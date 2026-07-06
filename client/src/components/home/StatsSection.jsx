import SectionLabel from '../common/SectionLabel'
import Reveal from '../common/Reveal'
import Stat from '../common/Stat'
import { stats } from '../../data/stats'
import { motion } from '../../styles/tokens.js'

function StatsSection() {
  if (!stats?.length) return null

  return (
    <section className="py-section-m lg:py-section-d">
      <div className="mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide">
        <Reveal>
          <SectionLabel index="04" text="숫자로 보는 DAH" />
          <h2 className="mt-24 max-w-2xl text-h1-m font-extrabold leading-snug tracking-display text-text-pri lg:text-h1-d">
            전공의 현재를 말하는 숫자
          </h2>
        </Reveal>

        <div className="mt-64 grid grid-cols-2 gap-x-24 gap-y-64 lg:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i < 6 ? i * motion.stagger : 0}>
              <Stat value={s.value} label={s.label} suffix={s.suffix} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
