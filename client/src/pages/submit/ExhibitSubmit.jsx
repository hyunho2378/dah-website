// /submit — 전시회 접수 (12_BACKEND 5절, 구글 폼 대체)
// 기간 판정 최종 권한은 서버(403) — settings/public.exhibition.is_submit_period는 UX 안내용.
// 33_PHASE18 Y2-3/Y2-4: 같은 라우트 안에서 온보딩(intro) → 폼(form) → 완료(done) 단계로 진행한다.
//   (App.jsx 라우트를 건드리지 않기 위해 단계는 컴포넌트 state로만 관리)
// 개인/팀 분기 폼: 인적사항·과목·연락처·작품명·작품 설명(100자)·수정용 이메일+비밀번호.
// 비밀번호는 서버 검증 전용 — 클라이언트 저장 금지.
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import GlassCard from '../../components/common/GlassCard'
import Button from '../../components/common/Button'
import RadioCards from '../../components/common/RadioCards'
import { ACCENT } from '../../styles/accents'
import { api, useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useAuth } from '../../context/AuthContext'
import { exhibitionFullTitle } from '../../data/exhibitionTitle'
import { isValidEmail, isValidPassword, isValidPhone } from '../../utils/format'
import {
  Field,
  MemberRows,
  PhoneInput,
  ScheduleHighlight,
  ScheduleList,
  SubjectField,
  SubmitButton,
} from './exhibitFormKit'
import {
  DESC_MAX,
  ENTRY_TYPE_LABEL,
  WORK_TITLE_HINT,
  inputCls,
  labelCls,
  formatKst,
  resolveSubjects,
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

const ENTRY_TYPE_OPTIONS = [
  { value: 'solo', label: ENTRY_TYPE_LABEL.solo, desc: '혼자 출품합니다' },
  { value: 'team', label: ENTRY_TYPE_LABEL.team, desc: '둘 이상이 함께 출품합니다' },
]

// Y2-3 온보딩 절차 안내 — 접수 시작 전에 전체 흐름을 먼저 보여준다
const STEPS = [
  { n: '01', title: '작성', desc: '참가 유형·인적사항·과목·작품 정보를 입력합니다.' },
  { n: '02', title: '제출', desc: '수정용 이메일과 비밀번호를 등록하고 접수를 완료합니다.' },
  {
    n: '03',
    title: '수정',
    desc: '수정 마감 전까지 「접수 내역 확인·수정」에서 등록한 이메일·비밀번호로 다시 열어 수정합니다.',
  },
]

const NOTES = [
  WORK_TITLE_HINT,
  '참가 유형·과목·이메일은 접수 후 수정할 수 없습니다. 제출 전에 확인해 주세요.',
  '연락처는 010-0000-0000 형식으로만 입력됩니다.',
  '작품 설명은 최대 100자입니다.',
  '수정용 비밀번호는 4자 이상이며, 분실 시 복구가 어려우니 따로 보관해 주세요.',
]

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

// P3 카드(bg.elev + hairline) — 글래스 중첩·blur 예산(동시 3개)을 피하려고 온보딩 본문은 비유리 패널
function Panel({ title, children }) {
  return (
    <section className="flex min-w-0 flex-col gap-16 rounded-md border border-border-subtle bg-bg-elev p-24 md:p-32">
      <h3 className="text-h3-m font-bold leading-snug text-text-pri md:text-h3-d">{title}</h3>
      {children}
    </section>
  )
}

function ExhibitSubmit() {
  useTitle('전시회 접수')
  const { data: settingsRes, loading: settingsLoading } = useApi('/settings/public')
  const { data: exhibitionsRes } = useApi('/content/exhibitions', {
    params: { pageSize: 20 },
  })
  const { hasRole } = useAuth()
  const [searchParams] = useSearchParams()
  const exhibition = settingsRes?.exhibition ?? null
  // Y2-4-8: 과목 목록은 어드민(Y3-1)이 등록한 값 — 아직 없으면 빈 배열 → 자유 입력 폴백
  const subjects = resolveSubjects(settingsRes)
  // 온보딩에 표시할 전시회명 — 상단 고정(피처드) 전시의 풀네임, 없으면 최신 항목
  const exhibitionItems = exhibitionsRes?.items ?? []
  const currentExhibition =
    exhibitionItems.find((it) => it?.is_featured) ?? exhibitionItems[0] ?? null
  const exhibitionName = currentExhibition
    ? exhibitionFullTitle(currentExhibition.ordinal) || currentExhibition.title
    : '디지털인문예술전공 프로젝트 전시회'

  // H10.3: 어드민 전용 미리보기 — manager+ 로그인 상태에서 /submit?preview=1 이면 기간 검증 우회
  //   (실제 제출은 서버가 기간 밖 403으로 차단 — 화면 테스트 용도)
  const previewBypass = searchParams.get('preview') === '1' && hasRole('manager')
  // 설정 조회 실패 시에도 폼은 노출 — 기간 밖 제출은 서버가 403으로 차단한다
  const submitOpenNow =
    previewBypass || (exhibition ? exhibition.is_submit_period === true : true)

  const [step, setStep] = useState('intro') // intro | form | done
  const [form, setForm] = useState(INITIAL_FORM)
  const [members, setMembers] = useState([{ ...EMPTY_MEMBER }])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const set = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  const setValue = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }))
  const isTeam = form.entryType === 'team'

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isValidEmail(form.email)) {
      setError('이메일 형식을 확인해 주세요 (예: example@hallym.ac.kr)')
      return
    }
    if (!isValidPhone(form.phone)) {
      setError('연락처를 010-0000-0000 형식으로 모두 입력해 주세요')
      return
    }
    if (!form.course.trim()) {
      setError('과목을 선택해 주세요')
      return
    }
    if (!isValidPassword(form.password)) {
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
      await api.post('/submit/exhibition', {
        entry_type: form.entryType,
        fields,
        email: form.email.trim(),
        password: form.password,
      })
      setStep('done')
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
        <Container as="section" className="py-section-m lg:py-section-d">
          <p className="text-body-m text-text-meta md:text-body-d" aria-live="polite">
            접수 일정 확인 중
          </p>
        </Container>
      </>
    )
  }

  if (!submitOpenNow) {
    return (
      <>
        <Banner />
        <Container as="section" className="py-section-m lg:py-section-d">
          <GlassCard className="flex flex-col items-start gap-24 p-24 md:p-40">
            <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
              접수 기간 아님
            </h2>
            <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
              지금은 전시회 접수 기간이 아닙니다. 아래 일정을 확인해 주세요.
            </p>
            <ScheduleList exhibition={exhibition} />
            <Button variant="secondary" href="/submit/edit">
              접수 내역 확인·수정
            </Button>
          </GlassCard>
        </Container>
      </>
    )
  }

  return (
    <>
      <Banner />
      <Container as="section" className="py-section-m lg:py-section-d">
        {step === 'intro' && (
          <div className="flex min-w-0 flex-col gap-32">
            <header className="flex min-w-0 flex-col gap-12">
              <p className="font-mono text-caption-m uppercase tracking-label text-text-meta md:text-caption-d">
                접수 안내
              </p>
              <h2 className="min-w-0 text-display-l-m font-extrabold leading-tight tracking-display text-text-pri md:text-display-l-d">
                {exhibitionName}
              </h2>
              <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
                접수 대상 <span className={ACCENT.proper}>디지털인문예술전공 수강생</span> · 개인
                또는 팀 단위로 출품합니다.
              </p>
            </header>

            <ScheduleHighlight exhibition={exhibition} />

            <div className="grid min-w-0 gap-24 lg:grid-cols-2">
              <Panel title="접수 절차">
                <ol className="flex flex-col gap-16">
                  {STEPS.map((s) => (
                    <li key={s.n} className="flex min-w-0 gap-16">
                      <span
                        className={`shrink-0 font-mono text-caption-m font-bold md:text-caption-d ${ACCENT.index}`}
                      >
                        {s.n}
                      </span>
                      <span className="flex min-w-0 flex-col gap-4">
                        <span className="text-body-m font-semibold text-text-pri md:text-body-d">
                          {s.title}
                        </span>
                        <span className="text-small-m leading-relaxed text-text-sec md:text-small-d">
                          {s.desc}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </Panel>
              <Panel title="유의사항">
                <ul className="flex flex-col gap-12">
                  {NOTES.map((note) => (
                    <li
                      key={note}
                      className="flex min-w-0 gap-12 text-small-m leading-relaxed text-text-sec md:text-small-d"
                    >
                      <span aria-hidden="true" className={ACCENT.index}>
                        ·
                      </span>
                      <span className="min-w-0">{note}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>

            <div className="flex flex-wrap items-center gap-16">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-sm bg-button-primary px-24 text-body-m font-semibold text-button-primaryText shadow-btn transition duration-fast ease-out hover:bg-button-primaryHover hover:shadow-btn-hover active:bg-button-primaryPressed md:h-48 md:text-body-d"
              >
                접수 시작하기
              </button>
              <Button variant="secondary" href="/submit/edit">
                접수 내역 확인·수정
              </Button>
            </div>
          </div>
        )}

        {step === 'done' && (
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
                접수 내역 확인·수정
              </Button>
              <Button variant="secondary" href="/">
                홈으로 이동
              </Button>
            </div>
          </GlassCard>
        )}

        {step === 'form' && (
          <div className="flex min-w-0 flex-col gap-24">
            <ScheduleHighlight exhibition={exhibition} />
            <GlassCard className="p-24 md:p-40">
              <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-32">
                <div className="flex flex-wrap items-baseline justify-between gap-16">
                  <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
                    접수 폼
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep('intro')}
                    className="cursor-pointer text-small-m text-text-meta transition-colors duration-fast ease-out hover:text-text-pri md:text-small-d"
                  >
                    안내로 돌아가기
                  </button>
                </div>

                <Field as="div" label="참가 유형" required>
                  <RadioCards
                    name="entry_type"
                    options={ENTRY_TYPE_OPTIONS}
                    value={form.entryType}
                    onChange={setValue('entryType')}
                  />
                </Field>

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
                      placeholder="example@hallym.ac.kr"
                    />
                  </Field>
                  <Field label="연락처" required hint="010-0000-0000">
                    <PhoneInput value={form.phone} onChange={setValue('phone')} />
                  </Field>
                </div>

                <SubjectField
                  subjects={subjects}
                  value={form.course}
                  onChange={setValue('course')}
                />

                <Field label="작품명" required hint={WORK_TITLE_HINT}>
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

                {/* Y2-4-3: 비밀번호·확인은 세로 배치(2열 금지) */}
                <fieldset className="flex min-w-0 flex-col gap-24">
                  <legend className={labelCls}>수정용 비밀번호</legend>
                  <Field
                    label="비밀번호"
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
                </fieldset>

                {error && (
                  <p role="alert" className="text-small-m text-state-error md:text-small-d">
                    {error}
                  </p>
                )}
                <div>
                  <SubmitButton busy={submitting}>
                    {submitting ? '접수 중' : '접수'}
                  </SubmitButton>
                </div>
              </form>
            </GlassCard>
          </div>
        )}
      </Container>
    </>
  )
}

export default ExhibitSubmit
