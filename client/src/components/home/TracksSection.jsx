import SectionLabel from '../common/SectionLabel'
import Reveal from '../common/Reveal'
import GlassCard from '../common/GlassCard'
import Tag from '../common/Tag'
import ArrowLink from '../common/ArrowLink'
import { useLang } from '../../i18n/LangContext'
import { tracks } from '../../data/tracks'
import { motion } from '../../styles/tokens.js'

// 홈 v2 #4 트랙 3 글래스 카드 (10_IA_V2 4절)
// 트랙 표시명 v2는 i18n 사전 매핑(tracks.track-1~3), 데이터 키·앵커는 기존 유지.
function TracksSection() {
  const { t } = useLang()

  if (!tracks?.length) return null

  return (
    <section className="py-section-m lg:py-section-d">
      <div className="mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide">
        <Reveal>
          <SectionLabel index="02" text="TRACKS" />
          <h2 className="mt-24 max-w-2xl text-h1-m font-extrabold leading-snug tracking-display text-text-pri lg:text-h1-d">
            {t('sections.tracks')}
          </h2>
        </Reveal>

        <div className="mt-64 grid gap-24 md:grid-cols-3">
          {tracks.map((track, i) => (
            <Reveal key={track.id} delay={i < 6 ? i * motion.stagger : 0}>
              <GlassCard hover className="h-full p-24 md:p-32">
                <p className="font-mono text-label-m uppercase tracking-label text-text-meta lg:text-label-d">
                  {track.no}
                </p>
                <h3 className="mt-16 text-h3-m font-bold text-text-pri lg:text-h3-d">
                  {t(`tracks.${track.id}`)}
                </h3>
                <p className="mt-12 line-clamp-2 text-body-m leading-relaxed text-text-sec lg:text-body-d">
                  {track.summary}
                </p>
                <div className="mt-20 flex flex-wrap gap-8">
                  {(track.keywords || []).slice(0, 3).map((keyword) => (
                    <Tag key={keyword}>{keyword}</Tag>
                  ))}
                </div>
                <div className="mt-24">
                  <ArrowLink href={`/curriculum#${track.id}`}>
                    {t('actions.detail')}
                  </ArrowLink>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TracksSection
