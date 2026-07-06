import { useState } from 'react'
import PageHero from '../components/common/PageHero'
import { useTitle } from '../hooks/useTitle'
import { achievements } from '../data/achievements'

const EMPTY_TEXT = '등록된 항목이 없습니다'

// 데이터에 존재하는 연도만 탭으로, 내림차순
const YEARS = [...new Set(achievements.map((item) => item.year))].sort(
  (a, b) => b - a
)

function YearTabs({ active, onSelect }) {
  return (
    <div
      role="group"
      aria-label="연도 필터"
      className="flex flex-wrap gap-x-24 gap-y-8 border-b border-border-subtle"
    >
      {YEARS.map((year) => {
        const isActive = year === active
        return (
          <button
            key={year}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(year)}
            className={`-mb-px cursor-pointer border-b-2 pb-12 font-mono text-small-m transition-colors duration-fast ease-out md:text-small-d ${
              isActive
                ? 'border-text-pri text-text-pri'
                : 'border-transparent text-text-meta hover:text-text-sec'
            }`}
          >
            {year}
          </button>
        )
      })}
    </div>
  )
}

function AwardItem({ award }) {
  const { title, awardee, host, desc } = award

  return (
    <li className="flex flex-col gap-8 py-24">
      <h3 className="text-body-l-m font-bold leading-snug text-text-pri md:text-body-l-d">
        {title}
      </h3>
      <p className="flex flex-wrap gap-x-16 gap-y-4 font-mono text-caption-m text-text-meta md:text-caption-d">
        {awardee && <span>{awardee}</span>}
        {host && <span>{host}</span>}
      </p>
      {desc && (
        <p className="text-body-m leading-relaxed text-text-sec md:text-body-d">
          {desc}
        </p>
      )}
    </li>
  )
}

function Achievements() {
  useTitle('실적')
  const [activeYear, setActiveYear] = useState(YEARS[0] ?? null)
  const items = achievements.filter((item) => item.year === activeYear)

  return (
    <>
      <PageHero
        eyebrow="ACHIEVEMENTS"
        titleKr="실적"
        desc="수상과 논문 실적을 연도별로 모았습니다."
      />
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        {achievements.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta md:text-caption-d">
            {EMPTY_TEXT}
          </p>
        ) : (
          <>
            <YearTabs active={activeYear} onSelect={setActiveYear} />
            <ul className="mt-32 divide-y divide-border-subtle">
              {items.map((item) => (
                <AwardItem key={item.id} award={item} />
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  )
}

export default Achievements
