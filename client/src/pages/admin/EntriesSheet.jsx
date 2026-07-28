// EntriesSheet.jsx — 전시회 접수 관리 시트 (Y3-2, 33_PHASE18. admin+)
// 어드민 "접수 현황 열기" → 새 탭 /admin/exhibition-entries/sheet. AdminLayout 밖 형제 라우트라
// 사이드바 없이 전체 폭을 쓴다.
//
// 디자인 예외: 이 페이지만 라이트 시트 스타일을 허용한다(33_PHASE18 Y3-2).
// 사용 색은 전부 CI.md HEX — 배경 #FFFFFF·#F7F5FC·#F2F0F6(3.3 밝은 배경), 텍스트 #211A31·#100D18,
// 보조 텍스트 #625A70, 강조·선택 #815FD7·#C8B9F2. 새 색을 만들지 않는다.
// 그리드 선은 CI에 없는 색을 만들지 않기 위해 #211A31(Glass Surface) 15% 헤어라인으로 만든다 —
// CI 4.2가 헤어라인을 "색 + 불투명도"로 정의하는 방식(Hairline White #FFFFFF 10%)과 동일하다.
// 다크 토큰 클래스와 섞이면 대비가 깨지므로 이 파일 안에서는 임의 값 클래스로 명시한다.
//
// 기능: 과목 탭 필터 · 검색 · 컬럼 정렬 · 헤더 고정 · 행 스트라이프 · 셀/행 복사 ·
//       CSV·엑셀 내려받기 · 수동/자동(20초) 새로고침 + 마지막 갱신 시각.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Copy, Download, RefreshCw } from 'lucide-react'
import { api } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'

const POLL_MS = 20000

// fields(jsonb) 키 → 화면 라벨. 접수 폼 스키마가 자유 구조라 미등록 키는 원문 키를 그대로 쓴다.
const FIELD_LABELS = {
  subject: '과목',
  course: '과목',
  name: '이름',
  student_no: '학번',
  student_id: '학번',
  major: '전공',
  majors: '전공',
  phone: '연락처',
  contact: '연락처',
  team: '팀명',
  members: '팀원',
  work_title: '작품명',
  title: '작품명',
  work_desc: '작품 설명',
  description: '작품 설명',
  note: '비고',
}

// 접수 행에서 과목을 읽는다 — 폼 스키마 후보 키를 순서대로 확인
function subjectOf(entry) {
  const f = entry?.fields || {}
  const raw = f.subject ?? f.course ?? f['과목'] ?? ''
  return String(raw || '').trim()
}

