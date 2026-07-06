// CareersAdmin.jsx — 진로 관리: 취업 현황(admin+) + 포트폴리오(manager+) 2탭 (13_CMS_SPEC 1절)
// 두 테이블 모두 진로 그리드 템플릿 — EntityCrud 재사용.

import { useState } from 'react'
import EntityCrud from '../../components/admin/EntityCrud'
import { useTitle } from '../../hooks/useTitle'

const CAREER_FIELDS = [
  { key: 'grad_name', label: '이름' },
  { key: 'majors', label: '전공 조합', placeholder: '예: 철학 / 디지털인문예술' },
  { key: 'company', label: '회사·기관' },
  { key: 'company_url', label: '회사 URL', kind: 'url' },
  { key: 'position', label: '직무·설명' },
  { key: 'year', label: '연도', kind: 'number' },
  { key: 'sort', label: '정렬 순서', kind: 'number' },
]

const PORTFOLIO_FIELDS = [
  { key: 'name', label: '이름' },
  { key: 'student_no', label: '학번' },
  { key: 'majors', label: '전공 조합' },
  { key: 'link', label: '포트폴리오 링크', kind: 'url' },
  { key: 'sort', label: '정렬 순서', kind: 'number' },
]

const TABS = [
  { key: 'careers', label: '취업 현황' },
  { key: 'portfolios', label: '포트폴리오' },
]

function CareersAdmin() {
  useTitle('진로 관리')
  const [tab, setTab] = useState('careers')

  return (
    <div className="flex flex-col gap-24">
      <div role="tablist" aria-label="진로 콘텐츠" className="flex items-center gap-8">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex cursor-pointer items-center rounded-full border px-16 py-8 text-body-m transition duration-fast ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus ${
              tab === t.key
                ? 'border-glass-line bg-glass-strong text-text-pri'
                : 'border-border-subtle text-text-sec hover:text-text-pri'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'careers' ? (
        <EntityCrud
          key="careers"
          type="careers"
          title="취업 현황"
          fields={CAREER_FIELDS}
          toPayload={(form) => ({
            ...form,
            year: form.year === '' ? null : Number(form.year),
            sort: form.sort === '' ? 0 : Number(form.sort),
          })}
          display={(item) => ({
            title: item.grad_name,
            meta: [item.company, item.position].filter(Boolean).join(' · '),
          })}
        />
      ) : (
        <EntityCrud
          key="portfolios"
          type="portfolios"
          title="포트폴리오"
          fields={PORTFOLIO_FIELDS}
          toPayload={(form) => ({
            ...form,
            sort: form.sort === '' ? 0 : Number(form.sort),
          })}
          display={(item) => ({
            title: item.name,
            meta: [item.student_no, item.majors].filter(Boolean).join(' · '),
          })}
        />
      )}
    </div>
  )
}

export default CareersAdmin
