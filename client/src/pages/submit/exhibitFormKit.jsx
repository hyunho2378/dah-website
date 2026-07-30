// 전시회 접수 폼 공용 컴포넌트 (12_BACKEND 5절) — ExhibitSubmit·ExhibitEdit 전용
// LoginGate와 AccountBar만 공개 제출 공용이라 ShowcaseSubmit도 함께 쓴다(41_AUTH_CONTRACT).
// 상수·헬퍼는 exhibitFormShared.js(비 JSX 모듈) — 이 파일은 컴포넌트만 export.
import { useState } from 'react'
import { Lock, LogOut, X } from 'lucide-react'
import GlassCard from '../../components/common/GlassCard'
import RadioCards from '../../components/common/RadioCards'
import SegmentControl from '../../components/common/SegmentControl'
import GoogleLoginButton from '../../components/auth/GoogleLoginButton'
import { ACCENT } from '../../styles/accents'
import { formatPhone } from '../../utils/format'
import { formatKst, inputCls, labelCls, semesterDesc } from './exhibitFormShared'

/** 라벨+힌트 래퍼. 입력 1개면 기본 label, 그룹(팀원·과목 등)은 as="div". */
export function Field({ as: Tag = 'label', label, required = false, hint, children }) {
  return (
    <Tag className="flex min-w-0 flex-col gap-8">
      <span className="flex items-baseline gap-8">
        <span className={labelCls}>{label}</span>
        {required && (
          <span className="font-mono text-caption-m text-text-meta">(필수)</span>
        )}
      </span>
      {children}
      {hint && <p className="text-caption-m text-text-meta">{hint}</p>}
    </Tag>
  )
}

/**
 * 폼 제출 버튼 — Button 컴포넌트는 링크 전용이라 submit에는 쓸 수 없다.
 * 시각은 X2 Primary 위계와 동일한 토큰(bg-button-primary + shadow-btn)만 사용한다.
 */
export function SubmitButton({ busy = false, children, ...rest }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex h-11 cursor-pointer items-center justify-center rounded-sm bg-button-primary px-24 text-body-m font-semibold text-button-primaryText shadow-btn transition duration-fast ease-out hover:bg-button-primaryHover hover:shadow-btn-hover active:bg-button-primaryPressed disabled:cursor-not-allowed disabled:opacity-50 md:h-48 md:text-body-d"
      {...rest}
    >
      {children}
    </button>
  )
}

/** readonly 항목 — 자물쇠 아이콘 + 비활성 톤. 서버도 해당 값 변경을 무시한다. */
export function LockedField({ label, value }) {
  return (
    <div className="flex min-w-0 flex-col gap-8">
      <span className="flex items-baseline gap-8">
        <span className={labelCls}>{label}</span>
        <span className="font-mono text-caption-m text-text-meta">(수정 불가)</span>
      </span>
      <div className="relative min-w-0">
        <input
          type="text"
          readOnly
          aria-label={`${label} (수정 불가 항목)`}
          value={value ?? ''}
          className={`${inputCls} cursor-not-allowed pr-48 text-text-meta focus:border-border-subtle`}
        />
        <Lock
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 text-text-meta"
        />
      </div>
    </div>
  )
}

/**
 * 로그인 게이트(41_AUTH_CONTRACT) — 비로그인 상태에서 폼 대신 노출한다.
 * 제출자 신원이 구글 계정으로 바뀌었으므로 폼에는 비밀번호 항목이 없다.
 * @param {string} title       카드 제목
 * @param {string} description 로그인이 필요한 이유 한 문단
 * @param {string} [next]      로그인 후 복귀 경로. 생략 시 현재 URL
 * @param {React.ReactNode} [children] 로그인 버튼 옆 보조 동선(막다른 화면 방지)
 */
export function LoginGate({ title, description, next, children }) {
  return (
    <GlassCard className="flex flex-col items-start gap-24 p-24 md:p-40">
      <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
        {title}
      </h2>
      <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
        {description}
      </p>
      <div className="flex flex-wrap items-center gap-16">
        <GoogleLoginButton next={next} />
        {children}
      </div>
    </GlassCard>
  )
}

