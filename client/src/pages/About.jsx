import PageHero from '../components/common/PageHero'
import SectionLabel from '../components/common/SectionLabel'
import Reveal from '../components/common/Reveal'
import { useTitle } from '../hooks/useTitle'
import { history } from '../data/history'
import { motion } from '../styles/tokens'

// source_content.md 원문 이관 — What is DAH / Why DAH / Mission·Vision
// 원문에 없는 문장 창작 금지. 원문 갱신 시 이 상수만 수정한다.
const WHAT_IS_DAH =
  '한림대학교 디지털인문예술전공은 AI와 디지털 트랜스포메이션과 같이 글로벌 혁신을 주도하는 디지털·정보통신기술, 인간을 위한 가치를 구현하는 디자인, 그리고 사람과 사회를 이해하는 인문사회학적 소양이 융합하여 미래의 주역이 될 인재를 양성하는 새로운 융합 프로그램입니다.'

const WHY_DAH = {
  statement:
    '앞으로는 한 전문 영역의 경계를 넘어 다방면의 지식을 통섭할 수 있어야 합니다.',
  lead: '디지털인문예술에서는 개개인의 삶의 질을 높이고 사회의 발전을 이끌고자 인문사회학적 지성에 기술과 디자인을 융합하여 혁신을 창안하는 역량을 키우고자 합니다.',
}

const MISSION = {
  en: 'We combine human insight and digital creativity to build a better future.',
  kr: '인간에 대한 깊은 이해와 창의적인 디지털 역량을 결합하여, 세상에 없던 새로운 가치를 창조한다.',
}

const VISION = [
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
]

const CONTAINER =
  'mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide'

// About 전용 조각 — 연혁 타임라인 (COMPONENTS.md 4절)
// 수직 타임라인: 좌측 헤어라인 세로선 + 좌 mono 날짜 + 우 내용
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
  useTitle('전공 소개')

  return (
    <>
      <PageHero eyebrow="ABOUT" titleKr="전공 소개" />

      <div className="pb-section-m md:pb-section-d">
        {/* 01 What is DAH — P1 3단 위계: mono eyebrow → 대형 선언 헤드라인 */}
        <section className={`${CONTAINER} pt-section-m md:pt-section-d`}>
          <Reveal>
            <SectionLabel index="01" text="WHAT IS DAH" />
            <h2 className="mt-24 max-w-4xl text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
              {WHAT_IS_DAH}
            </h2>
          </Reveal>
        </section>

        {/* 02 Why DAH */}
        <section className={`${CONTAINER} pt-section-m md:pt-section-d`}>
          <Reveal>
            <SectionLabel index="02" text="WHY DAH" />
            <h2 className="mt-24 max-w-4xl text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
              {WHY_DAH.statement}
            </h2>
            <p className="mt-16 max-w-[640px] text-body-l-m leading-relaxed text-text-sec md:mt-24 md:text-body-l-d">
              {WHY_DAH.lead}
            </p>
          </Reveal>
        </section>

        {/* 03 Mission · Vision (3항) */}
        <section className={`${CONTAINER} pt-section-m md:pt-section-d`}>
          <Reveal>
            <SectionLabel index="03" text="MISSION & VISION" />
            <div className="mt-24 md:mt-32">
              <p className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
                Mission
              </p>
              <h2 className="mt-16 max-w-4xl text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:text-h2-d">
                {MISSION.en}
              </h2>
              <p className="mt-16 max-w-[640px] text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
                {MISSION.kr}
              </p>
            </div>
          </Reveal>

          {VISION.length > 0 && (
            <div className="mt-64 md:mt-80">
              <p className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
                Vision
              </p>
              <div className="mt-24 grid gap-32 md:grid-cols-3">
                {VISION.map((item, i) => (
                  <Reveal key={item.title} delay={i * motion.stagger}>
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
          )}
        </section>

        {/* 04 연혁 타임라인 */}
        {history.length > 0 && (
          <section className={`${CONTAINER} pt-section-m md:pt-section-d`}>
            <Reveal>
              <SectionLabel index="04" text="HISTORY" />
              <h2 className="mt-24 text-h1-m font-extrabold leading-tight tracking-display text-text-pri md:mt-32 md:text-h1-d">
                연혁
              </h2>
            </Reveal>
            <div className="mt-48 md:mt-64">
              <HistoryTimeline items={history} />
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default About
