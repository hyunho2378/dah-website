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

// 회차 카드 제목 — edition.title이 원본이고, 없으면 공모전 제목 + 학기로 폴백
function editionTitle(edition, contestTitle) {
  if (edition.title) return edition.title
  return edition.semester_label ? `${edition.semester_label} ${contestTitle}` : contestTitle
}

function EditionCard({ contestId, edition, title, index }) {
  const label = editionTitle(edition, title)
  // 회차 키는 학기 라벨 우선. 라벨이 없을 때만 원본 배열 인덱스로 떨어진다
  // (카드는 최신순으로 정렬해 보여주므로 정렬 후 순번을 쓰면 어긋난다).
  const key = edition.semester_label || index
  const to =
    key === undefined || key === null || key === ''
      ? `/programs/contests/${contestId}`
      : `/programs/contests/${contestId}/${encodeURIComponent(key)}`
  return (
    <Link to={to} className="group block h-full">
      <GlassCard hover className="flex h-full flex-col gap-12 p-12">
        <ImageFrame
          src={edition.poster_url}
          alt={`${label} 포스터`}
          ratio="2/3"
          placeholder={edition.semester_label || title}
        />
        <div className="flex min-w-0 flex-col gap-4">
          {edition.semester_label && (
            <p className="font-mono text-caption-m text-text-meta">
              {edition.semester_label}
            </p>
          )}
          <h3 className="min-w-0 text-body-m font-bold leading-snug text-text-pri underline-offset-4 group-hover:underline md:text-body-d">
            {label}
          </h3>
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
  // editions 없으면 공모전 자기 자신을 1회차로 취급(캐릭터 공모전 등 단발성)
  // 최신 학기가 맨 앞. 라벨이 'YYYY-N' 고정 폭이라 문자열 내림차순이 곧 학기 내림차순이다.
  // index는 원본 배열 순번을 그대로 들고 간다 — 회차 상세 링크가 정렬에 흔들리지 않게 한다
  const editions =
    Array.isArray(item.body?.editions) && item.body.editions.length
      ? item.body.editions
          .map((ed, index) => ({ ed, index }))
          .sort((a, b) =>
            String(b.ed.semester_label ?? '').localeCompare(String(a.ed.semester_label ?? ''))
          )
      : [
          {
            ed: {
              semester_label: item.semester_label,
              poster_url: item.poster_url,
              period: eventPeriod(item),
            },
            index: null, // editions 없는 단발성 공모전 — 기존 공모전 상세로 보낸다
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
      <ul className="grid gap-16 [grid-template-columns:repeat(auto-fill,minmax(min(220px,40vw),1fr))] md:gap-24">
        {editions.map(({ ed, index }, i) => (
          <li key={i} className="min-w-0">
            <EditionCard contestId={item.id} edition={ed} title={title} index={index} />
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