/**
 * 로그인 계정 표시(41_AUTH_CONTRACT) — 제출자 신원은 구글 계정이라 읽기 전용이다.
 * 계정을 바꾸려면 로그아웃뿐이므로 로그아웃도 신원이 보이는 이 자리에 둔다.
 * @param {{email: string, name?: string}} user
 * @param {Function} onLogout
 */
export function AccountBar({ user, onLogout }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-16 rounded-md border border-border-subtle bg-bg-elev px-16 py-12">
      <div className="flex min-w-0 flex-col gap-4">
        <span className="text-caption-m text-text-meta md:text-caption-d">
          로그인 계정
        </span>
        <span className="min-w-0 text-body-m font-semibold text-text-pri md:text-body-d">
          {user.name ? `${user.name} (${user.email})` : user.email}
        </span>
      </div>
      <button
        type="button"
        onClick={onLogout}
        className="inline-flex shrink-0 cursor-pointer items-center gap-8 rounded-sm border border-border-subtle px-16 py-8 text-small-m font-semibold text-text-pri transition-colors duration-fast ease-out hover:border-border-strong md:text-small-d"
      >
        <LogOut size={16} aria-hidden="true" />
        로그아웃
      </button>
    </div>
  )
}

/**
 * 연락처 입력 — 010-XXXX-XXXX 고정(Y2-4-5).
 * onChange에는 포맷이 끝난 값만 올린다. 숫자 외 문자는 formatPhone이 제거하므로
 * 입력 자체가 반영되지 않고, 11자리를 넘겨 칠 수도 없다.
 */
export function PhoneInput({ value, onChange, ...rest }) {
  return (
    <input
      type="tel"
      required
      inputMode="numeric"
      autoComplete="tel"
      value={value}
      onChange={(event) => onChange(formatPhone(event.target.value))}
      className={inputCls}
      placeholder="010-0000-0000"
      {...rest}
    />
  )
}

/**
 * 과목 선택(Y2-4-8) — 어드민이 등록한 과목을 카드형 라디오로 고른다(네이티브 셀렉트 금지).
 * Y3의 과목 관리가 아직 비어 있으면 목록이 없으므로 자유 입력으로 폴백해 접수를 막지 않는다.
 *
 * H2-3: 1·2학기 과목을 한 번에 늘어놓지 않는다. G3 SegmentControl(mode="single")로
 * 현재 학기 하나만 알약으로 노출하고, 눌러 전환하면 그 학기 과목만 카드로 나타난다.
 * 기본값은 어드민이 지정한 현재 학기(defaultSemester). 학기가 하나뿐이면 전환기를 숨긴다.
 */
export function SubjectField({ subjects, value, onChange, defaultSemester }) {
  const semesters = [
    ...new Set(subjects.filter((s) => s.semester).map((s) => String(s.semester))),
  ].sort()
  const fallback = semesters.includes(String(defaultSemester))
    ? String(defaultSemester)
    : (semesters[0] ?? '')
  const [picked, setPicked] = useState('')
  // 과목 목록은 설정 응답을 기다렸다 도착한다. state를 effect로 맞추지 않고
  // "고른 값이 아직 유효하지 않으면 기본값" 으로 파생시켜 도착 순서에 영향받지 않게 한다.
  const semester = semesters.includes(picked) ? picked : fallback
  const hasSwitcher = semesters.length > 1
  const visible = hasSwitcher
    ? subjects.filter((s) => String(s.semester) === semester)
    : subjects

  const changeSemester = (next) => {
    setPicked(next)
    // 학기를 바꾸면 이전 학기에서 고른 과목은 목록에 없다 — 선택을 비운다
    if (value && !subjects.some((s) => s.value === value && String(s.semester) === next)) {
      onChange('')
    }
  }

  if (subjects.length === 0) {
    return (
      <Field label="과목" required hint="출품작이 제작된 수강 과목명">
        <input
          type="text"
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={inputCls}
          placeholder="과목명"
        />
      </Field>
    )
  }
  return (
    <Field as="div" label="과목" required hint="출품작이 제작된 수강 과목을 선택해 주세요">
      {hasSwitcher && (
        <div className="flex flex-wrap items-center gap-12">
          <span className="text-small-m text-text-meta md:text-small-d">학기</span>
          <SegmentControl
            mode="single"
            options={semesters.map((s) => ({ value: s, label: semesterDesc(s) }))}
            value={semester}
            onChange={changeSemester}
            aria-label="접수 대상 학기 선택"
          />
        </div>
      )}
      {visible.length === 0 ? (
        <p className="text-small-m text-text-meta md:text-small-d">
          {semesterDesc(semester)}에 등록된 과목이 없습니다
        </p>
      ) : (
        <RadioCards
          name="course"
          value={value}
          onChange={onChange}
          options={visible.map((s) => ({
            value: s.value,
            label: s.label,
            desc: hasSwitcher ? undefined : semesterDesc(s.semester),
          }))}
        />
      )}
    </Field>
  )
}

