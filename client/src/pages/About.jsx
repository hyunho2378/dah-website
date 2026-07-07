import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import SectionLabel from '../components/common/SectionLabel'
import Reveal from '../components/common/Reveal'
import { useTitle } from '../hooks/useTitle'
import { useLang, KoreanOnlyBadge } from '../i18n/LangContext'
import { history } from '../data/history'
import { motion } from '../styles/tokens'

// About (10_IA_V2 /about) — 개요 + 미션·비전 + 연혁 타임라인
// G12: 단조로운 텍스트 나열 → 리드 문단(크게, 행간 1.8, 최대 폭 720) + 소섹션 위계로 재배치.
//      새 콘텐츠 창작 없음 — 기존 원문 텍스트 재배치만.
// G16: 고정 페이지 영문 원고 — 국문 원문의 정보를 늘리거나 줄이지 않은 대역.
// KR 원문은 source_content.md 이관본 그대로(교정 제외 대상).
const COPY = {
  ko: {
    what: '한림대학교 디지털인문예술전공은 AI와 디지털 트랜스포메이션과 같이 글로벌 혁신을 주도하는 디지털·정보통신기술, 인간을 위한 가치를 구현하는 디자인, 그리고 사람과 사회를 이해하는 인문사회학적 소양이 융합하여 미래의 주역이 될 인재를 양성하는 새로운 융합 프로그램입니다.',
    whyStatement: '앞으로는 한 전문 영역의 경계를 넘어 다방면의 지식을 통섭할 수 있어야 합니다.',
    whyLead: '디지털인문예술에서는 개개인의 삶의 질을 높이고 사회의 발전을 이끌고자 인문사회학적 지성에 기술과 디자인을 융합하여 혁신을 창안하는 역량을 키우고자 합니다.',
    missionKr: '인간에 대한 깊은 이해와 창의적인 디지털 역량을 결합하여, 세상에 없던 새로운 가치를 창조한다.',
    vision: [
      {
        title: '미래를 디자인하는 창의적 리더 양성',
        desc: '인문학적 통찰력과 예술적 상상력을 바탕으로 디지털 시대의 새로운 미래를 이끌어갈 인재를 키웁니다.',
      },
      {
        title: '가치 기반의 융합 지식 창출',
        desc: '기술과 인문학, 예술이 만나는 접점에서 사회적 가치를 창출하는 혁신적인 지식과 프로젝트를 만들어갑니다.',
      },
      {
        title: '지속가능한 디지털 생태계 구축',
        desc: '사람과 기술이 조화롭게 공존하는 지속가능한 디지털 환경을 조성하고, 모두에게 이로운 기술의 확산을 주도합니다.',
      },
    ],
  },
  en: {
    what: 'Digital Arts and Humanities at Hallym University is a new convergence program that unites digital and information technologies driving global innovation, such as AI and digital transformation, with design that realizes human-centered value and humanistic insight into people and society, educating students who will lead the future.',
    whyStatement: 'The coming era demands the ability to reach beyond a single specialty and integrate knowledge across disciplines.',
    whyLead: 'Digital Arts and Humanities builds the capacity to create innovation by fusing technology and design with humanistic intelligence, raising the quality of individual life and advancing society.',
    missionKr: 'We combine a deep understanding of people with creative digital capability to create value the world has not seen.',
    vision: [
      {
        title: 'Educating creative leaders who design the future',
        desc: 'We educate students who will lead the new future of the digital era, grounded in humanistic insight and artistic imagination.',
      },
      {
        title: 'Creating value-driven convergent knowledge',
        desc: 'We build innovative knowledge and projects that create social value where technology, the humanities, and the arts meet.',
      },
      {
        title: 'Building a sustainable digital ecosystem',
        desc: 'We foster a sustainable digital environment where people and technology coexist in harmony, and lead the spread of technology that benefits everyone.',
      },
    ],
  },
}

const MISSION_EN = 'We combine human insight and digital creativity to build a better future.'

