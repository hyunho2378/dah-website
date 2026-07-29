// EntriesSheet.jsx — 전시회 접수 관리 시트 (Y3-2, 33_PHASE18 → H1, 37_SHEET_ROADMAP. admin+)
// 어드민 "접수 현황 열기" → 새 탭 /admin/exhibition-entries/sheet. AdminLayout 밖 형제 라우트라
// 사이드바 없이 전체 폭을 쓴다.
//
// 표면: G4 밝은 읽기 표면(tokens.reading) — bg-reading-* / text-reading-* / border-reading-*.
// 사이트 전역 다크 테마의 명시적 예외이며, 색은 전부 CI.md HEX를 토큰 경유로만 쓴다(HEX 하드코딩 금지).
//
// 레이아웃 불변 계약(37 절대원칙 4): 컬럼 폭은 colgroup + table-layout:fixed로 고정하고,
// 넘치는 폭은 페이지가 아니라 표 래퍼 내부 가로 스크롤로 격리한다. 필터 패널(포털)·토스트(fixed)·
// 행 확장(행 높이만 변화) 어느 동작에서도 컬럼 폭과 표 위치는 움직이지 않는다.
//
// 기능: 컬럼 헤더 필터·정렬(G1) · 검색 · 헤더/좌측 고정 · 행 확장(아코디언) · 셀/행 복사(G2 토스트) ·
//       CSV·엑셀 내려받기 · 수동 새로고침 + 20초 자동 새로고침(상시) · 하단 시트 탭 ·
//       접수자 정보 탭에서 admin+ 비밀번호 초기화(서버가 권한 재검증).

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronRight, Copy, Download, KeyRound, RefreshCw } from 'lucide-react'
import ColumnFilter from '../../components/common/ColumnFilter'
import { useToast } from '../../components/common/Toast'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'

const POLL_MS = 20000
const CONTROL_WIDTH = 72
const DEFAULT_WIDTH = 180

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
  team_name: '팀명',
  members: '팀원',
  work_title: '작품명',
  title: '작품명',
  work_desc: '작품 설명',
  description: '작품 설명',
  note: '비고',
}

// H1-4: 컬럼 순서 — 작품명이 작품 설명보다 반드시 왼쪽에 온다. 목록에 없는 키는 첫 등장 순서대로 뒤에.
const FIELD_ORDER = [
  'name',
  'student_no',
  'student_id',
  'major',
  'majors',
  'team_name',
  'team',
  'members',
  'phone',
  'contact',
  'subject',
  'course',
  'work_title',
  'title',
  'work_desc',
  'description',
  'note',
]

