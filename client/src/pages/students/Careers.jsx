// /students/careers — 진로 (취업 현황 + 재학생 포트폴리오 통합, 10_IA_V2 0절)
// API: /content/careers, /content/portfolios — offline 시 src/data 정적 폴백.
import { ArrowUpRight } from 'lucide-react'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import SectionLabel from '../../components/common/SectionLabel'
import Reveal from '../../components/common/Reveal'
import Divider from '../../components/common/Divider'
import ArrowLink from '../../components/common/ArrowLink'
import { AddButton } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'
import { careers as staticCareers } from '../../data/careers'
import { portfolios as staticPortfolios } from '../../data/portfolios'
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

const joinMajors = (majors) =>
  Array.isArray(majors) ? majors.join(' / ') : majors

// DB careers(grad_name, company_url, position) ↔ 정적(name, companyUrl, role) 통합
const normalizeCareer = (c) => ({
  id: c.id,
  name: c.grad_name ?? c.name,
  majors: c.majors,
  company: c.company,
  companyUrl: c.company_url ?? c.companyUrl ?? null,
  role: c.position ?? c.role ?? null,
})

const normalizePortfolio = (p) => ({
  id: p.id,
  studentNo: p.student_no ?? p.studentNo,
  name: p.name,
  majors: p.majors,
  url: p.link ?? p.url ?? null,
})

// N2-3: 과한 박스(GlassCard) 제거 → 헤어라인 상단 구분 경량 셀(정보 유지)
function CareerCard({ career }) {
  const { name, majors, company, companyUrl, role } = career

  return (
    <div className="flex min-w-0 flex-col items-start gap-8 border-t border-border-subtle py-16">
      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
        <h3 className="text-h3-m font-bold leading-snug text-text-pri md:text-h3-d">
          {name}
        </h3>
        {majors && (
          <span className="font-mono text-caption-m text-text-meta">
            {joinMajors(majors)}
          </span>
        )}
      </div>
      {companyUrl ? (
        <ArrowLink href={companyUrl} external>
          {company}
        </ArrowLink>
      ) : (
        company && (
          <p className="text-body-m text-text-pri md:text-body-d">{company}</p>
        )
      )}
      {role && (
        <p className="text-small-m text-text-sec md:text-small-d">{role}</p>
      )}
    </div>
  )
}

// P4 리스트 행 — url 없으면 비링크 행(원문에 없는 링크 생성 금지)
function PortfolioItem({ portfolio }) {
  const { studentNo, name, majors, url } = portfolio

  const body = (
    <>
      <span className="shrink-0 font-mono text-caption-m text-text-meta">
        {studentNo}
      </span>
      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-12 gap-y-4">
        <span
          className={`text-body-m text-text-pri underline-offset-4 md:text-body-d ${
            url ? 'group-hover:underline' : ''
          }`}
        >
          {name}
        </span>
        {majors && (
          <span className="font-mono text-caption-m text-text-sec">
            {joinMajors(majors)}
          </span>
        )}
        {url && (
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="ml-auto shrink-0 text-text-meta transition-colors duration-fast ease-out group-hover:text-text-pri"
          />
        )}
      </span>
    </>
  )

  const className =
    'flex min-w-0 flex-col gap-4 py-16 transition-colors duration-fast ease-out md:flex-row md:items-center md:gap-24 md:py-20'

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group ${className} hover:bg-bg-elev`}
      >
        {body}
      </a>
    )
  }
  return <div className={className}>{body}</div>
}

function Careers() {
  const { t } = useLang()
  useTitle(t('titles.careers'))
  // G1.3: 페이지네이션 UI 없는 목록은 전량 요청(서버 기본 12건 상한 회피 — 취업 26건 등)
  const careersRes = useApi('/content/careers', { params: { pageSize: 100 } })
  const portfoliosRes = useApi('/content/portfolios', { params: { pageSize: 100 } })

  const careerFallback = careersRes.offline || (careersRes.error && !careersRes.data)
  const careerItems = (
    careerFallback ? staticCareers : careersRes.data?.items ?? []
  ).map(normalizeCareer)

  const pfFallback =
    portfoliosRes.offline || (portfoliosRes.error && !portfoliosRes.data)
  const portfolioItems = (
    pfFallback ? staticPortfolios : portfoliosRes.data?.items ?? []
  ).map(normalizePortfolio)

  return (
    <>
      <PageBanner
        titleKo="취업 현황"
        titleEn="CAREERS"
        breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.activities') }, { label: t('titles.careers'), to: '/students/careers' }]}
        nebulaX="36%"
        nebulaY="20%"
      />
      <Container>
        <section className="py-section-m lg:py-section-d">
          <Reveal>
            <SectionLabel index="01" text="EMPLOYMENT" />
            <div className="mt-24 flex flex-wrap items-center justify-between gap-16">
              <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
                {t('sections.employment')}
              </h2>
              <AddButton type="careers" to="/admin/careers" />
            </div>
          </Reveal>
          {careerItems.length === 0 ? (
            <p className="py-64 font-mono text-caption-m text-text-meta">
              {careersRes.loading ? t('common.loading') : t('common.empty')}
            </p>
          ) : (
            <div className="mt-48 grid gap-16 [grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr))] md:gap-24">
              {/* K2-14: 카드 그리드 유동화 — 300px = 기존 lg 3열 카드폭 근사 하한 */}
              {careerItems.map((career, index) => (
                <Reveal key={career.id} delay={staggerDelay(index)} className="min-w-0">
                  <CareerCard career={career} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
        <Divider />
        <section className="py-section-m lg:py-section-d">
          <Reveal>
            <SectionLabel index="02" text="PORTFOLIO" />
            <div className="mt-24 flex flex-wrap items-center justify-between gap-16">
              <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
                {t('sections.portfolio')}
              </h2>
              <AddButton type="portfolios" to="/admin/careers" />
            </div>
          </Reveal>
          {portfolioItems.length === 0 ? (
            <p className="py-64 font-mono text-caption-m text-text-meta">
              {portfoliosRes.loading ? t('common.loading') : t('common.empty')}
            </p>
          ) : (
            <div className="mt-48 divide-y divide-border-subtle">
              {portfolioItems.map((portfolio) => (
                <PortfolioItem key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </>
  )
}

export default Careers