/** 팀원 목록 — {name, studentNo, major} 행 편집. 최소 1행 유지. */
export function MemberRows({ members, onChange }) {
  const setAt = (idx, key) => (event) =>
    onChange(members.map((m, i) => (i === idx ? { ...m, [key]: event.target.value } : m)))
  return (
    <ul className="flex flex-col gap-12">
      {members.map((member, idx) => (
        <li key={idx} className="flex min-w-0 flex-col gap-8 md:flex-row md:items-center">
          <input
            type="text"
            required
            aria-label={`팀원 ${idx + 1} 이름`}
            placeholder="이름"
            value={member.name}
            onChange={setAt(idx, 'name')}
            className={inputCls}
          />
          <input
            type="text"
            required
            aria-label={`팀원 ${idx + 1} 학번`}
            placeholder="학번"
            value={member.studentNo}
            onChange={setAt(idx, 'studentNo')}
            className={inputCls}
          />
          <input
            type="text"
            required
            aria-label={`팀원 ${idx + 1} 전공`}
            placeholder="전공"
            value={member.major}
            onChange={setAt(idx, 'major')}
            className={inputCls}
          />
          {members.length > 1 && (
            <button
              type="button"
              aria-label={`팀원 ${idx + 1} 제거`}
              onClick={() => onChange(members.filter((_, i) => i !== idx))}
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-border-subtle p-12 text-text-sec transition-colors duration-fast ease-out hover:border-border-strong hover:text-text-pri"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

function scheduleRows(exhibition) {
  return [
    { label: '접수 시작', value: formatKst(exhibition?.submit_open) },
    { label: '접수 마감', value: formatKst(exhibition?.submit_close) },
    { label: '수정 마감', value: formatKst(exhibition?.edit_close) },
  ].filter((row) => row.value)
}

/**
 * Y2-4-7 일정 강조 패널 — 폼·온보딩 최상단에 유리 패널로 크게 둔다.
 * 날짜는 ACCENT.proper(연보라)로 위계를 올린다. 작은 좌측 구석 표기 금지.
 */
export function ScheduleHighlight({ exhibition }) {
  const rows = scheduleRows(exhibition)
  if (!rows.length) return null
  return (
    <GlassCard as="section" className="p-24 md:p-32">
      <h2 className={`${labelCls} mb-16`}>접수 일정</h2>
      <dl className="grid gap-16 sm:grid-cols-3">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex min-w-0 flex-col gap-8">
            <dt className="text-small-m text-text-meta md:text-small-d">{label}</dt>
            <dd
              className={`min-w-0 text-h3-m font-bold leading-snug md:text-h3-d ${ACCENT.proper}`}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </GlassCard>
  )
}

/** 접수·수정 일정 표기(컴팩트) — settings/public.exhibition의 KST 일시. */
export function ScheduleList({ exhibition }) {
  const rows = scheduleRows(exhibition)
  if (!rows.length) return null
  return (
    <dl className="flex flex-col gap-8">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex flex-wrap items-baseline gap-12">
          <dt className="text-small-m font-semibold text-text-pri md:text-small-d">
            {label}
          </dt>
          <dd className="font-mono text-small-m text-text-sec md:text-small-d">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
