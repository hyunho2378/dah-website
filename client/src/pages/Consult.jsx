// /consult — 상담 신청 (Phase 9 K1-9, 비로그인 공개)
// POST /consult {name, grade, mainMajor, doubleMajor, email, contact, message, agreed}. 제출 성공 시 완료 안내로 교체.
// 폼 안내 문안은 사용자 제공 원문 그대로(변경 금지). 개인정보처리방침 전문 보기만 내부 /privacy 링크.
//
// Y1-7(33_PHASE18) 재설계:
//   - 자체 max-w/px 조합을 걷어내고 공용 Container를 쓴다(우측 마진 오버플로우 원인 제거).
//   - 좌측 입력은 레이블을 축약하고 2열 그리드로 묶는다. 짧은 값(학년·연락처)은 전체폭을 쓰지 않고
//     내용 폭에 맞춘다. 문의 내용만 전체폭 textarea.
//   - 우측은 결제창식 동의 패널(sticky): 수집 안내 요약 + 동의 체크 + 제출 버튼. 동의 전 disabled.
//   - 연락처는 utils/format.formatPhone으로 010-XXXX-XXXX 고정(숫자 외 입력 자체가 반영되지 않음).
//
// H2-5(37_SHEET_ROADMAP):
//   - 이메일 단독 필수 필드 추가(@ 형식 검증). 수집 항목 안내에도 반영.
//   - 해외 지원자 대응으로 페이지 전체를 국·영문 지원한다. 문구는 i18n(ko/en).consult에서 읽는다.
//     통합(STEP 3)에서 /consult를 PUBLIC_ROUTES로 옮겨 /en/consult 미러를 만들고 localizeTo
//     제외 목록에서도 뺐다. 언어 전환은 다른 공개 페이지와 동일하게 헤더 토글이 담당한다.

import { useState } from 'react'
import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import GlassCard from '../components/common/GlassCard'
import Checkbox from '../components/common/Checkbox'
import Link from '../components/common/LangLink'
import { api } from '../hooks/useApi'
import { useTitle } from '../hooks/useTitle'
import { useLang } from '../i18n/LangContext'
import { ko } from '../i18n/ko'
import { en } from '../i18n/en'
import { formatPhone, isValidEmail, isValidPhone } from '../utils/format'

const inputCls =
  'w-full min-w-0 rounded-md border border-border-subtle bg-bg-panel px-16 py-12 text-body-m text-text-pri placeholder:text-text-meta transition-colors duration-fast ease-out focus:border-border-purple focus:outline-none md:text-body-d'
const labelCls = 'text-small-m font-semibold text-text-pri md:text-small-d'
// X2 Primary 질감(보라 채움 + inset 하이라이트 + 퍼플 글로우)을 submit 버튼에도 동일 적용.
// 공용 Button은 링크 전용이라 form submit에는 쓸 수 없어 같은 토큰으로 구성한다.
const submitCls =
  'inline-flex h-11 w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-sm bg-button-primary px-24 text-body-m font-semibold text-button-primaryText shadow-btn transition duration-fast ease-out hover:bg-button-primaryHover hover:shadow-btn-hover active:bg-button-primaryPressed disabled:cursor-default disabled:bg-bg-panel disabled:text-text-disabled disabled:shadow-none md:h-48 md:text-body-d'

function Field({ label, required = false, requiredLabel, className = '', children }) {
  return (
    <div className={`flex min-w-0 flex-col gap-8 ${className}`.trim()}>
      <span className="flex items-baseline gap-8">
        <span className={labelCls}>{label}</span>
        {required && (
          <span className="font-mono text-caption-m text-text-meta">{requiredLabel}</span>
        )}
      </span>
      {children}
    </div>
  )
}

