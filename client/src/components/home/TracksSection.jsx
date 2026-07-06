import SectionLabel from '../common/SectionLabel'
import Reveal from '../common/Reveal'
import Card from '../common/Card'
import Tag from '../common/Tag'
import ArrowLink from '../common/ArrowLink'
import { tracks } from '../../data/tracks'
import { motion } from '../../styles/tokens.js'

function TracksSection() {
  if (!tracks?.length) return null

  return (
    <section className="py-section-m lg:py-section-d">
      <div className="mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide">
        <Reveal>
          <SectionLabel index="02" text="트랙" />
          <h2 className="mt-24 max-w-2xl text-h1-m font-extrabold leading-snug tracking-display text-text-pri lg:text-h1-d">
            세 개의 트랙, 하나의 전공
          </h2>
        </Reveal>

        <div className="mt-64 grid gap-24 md:grid-cols-3">
          {tracks.map((t, i) => (
            <Reveal key={t.id} delay={i < 6 ? i * motion.stagger : 0}>
              <Card>
                <p className="font-mono text-label-m uppercase tracking-label text-text-meta lg:text-label-d">
                  {t.no}
                </p>
                <h3 className="mt-16 text-h3-m font-bold text-text-pri lg:text-h3-d">{t.name}</h3>
                <p className="mt-12 line-clamp-2 text-body-m leading-relaxed text-text-sec lg:text-body-d">
                  {t.summary}
                </p>
                <div className="mt-20 flex flex-wrap gap-8">
                  {(t.keywords || []).slice(0, 3).map((k) => (
                    <Tag key={k}>{k}</Tag>
                  ))}
                </div>
                <div className="mt-24">
                  <ArrowLink href={`/tracks#${t.id}`}>자세히 보기</ArrowLink>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TracksSection
