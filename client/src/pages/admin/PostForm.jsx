// PostForm.jsx — /admin/posts/:type/new·:id/edit 공용 작성 폼 (13_CMS_SPEC 1절 편집 매트릭스)
// 템플릿: t1 게시글형(제목 ko/en+태그+본문) / t2 포스터형(+포스터·일정·외부 URL) /
// exhibition T2 확장(전시회 테이블) / achievement 성좌 전용 필드 / portfolio 진로 그리드.
// 성과(achievement)는 posts로 저장: body={awardee,host,desc,year}, tag=연도 (B1 계약).

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Paperclip, Plus, Trash2 } from 'lucide-react'
import { useApi, api } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import RichEditor from '../../components/editor/RichEditor'
import ImageUpload from '../../components/admin/ImageUpload'
import {
  EmptyNote,
  ErrorText,
  Field,
  GhostButton,
  Input,
  PageHead,
  PrimaryButton,
  Select,
  TextArea,
  Toggle,
} from '../../components/admin/FormControls'
import { POST_TYPES } from './postTypes'

const ICON_BTN =
  'flex h-32 w-32 cursor-pointer items-center justify-center rounded-full text-text-sec transition duration-fast ease-out hover:bg-glass-strong hover:text-text-pri focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

// '' → null 정규화 — PG date·url 컬럼에 빈 문자열 삽입 방지
const nul = (v) => (v === '' || v === undefined ? null : v)
const dateOf = (v) => (v ? String(v).slice(0, 10) : '')