// About 전용 조각 — 연혁 타임라인 (수직: 좌측 헤어라인 세로선 + 좌 mono 날짜 + 우 내용)
function HistoryTimeline({ items }) {
  if (items.length === 0) return null
  return (
    <ol className="border-l border-border-subtle">
      {items.map((item) => (
        <li
          key={`${item.date}-${item.text}`}
          className="pb-40 pl-24 last:pb-0 md:flex md:items-baseline md:gap-40 md:pl-40"
        >
          <time className="font-mono text-small-m text-text-meta md:w-160 md:shrink-0 md:text-small-d">
            {item.date}
          </time>
          <p className="mt-4 text-body-m text-text-pri md:mt-0 md:text-body-d">
            {item.text}
          </p>
        </li>
      ))}
    </ol>
  )
}

function About() {
  const { lang, t } = useLang()
  useTitle(t('titles.about'))
  const copy = COPY[lang] ?? COPY.ko

  return (
    <>
      <PageBanner
        titleKo="About"
        titleEn="ABOUT"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.about'), to: '/about' },
        ]}
        nebulaX="20%"
        nebulaY="30%"
      />

      <div className="pb-section-m md:pb-section-d">
        {/* 01 개요 — G12: 리드 문단(크게, 행간 1.8, max-w 720) → 소섹션(WHY) 위계 */}
        <Container as="section" className="pt-section-m md:pt-section-d">
          <Reveal>
            <SectionLabel index="01" text="OVERVIEW" />
            <p className="mt-32 max-w-[720px] text-h3-m font-medium leading-[1.8] text-text-pri md:mt-40 md:text-h3-d">
              {copy.what}
            </p>
          </Reveal>
          <Reveal className="mt-64 border-t border-border-subtle pt-48 md:mt-96 md:pt-64">
            <h2 className="max-w-[720px] text-h2-m font-bold leading-snug tracking-display text-text-pri md:text-h2-d">
              {copy.whyStatement}
            </h2>
            <p className="mt-24 max-w-[720px] text-body-l-m leading-[1.8] text-text-sec md:mt-32 md:text-body-l-d">
              {copy.whyLead}
            </p>
          </Reveal>
        </Container>

        {/* 02 미션·비전 */}
        <Container as="section" className="pt-section-m md:pt-section-d">
          <Reveal>
            <SectionLabel index="02" text="MISSION & VISION" />
            <div className="mt-32 md:mt-40">
              <p className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
                Mission
              </p>
              <h2 className="mt-16 max-w-4xl text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:text-h2-d">
                {MISSION_EN}
              </h2>
              <p className="mt-24 max-w-[720px] text-body-l-m leading-[1.8] text-text-sec md:text-body-l-d">
                {copy.missionKr}
              </p>
            </div>
          </Reveal>

          <div className="mt-64 md:mt-96">
            <p className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
              Vision
            </p>
            <div className="mt-24 grid gap-32 md:grid-cols-3">
              {copy.vision.map((item, i) => (
                <Reveal key={item.title} delay={i < 6 ? i * motion.stagger : 0}>
                  <div className="border-t border-border-subtle pt-24">
                    <h3 className="text-h3-m font-bold leading-snug text-text-pri md:text-h3-d">
                      {item.title}
                    </h3>
                    <p className="mt-12 text-body-m leading-relaxed text-text-sec md:text-body-d">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>

        {/* 03 연혁 타임라인 — 항목은 국문 원문(EN 페이지는 Korean only 뱃지 병기) */}
        {history.length > 0 && (
          <Container as="section" className="pt-section-m md:pt-section-d">
            <Reveal>
              <div className="flex flex-wrap items-center gap-12">
                <SectionLabel index="03" text="HISTORY" />
                <KoreanOnlyBadge />
              </div>
              <h2 className="mt-24 text-h1-m font-extrabold leading-tight tracking-display text-text-pri md:mt-32 md:text-h1-d">
                {t('sections.history')}
              </h2>
            </Reveal>
            <div className="mt-48 md:mt-64">
              <HistoryTimeline items={history} />
            </div>
          </Container>
        )}
      </div>
    </>
  )
}

export default About
