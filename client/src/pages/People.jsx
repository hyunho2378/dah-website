import { ExternalLink } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import SectionLabel from '../components/common/SectionLabel'
import Reveal from '../components/common/Reveal'
import GlassCard from '../components/common/GlassCard'
import ImageFrame from '../components/common/ImageFrame'
import Divider from '../components/common/Divider'
import ArrowLink from '../components/common/ArrowLink'
import InlineEditBar from '../components/content/InlineEditBar'
import { useApi } from '../hooks/useApi'
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

// M3-1: API(교수진 테이블: name_ko/title_ko/photo_url/links[])와 정적 원문(nameKr/role/link)을
// 카드가 쓰는 단일 형태로 정규화. undefined 안전 — 사진 없으면 photo_url null → 이니셜 플레이스홀더.
function normalizeProfessor(p) {
  const links = Array.isArray(p.links) ? p.links : []
  return {
    id: p.id,
    nameKr: p.name_ko ?? p.nameKr ?? '',
    nameEn: p.name_en ?? p.nameEn ?? '',
    role: p.title_ko ?? p.role ?? null,
    roleEn: p.title_en ?? p.roleEn ?? null,
    affiliation: p.affiliation ?? null,
    affiliationEn: p.affiliationEn ?? null,
    email: p.email ?? null,
    link: p.link ?? links[0]?.url ?? null,
    photo_url: p.photo_url ?? null,
    has_bg: p.has_bg ?? false,
  }
}

function ProfessorCard({ professor, lang }) {
  const { nameKr, nameEn, email, link } = professor
  // J5: EN 모드는 직함·소속 영문 필드 우선(없으면 국문 폴백)
  const role = lang === 'en' ? professor.roleEn || professor.role : professor.role
  const affiliation =
    lang === 'en' ? professor.affiliationEn || professor.affiliation : professor.affiliation
  // R3-3: EN 모드는 영문 이름을 크게 노출하고 국문 이름은 숨긴다. KR 모드는 기존 유지.
  const displayName = lang === 'en' ? nameEn || nameKr : nameKr

  return (
    <GlassCard hover className="h-full p-16 md:p-20">
      <div className="flex flex-col gap-12">
        {/* M3-1: 사진(306x427 세로)은 object-cover로 꽉 채움, 미보유 시 이니셜 플레이스홀더 */}
        <ImageFrame
          src={professor.photo_url || undefined}
          alt={nameKr}
          ratio="306/427"
          bg={professor.has_bg}
          placeholder={
            <span aria-hidden="true" className="font-mono text-h2-m text-text-meta md:text-h2-d">
              {initialsOf(nameEn, nameKr)}
            </span>
          }
        />
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-8">
            <h3 className="text-h3-m font-extrabold leading-snug text-text-pri md:text-h3-d">
              {displayName}
            </h3>
            {lang !== 'en' && nameEn && (
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

function MentorCard({ mentor, lang }) {
  const { companyUrl } = mentor
  // R3-3: EN 모드는 멘토 영문 필드(nameEn/companyEn/roleEn) 우선, 없으면 국문 폴백
  const name = lang === 'en' ? mentor.nameEn || mentor.name : mentor.name
  const company = lang === 'en' ? mentor.companyEn || mentor.company : mentor.company
  const role = lang === 'en' ? mentor.roleEn || mentor.role : mentor.role

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
  const { lang, t } = useLang()
  useTitle(t('titles.people'))
  // M3-1: 교수 사진은 어드민(API)에 저장 — API 우선, 미기동·빈 응답 시 정적 원문 폴백
  const { data } = useApi('/content/professors', { params: { pageSize: 100 } })
  const professorList = (data?.items?.length ? data.items : professors).map(normalizeProfessor)

  return (
    <>
      <PageBanner
        titleKo="교수진·멘토"
        titleEn="PEOPLE"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.people'), to: '/about' },
          { label: t('titles.people'), to: '/about/people' },
        ]}
        nebulaX="40%"
        nebulaY="70%"
      />
      {/* G6: 전역 단일 Container로 통일 — 헤더·본문 좌측선 픽셀 일치 */}
      <Container>
        <section className="py-section-m lg:py-section-d">
          <Reveal>
            <SectionLabel index="01" text="FACULTY" />
            <div className="mt-24 flex flex-wrap items-center gap-12">
              <h2 className="text-h2-m font-extrabold leading-snug text-text-pri md:text-h2-d">
                {t('sections.faculty')}
              </h2>
              <InlineEditBar type="professors" manageTo="/admin/professors" />
            </div>
          </Reveal>
          {professorList.length === 0 ? (
            <p className="py-64 font-mono text-caption-m text-text-meta md:text-caption-d">
              {t('common.empty')}
            </p>
          ) : (
            // Q5: 데스크탑 4열 — 카드·사진 축소로 섹션 높이 감소. minmax 하한 축소(약 220px)
            <div className="mt-48 grid gap-16 [grid-template-columns:repeat(auto-fill,minmax(min(220px,100%),1fr))] md:gap-24">
              {professorList.map((professor, index) => (
                <Reveal key={professor.id} delay={staggerDelay(index)}>
                  <ProfessorCard professor={professor} lang={lang} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
        <Divider />
        <section id="mentors" className="scroll-mt-header py-section-m lg:py-section-d">
          <Reveal>
            <SectionLabel index="02" text="INDUSTRY MENTORS" />
            <div className="mt-24 flex flex-wrap items-center gap-12">
              <h2 className="text-h2-m font-extrabold leading-snug text-text-pri md:text-h2-d">
                {t('sections.mentors')}
              </h2>
              <InlineEditBar type="mentors" manageTo="/admin/mentors" />
            </div>
          </Reveal>
          {mentors.length === 0 ? (
            <p className="py-64 font-mono text-caption-m text-text-meta md:text-caption-d">
              {t('common.empty')}
            </p>
          ) : (
            <div className="mt-48 grid gap-16 [grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr))] md:gap-24">
              {mentors.map((mentor, index) => (
                <Reveal key={mentor.id} delay={staggerDelay(index)}>
                  <MentorCard mentor={mentor} lang={lang} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </Container>
    </>
  )
}

export default People
