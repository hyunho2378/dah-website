import { ArrowUpRight } from 'lucide-react'
import PageHero from '../components/common/PageHero'
import SectionLabel from '../components/common/SectionLabel'
import Reveal from '../components/common/Reveal'
import Card from '../components/common/Card'
import Divider from '../components/common/Divider'
import ArrowLink from '../components/common/ArrowLink'
import { useTitle } from '../hooks/useTitle'
import { careers } from '../data/careers'
import { portfolios } from '../data/portfolios'

const EMPTY_TEXT = '등록된 항목이 없습니다'

// P9: 스태거 지연은 최대 6개까지만, 이후 0
function staggerDelay(index) {
  return index < 6 ? index * 80 : 0
}

// majors가 배열이면 조합 표기, 문자열이면 그대로
function joinMajors(majors) {
  return Array.isArray(majors) ? majors.join(' / ') : majors
}

function CareerCard({ career }) {
  const { name, majors, company, companyUrl, role } = career

  return (
    <Card>
      <div className="flex flex-col items-start gap-8">
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
          <h3 className="text-h3-m font-extrabold leading-snug text-text-pri md:text-h3-d">
            {name}
          </h3>
          {majors && (
            <span className="font-mono text-caption-m text-text-meta md:text-caption-d">
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
    </Card>
  )
}

// P4 리스트 행: [mono 학번 meta] [이름 body pri] [전공 조합 caption] … [ArrowUpRight]
function PortfolioItem({ portfolio }) {
  const { studentNo, name, majors, url } = portfolio

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-4 py-16 transition-colors duration-fast ease-out hover:bg-bg-elev md:flex-row md:items-center md:gap-24 md:py-20"
    >
      <span className="shrink-0 font-mono text-caption-m text-text-meta md:text-caption-d">
        {studentNo}
      </span>
      <span className="flex flex-1 flex-wrap items-center gap-x-12 gap-y-4">
        <span className="text-body-m text-text-pri underline-offset-4 group-hover:underline md:text-body-d">
          {name}
        </span>
        {majors && (
          <span className="font-mono text-caption-m text-text-sec md:text-caption-d">
            {joinMajors(majors)}
          </span>
        )}
        <ArrowUpRight
          size={16}
          aria-hidden="true"
          className="ml-auto shrink-0 text-text-meta transition-colors duration-fast ease-out group-hover:text-text-pri"
        />
      </span>
    </a>
  )
}

function Careers() {
  useTitle('진로')

  return (
    <>
      <PageHero
        eyebrow="CAREERS"
        titleKr="진로"
        desc="졸업생의 취업 현황과 재학생의 포트폴리오를 소개합니다."
      />
      <div className="mx-auto max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide">
        <section className="py-section-m lg:py-section-d">
          <Reveal>
            <SectionLabel index="01" text="EMPLOYMENT" />
            <h2 className="mt-24 text-h2-m font-extrabold leading-snug text-text-pri md:text-h2-d">
              취업 현황
            </h2>
          </Reveal>
          {careers.length === 0 ? (
            <p className="py-64 font-mono text-caption-m text-text-meta md:text-caption-d">
              {EMPTY_TEXT}
            </p>
          ) : (
            <div className="mt-48 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24 lg:grid-cols-3">
              {careers.map((career, index) => (
                <Reveal key={career.id} delay={staggerDelay(index)}>
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
            <h2 className="mt-24 text-h2-m font-extrabold leading-snug text-text-pri md:text-h2-d">
              재학생 포트폴리오
            </h2>
          </Reveal>
          {portfolios.length === 0 ? (
            <p className="py-64 font-mono text-caption-m text-text-meta md:text-caption-d">
              {EMPTY_TEXT}
            </p>
          ) : (
            <div className="mt-48 divide-y divide-border-subtle">
              {portfolios.map((portfolio) => (
                <PortfolioItem key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default Careers
