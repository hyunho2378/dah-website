// /students/achievements — 학생 성과 (F6: 성좌 폐기 → 연도별 원문 리스트)
// PageBanner + 연도 앵커 네비(존재 연도만) + 연도별 수직 리스트.
// 항목: 제목(title 원문) + 본문(desc 원문). (M3-4: desc에 이미 담긴 수상자 중복 표시 블록 제거)
// API: GET /content/achievement 우선, offline·오류 시 src/data/achievements 폴백.
// 원문 보존 원칙 — 조사 오류 등 일절 수정하지 않고 데이터 원문 그대로 렌더.
import { ArrowUpRight } from 'lucide-react'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import InlineEditBar from '../../components/content/InlineEditBar'
import { EditPencil } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'
import { achievements } from '../../data/achievements'

// 성과 원문(achievements_SOURCE) 시드: title_ko + body{desc,descEn,year} + title_en. 정적 폴백은
// title/titleEn/desc/descEn 평면. EN 모드는 영문 대역 우선(없으면 국문 폴백). 원문 그대로 렌더.
function normalize(post, isEn) {
  const body = post.body && typeof post.body === 'object' ? post.body : {}
  const year = Number(
    post.year ?? body.year ?? post.tag ?? (post.event_start ?? post.created_at ?? '').slice(0, 4)
  )
  const titleKo = post.title_ko ?? post.title ?? ''
  const titleEn = post.title_en ?? post.titleEn ?? null
  const descKo = post.desc ?? body.desc ?? null
  const descEn = post.descEn ?? body.descEn ?? null
  return {
    id: String(post.id),
    year: Number.isFinite(year) && year > 0 ? year : null,
    title: isEn ? titleEn || titleKo : titleKo,
    url: post.external_url ?? post.url ?? null,
    desc: isEn ? descEn || descKo : descKo,
  }
}

function AwardItem({ item }) {
  return (
    <li className="flex flex-col gap-8 py-24">
      <div className="flex items-start justify-between gap-12">
        <h3 className="min-w-0 text-body-l-m font-bold leading-snug text-text-pri md:text-body-l-d">
          {item.title}
        </h3>
        <EditPencil
          type="achievement"
          to={`/admin/posts/achievement/${item.id}/edit`}
        />
      </div>
      {item.desc && (
        <p className="whitespace-pre-line break-keep text-body-m leading-relaxed text-text-sec md:text-body-d">
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
  const { lang, t } = useLang()
  useTitle(t('titles.achievements'))
  const isEn = lang === 'en'
  // G1.3: 페이지네이션 없이 전량 노출 — 서버 기본 12건 상한 회피
  const { data, error, offline } = useApi('/content/achievement', {
    params: { pageSize: 100 },
  })

  const useFallback = offline || (error && !data)
  const items = (useFallback ? achievements : data?.items ?? [])
    .map((p) => normalize(p, isEn))
    .filter((a) => a.year !== null)
  const years = [...new Set(items.map((a) => a.year))].sort((a, b) => b - a)

  return (
    <>
      <PageBanner
        titleKo="학생 성과"
        titleEn="ACHIEVEMENTS"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.activities') },
          { label: t('titles.achievements'), to: '/students/achievements' },
        ]}
        nebulaX="58%"
        nebulaY="12%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        {offline && (
          <p className="mb-16 font-mono text-caption-m text-text-meta">
            {t('common.offline')}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-end gap-16">
          <InlineEditBar
            type="achievement"
            addTo="/admin/posts/achievement/new"
            manageTo="/admin/posts/achievement"
          />
        </div>

        {items.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.empty')}</p>
        ) : (
          <>
            {/* 연도 앵커 네비 — 존재하는 연도만 */}
            <nav
              aria-label={t('aria.yearNav')}
              className="mt-24 flex flex-wrap gap-8 border-y border-border-subtle py-16"
            >
              {years.map((year) => (
                <a
                  key={year}
                  href={`#year-${year}`}
                  className="rounded-sm border border-border-subtle px-12 py-4 font-mono text-caption-m text-text-sec transition-colors duration-fast ease-out hover:border-border-strong hover:text-text-pri"
                >
                  {year}
                </a>
              ))}
            </nav>

            {/* 연도별 수직 리스트 */}
            <div className="mt-48 flex flex-col gap-48">
              {years.map((year) => (
                <section
                  key={year}
                  id={`year-${year}`}
                  aria-label={`${year}년 실적`}
                  className="scroll-mt-96"
                >
                  <h2 className="border-b border-border-strong pb-12 text-h2-m font-bold text-text-pri md:text-h2-d">
                    {year}
                  </h2>
                  <ul className="divide-y divide-border-subtle">
                    {items
                      .filter((a) => a.year === year)
                      .map((item) => (
                        <AwardItem key={item.id} item={item} />
                      ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  )
}

export default Achievements
