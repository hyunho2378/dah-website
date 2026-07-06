// ExhibitionAdmin.jsx — 전시회 접수 시스템 관리 (12_BACKEND 5절, admin+)
// 일정(exhibition_settings: submit_open·submit_close·edit_close) 편집 + 접수 현황 목록.
// 접수 버튼 노출 on/off·위치는 /admin/settings에서 관리(13_CMS 1절 site_settings).

import { useEffect, useState } from 'react'
import { useApi, api } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import {
  EmptyNote,
  ErrorText,
  Field,
  Input,
  PageHead,
  Pagination,
  PrimaryButton,
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

  const exhibition = settings.data?.exhibition

  useEffect(() => {
    if (hydrated || !exhibition) return
    setForm({
      submit_open: toLocalInput(exhibition.submit_open),
      submit_close: toLocalInput(exhibition.submit_close),
      edit_close: toLocalInput(exhibition.edit_close),
    })
    setHydrated(true)
  }, [hydrated, exhibition])

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
      setSaveError(err.hint ? `${err.message} — ${err.hint}` : err.message)
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
            <span className="inline-flex items-center rounded-full border border-glass-line bg-glass-bg px-12 py-4 font-mono text-caption-m text-text-meta">
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
            <Input type="datetime-local" value={form.submit_open} onChange={set('submit_open')} />
          </Field>
          <Field label="접수 마감" hint="이후 신규 접수 차단">
            <Input type="datetime-local" value={form.submit_close} onChange={set('submit_close')} />
          </Field>
          <Field label="수정 마감" hint="이후 신규·수정 전면 차단">
            <Input type="datetime-local" value={form.edit_close} onChange={set('edit_close')} />
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

      {/* 접수 현황 목록 */}
      <div className="flex flex-col gap-16">
        <div className="flex flex-wrap items-center justify-between gap-16">
          <h3 className="text-h3-m font-bold text-text-pri md:text-h3-d">접수 현황</h3>
          <p className="font-mono text-caption-m text-text-meta">총 {total}건</p>
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
