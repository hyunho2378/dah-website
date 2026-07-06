import SectionLabel from '../common/SectionLabel'
import Reveal from '../common/Reveal'
import Card from '../common/Card'
import ArrowLink from '../common/ArrowLink'
import { professors } from '../../data/professors'
import { motion } from '../../styles/tokens.js'

function PeoplePreview() {
  if (!professors?.length) return null

  // 주임(lead) 우선, 이후 원본 순서 유지
  const featured = [
    ...professors.filter((p) => p.lead),
    ...professors.filter((p) => !p.lead),
  ].slice(0, 4)

  return (
    <section className="py-section-m lg:py-section-d">
      <div className="mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide">
        <Reveal>
          <SectionLabel index="05" text="사람" />
          <h2 className="mt-24 max-w-2xl text-h1-m font-extrabold leading-snug tracking-display text-text-pri lg:text-h1-d">
            전공을 이끄는 사람들
          </h2>
        </Reveal>

        <div className="mt-64 grid gap-24 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i < 6 ? i * motion.stagger : 0}>
              <Card>
                <h3 className="text-h3-m font-bold text-text-pri lg:text-h3-d">{p.nameKr}</h3>
                <p className="mt-4 font-mono text-caption-m text-text-meta">{p.nameEn}</p>
                <p className="mt-12 text-small-m text-text-sec lg:text-small-d">{p.role}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-48">
          <ArrowLink href="/people">전체 교수진</ArrowLink>
        </div>
      </div>
    </section>
  )
}

export default PeoplePreview
