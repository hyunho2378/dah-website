import SectionLabel from '../common/SectionLabel'
import Reveal from '../common/Reveal'
import GlassCard from '../common/GlassCard'
import Tag from '../common/Tag'
import ArrowLink from '../common/ArrowLink'
import Container from '../layout/Container'
import { useLang } from '../../i18n/LangContext'
import { tracks } from '../../data/tracks'
import { motion } from '../../styles/tokens.js'

// 홈 v2 #4 트랙 3 글래스 카드 (10_IA_V2 4절)
// 트랙 표시명 v2는 i18n 사전 매핑(tracks.track-1~3), 데이터 키·앵커는 기존 유지.
function TracksSection() {
  const { lang, t } = useLang()

  if (!tracks?.length) return null

  return (
    <section className="py-section-m lg:py-section-d">
      <Container>
        <Reveal>
          <SectionLabel index="02" text="TRACKS" />
          <h2 className="mt-24 max-w-2xl text-h1-m font-extrabold leading-snug tracking-display text-text-pri lg:text-h1-d">
            {t('sections.tracks')}
          </h2>
        </Reveal>

        {/* K2-14: 1→3열 급전환 대신 auto-fill — 300px = 3열 기준 카드폭(약 360px) 근사 하한 */}
        <div className="mt-64 grid gap-24 [grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr))]">
          {tracks.map((track, i) => (
            <Reveal key={track.id} delay={i < 6 ? i * motion.stagger : 0}>
              <GlassCard hover className="flex h-full flex-col p-24 md:p-32">
                <p className="font-mono text-label-m uppercase tracking-label text-text-meta lg:text-label-d">
                  {track.no}
                </p>
                <h3 className="mt-16 text-h3-m font-bold text-text-pri lg:text-h3-d">
                  {t(`tracks.${track.id}`)}
                </h3>
                {/* J4.2: clamp 2줄 + 2줄 높이 예약 — 언어별 길이 차 무시 */}
                <p className="mt-12 line-clamp-2 min-h-[2lh] text-body-m leading-relaxed text-text-sec lg:text-body-d">
                  {lang === 'en' && track.summaryEn ? track.summaryEn : track.summary}
                </p>
                {/* J4.2: 키워드 랩 2행 높이 예약(min-h-64) — EN 랩핑 차이 흡수 */}
                <div className="mt-20 flex min-h-64 flex-wrap content-start gap-8">
                  {((lang === 'en' && track.keywordsEn) || track.keywords || [])
                    .slice(0, 3)
                    .map((keyword) => (
                      <Tag key={keyword}>{keyword}</Tag>
                    ))}
                </div>
                {/* J4.2: 버튼은 카드 하단 고정 — 위 콘텐츠 높이와 무관 */}
                <div className="mt-auto pt-24">
                  <ArrowLink href={`/curriculum#${track.id}`}>
                    {t('actions.detail')}
                  </ArrowLink>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default TracksSection
