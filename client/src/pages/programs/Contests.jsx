// /programs/contests — 공모전 목록
// 51_CONTEST_SPLIT: 공모전 1건 = post 1건(= 옛 회차 하나). 이전에는 한 post의 body.editions를
// 풀어 카드를 그렸으나, 이제 목록 응답 자체가 카드 하나에 대응한다.
// 정렬은 서버가 학기 라벨 내림차순으로 내려준다(content-config의 contest orderBy).
import Link from '../../components/common/LangLink'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import GlassCard from '../../components/common/GlassCard'
import ImageFrame from '../../components/common/ImageFrame'
import Reveal from '../../components/common/Reveal'
import InlineEditBar from '../../components/content/InlineEditBar'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'
import { semesterLabelOf } from '../../utils/format'
import { CONTEST_CATEGORY, CONTEST_CATEGORY_ORDER } from '../../data/contestCategory'

const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

// 기간 표시 — period 컬럼이 원본이고, 없으면 게시글 일정(event_start~event_end)으로 폴백
function periodText(item) {
  if (item.period) return item.period
  const s = (item.event_start ?? '').slice(0, 10)
  const e = (item.event_end ?? '').slice(0, 10)
  if (s && e) return `${s} ~ ${e}`
  return s || e || null
}

function ContestCard({ item, isEn }) {
  const title = (isEn && item.title_en) || item.title_ko || item.title
  const period = periodText(item)
  // 학기는 제목 위 eyebrow 자리에 고정한다. 저장된 라벨이 없으면 개최일에서 산출해
  // 모든 카드가 [학기 → 제목] 같은 구조를 갖게 한다(캐릭터 공모전 포함).
  const semester = semesterLabelOf(item)

  return (
    <Link to={`/programs/contests/${item.id}`} className="group block h-full">
      <GlassCard hover className="flex h-full flex-col gap-12 p-12">
        <ImageFrame
          src={item.poster_url}
          alt={`${title} 포스터`}
          ratio="2/3"
          placeholder={item.semester_label || title}
        />
        <div className="flex min-w-0 flex-col gap-4">
          {semester && (
            <p className="font-mono text-caption-m text-text-meta">{semester}</p>
          )}
          <h3 className="min-w-0 text-body-m font-bold leading-snug text-text-pri underline-offset-4 group-hover:underline md:text-body-d">
            {title}
          </h3>
          {period && <p className="font-mono text-caption-m text-text-meta">{period}</p>}
        </div>
      </GlassCard>
    </Link>
  )
}

// 종류별 섹션 — 순서는 포스터 → 장서표 → 기타 고정.
// category가 비어 있는 레거시 행은 기타로 모은다(섹션 밖으로 새어 화면에서 사라지지 않게).
function groupByCategory(items) {
  const buckets = new Map(CONTEST_CATEGORY_ORDER.map((c) => [c, []]))
  for (const item of items) {
    const key = buckets.has(item.category) ? item.category : CONTEST_CATEGORY.ETC
    buckets.get(key).push(item)
  }
  return CONTEST_CATEGORY_ORDER.map((category) => ({
    category,
    items: buckets.get(category),
  })).filter((section) => section.items.length > 0)
}

function Contests() {
  const { lang, t } = useLang()
  useTitle(t('titles.contests'))
  const isEn = lang === 'en'
  // G1.3: 페이지네이션 UI 없는 목록은 전량 요청(서버 기본 12건 상한 회피)
  const { data, loading, error, offline } = useApi('/content/contest', {
    params: { pageSize: 100 },
  })
  const items = data?.items ?? []
  // 서버가 학기 내림차순으로 내려주므로 섹션 안 순서는 그대로가 최신순이다
  const sections = groupByCategory(items)

  return (
    <>
      <PageBanner
        titleKo="공모전"
        titleEn="CONTESTS"
        breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.events') }, { label: t('titles.contests'), to: '/programs/contests' }]}
        nebulaX="46%"
        nebulaY="14%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        <div className="flex flex-wrap items-center justify-end gap-16">
          <InlineEditBar
            type="contest"
            addTo="/admin/posts/contest/new"
            manageTo="/admin/posts/contest"
          />
        </div>
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {error && !offline ? t('common.error') : t('common.empty')}
          </p>
        ) : (
          <div className="mt-32 flex min-w-0 flex-col gap-48">
            {sections.map((section) => (
              <section key={section.category} className="flex min-w-0 flex-col gap-24">
                <h2 className="min-w-0 text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
                  {section.category}
                </h2>
                <ul className="grid gap-16 [grid-template-columns:repeat(auto-fill,minmax(min(220px,40vw),1fr))] md:gap-24">
                  {section.items.map((item, index) => (
                    <li key={item.id} className="min-w-0">
                      <Reveal delay={staggerDelay(index)} className="h-full min-w-0">
                        <ContestCard item={item} isEn={isEn} />
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}

export default Contests