/** 첨부 목록 — 자료실 gallery jsonb [{ name, url }] (postTypes.js 계약) */
function AttachmentsField({ value = [], onChange }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = async (event) => {
    const file = event.target.files && event.target.files[0]
    event.target.value = ''
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const res = await api.upload(file, { usage: 'general' })
      if (!res?.url) throw new Error('업로드 응답에 url이 없습니다.')
      onChange([...value, { name: file.name, url: res.url }])
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-8">
      {value.map((file, i) => (
        <div key={`${file.url}-${i}`} className="flex min-w-0 items-center gap-8">
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-0 items-center gap-8 truncate font-mono text-small-m text-text-sec underline underline-offset-4 hover:text-text-pri"
          >
            <Paperclip size={16} aria-hidden="true" />
            <span className="truncate">{file.name || file.url.split('/').pop()}</span>
          </a>
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            aria-label="첨부 제거"
            className={ICON_BTN}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <div>
        <GhostButton onClick={() => inputRef.current && inputRef.current.click()} disabled={busy}>
          <Plus size={16} aria-hidden="true" />
          {busy ? '업로드 중' : '첨부 추가'}
        </GhostButton>
      </div>
      <ErrorText>{error}</ErrorText>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFile}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  )
}

/** 이미지 갤러리 — 전시회 gallery jsonb [url] */
function GalleryField({ value = [], onChange, usage = 'exhibition' }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = async (event) => {
    const file = event.target.files && event.target.files[0]
    event.target.value = ''
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const res = await api.upload(file, { usage })
      if (!res?.url) throw new Error('업로드 응답에 url이 없습니다.')
      onChange([...value, res.url])
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-8">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-8">
          {value.map((url, i) => (
            <li key={`${url}-${i}`} className="relative">
              <img
                src={url}
                alt={`갤러리 이미지 ${i + 1}`}
                loading="lazy"
                className="h-64 w-64 rounded-md border border-border-subtle bg-bg-elev object-cover"
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                aria-label={`갤러리 이미지 ${i + 1} 제거`}
                className="absolute -right-8 -top-8 flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border border-glass-line bg-glass-bg text-text-sec backdrop-blur-glass-mobile transition duration-fast ease-out hover:text-text-pri focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
              >
                <Trash2 size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <GhostButton onClick={() => inputRef.current && inputRef.current.click()} disabled={busy}>
          <Plus size={16} aria-hidden="true" />
          {busy ? '업로드 중' : '이미지 추가'}
        </GhostButton>
      </div>
      <ErrorText>{error}</ErrorText>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  )
}

// ── 템플릿별 폼 상태 ↔ 페이로드 매핑 ─────────────────────────────

function emptyForm(template) {
  switch (template) {
    case 'achievement':
      return {
        title_ko: '',
        title_en: '',
        awardee: '',
        host: '',
        desc: '',
        year: '',
        external_url: '',
        published: true,
      }
    case 'exhibition':
      return {
        title: '',
        semester_label: '',
        poster_url: '',
        site_url: '',
        intro: '',
        body: null,
        gallery: [],
        held_at: '',
        published: true,
      }
    case 'portfolio':
      return { student_no: '', name: '', majors: '', link: '', sort: 0 }
    default:
      // t1 · t2 공용 (posts)
      return {
        title_ko: '',
        title_en: '',
        tag: '',
        body: null,
        poster_url: '',
        external_url: '',
        event_start: '',
        event_end: '',
        gallery: [],
        published: true,
        pinned: false,
      }
  }
}

function fromItem(template, item) {
  const base = emptyForm(template)
  switch (template) {
    case 'achievement':
      return {
        ...base,
        title_ko: item.title_ko || '',
        title_en: item.title_en || '',
        awardee: item.body?.awardee || '',
        host: item.body?.host || '',
        desc: item.body?.desc || '',
        year: item.body?.year ?? item.tag ?? '',
        external_url: item.external_url || '',
        published: Boolean(item.published),
      }
    case 'exhibition':
      return {
        ...base,
        title: item.title || '',
        semester_label: item.semester_label || '',
        poster_url: item.poster_url || '',
        site_url: item.site_url || '',
        intro: item.intro || '',
        body: item.body || null,
        gallery: Array.isArray(item.gallery) ? item.gallery : [],
        held_at: dateOf(item.held_at),
        published: Boolean(item.published),
      }
    case 'portfolio':
      return {
        ...base,
        student_no: item.student_no || '',
        name: item.name || '',
        majors: item.majors || '',
        link: item.link || '',
        sort: item.sort ?? 0,
      }
    default:
      return {
        ...base,
        title_ko: item.title_ko || '',
        title_en: item.title_en || '',
        tag: item.tag || '',
        body: item.body || null,
        poster_url: item.poster_url || '',
        external_url: item.external_url || '',
        event_start: dateOf(item.event_start),
        event_end: dateOf(item.event_end),
        gallery: Array.isArray(item.gallery) ? item.gallery : [],
        published: Boolean(item.published),
        pinned: Boolean(item.pinned),
      }
  }
}

function toPayload(template, config, form) {
  switch (template) {
    case 'achievement': {
      const year = form.year === '' ? null : Number(form.year)
      return {
        title_ko: form.title_ko,
        title_en: nul(form.title_en),
        tag: year === null ? null : String(year),
        body: { awardee: form.awardee, host: form.host, desc: form.desc, year },
        external_url: nul(form.external_url),
        published: form.published,
      }
    }
    case 'exhibition':
      return {
        title: form.title,
        semester_label: nul(form.semester_label),
        poster_url: nul(form.poster_url),
        site_url: nul(form.site_url),
        intro: nul(form.intro),
        body: form.body,
        gallery: form.gallery,
        held_at: nul(form.held_at),
        published: form.published,
      }
    case 'portfolio':
      return {
        student_no: nul(form.student_no),
        name: form.name,
        majors: nul(form.majors),
        link: nul(form.link),
        sort: form.sort === '' ? 0 : Number(form.sort),
      }
    default: {
      const payload = {
        title_ko: form.title_ko,
        title_en: nul(form.title_en),
        tag: nul(form.tag),
        body: form.body,
        published: form.published,
        pinned: form.pinned,
      }
      if (template === 't2') {
        payload.poster_url = nul(form.poster_url)
        payload.external_url = nul(form.external_url)
        payload.event_start = nul(form.event_start)
        payload.event_end = nul(form.event_end)
      }
      if (config.attachments) payload.gallery = form.gallery
      return payload
    }
  }
}

// ── 페이지 ─────────────────────────────────────────────────────

function PostForm() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const config = POST_TYPES[type]
  const template = config?.template || 't1'
  const isNew = !id
  useTitle(config ? `${config.label} ${isNew ? '작성' : '수정'}` : '콘텐츠 관리')

  const { data, loading, error } = useApi(
    config && !isNew ? `/admin/content/${type}/${id}` : null
  )
  const [form, setForm] = useState(() => emptyForm(template))
  const [hydrated, setHydrated] = useState(isNew)
  const [busy, setBusy] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // 편집 모드 — 단건 도착 시 1회 주입
  useEffect(() => {
    if (hydrated || !data?.item) return
    setForm(fromItem(template, data.item))
    setHydrated(true)
  }, [hydrated, data, template])

  if (!config) return <EmptyNote>알 수 없는 콘텐츠 유형입니다</EmptyNote>

  const set = (key) => (v) => setForm((prev) => ({ ...prev, [key]: v }))
  const setInput = (key) => (e) => set(key)(e.target.value)
  const backTo = `/admin/posts/${type}`

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setSaveError(null)
    try {
      const payload = toPayload(template, config, form)
      if (isNew) await api.post(`/admin/content/${type}`, payload)
      else await api.put(`/admin/content/${type}/${id}`, payload)
      navigate(backTo)
    } catch (err) {
      setSaveError(err.hint ? `${err.message} — ${err.hint}` : err.message)
    } finally {
      setBusy(false)
    }
  }

  const isPosts = template === 't1' || template === 't2' || template === 'achievement'

  return (
    <section className="flex flex-col gap-24">
      <PageHead
        title={`${config.label} ${isNew ? '작성' : '수정'}`}
        actions={<GhostButton onClick={() => navigate(backTo)}>목록</GhostButton>}
      />

      {error && <ErrorText>{error.message}</ErrorText>}
      {!isNew && loading && (
        <p className="font-mono text-caption-m text-text-meta">불러오는 중</p>
      )}

      <form onSubmit={save} className="flex flex-col gap-24">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* 제목 — posts 계열 ko/en, 전시회·포트폴리오는 테이블 컬럼 */}
          {isPosts && (
            <>
              <Field label={template === 'achievement' ? '수상명' : '제목 (국문)'}>
                <Input value={form.title_ko} onChange={setInput('title_ko')} required />
              </Field>
              <Field label="제목 (영문)" hint="비우면 영문 페이지에 Korean only 뱃지">
                <Input value={form.title_en} onChange={setInput('title_en')} />
              </Field>
            </>
          )}

          {template === 't1' && config.tags && (
            <Field label="태그">
              <Select
                value={form.tag}
                onChange={setInput('tag')}
                options={[
                  { value: '', label: '태그 선택' },
                  ...config.tags.map((t) => ({ value: t, label: t })),
                ]}
              />
            </Field>
          )}

          {template === 't2' && (
            <>
              <Field label="일정 시작">
                <Input type="date" value={form.event_start} onChange={setInput('event_start')} />
              </Field>
              <Field label="일정 종료">
                <Input type="date" value={form.event_end} onChange={setInput('event_end')} />
              </Field>
              <Field
                label="외부 접수 URL"
                hint={type === 'contest' ? '입력 시 카드에서 바로 외부로 이동합니다' : undefined}
              >
                <Input type="url" value={form.external_url} onChange={setInput('external_url')} />
              </Field>
              <div className="md:col-span-2">
                <Field label="포스터">
                  <ImageUpload value={form.poster_url} onChange={set('poster_url')} usage="poster" />
                </Field>
              </div>
            </>
          )}

          {template === 'achievement' && (
            <>
              <Field label="수상자">
                <Input value={form.awardee} onChange={setInput('awardee')} />
              </Field>
              <Field label="주최">
                <Input value={form.host} onChange={setInput('host')} />
              </Field>
              <Field label="연도" hint="성좌 태그로 사용됩니다">
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => set('year')(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </Field>
              <Field label="대회 URL">
                <Input type="url" value={form.external_url} onChange={setInput('external_url')} />
              </Field>
              <div className="md:col-span-2">
                <Field label="설명">
                  <TextArea rows={4} value={form.desc} onChange={setInput('desc')} />
                </Field>
              </div>
            </>
          )}

          {template === 'exhibition' && (
            <>
              <Field label="전시명">
                <Input value={form.title} onChange={setInput('title')} required />
              </Field>
              <Field label="학기 라벨" hint="예: 2026-2">
                <Input value={form.semester_label} onChange={setInput('semester_label')} />
              </Field>
              <Field label="개최일">
                <Input type="date" value={form.held_at} onChange={setInput('held_at')} />
              </Field>
              <Field label="전시 사이트 URL">
                <Input type="url" value={form.site_url} onChange={setInput('site_url')} />
              </Field>
              <div className="md:col-span-2">
                <Field label="소개">
                  <TextArea rows={3} value={form.intro} onChange={setInput('intro')} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="포스터">
                  <ImageUpload value={form.poster_url} onChange={set('poster_url')} usage="poster" />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="갤러리">
                  <GalleryField value={form.gallery} onChange={set('gallery')} />
                </Field>
              </div>
            </>
          )}

          {template === 'portfolio' && (
            <>
              <Field label="이름">
                <Input value={form.name} onChange={setInput('name')} required />
              </Field>
              <Field label="학번">
                <Input value={form.student_no} onChange={setInput('student_no')} />
              </Field>
              <Field label="전공 조합">
                <Input value={form.majors} onChange={setInput('majors')} />
              </Field>
              <Field label="포트폴리오 링크">
                <Input type="url" value={form.link} onChange={setInput('link')} />
              </Field>
              <Field label="정렬 순서">
                <Input
                  type="number"
                  value={form.sort}
                  onChange={(e) => set('sort')(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </Field>
            </>
          )}

          {config.attachments && (
            <div className="md:col-span-2">
              <Field label="첨부 파일">
                <AttachmentsField value={form.gallery} onChange={set('gallery')} />
              </Field>
            </div>
          )}
        </div>

        {/* 본문 — T1·T2·전시회. 성과는 전용 필드만(게시판 렌더 금지), 포트폴리오는 링크형 */}
        {(template === 't1' || template === 't2' || template === 'exhibition') && (
          <Field label="본문">
            <RichEditor value={form.body} onChange={set('body')} />
          </Field>
        )}

        <div className="flex flex-wrap items-center gap-24 border-t border-border-subtle pt-24">
          {template !== 'portfolio' && (
            <Field label="게시">
              <Toggle checked={form.published} onChange={set('published')} label="게시 여부" />
            </Field>
          )}
          {isPosts && template !== 'achievement' && (
            <Field label="상단 고정">
              <Toggle checked={form.pinned} onChange={set('pinned')} label="상단 고정" />
            </Field>
          )}
        </div>

        <ErrorText>{saveError}</ErrorText>
        <div className="flex items-center gap-8">
          <PrimaryButton type="submit" disabled={busy || (!isNew && !hydrated)}>
            {busy ? '저장 중' : '저장'}
          </PrimaryButton>
          <GhostButton onClick={() => navigate(backTo)}>취소</GhostButton>
        </div>
      </form>
    </section>
  )
}

export default PostForm
