import { useState } from 'react'
import PageHero from '../components/common/PageHero'
import NoticeItem from '../components/common/NoticeItem'
import { useTitle } from '../hooks/useTitle'
import { notices } from '../data/notices'

const EMPTY_TEXT = '등록된 항목이 없습니다'
const ORG_FILTERS = ['전체', '전공', '미래융합스쿨', '창업지원본부', '기타']

// 날짜 내림차순 (YYYY-MM-DD 문자열 정렬)
const SORTED_NOTICES = [...notices].sort((a, b) =>
  b.date.localeCompare(a.date)
)

function News() {
  useTitle('소식')
  const [activeOrg, setActiveOrg] = useState('전체')
  const filtered =
    activeOrg === '전체'
      ? SORTED_NOTICES
      : SORTED_NOTICES.filter((notice) => notice.org === activeOrg)

  return (
    <>
      <PageHero
        eyebrow="NEWS"
        titleKr="소식"
        desc="전공과 학교 기관의 공지사항을 한곳에 모았습니다."
      />
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        <div role="group" aria-label="기관 필터" className="flex flex-wrap gap-8">
          {ORG_FILTERS.map((org) => {
            const isActive = org === activeOrg
            return (
              <button
                key={org}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveOrg(org)}
                className={`cursor-pointer rounded-full border px-12 py-4 font-mono text-caption-m transition-colors duration-fast ease-out md:text-caption-d ${
                  isActive
                    ? 'border-border-strong bg-bg-elev text-text-pri'
                    : 'border-border-subtle text-text-sec hover:border-border-strong hover:text-text-pri'
                }`}
              >
                {org}
              </button>
            )
          })}
        </div>
        <div className="mt-32">
          {filtered.length === 0 ? (
            <p className="py-64 font-mono text-caption-m text-text-meta md:text-caption-d">
              {EMPTY_TEXT}
            </p>
          ) : (
            <div className="divide-y divide-border-subtle">
              {filtered.map((notice) => (
                <NoticeItem key={notice.id} notice={notice} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default News
