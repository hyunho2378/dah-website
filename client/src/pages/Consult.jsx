// /consult — 상담 신청 (Phase 9 K1-9, 비로그인 공개)
// POST /consult {name, grade, mainMajor, doubleMajor, contact, message, agreed}. 제출 성공 시 완료 안내로 교체.
// 폼 문안은 사용자 제공 원문 그대로(변경 금지). 개인정보처리방침 전문 보기만 내부 /privacy 링크.
// 라우트 등록(App.jsx)은 통합자 소관 — 이 파일은 페이지만 제공한다.

import { useState } from 'react'
import PageBanner from '../components/layout/PageBanner'
import GlassCard from '../components/common/GlassCard'
import Link from '../components/common/LangLink'
import { api } from '../hooks/useApi'
import { useTitle } from '../hooks/useTitle'

const inputCls =
  'w-full min-w-0 rounded-md border border-border-subtle bg-bg-panel px-16 py-12 text-body-m text-text-pri placeholder:text-text-meta transition-colors duration-fast ease-out focus:border-border-strong focus:outline-none md:text-body-d'
const labelCls = 'text-small-m font-semibold text-text-pri md:text-small-d'
const submitCls =
  'inline-flex h-11 cursor-pointer items-center justify-center gap-8 whitespace-nowrap rounded-sm bg-bg-invert px-24 text-body-m font-semibold text-text-invert transition duration-fast ease-out hover:opacity-90 disabled:cursor-default disabled:opacity-40 md:h-48 md:text-body-d'

function Field({ label, required = false, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-8">
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.contact.trim()) {
      setError('이름과 연락처를 입력해 주세요.')
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
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        {done ? (
          <GlassCard className="flex flex-col items-start gap-24 p-24 md:p-32">
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
            className="mx-auto flex min-w-0 max-w-container flex-col gap-32"
          >
            <Field label="이름" required>
              <input
                type="text"
                required
                value={form.name}
                onChange={set('name')}
                className={inputCls}
                autoComplete="name"
              />
            </Field>
            <Field label="학년">
              <input
                type="text"
                value={form.grade}
                onChange={set('grade')}
                className={inputCls}
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
            <Field label="연락처 (전화 또는 이메일)" required>
              <input
                type="text"
                required
                value={form.contact}
                onChange={set('contact')}
                className={inputCls}
              />
            </Field>
            <Field label="문의 내용">
              <textarea
                rows={6}
                value={form.message}
                onChange={set('message')}
                className={`${inputCls} resize-y`}
              />
            </Field>

            <div className="flex flex-col gap-16 rounded-md border border-border-subtle bg-bg-panel p-16 md:p-24">
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
                className="font-mono text-caption-m text-text-meta underline underline-offset-4 transition-colors duration-fast ease-out hover:text-text-pri"
              >
                개인정보처리방침 전문 보기
              </Link>
            </div>

            <label className="flex cursor-pointer items-start gap-12">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-4 h-16 w-16 shrink-0 cursor-pointer accent-bg-invert"
              />
              <span className="text-body-m text-text-pri md:text-body-d">
                상담을 위한 개인정보 수집·이용에 동의합니다.
              </span>
            </label>

            {error && <p className="text-small-m text-state-error md:text-small-d">{error}</p>}

            <div>
              <button type="submit" disabled={submitting} className={submitCls}>
                {submitting ? '신청 중' : '상담 신청하기'}
              </button>
            </div>
          </form>
        )}
      </section>
    </>
  )
}

export default Consult
