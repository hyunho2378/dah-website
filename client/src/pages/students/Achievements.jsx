// /students/achievements — 학생 성과 (11_DESIGN_V2 10절 성좌 전용, 일반 게시판 금지)
// md 이상: SVG 성좌 + 하단 접근성 리스트 병행 / md 미만·스크린리더: 리스트 기본.
import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import PageBanner from '../../components/common/PageBanner'
import SectionLabel from '../../components/common/SectionLabel'
import Reveal from '../../components/common/Reveal'
import Divider from '../../components/common/Divider'
import Constellation from '../../components/constellation/Constellation'
import { AddButton, EditPencil } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { achievements } from '../../data/achievements'

const EMPTY_TEXT = '등록된 항목이 없습니다'

// API 게시글(13_CMS: 수상명/수상자/주최/연도/대회 URL) → 성좌 노드 공통형
function normalize(post) {
  const year = Number(
    post.year ?? (post.event_start ?? post.created_at ?? '').slice(0, 4)
  )
  return {
    id: String(post.id),
    year: Number.isFinite(year) && year > 0 ? year : null,
    title: post.title ?? post.title_ko ?? '',
    awardee: post.awardee ?? null,
    host: post.host ?? null,
    url: post.external_url ?? post.url ?? null,
    desc: post.desc ?? null,
  }
}

function AwardItem({ item, highlighted }) {
  return (
    <li
      id={`ach-${item.id}`}
      tabIndex={-1}
      className={`flex flex-col gap-8 rounded-md px-16 py-24 outline-none transition-colors duration-base ease-out ${
        highlighted ? 'border border-border-strong bg-glass-bg' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-12">
        <h3 className="min-w-0 text-body-l-m font-bold leading-snug text-text-pri md:text-body-l-d">
          {item.title}
        </h3>
        <EditPencil
          type="achievement"
          to={`/admin/posts/achievement/${item.id}/edit`}
        />
      </div>
      <p className="flex flex-wrap gap-x-16 gap-y-4 font-mono text-caption-m text-text-meta">
        {item.awardee && <span>{item.awardee}</span>}
        {item.host && <span>{item.host}</span>}
      </p>
      {item.desc && (
        <p className="text-body-m leading-relaxed text-text-sec md:text-body-d">
          {item.desc}
        </p>
      )}
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 font-mono text-caption-m text-text-sec transition-colors duration-fast ease-out hover:text-text-pri"
        >
          대회 페이지
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
    </li>
  )
}

function Achievements() {
  useTitle('학생 성과')
  const { data, error, offline } = useApi('/content/achievement')
  const [highlightId, setHighlightId] = useState(null)

  const useFallback = offline || (error && !data)
  const items = (useFallback ? achievements : data?.items ?? [])
    .map(normalize)
    .filter((a) => a.year !== null)
  const years = [...new Set(items.map((a) => a.year))].sort((a, b) => b - a)

  // 성좌 노드 클릭·Enter → 하단 리스트 해당 항목 스크롤 + 하이라이트
  const handleSelect = (id) => {
    setHighlightId(id)
    const el = document.getElementById(`ach-${id}`)
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
    el.focus({ preventScroll: true })
  }

  return (
    <>
      <PageBanner
        titleKo="학생 성과"
        titleEn="ACHIEVEMENTS"
        breadcrumb={[{ label: '홈', to: '/' }, { label: '학생' }, { label: '학생 성과', to: '/students/achievements' }]}
        nebulaX="58%"
        nebulaY="12%"
      />
      <div className="mx-auto max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide">
        {items.length === 0 ? (
          <p className="py-section-m font-mono text-caption-m text-text-meta">
            {EMPTY_TEXT}
          </p>
        ) : (
          <>
            {/* 성좌 — md 미만에서는 숨기고 리스트만 (접근성·모바일 기본) */}
            <section className="hidden py-section-m md:block lg:py-section-d">
              <Reveal>
                <SectionLabel index="01" text="CONSTELLATION" />
                <h2 className="mt-24 text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
                  수상 성좌
                </h2>
                <p className="mt-12 max-w-container text-body-m leading-relaxed text-text-sec md:text-body-d">
                  연도별 수상이 별로 떠 있고, 같은 대회·같은 팀의 수상이 헤어라인으로
                  이어집니다. 별을 선택하면 아래 목록의 해당 항목으로 이동합니다.
                </p>
              </Reveal>
              <div className="mt-32 flex items-center justify-end">
                <AddButton type="achievement" to="/admin/posts/achievement/new" />
              </div>
              <div className="mt-16">
                <Constellation items={items} onSelect={handleSelect} />
              </div>
            </section>
            <div className="hidden md:block">
              <Divider />
            </div>

            {/* 접근성 리스트 뷰 — 연도 그룹, 스크린리더·모바일 기본 */}
            <section className="py-section-m lg:py-section-d">
              <Reveal>
                <SectionLabel index="02" text="ARCHIVE" />
                <div className="mt-24 flex flex-wrap items-center justify-between gap-16">
                  <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
                    연도별 실적
                  </h2>
                  <span className="md:hidden">
                    <AddButton type="achievement" to="/admin/posts/achievement/new" />
                  </span>
                </div>
              </Reveal>
              <div className="mt-48 flex flex-col gap-48">
                {years.map((year) => (
                  <section key={year} aria-label={`${year}년 실적`}>
                    <h3 className="border-b border-border-subtle pb-12 font-mono text-small-m text-text-pri md:text-small-d">
                      {year}
                    </h3>
                    <ul className="mt-8 divide-y divide-border-subtle">
                      {items
                        .filter((a) => a.year === year)
                        .map((item) => (
                          <AwardItem
                            key={item.id}
                            item={item}
                            highlighted={item.id === highlightId}
                          />
                        ))}
                    </ul>
                  </section>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </>
  )
}

export default Achievements
