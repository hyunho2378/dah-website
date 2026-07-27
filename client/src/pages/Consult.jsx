// /consult — 상담 신청 (Phase 9 K1-9, 비로그인 공개)
// POST /consult {name, grade, mainMajor, doubleMajor, contact, message, agreed}. 제출 성공 시 완료 안내로 교체.
// 폼 안내 문안은 사용자 제공 원문 그대로(변경 금지). 개인정보처리방침 전문 보기만 내부 /privacy 링크.
//
// Y1-7(33_PHASE18) 재설계:
//   - 자체 max-w/px 조합을 걷어내고 공용 Container를 쓴다(우측 마진 오버플로우 원인 제거).
//   - 좌측 입력은 레이블을 축약하고 2열 그리드로 묶는다. 짧은 값(학년·연락처)은 전체폭을 쓰지 않고
//     내용 폭에 맞춘다. 문의 내용만 전체폭 textarea.
//   - 우측은 결제창식 동의 패널(sticky): 수집 안내 요약 + 동의 체크 + 제출 버튼. 동의 전 disabled.
//   - 연락처는 utils/format.formatPhone으로 010-XXXX-XXXX 고정(숫자 외 입력 자체가 반영되지 않음).

import { useState } from 'react'
import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import GlassCard from '../components/common/GlassCard'
import Checkbox from '../components/common/Checkbox'
import Link from '../components/common/LangLink'
import { api } from '../hooks/useApi'
import { useTitle } from '../hooks/useTitle'
import { formatPhone, isValidPhone } from '../utils/format'

const inputCls =
  'w-full min-w-0 rounded-md border border-border-subtle bg-bg-panel px-16 py-12 text-body-m text-text-pri placeholder:text-text-meta transition-colors duration-fast ease-out focus:border-border-purple focus:outline-none md:text-body-d'
const labelCls = 'text-small-m font-semibold text-text-pri md:text-small-d'
// X2 Primary 질감(보라 채움 + inset 하이라이트 + 퍼플 글로우)을 submit 버튼에도 동일 적용.
// 공용 Button은 링크 전용이라 form submit에는 쓸 수 없어 같은 토큰으로 구성한다.
const submitCls =
  'inline-flex h-11 w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-sm bg-button-primary px-24 text-body-m font-semibold text-button-primaryText shadow-btn transition duration-fast ease-out hover:bg-button-primaryHover hover:shadow-btn-hover active:bg-button-primaryPressed disabled:cursor-default disabled:bg-bg-panel disabled:text-text-disabled disabled:shadow-none md:h-48 md:text-body-d'

function Field({ label, required = false, className = '', children }) {
  return (
    <div className={`flex min-w-0 flex-col gap-8 ${className}`.trim()}>
      <span className="flex items-baseline gap-8">
        <span className={labelCls}>{label}</span>
        {required && <span className="font-mono text-caption-m text-text-meta">(필수)</span>}
      </span>
      {children}
    </div>
  )
}

function Consult() {
  useTitle('상담 신청')
  const [form, setForm] = useState({
    name: '',
    grade: '',
    mainMajor: '',
    doubleMajor: '',
    contact: '',
    message: '',
  })
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))
  // 숫자만 남기고 3-4-4로 하이픈을 삽입한다 — 그 외 문자는 상태에 반영되지 않는다
  const setContact = (event) =>
    setForm((prev) => ({ ...prev, contact: formatPhone(event.target.value) }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('이름을 입력해 주세요.')
      return
    }
    if (!isValidPhone(form.contact)) {
      setError('연락처를 010-0000-0000 형식으로 입력해 주세요.')
      return
    }
    if (!agreed) {
      setError('개인정보 수집·이용에 동의해 주세요.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await api.post('/consult', {
        name: form.name.trim(),
        grade: form.grade.trim() || null,
        mainMajor: form.mainMajor.trim() || null,
        doubleMajor: form.doubleMajor.trim() || null,
        contact: form.contact.trim(),
        message: form.message.trim() || null,
        agreed: true,
      })
      setDone(true)
    } catch {
      setError('신청에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageBanner
        titleKo="상담 신청"
        titleEn="CONSULTATION"
        breadcrumb={[
          { label: '홈', to: '/' },
          { label: '상담 신청', to: '/consult' },
        ]}
        nebulaX="68%"
        nebulaY="24%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        {done ? (
          <GlassCard className="flex max-w-[760px] flex-col items-start gap-24 p-24 md:p-32">
            <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
              신청 완료
            </h2>
            <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
              상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.
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
                <Field label="이름" required>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={set('name')}
                    className={`${inputCls} md:w-160`}
                    autoComplete="name"
                  />
                </Field>
                <Field label="학년">
                  <input
                    type="text"
                    value={form.grade}
                    onChange={set('grade')}
                    className={`${inputCls} md:w-128`}
                  />
                </Field>
                <Field label="주전공">
                  <input
                    type="text"
                    value={form.mainMajor}
                    onChange={set('mainMajor')}
                    className={inputCls}
                  />
                </Field>
                <Field label="복수전공">
                  <input
                    type="text"
                    value={form.doubleMajor}
                    onChange={set('doubleMajor')}
                    className={inputCls}
                  />
                </Field>
                <Field label="연락처" required>
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    value={form.contact}
                    onChange={setContact}
                    placeholder="010-0000-0000"
                    className={`${inputCls} md:w-160`}
                    autoComplete="tel"
                  />
                </Field>
              </div>

              <Field label="문의">
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
                개인정보 수집·이용 안내 (상담 신청)
              </p>
              <ul className="flex flex-col gap-8 text-small-m leading-relaxed text-text-sec md:text-small-d">
                <li>수집 항목: 이름, 학년, 주전공, 복수전공, 연락처(전화 또는 이메일), 문의 내용</li>
                <li>이용 목적: 복수전공·교육과정 상담 응대</li>
                <li>
                  보유·이용 기간: 상담 종료 후 지체 없이 파기(관계 법령에 따른 보관 의무가 있는
                  경우 제외)
                </li>
                <li>
                  동의 거부 권리: 동의를 거부할 수 있으며, 이 경우 상담 신청이 제한될 수
                  있습니다.
                </li>
              </ul>
              <Link
                to="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-caption-m text-text-meta underline underline-offset-4 transition-colors duration-fast ease-out hover:text-text-pri"
              >
                개인정보처리방침 전문 보기
              </Link>

              <div className="border-t border-border-subtle pt-16">
                <Checkbox checked={agreed} onChange={setAgreed}>
                  상담을 위한 개인정보 수집·이용에 동의합니다.
                </Checkbox>
              </div>

              {error && (
                <p role="alert" className="text-small-m text-state-error md:text-small-d">
                  {error}
                </p>
              )}

              <button type="submit" disabled={!agreed || submitting} className={submitCls}>
                {submitting ? '신청 중' : '상담 신청하기'}
              </button>
            </GlassCard>
          </form>
        )}
      </Container>
    </>
  )
}

export default Consult