function cellText(value) {
  if (value === null || value === undefined) return ''
  if (Array.isArray(value)) return value.map(cellText).join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function formatDateTime(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ── 내려받기 ────────────────────────────────────────────────
// CSV: 엑셀 한글 깨짐 방지를 위해 UTF-8 BOM + CRLF.
function toCsv(columns, rows) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const lines = [columns.map((c) => esc(c.label)).join(',')]
  for (const row of rows) lines.push(columns.map((c) => esc(c.get(row))).join(','))
  return `﻿${lines.join('\r\n')}`
}

// 엑셀: 새 npm 의존성 금지 규칙에 따라 SpreadsheetML 2003(XML)을 직접 생성한다.
// 확장자는 .xls — Excel·Numbers·Google Sheets가 그대로 연다(진짜 .xlsx zip 패키징은 미사용).
function xmlEscape(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function toSpreadsheetML(columns, rows, sheetName = '접수 현황') {
  const cell = (v) => `<Cell><Data ss:Type="String">${xmlEscape(v)}</Data></Cell>`
  const head = `<Row>${columns.map((c) => cell(c.label)).join('')}</Row>`
  const body = rows
    .map((row) => `<Row>${columns.map((c) => cell(c.get(row))).join('')}</Row>`)
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="${xmlEscape(sheetName)}"><Table>${head}${body}</Table></Worksheet>
</Workbook>`
}

function download(content, filename, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// ── 페이지 ──────────────────────────────────────────────────
const BTN =
  'inline-flex h-40 cursor-pointer items-center justify-center gap-8 whitespace-nowrap rounded-sm border border-[rgba(33,26,49,0.15)] bg-[#FFFFFF] px-16 text-small-m font-semibold text-[#211A31] transition duration-fast ease-out hover:border-[#815FD7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#815FD7]'

function EntriesSheet() {
  useTitle('접수 관리 시트')

  const [rows, setRows] = useState([])
  const [subjectOptions, setSubjectOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [auto, setAuto] = useState(false)
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('__all__')
  const [sort, setSort] = useState({ key: 'created_at', dir: 'desc' })
  const [selected, setSelected] = useState(null)
  const [notice, setNotice] = useState('')
  const noticeTimer = useRef(null)

  const load = useCallback(async () => {
    try {
      const [entriesRes, settingsRes] = await Promise.all([
        api.get('/admin/exhibition/entries', { page: 1, pageSize: 500 }),
        api.get('/settings/public').catch(() => null),
      ])
      setRows(entriesRes?.items || [])
      const list = settingsRes?.settings?.exhibitionSubjects
      setSubjectOptions(Array.isArray(list) ? list : [])
      setError(null)
      setUpdatedAt(new Date())
    } catch (err) {
      setError(err.hint ? `${err.message} (${err.hint})` : err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!auto) return undefined
    const timer = setInterval(load, POLL_MS)
    return () => clearInterval(timer)
  }, [auto, load])

  useEffect(() => () => clearTimeout(noticeTimer.current), [])

  const flash = (message) => {
    setNotice(message)
    clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(''), 1600)
  }

  const copyText = async (text, message) => {
    try {
      await navigator.clipboard.writeText(text)
      flash(message)
    } catch {
      flash('복사에 실패했습니다')
    }
  }

  // 컬럼 — 고정 컬럼 + fields(jsonb)에 실제로 등장한 키(첫 등장 순서 유지)
  const columns = useMemo(() => {
    const dynamic = []
    const seen = new Set()
    for (const row of rows) {
      const f = row.fields && typeof row.fields === 'object' ? row.fields : {}
      for (const key of Object.keys(f)) {
        if (seen.has(key)) continue
        seen.add(key)
        dynamic.push({
          key: `fields.${key}`,
          label: FIELD_LABELS[key] || key,
          get: (r) => cellText(r.fields?.[key]),
        })
      }
    }
    return [
      { key: 'id', label: '번호', get: (r) => String(r.id) },
      { key: 'created_at', label: '접수일시', get: (r) => formatDateTime(r.created_at) },
      { key: 'updated_at', label: '수정일시', get: (r) => formatDateTime(r.updated_at) },
      { key: 'semester_label', label: '학기', get: (r) => cellText(r.semester_label) },
      { key: 'entry_type', label: '유형', get: (r) => (r.entry_type === 'team' ? '팀' : '개인') },
      { key: 'email', label: '이메일', get: (r) => cellText(r.email) },
      ...dynamic,
      {
        key: 'images',
        label: '이미지',
        get: (r) => String(Array.isArray(r.images) ? r.images.length : 0),
      },
    ]
  }, [rows])

  // 탭 — 관리자가 등록한 과목(1·2학기) + 데이터에 실제로 존재하는 과목
  const tabs = useMemo(() => {
    const names = []
    const push = (n) => {
      const v = String(n || '').trim()
      if (v && !names.includes(v)) names.push(v)
    }
    subjectOptions.forEach((s) => push(s?.name))
    rows.forEach((r) => push(subjectOf(r)))
    return names
  }, [subjectOptions, rows])

  const visibleRows = useMemo(() => {
    const keyword = q.trim().toLowerCase()
    let list = rows
    if (tab !== '__all__') list = list.filter((r) => subjectOf(r) === tab)
    if (keyword) {
      list = list.filter((r) =>
        columns.some((c) => c.get(r).toLowerCase().includes(keyword))
      )
    }
    const col = columns.find((c) => c.key === sort.key)
    if (!col) return list
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      const av = col.get(a)
      const bv = col.get(b)
      const an = Number(av)
      const bn = Number(bv)
      if (av !== '' && bv !== '' && !Number.isNaN(an) && !Number.isNaN(bn)) {
        return (an - bn) * dir
      }
      return av.localeCompare(bv, 'ko') * dir
    })
  }, [rows, columns, q, tab, sort])

  const toggleSort = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    )
  }

  const copyRow = (row) => {
    copyText(columns.map((c) => c.get(row)).join('\t'), '행을 복사했습니다')
  }

  const stamp = new Date().toISOString().slice(0, 10)
  const exportCsv = () =>
    download(toCsv(columns, visibleRows), `접수현황-${stamp}.csv`, 'text/csv;charset=utf-8')
  const exportExcel = () =>
    download(
      toSpreadsheetML(columns, visibleRows),
      `접수현황-${stamp}.xls`,
      'application/vnd.ms-excel;charset=utf-8'
    )

  // iOS Safari 동적 툴바 대응: 100vh는 주소창·툴바 접힘/펼침에 따라 값이 바뀌어
  // 레이아웃이 흔들린다 — 뷰포트 실측값을 반영하는 100dvh로 대체
  return (
    <div className="min-h-[100dvh] bg-[#F7F5FC] text-[#211A31]">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-16 px-16 py-24 md:px-24">
        {/* 헤더 */}
        <div className="flex flex-wrap items-end justify-between gap-16">
          <div className="flex min-w-0 flex-col gap-4">
            <h1 className="text-h2-m font-bold text-[#100D18] md:text-h2-d">접수 관리 시트</h1>
            <p className="font-mono text-caption-m text-[#625A70]">
              총 {rows.length}건 · 표시 {visibleRows.length}건
              {updatedAt ? ` · 마지막 갱신 ${formatDateTime(updatedAt)}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-8">
            <button type="button" onClick={load} className={BTN}>
              <RefreshCw size={16} aria-hidden="true" />
              새로고침
            </button>
            {/* 자동 새로고침 스위치 (20초 폴링) */}
            <button
              type="button"
              role="switch"
              aria-checked={auto}
              onClick={() => setAuto((v) => !v)}
              className={`${BTN} ${auto ? 'border-[#815FD7] bg-[#815FD7] text-[#F7F5FC] hover:border-[#6844C4]' : ''}`}
            >
              자동 새로고침 {auto ? '켜짐' : '꺼짐'}
            </button>
            <button type="button" onClick={exportCsv} className={BTN}>
              <Download size={16} aria-hidden="true" />
              CSV
            </button>
            <button type="button" onClick={exportExcel} className={BTN}>
              <Download size={16} aria-hidden="true" />
              엑셀
            </button>
          </div>
        </div>

        {/* 탭 + 검색 */}
        <div className="flex flex-wrap items-center justify-between gap-12">
          <div className="flex min-w-0 flex-wrap items-center gap-4">
            {[{ value: '__all__', label: '전체' }, ...tabs.map((n) => ({ value: n, label: n }))].map(
              (item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTab(item.value)}
                  aria-pressed={tab === item.value}
                  className={`cursor-pointer rounded-t-sm border-b-2 px-16 py-8 text-small-m font-semibold transition duration-fast ease-out ${
                    tab === item.value
                      ? 'border-[#815FD7] text-[#100D18]'
                      : 'border-transparent text-[#625A70] hover:text-[#211A31]'
                  }`}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="검색어"
            aria-label="검색어"
            className="h-40 w-full max-w-xs rounded-sm border border-[rgba(33,26,49,0.15)] bg-[#FFFFFF] px-12 text-small-m text-[#211A31] outline-none transition duration-fast ease-out placeholder:text-[#625A70] focus:border-[#815FD7]"
          />
        </div>

        {notice && <p className="font-mono text-caption-m text-[#4B2D99]">{notice}</p>}
        {error && <p className="font-mono text-caption-m text-[#815FD7]">{error}</p>}
        {loading && <p className="font-mono text-caption-m text-[#625A70]">불러오는 중</p>}
        {!loading && !error && visibleRows.length === 0 && (
          <p className="font-mono text-caption-m text-[#625A70]">표시할 접수 내역이 없습니다</p>
        )}

        {/* 시트 */}
        {visibleRows.length > 0 && (
          <div className="max-h-[calc(100dvh-260px)] overflow-auto rounded-sm border border-[rgba(33,26,49,0.15)] bg-[#FFFFFF]">
            <table className="w-full border-collapse text-small-m">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="sticky left-0 z-20 border-b border-r border-[rgba(33,26,49,0.15)] bg-[#F2F0F6] px-8 py-8 text-left font-semibold text-[#625A70]">
                    복사
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className="border-b border-r border-[rgba(33,26,49,0.15)] bg-[#F2F0F6] p-0 text-left"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="flex w-full cursor-pointer items-center gap-4 whitespace-nowrap px-12 py-8 text-left font-semibold text-[#211A31] transition duration-fast ease-out hover:bg-[#C8B9F2]"
                      >
                        {col.label}
                        <span aria-hidden="true" className="font-mono text-caption-m text-[#625A70]">
                          {sort.key === col.key ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
                        </span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, index) => (
                  <tr key={row.id} className={index % 2 === 1 ? 'bg-[#F7F5FC]' : 'bg-[#FFFFFF]'}>
                    <td className="sticky left-0 z-[1] border-b border-r border-[rgba(33,26,49,0.15)] bg-inherit px-8 py-4 align-top">
                      <button
                        type="button"
                        onClick={() => copyRow(row)}
                        aria-label={`${row.id}번 행 복사`}
                        className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-sm text-[#625A70] transition duration-fast ease-out hover:bg-[#C8B9F2] hover:text-[#100D18]"
                      >
                        <Copy size={14} />
                      </button>
                    </td>
                    {columns.map((col) => {
                      const value = col.get(row)
                      const cellId = `${row.id}:${col.key}`
                      return (
                        <td
                          key={col.key}
                          className="border-b border-r border-[rgba(33,26,49,0.15)] p-0 align-top"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelected(cellId)
                              copyText(value, '셀을 복사했습니다')
                            }}
                            title={value}
                            className={`block w-full cursor-cell whitespace-pre-wrap break-words px-12 py-8 text-left text-[#211A31] transition duration-fast ease-out hover:bg-[#F2F0F6] ${
                              selected === cellId ? 'outline outline-2 outline-offset-[-2px] outline-[#815FD7]' : ''
                            }`}
                          >
                            {value}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="font-mono text-caption-m text-[#625A70]">
          셀을 누르면 값이, 왼쪽 복사 아이콘을 누르면 행 전체가 클립보드에 복사됩니다. 내려받기는
          현재 탭·검색 결과 기준입니다.
        </p>
      </div>
    </div>
  )
}

export default EntriesSheet
