// ExhibitionAdmin.jsx — 전시회 접수 시스템 관리 (12_BACKEND 5절, admin+)
// 일정(exhibition_settings: submit_open·submit_close·edit_close) 편집 + 접수 현황 목록.
// Y3-1(33_PHASE18): 접수 버튼 노출 스위치를 이 화면에서도 직접 조작하고(기존에는 사이트 설정
// 안에만 있었다), 접수 폼이 읽는 과목 목록(1·2학기)을 여기서 관리한다.
// 과목 목록 저장 위치: site_settings.exhibitionSubjects → GET /settings/public에
// settings.exhibitionSubjects · exhibition.subjects 두 경로로 노출된다.

import { useEffect, useState } from 'react'
import { ExternalLink, Plus, Trash2 } from 'lucide-react'
import { useApi, api } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import {
  EmptyNote,
  ErrorText,
  Field,
  GhostButton,
  Input,
  PageHead,
  Pagination,
  PrimaryButton,
  Select,
  Toggle,
  DateInput,
} from '../../components/admin/FormControls'

// ISO ↔ datetime-local 변환 (로컬 시간대 기준 편집, 저장 시 ISO)
function toLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fromLocalInput(v) {
  return v ? new Date(v).toISOString() : null
}

// 접수 fields jsonb에서 표시용 대표 텍스트 추출 (폼 스키마 자유 구조 대응)
function entryTitle(entry) {
  const f = entry.fields || {}
  return f.work_title || f.title || f.name || entry.email
}

const PANEL =
  'flex flex-col gap-16 rounded-glass border border-glass-line bg-glass-bg p-24 backdrop-blur-glass-mobile'

