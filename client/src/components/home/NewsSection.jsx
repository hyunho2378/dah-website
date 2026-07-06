import SectionLabel from '../common/SectionLabel'
import Reveal from '../common/Reveal'
import ArrowLink from '../common/ArrowLink'
import NoticeItem from '../common/NoticeItem'
import { notices } from '../../data/notices'
import { motion } from '../../styles/tokens.js'

function NewsSection() {
  if (!notices?.length) return null

  const latest = [...notices]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 4)

  return (
    <section className="py-section-m lg:py-section-d">
      <div className="mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide">
        <Reveal>
          <SectionLabel index="06" text="소식" />
          <h2 className="mt-24 max-w-2xl text-h1-m font-extrabold leading-snug tracking-display text-text-pri lg:text-h1-d">
            최근 소식
          </h2>
        </Reveal>

        <div className="mt-64 divide-y divide-border-subtle">
          {latest.map((n, i) => (
            <Reveal key={n.id} delay={i < 6 ? i * motion.stagger : 0}>
              <NoticeItem notice={n} />
            </Reveal>
          ))}
        </div>

        <div className="mt-48">
          <ArrowLink href="/news">전체 소식</ArrowLink>
        </div>
      </div>
    </section>
  )
}

export default NewsSection
