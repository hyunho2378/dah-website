import { ExternalLink } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import SectionLabel from '../components/common/SectionLabel'
import Reveal from '../components/common/Reveal'
import GlassCard from '../components/common/GlassCard'
import Divider from '../components/common/Divider'
import ArrowLink from '../components/common/ArrowLink'
import { EditPencil, AddButton } from '../components/content/EditControls'
import { useTitle } from '../hooks/useTitle'
import { useLang } from '../i18n/LangContext'
import { professors } from '../data/professors'
import { mentors } from '../data/mentors'

// People v2 스킨 (10_IA_V2 2절 /about/people) — 내용 유지 + PageBanner·글래스 카드화.
// 교수진·멘토단 편집(admin+, 13_CMS_SPEC 1절): 섹션 헤더에 연필·추가 버튼(비로그인 미렌더)

// P9: 스태거 지연은 최대 6개까지만, 이후 0
function staggerDelay(index) {
  return index < 6 ? index * 80 : 0
}

// P8: 인물 사진 미보유 → 이니셜 플레이스홀더 (얼굴 아이콘 금지)
function initialsOf(nameEn, nameKr) {
  if (nameEn) {
    return nameEn
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
  }
  return nameKr ? nameKr[0] : ''
}

function ProfessorCard({ professor }) {
  const { nameKr, nameEn, role, affiliation, email, link } = professor

  return (
    <GlassCard hover className="h-full p-24 md:p-32">
      <div className="flex flex-col gap-16">
        <div
          className="flex aspect-square items-center justify-center rounded-md bg-bg-panel"
          aria-hidden="true"
        >
          <span className="font-mono text-h2-m text-text-meta md:text-h2-d">
            {initialsOf(nameEn, nameKr)}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-8">
            <h3 className="text-h3-m font-extrabold leading-snug text-text-pri md:text-h3-d">
              {nameKr}
            </h3>
            {nameEn && (
              <span className="font-mono text-caption-m text-text-meta md:text-caption-d">
                {nameEn}
              </span>
            )}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${nameKr} 외부 페이지`}
                className="text-text-sec transition-colors duration-fast ease-out hover:text-text-pri"
              >
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            )}
          </div>
          {role && (
            <p className="text-small-m text-text-sec md:text-small-d">{role}</p>
          )}
          {affiliation && (
            <p className="text-small-m text-text-meta md:text-small-d">
              {affiliation}
            </p>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="mt-4 self-start font-mono text-small-m text-text-sec transition-colors duration-fast ease-out hover:text-text-pri md:text-small-d"
            >
              {email}
            </a>
          )}
        </div>
      </div>
    </GlassCard>
  )
}

function MentorCard({ mentor }) {
  const { name, company, role, companyUrl } = mentor

  return (
    <GlassCard hover className="h-full p-24 md:p-32">
      <div className="flex flex-col items-start gap-8">
        <h3 className="text-h3-m font-extrabold leading-snug text-text-pri md:text-h3-d">
          {name}
        </h3>
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
    </GlassCard>
  )
}

function People() {
  const { t } = useLang()
  useTitle(t('titles.people'))

  return (
    <>
      <PageBanner
        titleKo="교수진·멘토단"
        titleEn="PEOPLE"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.about'), to: '/about' },
          { label: t('titles.people'), to: '/about/people' },
        ]}
        nebulaX="40%"
        nebulaY="70%"
      />
      <div className="mx-auto max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide">
        <section className="py-section-m lg:py-section-d">
          <Reveal>
            <SectionLabel index="01" text="FACULTY" />
            <div className="mt-24 flex flex-wrap items-center gap-12">
              <h2 className="text-h2-m font-extrabold leading-snug text-text-pri md:text-h2-d">
                {t('sections.faculty')}
              </h2>
              <EditPencil type="professors" to="/admin/professors" />
              <AddButton type="professors" to="/admin/professors" />
            </div>
          </Reveal>
          {professors.length === 0 ? (
            <p className="py-64 font-mono text-caption-m text-text-meta md:text-caption-d">
              {t('common.empty')}
            </p>
          ) : (
            <div className="mt-48 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24 lg:grid-cols-3">
              {professors.map((professor, index) => (
                <Reveal key={professor.id} delay={staggerDelay(index)}>
                  <ProfessorCard professor={professor} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
        <Divider />
        <section className="py-section-m lg:py-section-d">
          <Reveal>
            <SectionLabel index="02" text="INDUSTRY MENTORS" />
            <div className="mt-24 flex flex-wrap items-center gap-12">
              <h2 className="text-h2-m font-extrabold leading-snug text-text-pri md:text-h2-d">
                {t('sections.mentors')}
              </h2>
              <EditPencil type="mentors" to="/admin/mentors" />
              <AddButton type="mentors" to="/admin/mentors" />
            </div>
          </Reveal>
          {mentors.length === 0 ? (
            <p className="py-64 font-mono text-caption-m text-text-meta md:text-caption-d">
              {t('common.empty')}
            </p>
          ) : (
            <div className="mt-48 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24 lg:grid-cols-3">
              {mentors.map((mentor, index) => (
                <Reveal key={mentor.id} delay={staggerDelay(index)}>
                  <MentorCard mentor={mentor} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default People
