// /submit — 전시회 접수 (12_BACKEND 5절, 구글 폼 대체)
// 기간 판정 최종 권한은 서버(403) — settings/public.exhibition.is_submit_period는 UX 안내용.
// 개인/팀 분기 폼: 인적사항·과목·연락처·작품명·작품 설명(100자)·이미지(최대 5)·수정용 이메일+비밀번호.
// 비밀번호는 서버 검증 전용 — 클라이언트 저장 금지.
import { useState } from 'react'
import { Plus } from 'lucide-react'
import PageBanner from '../../components/layout/PageBanner'
import GlassCard from '../../components/common/GlassCard'
import Button from '../../components/common/Button'
import { api, useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { Field, ImagesField, MemberRows, ScheduleList } from './exhibitFormKit'
import {
  DESC_MAX,
  ENTRY_TYPE_LABEL,
  inputCls,
  labelCls,
  formatKst,
  resolveImageUrls,
  submitErrorMessage,
} from './exhibitFormShared'

const EMPTY_MEMBER = { name: '', studentNo: '', major: '' }

const INITIAL_FORM = {
  entryType: 'solo',
  name: '',
  studentNo: '',
  major: '',
  teamName: '',
  email: '',
  phone: '',
  course: '',
  workTitle: '',
  workDesc: '',
  password: '',
  passwordConfirm: '',
}

function Banner() {
  return (
    <PageBanner
      titleKo="전시회 접수"
      titleEn="EXHIBITION SUBMIT"
      breadcrumb={[
        { label: '홈', to: '/' },
        { label: '전시회 접수', to: '/submit' },
      ]}
      nebulaX="64%"
      nebulaY="32%"
    />
  )
}

function ExhibitSubmit() {
  useTitle('전시회 접수')
  const { data: settings, loading: settingsLoading } = useApi('/settings/public')
  const exhibition = settings?.exhibition ?? null
  // 설정 조회 실패 시에도 폼은 노출 — 기간 밖 제출은 서버가 403으로 차단한다
  const submitOpenNow = exhibition ? exhibition.is_submit_period === true : true

  const [form, setForm] = useState(INITIAL_FORM)
  const [members, setMembers] = useState([{ ...EMPTY_MEMBER }])
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)

  const set = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  const isTeam = form.entryType === 'team'

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.password.length < 4) {
      setError('수정용 비밀번호는 4자 이상이어야 합니다')
      return
    }
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }
    if (
      isTeam &&
      !members.every((m) => m.name.trim() && m.studentNo.trim() && m.major.trim())
    ) {
      setError('팀원 이름·학번·전공을 모두 입력해 주세요')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const common = {
        phone: form.phone.trim(),
        course: form.course.trim(),
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
      await api.post('/submit/exhibition', {
        entry_type: form.entryType,
        fields,
        email: form.email.trim(),
        password: form.password,
        images: urls,
      })
      setDone(true)
    } catch (err) {
      setError(submitErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (settingsLoading) {
    return (
      <>
        <Banner />
        <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
          <p className="text-body-m text-text-meta md:text-body-d" aria-live="polite">
            접수 일정 확인 중
          </p>
        </section>
      </>
    )
  }

  if (!submitOpenNow) {
    return (
      <>
        <Banner />
        <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
          <GlassCard className="flex max-w-container flex-col items-start gap-24 p-24 md:p-40">
            <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
              접수 기간 아님
            </h2>
            <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
              지금은 전시회 접수 기간이 아닙니다. 아래 일정을 확인해 주세요.
            </p>
            <ScheduleList exhibition={exhibition} />
            {exhibition?.is_edit_period === true && (
              <Button variant="secondary" href="/submit/edit">
                기존 접수 수정
              </Button>
            )}
          </GlassCard>
        </section>
      </>
    )
  }

  return (
    <>
      <Banner />
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        {done ? (
          <GlassCard className="flex flex-col items-start gap-24 p-24 md:p-40">
            <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
              접수 완료
            </h2>
            <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
              전시회 출품이 접수되었습니다. 내용 수정은 접수 시 등록한 이메일과
              비밀번호로 가능합니다
              {formatKst(exhibition?.edit_close)
                ? ` (수정 마감: ${formatKst(exhibition?.edit_close)})`
                : ''}
              .
            </p>
            <div className="flex flex-wrap gap-12">
              <Button variant="secondary" href="/submit/edit">
                접수 내용 수정
              </Button>
              <Button variant="secondary" href="/">
                홈으로 이동
              </Button>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-24 md:p-40">
            <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-32">
              <ScheduleList exhibition={exhibition} />
              <fieldset className="flex min-w-0 flex-col gap-8">
                <legend className={labelCls}>참가 유형</legend>
                <div className="grid grid-cols-2 gap-8">
                  {Object.entries(ENTRY_TYPE_LABEL).map(([value, label]) => (
                    <label key={value} className="min-w-0 cursor-pointer">
                      <input
                        type="radio"
                        name="entry_type"
                        value={value}
                        checked={form.entryType === value}
                        onChange={set('entryType')}
                        className="peer sr-only"
                      />
                      <span className="flex h-11 items-center justify-center rounded-md border border-border-subtle text-body-m text-text-sec transition-colors duration-fast ease-out peer-checked:border-border-strong peer-checked:bg-glass-strong peer-checked:font-semibold peer-checked:text-text-pri peer-focus-visible:border-border-focus md:h-48 md:text-body-d">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {isTeam ? (
                <>
                  <Field label="팀명" required>
                    <input
                      type="text"
                      required
                      value={form.teamName}
                      onChange={set('teamName')}
                      className={inputCls}
                      placeholder="팀 이름"
                    />
                  </Field>
                  <Field
                    as="div"
                    label="팀원"
                    required
                    hint="대표자를 포함한 전체 팀원의 이름·학번·전공을 입력합니다"
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
                      placeholder="이름"
                    />
                  </Field>
                  <Field label="학번" required>
                    <input
                      type="text"
                      required
                      value={form.studentNo}
                      onChange={set('studentNo')}
                      className={inputCls}
                      placeholder="학번"
                    />
                  </Field>
                  <Field label="전공" required>
                    <input
                      type="text"
                      required
                      value={form.major}
                      onChange={set('major')}
                      className={inputCls}
                      placeholder="전공"
                    />
                  </Field>
                </div>
              )}

              <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
                <Field label="이메일" required hint="접수 확인과 수정에 사용됩니다">
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={set('email')}
                    className={inputCls}
                    placeholder="example@office.kmu.ac.kr"
                  />
                </Field>
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
              </div>

              <Field label="과목" required hint="출품작이 제작된 수강 과목명">
                <input
                  type="text"
                  required
                  value={form.course}
                  onChange={set('course')}
                  className={inputCls}
                  placeholder="과목명"
                />
              </Field>

              <Field label="작품명" required>
                <input
                  type="text"
                  required
                  value={form.workTitle}
                  onChange={set('workTitle')}
                  className={inputCls}
                  placeholder="작품 제목"
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
                  placeholder="작품에 대한 간단한 설명"
                />
                <span
                  aria-live="polite"
                  className="text-right font-mono text-caption-m text-text-meta"
                >
                  {form.workDesc.length}/{DESC_MAX}
                </span>
              </Field>

              <ImagesField images={images} onChange={setImages} />

              <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
                <Field
                  label="수정용 비밀번호"
                  required
                  hint="접수 후 내용 수정에 사용됩니다. 4자 이상."
                >
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={form.password}
                    onChange={set('password')}
                    className={inputCls}
                  />
                </Field>
                <Field label="비밀번호 확인" required>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={form.passwordConfirm}
                    onChange={set('passwordConfirm')}
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
                  disabled={submitting}
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-sm bg-bg-invert px-24 text-body-m font-semibold text-text-invert transition-opacity duration-fast ease-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:h-48 md:text-body-d"
                >
                  {submitting ? '접수 중' : '접수'}
                </button>
              </div>
            </form>
          </GlassCard>
        )}
      </section>
    </>
  )
}

export default ExhibitSubmit
