// CodeSharingAdmin.jsx — 코드쉐어링 단일 문서 편집 (13_CMS_SPEC 1절, admin+)
// B1 계약: codesharing 싱글턴(id=1) body jsonb + depts jsonb + hwp_url. POST가 upsert.
// body는 공개 페이지(CodeSharing.jsx)가 소비하는 구조 문서 {definition, note, steps, types}
// — 시드·렌더러와의 계약 유지를 위해 자유 서식(RichEditor) 대신 구조 필드로 편집한다.

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useApi, api } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import ImageUpload from '../../components/admin/ImageUpload'
import {
  ErrorText,
  Field,
  GhostButton,
  Input,
  PageHead,
  PrimaryButton,
  TextArea,
} from '../../components/admin/FormControls'

const ICON_BTN =
  'flex h-32 w-32 shrink-0 cursor-pointer items-center justify-center rounded-sm text-text-sec transition duration-fast ease-out hover:bg-glass-strong hover:text-text-pri focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

/** 문자열 목록 편집 — 승인 절차·인정 학과 공용 */
function StringListField({ label, value = [], onChange, addLabel = '항목 추가' }) {
  const setRow = (i, v) => onChange(value.map((row, idx) => (idx === i ? v : row)))
  return (
    <div className="flex flex-col gap-8">
      {value.map((row, i) => (
        <div key={i} className="flex items-center gap-8">
          <Input
            value={row}
            onChange={(e) => setRow(i, e.target.value)}
            aria-label={`${label} ${i + 1}`}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            aria-label="항목 제거"
            className={ICON_BTN}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <div>
        <GhostButton onClick={() => onChange([...value, ''])}>
          <Plus size={16} aria-hidden="true" />
          {addLabel}
        </GhostButton>
      </div>
    </div>
  )
}

const EMPTY = {
  definition: '',
  note: '',
  steps: [],
  types: [],
  depts: [],
  hwp_url: '',
}

function CodeSharingAdmin() {
  useTitle('코드쉐어링 관리')
  const { data, loading, error, offline, refetch } = useApi('/admin/content/codesharing')
  const [form, setForm] = useState(EMPTY)
  const [hydrated, setHydrated] = useState(false)
  const [busy, setBusy] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (hydrated) return
    const item = data?.items?.[0]
    if (!item) return
    setForm({
      definition: item.body?.definition || '',
      note: item.body?.note || '',
      steps: Array.isArray(item.body?.steps) ? item.body.steps : [],
      types: Array.isArray(item.body?.types) ? item.body.types : [],
      depts: Array.isArray(item.depts) ? item.depts : [],
      hwp_url: item.hwp_url || '',
    })
    setHydrated(true)
  }, [hydrated, data])

  const set = (key) => (v) => {
    setSaved(false)
    setForm((prev) => ({ ...prev, [key]: v }))
  }

  const setType = (i, key, v) => {
    set('types')(form.types.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)))
  }

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setSaveError(null)
    try {
      // 싱글턴 upsert — POST /admin/content/codesharing (id=1 고정, B1 계약)
      await api.post('/admin/content/codesharing', {
        body: {
          definition: form.definition,
          note: form.note,
          steps: form.steps.filter((s) => s.trim() !== ''),
          types: form.types.filter((t) => (t.name || '').trim() !== ''),
        },
        depts: form.depts.filter((d) => d.trim() !== ''),
        hwp_url: form.hwp_url || null,
      })
      setSaved(true)
    } catch (err) {
      setSaveError(err.hint ? `${err.message} (${err.hint})` : err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="flex flex-col gap-24">
      <PageHead
        title="코드쉐어링"
        desc="단일 문서입니다. 본문과 인정 학과 목록, HWP 신청서를 관리합니다."
        offline={offline}
      />

      {/* G3: 기존 문서가 채워진 뒤에만 폼 렌더 — 빈 폼으로 덮어쓰기 방지 */}
      {!hydrated ? (
        <div className="flex flex-col items-start gap-16">
          {loading && (
            <p className="font-mono text-caption-m text-text-meta">
              기존 내용을 불러오는 중
            </p>
          )}
          {error && (
            <>
              <ErrorText>{error.message}</ErrorText>
              <GhostButton onClick={refetch}>다시 불러오기</GhostButton>
            </>
          )}
          {!loading && !error && (
            <p className="font-mono text-caption-m text-text-meta">
              문서가 아직 없습니다. 저장하면 새 문서가 생성됩니다.
            </p>
          )}
        </div>
      ) : null}

      {(hydrated || (!loading && !error && !data?.items?.length)) && (
      <form onSubmit={save} className="flex flex-col gap-24">
        <Field label="정의">
          <TextArea rows={3} value={form.definition} onChange={(e) => set('definition')(e.target.value)} />
        </Field>
        <Field label="유의 사항">
          <TextArea rows={3} value={form.note} onChange={(e) => set('note')(e.target.value)} />
        </Field>

        <Field label="승인 절차" hint="순서대로 렌더됩니다">
          <StringListField label="승인 절차" value={form.steps} onChange={set('steps')} addLabel="단계 추가" />
        </Field>

        <Field label="코드쉐어링 유형">
          <div className="flex flex-col gap-8">
            {form.types.map((row, i) => (
              <div key={i} className="flex items-center gap-8">
                <Input
                  value={row.name || ''}
                  onChange={(e) => setType(i, 'name', e.target.value)}
                  placeholder="유형명"
                  aria-label={`유형 ${i + 1} 이름`}
                />
                <Input
                  value={row.detail || ''}
                  onChange={(e) => setType(i, 'detail', e.target.value)}
                  placeholder="설명"
                  aria-label={`유형 ${i + 1} 설명`}
                />
                <button
                  type="button"
                  onClick={() => set('types')(form.types.filter((_, idx) => idx !== i))}
                  aria-label="유형 제거"
                  className={ICON_BTN}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <div>
              <GhostButton onClick={() => set('types')([...form.types, { name: '', detail: '' }])}>
                <Plus size={16} aria-hidden="true" />
                유형 추가
              </GhostButton>
            </div>
          </div>
        </Field>

        <Field label={`인정 학과 (${form.depts.length})`}>
          <StringListField label="인정 학과" value={form.depts} onChange={set('depts')} addLabel="학과 추가" />
        </Field>

        <Field label="HWP 신청서" hint="코드쉐어링 인정원 파일 교체">
          <ImageUpload
            value={form.hwp_url}
            onChange={set('hwp_url')}
            accept=".hwp,.hwpx"
            preview={false}
            buttonLabel="HWP 업로드"
          />
        </Field>

        <ErrorText>{saveError}</ErrorText>
        {saved && <p className="font-mono text-caption-m text-text-meta">저장 완료</p>}
        <div>
          <PrimaryButton type="submit" disabled={busy}>
            {busy ? '저장 중' : '저장'}
          </PrimaryButton>
        </div>
      </form>
      )}
    </section>
  )
}

export default CodeSharingAdmin