// 컬럼 폭(px) — table-layout:fixed의 기준. 필터·복사·행확장에도 이 값은 변하지 않는다.
const COLUMN_WIDTH = {
  id: 72,
  created_at: 150,
  updated_at: 150,
  semester_label: 110,
  entry_type: 88,
  email: 220,
  'fields.name': 120,
  'fields.student_no': 120,
  'fields.student_id': 120,
  'fields.major': 150,
  'fields.majors': 150,
  'fields.team_name': 150,
  'fields.members': 260,
  'fields.phone': 140,
  'fields.contact': 140,
  'fields.subject': 200,
  'fields.course': 200,
  'fields.work_title': 220,
  'fields.title': 220,
  'fields.work_desc': 300,
  'fields.description': 300,
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

function fieldOrderIndex(key) {
  const i = FIELD_ORDER.indexOf(key)
  return i < 0 ? FIELD_ORDER.length : i
}

// ── 접수자 인적사항 추출 (H1-6) ──────────────────────────────
// 개인 접수는 fields.name/major/student_no, 팀 접수는 fields.members[]에 인적사항이 들어온다.
function membersOf(row) {
  const m = row?.fields?.members
  return Array.isArray(m) ? m : []
}

function personField(row, key) {
  const solo = cellText(row?.fields?.[key]).trim()
  if (solo) return solo
  const list = membersOf(row)
    .map((m) => cellText(m?.[key]).trim())
    .filter(Boolean)
  return list.join(', ')
}

function personName(row) {
  return personField(row, 'name') || cellText(row?.fields?.team_name)
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

// ── 비밀번호 초기화 확인 모달 (H1-7) ─────────────────────────
// window.confirm 금지 — 사이트 글래스 모달 패턴(AdminLayout 로그아웃 확인과 동일: 백드롭·ESC).
function ResetConfirm({ name, busy, onCancel, onConfirm }) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [onCancel])

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-gutter-m">
      <button
        type="button"
        aria-label="닫기"
        tabIndex={-1}
        onClick={onCancel}
        className="absolute inset-0 bg-bg-base/70"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pw-reset-title"
        className="relative w-full max-w-sm rounded-glass border border-glass-line bg-cosmos-depth1/[0.96] p-32 backdrop-blur-glass"
      >
        <h2 id="pw-reset-title" className="text-h3-m font-bold text-text-pri md:text-h3-d">
          비밀번호 초기화
        </h2>
        <p className="mt-12 text-body-m text-text-sec md:text-body-d">
          {name}님의 접수 비밀번호를 1234로 초기화합니다.
        </p>
        <div className="mt-24 flex justify-end gap-8">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-40 cursor-pointer items-center justify-center rounded-sm border border-border-subtle px-16 text-small-m font-semibold text-text-pri transition duration-fast ease-out hover:border-border-strong"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex h-40 cursor-pointer items-center justify-center rounded-sm bg-button-primary px-16 text-small-m font-semibold text-button-primaryText transition duration-fast ease-out hover:bg-button-primaryHover disabled:cursor-default disabled:opacity-60"
          >
            {busy ? '초기화 중' : '초기화'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── 페이지 ──────────────────────────────────────────────────
const BTN =
  'inline-flex h-40 cursor-pointer items-center justify-center gap-8 whitespace-nowrap rounded-sm border border-reading-hairline bg-reading-surface px-16 text-small-m font-semibold text-reading-text transition duration-fast ease-out hover:border-reading-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reading-accent'

const SHEETS = [
  { value: 'entries', label: '접수 현황' },
  { value: 'people', label: '접수자 정보' },
]

function EntriesSheet() {
  useTitle('접수 관리 시트')
  const toast = useToast()
  const { hasRole } = useAuth()
  const canReset = hasRole('admin')

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [q, setQ] = useState('')
  const [sheet, setSheet] = useState('entries')
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState(null)
  const [selected, setSelected] = useState(null)
  const [expanded, setExpanded] = useState(() => new Set())
  const [pwTarget, setPwTarget] = useState(null)
  const [pwBusy, setPwBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await api.get('/admin/exhibition/entries', { page: 1, pageSize: 500 })
      setRows(res?.items || [])
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

  // H1-2: 자동 새로고침은 토글 없이 항상 켜진 상태(20초 폴링)
  useEffect(() => {
    const timer = setInterval(load, POLL_MS)
    return () => clearInterval(timer)
  }, [load])

  const copyText = async (text, message) => {
    try {
      await navigator.clipboard.writeText(text)
      toast(message)
    } catch {
      toast('복사에 실패했습니다')
    }
  }

  // 접수 현황 컬럼 — 고정 컬럼 + fields(jsonb) 실제 키(FIELD_ORDER 순서). 이미지 컬럼은 H1-4로 삭제.
  const entryColumns = useMemo(() => {
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
          order: fieldOrderIndex(key),
        })
      }
    }
    dynamic.sort((a, b) => a.order - b.order)
    return [
      { key: 'id', label: '번호', get: (r) => String(r.id) },
      { key: 'created_at', label: '접수일시', get: (r) => formatDateTime(r.created_at) },
      { key: 'updated_at', label: '수정일시', get: (r) => formatDateTime(r.updated_at) },
      { key: 'semester_label', label: '학기', get: (r) => cellText(r.semester_label) },
      { key: 'entry_type', label: '유형', get: (r) => (r.entry_type === 'team' ? '팀' : '개인') },
      { key: 'email', label: '이메일', get: (r) => cellText(r.email) },
      ...dynamic,
    ]
  }, [rows])

  // 접수자 정보 컬럼 (H1-6) — 인적사항만. 작품 정보 제외, 원본 데이터는 그대로 두고 뷰만 분리한다.
  const peopleColumns = useMemo(() => {
    const base = [
      { key: 'id', label: '번호', get: (r) => String(r.id) },
      { key: 'created_at', label: '접수일', get: (r) => formatDateTime(r.created_at) },
      { key: 'entry_type', label: '참가 유형', get: (r) => (r.entry_type === 'team' ? '팀' : '개인') },
      { key: 'person_name', label: '이름', get: personName },
      { key: 'person_major', label: '소속', get: (r) => personField(r, 'major') },
      { key: 'person_no', label: '학번', get: (r) => personField(r, 'student_no') },
      { key: 'email', label: '이메일', get: (r) => cellText(r.email) },
      { key: 'phone', label: '연락처', get: (r) => cellText(r.fields?.phone) },
    ]
    // 비로그인·manager에는 초기화 UI 자체를 렌더하지 않는다(서버도 admin+ 재검증)
    if (!canReset) return base
    return [
      ...base,
      {
        key: 'pw_reset',
        label: '비밀번호',
        action: true,
        get: () => '',
      },
    ]
  }, [canReset])

  const columns = sheet === 'people' ? peopleColumns : entryColumns
  const dataColumns = useMemo(() => columns.filter((c) => !c.action), [columns])

  const columnWidth = useCallback(
    (col) => (col.action ? 150 : COLUMN_WIDTH[col.key] || DEFAULT_WIDTH),
    []
  )
  const tableWidth = useMemo(
    () => columns.reduce((sum, col) => sum + columnWidth(col), CONTROL_WIDTH),
    [columns, columnWidth]
  )

  // 필터 후보값 — 그 컬럼의 고유값(구글 시트 방식)
  const filterValues = useMemo(() => {
    const map = {}
    for (const col of dataColumns) {
      const set = new Set()
      for (const row of rows) set.add(col.get(row))
      map[col.key] = [...set].sort((a, b) => a.localeCompare(b, 'ko'))
    }
    return map
  }, [dataColumns, rows])

  const visibleRows = useMemo(() => {
    const keyword = q.trim().toLowerCase()
    let list = rows
    for (const col of dataColumns) {
      const picked = filters[col.key]
      if (picked instanceof Set) list = list.filter((r) => picked.has(col.get(r)))
    }
    if (keyword) {
      list = list.filter((r) => dataColumns.some((c) => c.get(r).toLowerCase().includes(keyword)))
    }
    if (!sort) return list
    const col = dataColumns.find((c) => c.key === sort.key)
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
  }, [rows, dataColumns, filters, q, sort])

  const toggleExpanded = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const copyRow = (row) => {
    copyText(dataColumns.map((c) => c.get(row)).join('\t'), '행을 복사했습니다')
  }

  const sheetLabel = SHEETS.find((s) => s.value === sheet)?.label || '접수 현황'
  const stamp = new Date().toISOString().slice(0, 10)
  const exportCsv = () =>
    download(
      toCsv(dataColumns, visibleRows),
      `${sheetLabel}-${stamp}.csv`,
      'text/csv;charset=utf-8'
    )
  const exportExcel = () =>
    download(
      toSpreadsheetML(dataColumns, visibleRows, sheetLabel),
      `${sheetLabel}-${stamp}.xls`,
      'application/vnd.ms-excel;charset=utf-8'
    )

  const closeReset = useCallback(() => setPwTarget(null), [])

  const confirmReset = async () => {
    if (!pwTarget) return
    setPwBusy(true)
    try {
      await api.post(`/admin/exhibition/entries/${pwTarget.id}/reset-password`)
      toast(`${pwTarget.name}님의 접수 비밀번호를 1234로 초기화했습니다`)
      setPwTarget(null)
    } catch (err) {
      toast(err.message || '비밀번호 초기화에 실패했습니다')
    } finally {
      setPwBusy(false)
    }
  }

  // iOS Safari 동적 툴바 대응: 100vh는 주소창·툴바 접힘/펼침에 따라 값이 바뀌어
  // 레이아웃이 흔들린다 — 뷰포트 실측값을 반영하는 100dvh로 대체
  return (
    <div className="min-h-[100dvh] bg-reading-bg text-reading-text">
      <div className="mx-auto flex w-full min-w-0 max-w-container-wide flex-col gap-16 px-gutter-m py-24 md:px-gutter-t lg:px-gutter-d">
        {/* 헤더 */}
        <div className="flex flex-wrap items-end justify-between gap-16">
          <div className="flex min-w-0 flex-col gap-4">
            <h1 className="text-h2-m font-bold text-reading-textStrong md:text-h2-d">
              접수 관리 시트
            </h1>
            <p className="font-mono text-caption-m text-reading-textMeta">
              총 {rows.length}건 · 표시 {visibleRows.length}건 · 20초마다 자동 새로고침
              {updatedAt ? ` · 마지막 갱신 ${formatDateTime(updatedAt)}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-8">
            <button type="button" onClick={load} className={BTN}>
              <RefreshCw size={16} aria-hidden="true" />
              새로고침
            </button>
            <button type="button" onClick={exportCsv} className={BTN}>
              <Download size={16} aria-hidden="true" />
              CSV
            </button>
            <button type="button" onClick={exportExcel} className={BTN}>
              <Download size={16} aria-hidden="true" />
              엑셀
            </button>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색어"
              aria-label="검색어"
              className="h-40 w-full max-w-xs rounded-sm border border-reading-hairline bg-reading-surface px-12 text-small-m text-reading-text outline-none transition duration-fast ease-out placeholder:text-reading-textMeta focus:border-reading-accent"
            />
          </div>
        </div>

        {error && <p className="font-mono text-caption-m text-reading-accent">{error}</p>}
        {loading && <p className="font-mono text-caption-m text-reading-textMeta">불러오는 중</p>}
        {!loading && !error && visibleRows.length === 0 && (
          <p className="font-mono text-caption-m text-reading-textMeta">
            표시할 접수 내역이 없습니다
          </p>
        )}

        {/* 시트 — 가로 넘침은 이 래퍼 내부 스크롤로 격리(페이지 가로 스크롤 0) */}
        {visibleRows.length > 0 && (
          <div className="max-h-[70dvh] w-full min-w-0 overflow-auto rounded-sm border border-reading-hairline bg-reading-surface">
            {/* colgroup 폭 합계를 최소폭으로 잡아 컬럼 폭을 고정한다. 래퍼가 더 넓으면
                남는 폭만 비례 분배되고(뷰포트 변화), 필터·복사·행확장에는 반응하지 않는다. */}
            <table
              className="w-full table-fixed border-collapse text-small-m"
              style={{ minWidth: tableWidth }}
            >
              <colgroup>
                <col style={{ width: CONTROL_WIDTH }} />
                {columns.map((col) => (
                  <col key={col.key} style={{ width: columnWidth(col) }} />
                ))}
              </colgroup>
              <thead className="sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-20 border-b border-r border-reading-hairline bg-reading-subtle px-8 py-8 text-left font-semibold text-reading-textMeta"
                  >
                    행
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className="border-b border-r border-reading-hairline bg-reading-subtle px-12 py-8 text-left"
                    >
                      <span className="flex items-center justify-between gap-4">
                        <span className="min-w-0 truncate font-semibold text-reading-text">
                          {col.label}
                        </span>
                        {!col.action && (
                          <ColumnFilter
                            label={col.label}
                            values={filterValues[col.key] || []}
                            selected={filters[col.key] ?? null}
                            onChange={(next) =>
                              setFilters((prev) => ({ ...prev, [col.key]: next }))
                            }
                            sort={sort?.key === col.key ? sort.dir : null}
                            onSortChange={(dir) => setSort(dir ? { key: col.key, dir } : null)}
                          />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, index) => {
                  const open = expanded.has(row.id)
                  return (
                    <tr key={row.id} className={index % 2 === 1 ? 'bg-reading-bg' : 'bg-reading-surface'}>
                      <td className="sticky left-0 z-[1] border-b border-r border-reading-hairline bg-inherit px-8 py-4 align-top">
                        <span className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => toggleExpanded(row.id)}
                            aria-expanded={open}
                            aria-label={`${row.id}번 행 ${open ? '접기' : '펼치기'}`}
                            className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-sm text-reading-textMeta transition-colors duration-fast ease-out hover:bg-reading-subtle hover:text-reading-textStrong"
                          >
                            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyRow(row)}
                            aria-label={`${row.id}번 행 복사`}
                            className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-sm text-reading-textMeta transition-colors duration-fast ease-out hover:bg-reading-subtle hover:text-reading-textStrong"
                          >
                            <Copy size={14} />
                          </button>
                        </span>
                      </td>
                      {columns.map((col) => {
                        if (col.action) {
                          return (
                            <td
                              key={col.key}
                              className="border-b border-r border-reading-hairline px-12 py-4 align-top"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setPwTarget({ id: row.id, name: personName(row) || '접수자' })
                                }
                                className="inline-flex h-24 cursor-pointer items-center gap-4 rounded-sm border border-reading-hairline px-8 text-caption-m font-semibold text-reading-accent transition-colors duration-fast ease-out hover:bg-reading-subtle"
                              >
                                <KeyRound size={12} aria-hidden="true" />
                                초기화
                              </button>
                            </td>
                          )
                        }
                        const value = col.get(row)
                        const cellId = `${row.id}:${col.key}`
                        return (
                          <td
                            key={col.key}
                            className="border-b border-r border-reading-hairline p-0 align-top"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelected(cellId)
                                copyText(value, '셀을 복사했습니다')
                              }}
                              title={value}
                              className={`block w-full cursor-cell px-12 py-8 text-left text-reading-text transition-colors duration-fast ease-out hover:bg-reading-subtle ${
                                open ? 'whitespace-pre-wrap break-words' : 'truncate'
                              } ${
                                selected === cellId
                                  ? 'outline outline-2 outline-offset-[-2px] outline-reading-accent'
                                  : ''
                              }`}
                            >
                              {value}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 하단 시트 탭 (H1-6) */}
        <div className="flex items-center gap-4 border-t border-reading-hairline pt-8">
          {SHEETS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setSheet(item.value)}
              aria-pressed={sheet === item.value}
              className={`cursor-pointer rounded-b-sm border-b-2 px-16 py-8 text-small-m font-semibold transition-colors duration-fast ease-out ${
                sheet === item.value
                  ? 'border-reading-accent bg-reading-surface text-reading-textStrong'
                  : 'border-transparent text-reading-textMeta hover:text-reading-text'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="font-mono text-caption-m text-reading-textMeta">
          셀을 누르면 값이, 복사 아이콘을 누르면 행 전체가 클립보드에 복사됩니다. 화살표를 누르면 그
          행의 전체 내용이 펼쳐집니다. 컬럼 헤더의 필터 아이콘으로 값 선택·정렬을 하고, 내려받기는
          현재 시트·필터·검색 결과 기준입니다.
        </p>
      </div>

      {pwTarget && (
        <ResetConfirm
          name={pwTarget.name}
          busy={pwBusy}
          onCancel={closeReset}
          onConfirm={confirmReset}
        />
      )}
    </div>
  )
}

export default EntriesSheet
