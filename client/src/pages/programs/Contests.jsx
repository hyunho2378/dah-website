// /programs/contests — 공모전 (공모전별 블록 세로 나열)
// 각 블록 = 제목 + 주최(원문 그대로) + 회차(editions) 포스터 카드 가로 나열. 회차 클릭 → 상세.
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

const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

// 주최 원문: 배열이면 줄바꿈 join, 문자열이면 그대로(whitespace-pre-line로 여러 줄 보존)
function hostText(host) {
  if (!host) return null
  if (Array.isArray(host)) return host.join('\n')
  return String(host)
}

// 회차 없는 공모전 폴백용 — 게시글 event_start~event_end
function eventPeriod(item) {
  const s = (item.event_start ?? '').slice(0, 10)
  const e = (item.event_end ?? '').slice(0, 10)
  if (s && e) return `${s} ~ ${e}`
  return s || e || null
}

function EditionCard({ contestId, edition, title }) {
  return (
    <Link to={`/programs/contests/${contestId}`} className="group block h-full">
      <GlassCard hover className="flex h-full flex-col gap-12 p-12">
        <ImageFrame
          src={edition.poster_url}
          alt={`${title} 포스터`}
          ratio="2/3"
          placeholder={edition.semester_label || title}
        />
        <div className="flex min-w-0 flex-col gap-4">
          {edition.semester_label && (
            <p className="font-mono text-caption-m text-text-meta">
              {edition.semester_label}
            </p>
          )}
          {edition.period && (
            <p className="font-mono text-caption-m text-text-meta">{edition.period}</p>
          )}
        </div>
      </GlassCard>
    </Link>
  )
}

function ContestBlock({ item }) {
  const { t } = useLang()
  const title = item.title_ko ?? item.title
  const host = hostText(item.body?.host)
  // editions 없으면 공모전 자기 자신을 1회차로 취급
  const editions =
    Array.isArray(item.body?.editions) && item.body.editions.length
      ? item.body.editions
      : [
          {
            semester_label: item.semester_label,
            poster_url: item.poster_url,
            period: eventPeriod(item),
          },
        ]

  return (
    <article className="flex min-w-0 flex-col gap-24 border-t border-border-subtle pt-48 first:border-0 first:pt-0">
      <div className="flex min-w-0 flex-col gap-12">
        <h2 className="min-w-0 text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
          {title}
        </h2>
        {host && (
          <div className="flex min-w-0 flex-col gap-4">
            <p className="font-mono text-caption-m uppercase tracking-label text-text-meta">
              {t('meta.host')}
            </p>
            <p className="whitespace-pre-line text-body-m leading-relaxed text-text-sec md:text-body-d">
              {host}
            </p>
          </div>
        )}
      </div>
      <ul className="flex flex-wrap gap-16">
        {editions.map((ed, i) => (
          <li key={i} className="w-[calc(50%-8px)] min-w-0 sm:w-[180px]">
            <EditionCard contestId={item.id} edition={ed} title={title} />
          </li>
        ))}
      </ul>
    </article>
  )
}

function Contests() {
  const { t } = useLang()
  useTitle(t('titles.contests'))
  // G1.3: 페이지네이션 UI 없는 목록은 전량 요청(서버 기본 12건 상한 회피)
  const { data, loading, error, offline } = useApi('/content/contest', {
    params: { pageSize: 100 },
  })
  const items = data?.items ?? []

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
            {items.map((item, index) => (
              <Reveal key={item.id} delay={staggerDelay(index)} className="min-w-0">
                <ContestBlock item={item} />
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}

export default Contests
