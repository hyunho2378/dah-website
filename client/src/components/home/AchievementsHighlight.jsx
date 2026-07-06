import SectionLabel from '../common/SectionLabel'
import Reveal from '../common/Reveal'
import GlassCard from '../common/GlassCard'
import ArrowLink from '../common/ArrowLink'
import { useApi } from '../../hooks/useApi'
import { useLang } from '../../i18n/LangContext'
import { achievements as staticAchievements } from '../../data/achievements'
import { motion } from '../../styles/tokens.js'

const CONTAINER =
  'mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide'

// 홈 v2 #5 학생 성과 하이라이트 (10_IA_V2 4절)
// 최근 수상 4건 + 성좌 미니 비주얼. B5의 본 성좌(/students/achievements)와 별개의 장식 미니판.
// 데이터: useApi('/content/achievement') → 미기동·오류 시 src/data/achievements 폴백.

// 미니 성좌 좌표 — 별 4개 + 헤어라인 연결(장식, 정보 미포함)
const MINI_STARS = [
  { x: 36, y: 78 },
  { x: 104, y: 30 },
  { x: 176, y: 92 },
  { x: 228, y: 44 },
]

function MiniConstellation() {
  return (
    <svg viewBox="0 0 256 120" aria-hidden="true" className="h-auto w-full">
      <polyline
        points={MINI_STARS.map((s) => `${s.x},${s.y}`).join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-border-strong"
      />
      {MINI_STARS.map((s, i) => (
        <circle
          key={`${s.x}-${s.y}`}
          cx={s.x}
          cy={s.y}
          r={i % 2 === 0 ? 3 : 2}
          fill="currentColor"
          className="text-cosmos-star"
        />
      ))}
    </svg>
  )
}

// API posts(type=achievement) → 정적 achievements.js와 동일 필드로 정규화
function normalize(item) {
  return {
    id: item.id,
    year: item.year ?? null,
    title: item.title_ko || item.title || '',
    awardee: item.awardee || null,
  }
}

function AchievementsHighlight() {
  const { t } = useLang()
  const { data, error, offline } = useApi('/content/achievement')

  const apiList = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : null
  const source =
    !apiList || apiList.length === 0 || error || offline
      ? staticAchievements
      : apiList.map(normalize)
  const latest = [...source]
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .slice(0, 4)

  if (latest.length === 0) return null

  return (
    <section className="py-section-m lg:py-section-d">
      <div className={CONTAINER}>
        <Reveal>
          <SectionLabel index="03" text="ACHIEVEMENTS" />
          <h2 className="mt-24 text-h1-m font-extrabold leading-snug tracking-display text-text-pri lg:text-h1-d">
            {t('sections.achievements')}
          </h2>
        </Reveal>

        <div className="mt-64 grid gap-24 lg:grid-cols-5 lg:gap-48">
          <Reveal className="lg:col-span-2">
            <GlassCard className="flex h-full flex-col justify-center p-24 md:p-32">
              <MiniConstellation />
            </GlassCard>
          </Reveal>

          <div className="min-w-0 lg:col-span-3">
            <ul className="border-t border-border-subtle">
              {latest.map((item, i) => (
                <Reveal
                  key={item.id}
                  as="li"
                  delay={i < 6 ? i * motion.stagger : 0}
                  className="border-b border-border-subtle"
                >
                  <div className="flex flex-col gap-4 py-16 md:flex-row md:items-baseline md:gap-24 md:py-20">
                    {item.year && (
                      <span className="w-48 shrink-0 font-mono text-caption-m text-text-meta md:text-caption-d">
                        {item.year}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block text-body-m text-text-pri md:text-body-d">
                        {item.title}
                      </span>
                      {item.awardee && (
                        <span className="mt-4 block text-small-m text-text-sec md:text-small-d">
                          {item.awardee}
                        </span>
                      )}
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
            <div className="mt-32">
              <ArrowLink href="/students/achievements">{t('actions.viewAll')}</ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AchievementsHighlight
