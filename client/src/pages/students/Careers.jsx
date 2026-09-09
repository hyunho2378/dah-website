// /students/careers — 취업 현황
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import SectionLabel from '../../components/common/SectionLabel'
import Reveal from '../../components/common/Reveal'
import ArrowLink from '../../components/common/ArrowLink'
import InlineEditBar from '../../components/content/InlineEditBar'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'
import { careers as staticCareers } from '../../data/careers'
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

const joinMajors = (majors) =>
  Array.isArray(majors) ? majors.join(' / ') : majors

// R2(27_I18N): DB careers는 id가 정적 시드(career-01..)와 일치 → EN 모드는 정적 EN 필드(nameEn 등)를
// id로 매칭해 렌더(취업은 수동 영문 정책상 별도 en 컬럼 없이 시드 확정 영문 사용). 미매칭 항목은 국문 폴백.
const careerEnById = Object.fromEntries(staticCareers.map((c) => [c.id, c]))

// DB careers(grad_name, company_url, position) ↔ 정적(name, companyUrl, role) 통합
const normalizeCareer = (c, isEn) => {
  const en = isEn ? careerEnById[c.id] : null
  return {
    id: c.id,
    name: en?.nameEn ?? c.grad_name ?? c.name,
    majors: en?.majorsEn ?? c.majors,
    company: en?.companyEn ?? c.company,
    companyUrl: c.company_url ?? c.companyUrl ?? null,
    role: en?.roleEn ?? c.position ?? c.role ?? null,
  }
}

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

function Careers() {
  const { lang, t } = useLang()
  useTitle(t('titles.careers'))
  const isEn = lang === 'en'
  // G1.3: 페이지네이션 UI 없는 목록은 전량 요청(서버 기본 12건 상한 회피 — 취업 26건 등)
  const careersRes = useApi('/content/careers', { params: { pageSize: 100 } })

  const careerFallback = careersRes.offline || (careersRes.error && !careersRes.data)
  const careerItems = (
    careerFallback ? staticCareers : careersRes.data?.items ?? []
  ).map((c) => normalizeCareer(c, isEn))

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
              <InlineEditBar type="careers" addTo="/admin/careers" manageTo="/admin/careers" />
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
      </Container>
    </>
  )
}

export default Careers