function ExhibitionAdmin() {
  useTitle('전시회 설정')
  const settings = useApi('/settings/public')
  const [page, setPage] = useState(1)
  const entries = useApi('/admin/exhibition/entries', { params: { page, pageSize: 20 } })

  const [form, setForm] = useState({ submit_open: '', submit_close: '', edit_close: '' })
  const [hydrated, setHydrated] = useState(false)
  const [busy, setBusy] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saved, setSaved] = useState(false)

  // Y3-1: 접수 버튼 노출 + 과목 목록
  const [headerVisible, setHeaderVisible] = useState(true)
  const [buttonMode, setButtonMode] = useState('header')
  const [subjects, setSubjects] = useState([])
  const [buttonBusy, setButtonBusy] = useState(false)
  const [buttonSaved, setButtonSaved] = useState(false)
  const [buttonError, setButtonError] = useState(null)
  const [subjectBusy, setSubjectBusy] = useState(false)
  const [subjectSaved, setSubjectSaved] = useState(false)
  const [subjectError, setSubjectError] = useState(null)

  const exhibition = settings.data?.exhibition

  useEffect(() => {
    if (hydrated || !settings.data) return
    if (exhibition) {
      setForm({
        submit_open: toLocalInput(exhibition.submit_open),
        submit_close: toLocalInput(exhibition.submit_close),
        edit_close: toLocalInput(exhibition.edit_close),
      })
      setHeaderVisible(exhibition.header_visible !== false)
      setButtonMode(exhibition.button_mode || 'header')
    }
    const remote = settings.data.settings?.exhibitionSubjects
    setSubjects(
      Array.isArray(remote)
        ? remote.map((s) => ({ name: s?.name || '', semester: Number(s?.semester) === 2 ? 2 : 1 }))
        : []
    )
    setHydrated(true)
  }, [hydrated, settings.data, exhibition])

  const addSubject = (semester) => {
    setSubjectSaved(false)
    setSubjects((prev) => [...prev, { name: '', semester }])
  }
  const setSubjectName = (index, name) => {
    setSubjectSaved(false)
    setSubjects((prev) => prev.map((s, i) => (i === index ? { ...s, name } : s)))
  }
  const removeSubject = (index) => {
    setSubjectSaved(false)
    setSubjects((prev) => prev.filter((_, i) => i !== index))
  }

  const saveButton = async (e) => {
    e.preventDefault()
    setButtonBusy(true)
    setButtonError(null)
    try {
      await api.put('/admin/settings', {
        exhibition: { header_visible: headerVisible, button_mode: buttonMode },
      })
      setButtonSaved(true)
      settings.refetch()
    } catch (err) {
      setButtonError(err.hint ? `${err.message} (${err.hint})` : err.message)
    } finally {
      setButtonBusy(false)
    }
  }

  const saveSubjects = async (e) => {
    e.preventDefault()
    setSubjectBusy(true)
    setSubjectError(null)
    try {
      const next = subjects
        .map((s) => ({ name: s.name.trim(), semester: s.semester }))
        .filter((s) => s.name !== '')
      await api.put('/admin/settings', { settings: { exhibitionSubjects: next } })
      setSubjects(next)
      setSubjectSaved(true)
      settings.refetch()
    } catch (err) {
      setSubjectError(err.hint ? `${err.message} (${err.hint})` : err.message)
    } finally {
      setSubjectBusy(false)
    }
  }

  const set = (key) => (e) => {
    setSaved(false)
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setSaveError(null)
    try {
      await api.put('/admin/settings', {
        exhibition: {
          submit_open: fromLocalInput(form.submit_open),
          submit_close: fromLocalInput(form.submit_close),
          edit_close: fromLocalInput(form.edit_close),
        },
      })
      setSaved(true)
      settings.refetch()
    } catch (err) {
      setSaveError(err.hint ? `${err.message} (${err.hint})` : err.message)
    } finally {
      setBusy(false)
    }
  }

  const items = entries.data?.items || []
  const total = entries.data?.total ?? items.length

  return (
    <section className="flex flex-col gap-32">
      <PageHead
        title="전시회 설정"
        desc="접수 일정과 접수 현황을 관리합니다. 기간 검증은 서버 기준입니다."
      />

      {/* 일정 편집 */}
      <form
        onSubmit={save}
        className="flex flex-col gap-16 rounded-glass border border-glass-line bg-glass-bg p-24 backdrop-blur-glass-mobile"
      >
        <div className="flex flex-wrap items-center gap-12">
          <h3 className="text-h3-m font-bold text-text-pri md:text-h3-d">접수 일정</h3>
          {exhibition && (
            <span className="inline-flex items-center rounded-sm border border-glass-line bg-glass-bg px-12 py-4 font-mono text-caption-m text-text-meta">
              {exhibition.is_submit_period
                ? '접수 기간'
                : exhibition.is_edit_period
                  ? '수정 기간'
                  : '기간 외'}
            </span>
          )}
        </div>
        {settings.error && <ErrorText>{settings.error.message}</ErrorText>}
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          <Field label="접수 시작">
            <DateInput withTime value={form.submit_open} onChange={set('submit_open')} />
          </Field>
          <Field label="접수 마감" hint="이후 신규 접수 차단">
            <DateInput withTime value={form.submit_close} onChange={set('submit_close')} />
          </Field>
          <Field label="수정 마감" hint="이후 신규·수정 전면 차단">
            <DateInput withTime value={form.edit_close} onChange={set('edit_close')} />
          </Field>
        </div>
        <ErrorText>{saveError}</ErrorText>
        {saved && <p className="font-mono text-caption-m text-text-meta">저장 완료</p>}
        <div>
          <PrimaryButton type="submit" disabled={busy || !hydrated}>
            {busy ? '저장 중' : '일정 저장'}
          </PrimaryButton>
        </div>
      </form>

      {/* Y3-1: 접수 버튼 노출 — 히어로 편집이 아니라 이 화면에서 바로 켜고 끈다 */}
      <form onSubmit={saveButton} className={PANEL}>
        <h3 className="text-h3-m font-bold text-text-pri md:text-h3-d">접수 버튼 노출</h3>
        <p className="text-small-m text-text-sec">
          스위치를 켜면 전시회 페이지와 헤더에 접수 버튼이 노출됩니다. 기간 검증은 제출 시점에
          서버가 적용합니다.
        </p>
        <div className="flex flex-wrap items-start gap-24">
          <Field label="노출 허용">
            <Toggle
              checked={headerVisible}
              onChange={(v) => {
                setButtonSaved(false)
                setHeaderVisible(v)
              }}
              label="접수 버튼 노출 허용"
            />
          </Field>
          <Field label="위치">
            <Select
              value={buttonMode}
              onChange={(e) => {
                setButtonSaved(false)
                setButtonMode(e.target.value)
              }}
              options={[
                { value: 'header', label: '헤더' },
                { value: 'floating', label: '플로팅' },
              ]}
            />
          </Field>
        </div>
        <ErrorText>{buttonError}</ErrorText>
        {buttonSaved && <p className="font-mono text-caption-m text-text-meta">저장 완료</p>}
        <div>
          <PrimaryButton type="submit" disabled={buttonBusy || !hydrated}>
            {buttonBusy ? '저장 중' : '노출 설정 저장'}
          </PrimaryButton>
        </div>
      </form>

      {/* Y3-1: 과목 관리 — 접수 폼의 과목 선택지가 이 목록을 읽는다 */}
      <form onSubmit={saveSubjects} className={PANEL}>
        <h3 className="text-h3-m font-bold text-text-pri md:text-h3-d">과목 관리</h3>
        <p className="text-small-m text-text-sec">
          학기별 과목 목록입니다. 접수 폼의 과목 선택지로 그대로 쓰입니다. 예: UX디자인,
          디지털디자인1
        </p>
        <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
          {[1, 2].map((semester) => {
            const rows = subjects
              .map((s, index) => ({ s, index }))
              .filter(({ s }) => s.semester === semester)
            return (
              <div key={semester} className="flex flex-col gap-12">
                <p className="font-mono text-label-m uppercase tracking-label text-text-meta">
                  {semester}학기 과목
                </p>
                {rows.length === 0 && (
                  <p className="font-mono text-caption-m text-text-meta">등록된 과목이 없습니다</p>
                )}
                {rows.map(({ s, index }) => (
                  <div key={index} className="flex min-w-0 items-center gap-8">
                    <Input
                      value={s.name}
                      onChange={(e) => setSubjectName(index, e.target.value)}
                      placeholder="과목명"
                      aria-label={`${semester}학기 과목명`}
                    />
                    <button
                      type="button"
                      onClick={() => removeSubject(index)}
                      aria-label="과목 삭제"
                      className="flex h-32 w-32 shrink-0 cursor-pointer items-center justify-center rounded-sm text-text-sec transition duration-fast ease-out hover:bg-glass-strong hover:text-text-pri focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <div>
                  <GhostButton onClick={() => addSubject(semester)}>
                    <Plus size={16} aria-hidden="true" />
                    과목 추가
                  </GhostButton>
                </div>
              </div>
            )
          })}
        </div>
        <ErrorText>{subjectError}</ErrorText>
        {subjectSaved && <p className="font-mono text-caption-m text-text-meta">저장 완료</p>}
        <div>
          <PrimaryButton type="submit" disabled={subjectBusy || !hydrated}>
            {subjectBusy ? '저장 중' : '과목 저장'}
          </PrimaryButton>
        </div>
      </form>

      {/* 접수 현황 목록 */}
      <div className="flex flex-col gap-16">
        <div className="flex flex-wrap items-center justify-between gap-16">
          <h3 className="text-h3-m font-bold text-text-pri md:text-h3-d">접수 현황</h3>
          <div className="flex flex-wrap items-center gap-12">
            <p className="font-mono text-caption-m text-text-meta">총 {total}건</p>
            {/* Y3-2: 전용 관리 시트 — 새 탭으로 전체화면 열람 */}
            <a
              href="/admin/exhibition-entries/sheet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-8 whitespace-nowrap rounded-sm border border-border-subtle px-24 text-body-m font-semibold text-text-pri transition duration-fast ease-out hover:border-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
            >
              <ExternalLink size={16} aria-hidden="true" />
              접수 현황 열기
            </a>
          </div>
        </div>
        {entries.error && <ErrorText>{entries.error.message}</ErrorText>}
        {entries.loading && <p className="font-mono text-caption-m text-text-meta">불러오는 중</p>}
        {!entries.loading && !items.length && <EmptyNote>접수 내역이 없습니다</EmptyNote>}

        {items.length > 0 && (
          <ul className="flex flex-col">
            {items.map((entry) => (
              <li
                key={entry.id}
                className="flex min-w-0 items-center gap-12 border-b border-border-subtle py-12 first:border-t"
              >
                <span className="w-96 shrink-0 font-mono text-caption-m text-text-meta">
                  {String(entry.created_at).slice(0, 10)}
                </span>
                <span className="w-48 shrink-0 font-mono text-caption-m text-text-meta">
                  {entry.entry_type === 'team' ? '팀' : '개인'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body-m text-text-pri">
                    {entryTitle(entry)}
                  </span>
                  <span className="block truncate font-mono text-caption-m text-text-meta">
                    {entry.email}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-caption-m text-text-meta">
                  이미지 {Array.isArray(entry.images) ? entry.images.length : 0}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Pagination
          page={page}
          pageSize={entries.data?.pageSize || 20}
          total={total}
          onPage={setPage}
        />
      </div>
    </section>
  )
}

export default ExhibitionAdmin
