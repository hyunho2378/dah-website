// /submit/edit — 전시회 접수 수정 (12_BACKEND 5절)
// 이메일+비밀번호 → POST /submit/exhibition/list(본인 접수 목록) → 선택 → PUT /submit/exhibition.
// readonly: 참가 유형·과목·이메일 — 서버가 변경을 무시하므로 클라도 자물쇠+비활성으로 표시만.
// 인증 정보는 컴포넌트 state(메모리)만 보관 — 클라이언트 저장 금지.
import { useState } from 'react'
import { ChevronRight, Plus } from 'lucide-react'
import PageBanner from '../../components/layout/PageBanner'
import GlassCard from '../../components/common/GlassCard'
import Button from '../../components/common/Button'
import { api, useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import {
  Field,
  ImagesField,
  LockedField,
  MemberRows,
  ScheduleList,
} from './exhibitFormKit'
import {
  DESC_MAX,
  ENTRY_TYPE_LABEL,
  inputCls,
  formatKst,
  resolveImageUrls,
  submitErrorMessage,
} from './exhibitFormShared'

const EMPTY_MEMBER = { name: '', studentNo: '', major: '' }

function Banner() {
  return (
    <PageBanner
      titleKo="접수 수정"
      titleEn="EXHIBITION EDIT"
      breadcrumb={[
        { label: '홈', to: '/' },
        { label: '전시회 접수', to: '/submit' },
        { label: '수정', to: '/submit/edit' },
      ]}
      nebulaX="64%"
      nebulaY="44%"
    />
  )
}

function Section({ children }) {
  return (
    <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
      {children}
    </section>
  )
}

function ExhibitEdit() {
  useTitle('전시회 접수 수정')
  const { data: settings, loading: settingsLoading } = useApi('/settings/public')
  const exhibition = settings?.exhibition ?? null
  // 설정 조회 실패 시에도 플로우 노출 — 기간 밖 수정은 서버가 403으로 차단한다
  const editOpenNow = exhibition ? exhibition.is_edit_period === true : true

  const [step, setStep] = useState('auth') // auth | list | form | done
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [entries, setEntries] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(null)
  const [members, setMembers] = useState([{ ...EMPTY_MEMBER }])
  const [images, setImages] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const setCred = (key) => (event) =>
    setCredentials((prev) => ({ ...prev, [key]: event.target.value }))
  const set = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const handleAuth = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await api.post('/submit/exhibition/list', {
        email: credentials.email.trim(),
        password: credentials.password,
      })
      const list = Array.isArray(res) ? res : (res?.entries ?? res?.items ?? [])
      setEntries(list)
      setStep('list')
    } catch (err) {
      setError(submitErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const selectEntry = (entry) => {
    const f = entry.fields ?? {}
    setForm({
      name: f.name ?? '',
      studentNo: f.student_no ?? '',
      major: f.major ?? '',
      teamName: f.team_name ?? '',
      phone: f.phone ?? '',
      workTitle: f.work_title ?? '',
      workDesc: f.work_desc ?? '',
    })
    const loadedMembers = Array.isArray(f.members)
      ? f.members.map((m) => ({
          name: m?.name ?? '',
          studentNo: m?.student_no ?? '',
          major: m?.major ?? '',
        }))
      : []
    setMembers(loadedMembers.length ? loadedMembers : [{ ...EMPTY_MEMBER }])
    setImages(
      (Array.isArray(entry.images) ? entry.images : []).map((url) => ({ url }))
    )
    setSelected(entry)
    setError(null)
    setStep('form')
  }

  const handleSave = async (event) => {
    event.preventDefault()
    const isTeam = selected.entry_type === 'team'
    if (
      isTeam &&
      !members.every((m) => m.name.trim() && m.studentNo.trim() && m.major.trim())
    ) {
      setError('팀원 이름·학번·전공을 모두 입력해 주세요')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const common = {
        // 과목은 readonly — 서버가 무시하지만 원본 값을 그대로 되돌려 보낸다
        course: selected.fields?.course ?? '',
        phone: form.phone.trim(),
        work_title: form.workTitle.trim(),
        work_desc: form.workDesc.trim(),
      }
      const fields = isTeam
        ? {
            team_name: form.teamName.trim(),
            members: members.map((m) => ({
              name: m.name.trim(),
              student_no: m.studentNo.trim(),
              major: m.major.trim(),
            })),
            ...common,
          }
        : {
            name: form.name.trim(),
            student_no: form.studentNo.trim(),
            major: form.major.trim(),
            ...common,
          }
      const urls = await resolveImageUrls(images)
      await api.put('/submit/exhibition', {
        id: selected.id,
        email: credentials.email.trim(),
        password: credentials.password,
        entry_type: selected.entry_type,
        fields,
        images: urls,
      })
      setStep('done')
    } catch (err) {
      setError(submitErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (settingsLoading) {
    return (
      <>
        <Banner />
        <Section>
          <p className="text-body-m text-text-meta md:text-body-d" aria-live="polite">
            수정 가능 기간 확인 중
          </p>
        </Section>
      </>
    )
  }

  if (!editOpenNow) {
    return (
      <>
        <Banner />
        <Section>
          <GlassCard className="flex flex-col items-start gap-24 p-24 md:p-40">
            <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
              수정 기간 아님
            </h2>
            <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
              지금은 접수 내용 수정 기간이 아닙니다. 아래 일정을 확인해 주세요.
            </p>
            <ScheduleList exhibition={exhibition} />
            <Button variant="secondary" href="/">
              홈으로 이동
            </Button>
          </GlassCard>
        </Section>
      </>
    )
  }

  return (
    <>
      <Banner />
      <Section>
        {step === 'auth' && (
          <GlassCard className="p-24 md:p-40">
            <form onSubmit={handleAuth} className="flex min-w-0 flex-col gap-32">
              <p className="text-body-m leading-relaxed text-text-sec md:text-body-d">
                접수 시 등록한 이메일과 비밀번호를 입력하면 본인의 접수 목록을
                불러옵니다.
              </p>
              <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
                <Field label="이메일" required>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={credentials.email}
                    onChange={setCred('email')}
                    className={inputCls}
                    placeholder="접수 시 등록한 이메일"
                  />
                </Field>
                <Field label="비밀번호" required>
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={setCred('password')}
                    className={inputCls}
                  />
                </Field>
              </div>
              {error && (
                <p role="alert" className="text-small-m text-state-error md:text-small-d">
                  {error}
                </p>
              )}
              <div>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-sm bg-bg-invert px-24 text-body-m font-semibold text-text-invert transition-opacity duration-fast ease-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:h-48 md:text-body-d"
                >
                  {busy ? '확인 중' : '접수 목록 확인'}
                </button>
              </div>
            </form>
          </GlassCard>
        )}

        {step === 'list' && (
          <div className="flex flex-col gap-24">
            <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
              접수 목록
            </h2>
            {entries.length === 0 ? (
              <GlassCard className="flex flex-col items-start gap-24 p-24 md:p-40">
                <p className="text-body-m leading-relaxed text-text-sec md:text-body-d">
                  해당 이메일로 등록된 접수 내역이 없습니다.
                </p>
                <Button variant="secondary" href="/submit">
                  새로 접수
                </Button>
              </GlassCard>
            ) : (
              <ul className="flex flex-col gap-16">
                {entries.map((entry) => (
                  <li key={entry.id} className="min-w-0">
                    <GlassCard hover as="div" className="min-w-0">
                      <button
                        type="button"
                        onClick={() => selectEntry(entry)}
                        className="flex w-full cursor-pointer items-center justify-between gap-16 p-24 text-left"
                      >
                        <span className="flex min-w-0 flex-col gap-8">
                          <span className="truncate text-body-l-m font-semibold text-text-pri md:text-body-l-d">
                            {entry.fields?.work_title || '(작품명 미입력)'}
                          </span>
                          <span className="font-mono text-caption-m text-text-meta">
                            {ENTRY_TYPE_LABEL[entry.entry_type] ?? entry.entry_type}
                            {entry.created_at
                              ? ` · ${String(entry.created_at).slice(0, 10)}`
                              : ''}
                          </span>
                        </span>
                        <ChevronRight
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 text-text-meta"
                        />
                      </button>
                    </GlassCard>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {step === 'form' && selected && form && (
          <GlassCard className="p-24 md:p-40">
            <form onSubmit={handleSave} className="flex min-w-0 flex-col gap-32">
              <div className="flex items-baseline justify-between gap-16">
                <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
                  접수 내용 수정
                </h2>
                <button
                  type="button"
                  onClick={() => setStep('list')}
                  className="cursor-pointer text-small-m text-text-meta transition-colors duration-fast ease-out hover:text-text-pri md:text-small-d"
                >
                  목록으로
                </button>
              </div>

              <div className="grid grid-cols-1 gap-24 md:grid-cols-3">
                <LockedField
                  label="참가 유형"
                  value={ENTRY_TYPE_LABEL[selected.entry_type] ?? selected.entry_type}
                />
                <LockedField label="이메일" value={selected.email ?? credentials.email} />
                <LockedField label="과목" value={selected.fields?.course} />
              </div>

              {selected.entry_type === 'team' ? (
                <>
                  <Field label="팀명" required>
                    <input
                      type="text"
                      required
                      value={form.teamName}
                      onChange={set('teamName')}
                      className={inputCls}
                    />
                  </Field>
                  <Field
                    as="div"
                    label="팀원"
                    required
                    hint="대표자를 포함한 전체 팀원의 이름·학번·전공"
                  >
                    <MemberRows members={members} onChange={setMembers} />
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setMembers((prev) => [...prev, { ...EMPTY_MEMBER }])
                        }
                        className="inline-flex cursor-pointer items-center gap-8 rounded-sm border border-border-subtle px-16 py-8 text-small-m font-semibold text-text-pri transition-colors duration-fast ease-out hover:border-border-strong md:text-small-d"
                      >
                        <Plus size={16} aria-hidden="true" />
                        팀원 추가
                      </button>
                    </div>
                  </Field>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-24 md:grid-cols-3">
                  <Field label="이름" required>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set('name')}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="학번" required>
                    <input
                      type="text"
                      required
                      value={form.studentNo}
                      onChange={set('studentNo')}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="전공" required>
                    <input
                      type="text"
                      required
                      value={form.major}
                      onChange={set('major')}
                      className={inputCls}
                    />
                  </Field>
                </div>
              )}

              <Field label="연락처" required>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  className={inputCls}
                  placeholder="010-0000-0000"
                />
              </Field>

              <Field label="작품명" required>
                <input
                  type="text"
                  required
                  value={form.workTitle}
                  onChange={set('workTitle')}
                  className={inputCls}
                />
              </Field>

              <Field label="작품 설명" required hint={`최대 ${DESC_MAX}자`}>
                <textarea
                  required
                  rows={4}
                  maxLength={DESC_MAX}
                  value={form.workDesc}
                  onChange={set('workDesc')}
                  className={inputCls}
                />
                <span
                  aria-live="polite"
                  className="text-right font-mono text-caption-m text-text-meta"
                >
                  {form.workDesc.length}/{DESC_MAX}
                </span>
              </Field>

              <ImagesField images={images} onChange={setImages} />

              {error && (
                <p role="alert" className="text-small-m text-state-error md:text-small-d">
                  {error}
                </p>
              )}
              <div>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-sm bg-bg-invert px-24 text-body-m font-semibold text-text-invert transition-opacity duration-fast ease-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:h-48 md:text-body-d"
                >
                  {busy ? '저장 중' : '수정 저장'}
                </button>
              </div>
            </form>
          </GlassCard>
        )}

        {step === 'done' && (
          <GlassCard className="flex flex-col items-start gap-24 p-24 md:p-40">
            <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
              수정 완료
            </h2>
            <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
              접수 내용이 수정되었습니다.
              {formatKst(exhibition?.edit_close)
                ? ` 수정은 ${formatKst(exhibition?.edit_close)}까지 가능합니다.`
                : ''}
            </p>
            <div className="flex flex-wrap gap-12">
              <Button variant="secondary" href="/">
                홈으로 이동
              </Button>
            </div>
          </GlassCard>
        )}
      </Section>
    </>
  )
}

export default ExhibitEdit