function Consult() {
  // 통합(STEP 3): /en/consult 미러 라우트가 생겨 헤더 언어 토글이 이 페이지에서도 동작한다.
  // 페이지 내 별도 토글은 헤더와 중복이라 제거하고, 라우트 언어를 단일 진실로 쓴다.
  const { lang } = useLang()
  const c = lang === 'en' ? en.consult : ko.consult
  useTitle(c.title)

  const [form, setForm] = useState({
    name: '',
    grade: '',
    mainMajor: '',
    doubleMajor: '',
    email: '',
    contact: '',
    message: '',
  })
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  // 에러는 문구가 아니라 사전 키로 들고 있는다 — 언어를 바꿔도 표시 문구가 따라 바뀐다
  const [errorKey, setErrorKey] = useState(null)

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))
  // 숫자만 남기고 3-4-4로 하이픈을 삽입한다 — 그 외 문자는 상태에 반영되지 않는다
  const setContact = (event) =>
    setForm((prev) => ({ ...prev, contact: formatPhone(event.target.value) }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setErrorKey('errorName')
      return
    }
    if (!isValidEmail(form.email)) {
      setErrorKey('errorEmail')
      return
    }
    if (!isValidPhone(form.contact)) {
      setErrorKey('errorContact')
      return
    }
    if (!agreed) {
      setErrorKey('errorAgree')
      return
    }
    setSubmitting(true)
    setErrorKey(null)
    try {
      await api.post('/consult', {
        name: form.name.trim(),
        grade: form.grade.trim() || null,
        mainMajor: form.mainMajor.trim() || null,
        doubleMajor: form.doubleMajor.trim() || null,
        email: form.email.trim(),
        contact: form.contact.trim(),
        message: form.message.trim() || null,
        agreed: true,
      })
      setDone(true)
    } catch {
      setErrorKey('errorSubmit')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageBanner
        titleKo={c.title}
        titleEn="CONSULTATION"
        breadcrumb={[
          { label: c.breadcrumbHome, to: '/' },
          { label: c.title, to: '/consult' },
        ]}
        nebulaX="68%"
        nebulaY="24%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        {done ? (
          <GlassCard className="flex max-w-[760px] flex-col items-start gap-24 p-24 md:p-32">
            <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
              {c.doneTitle}
            </h2>
            <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
              {c.doneBody}
            </p>
          </GlassCard>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid min-w-0 gap-40 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-48"
          >
            {/* 좌: 입력 — 짧은 값은 2열로 묶고, 문의 내용만 전체폭 */}
            <div className="flex min-w-0 flex-col gap-24">
              <div className="grid min-w-0 gap-24 md:grid-cols-2">
                <Field label={c.name} required requiredLabel={c.required}>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={set('name')}
                    className={`${inputCls} md:w-160`}
                    autoComplete="name"
                  />
                </Field>
                <Field label={c.grade}>
                  <input
                    type="text"
                    value={form.grade}
                    onChange={set('grade')}
                    className={`${inputCls} md:w-128`}
                  />
                </Field>
                <Field label={c.mainMajor}>
                  <input
                    type="text"
                    value={form.mainMajor}
                    onChange={set('mainMajor')}
                    className={inputCls}
                  />
                </Field>
                <Field label={c.doubleMajor}>
                  <input
                    type="text"
                    value={form.doubleMajor}
                    onChange={set('doubleMajor')}
                    className={inputCls}
                  />
                </Field>
                {/* H2-5: 이메일 필수 — 회신 경로 확보 */}
                <Field label={c.email} required requiredLabel={c.required}>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={set('email')}
                    placeholder={c.emailPlaceholder}
                    className={inputCls}
                    autoComplete="email"
                  />
                </Field>
                <Field label={c.contact} required requiredLabel={c.required}>
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    value={form.contact}
                    onChange={setContact}
                    placeholder={c.contactPlaceholder}
                    className={`${inputCls} md:w-160`}
                    autoComplete="tel"
                  />
                </Field>
              </div>

              <Field label={c.message}>
                <textarea
                  rows={8}
                  value={form.message}
                  onChange={set('message')}
                  className={`${inputCls} resize-y`}
                />
              </Field>
            </div>

            {/* 우: 결제창식 동의 패널 — 수집 안내 요약 → 동의 → 제출. 동의 전에는 제출 불가 */}
            <GlassCard as="aside" className="flex flex-col gap-16 p-24 lg:sticky lg:top-header">
              <p className="text-small-m font-semibold text-text-pri md:text-small-d">
                {c.privacyTitle}
              </p>
              <ul className="flex flex-col gap-8 text-small-m leading-relaxed text-text-sec md:text-small-d">
                <li>{c.privacyItems}</li>
                <li>{c.privacyPurpose}</li>
                <li>{c.privacyRetention}</li>
                <li>{c.privacyRefusal}</li>
              </ul>
              <Link
                to="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-caption-m text-text-meta underline underline-offset-4 transition-colors duration-fast ease-out hover:text-text-pri"
              >
                {c.privacyLink}
              </Link>

              <div className="border-t border-border-subtle pt-16">
                <Checkbox checked={agreed} onChange={setAgreed}>
                  {c.agree}
                </Checkbox>
              </div>

              {errorKey && (
                <p role="alert" className="text-small-m text-state-error md:text-small-d">
                  {c[errorKey]}
                </p>
              )}

              <button type="submit" disabled={!agreed || submitting} className={submitCls}>
                {submitting ? c.submitting : c.submit}
              </button>
            </GlassCard>
          </form>
        )}
      </Container>
    </>
  )
}

export default Consult
