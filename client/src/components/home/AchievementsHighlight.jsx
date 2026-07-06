import SectionLabel from '../common/SectionLabel'
import Reveal from '../common/Reveal'
import ArrowLink from '../common/ArrowLink'
import Container from '../layout/Container'
import { useApi } from '../../hooks/useApi'
import { useLang } from '../../i18n/LangContext'
import { achievements as staticAchievements } from '../../data/achievements'
import { motion } from '../../styles/tokens.js'

// 홈 v2 #5 학생 성과 하이라이트 (10_IA_V2 4절 · F6.3 톤다운)
// 성좌 미니 비주얼 폐기. 최근 3건 제목만 심플 리스트(연도 + 제목) + 전체 보기 링크.
// 데이터: useApi('/content/achievement') → 미기동·오류 시 src/data/achievements 폴백.

// API posts(type=achievement) → 정적 achievements.js와 동일 필드로 정규화
function normalize(item) {
  return {
    id: item.id,
    year: item.year ?? null,
    title: item.title_ko || item.title || '',
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
    .slice(0, 3)

  if (latest.length === 0) return null

  return (
    <section className="py-section-m lg:py-section-d">
      <Container>
        <Reveal>
          <SectionLabel index="03" text="ACHIEVEMENTS" />
          <h2 className="mt-24 text-h1-m font-bold leading-snug tracking-display text-text-pri lg:text-h1-d">
            {t('sections.achievements')}
          </h2>
        </Reveal>

        <ul className="mt-48 border-t border-border-subtle">
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
                <span className="min-w-0 break-keep text-body-m text-text-pri md:text-body-d">
                  {item.title}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
        <div className="mt-32">
          <ArrowLink href="/students/achievements">{t('actions.viewAll')}</ArrowLink>
        </div>
      </Container>
    </section>
  )
}

export default AchievementsHighlight
