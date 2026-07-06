// /programs/contests — 공모전 (포스터 그리드)
// external_url 있으면 카드에서 바로 외부 접수(ArrowUpRight 표시), 없으면 상세 진입.
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import GlassCard from '../../components/common/GlassCard'
import Reveal from '../../components/common/Reveal'
import { AddButton } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'

const EMPTY_TEXT = '등록된 항목이 없습니다'
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

function period(item) {
  const start = (item.event_start ?? '').slice(0, 10)
  const end = (item.event_end ?? '').slice(0, 10)
  if (start && end) return `${start} ~ ${end}`
  return start || end || null
}

function CardBody({ item, external }) {
  const title = item.title_ko ?? item.title
  return (
    <GlassCard hover className="flex h-full flex-col gap-12">
      <figure className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-bg-elev">
        {item.poster_url ? (
          <img
            src={item.poster_url}
            alt={`${title} 포스터`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-mono text-caption-m text-text-meta">
            NO POSTER
          </span>
        )}
        {external && (
          <span className="absolute right-8 top-8 inline-flex items-center gap-4 rounded-full border border-glass-line bg-glass-strong px-8 py-4 font-mono text-caption-m text-text-pri">
            <ArrowUpRight size={16} aria-hidden="true" />
            외부 접수
          </span>
        )}
      </figure>
      <div className="flex min-w-0 flex-col gap-4">
        {period(item) && (
          <p className="font-mono text-caption-m text-text-meta">{period(item)}</p>
        )}
        <h3 className="min-w-0 text-body-l-m font-bold leading-snug text-text-pri underline-offset-4 group-hover:underline md:text-body-l-d">
          {title}
        </h3>
      </div>
    </GlassCard>
  )
}

function ContestCard({ item }) {
  if (item.external_url) {
    return (
      <a
        href={item.external_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
      >
        <CardBody item={item} external />
      </a>
    )
  }
  return (
    <Link to={`/programs/contests/${item.id}`} className="group block h-full">
      <CardBody item={item} external={false} />
    </Link>
  )
}

function Contests() {
  useTitle('공모전')
  const { data, loading, error, offline } = useApi('/content/contest')
  const items = data?.items ?? []

  return (
    <>
      <PageBanner
        titleKo="공모전"
        titleEn="CONTESTS"
        breadcrumb={[{ label: '홈', to: '/' }, { label: '프로그램' }, { label: '공모전', to: '/programs/contests' }]}
        nebulaX="46%"
        nebulaY="14%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        <div className="flex flex-wrap items-center justify-between gap-16">
          <p className="font-mono text-caption-m text-text-sec">
            총 <span className="text-text-pri">{data?.total ?? items.length}</span>건
          </p>
          <AddButton type="contest" to="/admin/posts/contest/new" />
        </div>
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">불러오는 중</p>
        ) : items.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {error && !offline ? '목록을 불러오지 못했습니다' : EMPTY_TEXT}
          </p>
        ) : (
          <ul className="mt-32 grid grid-cols-2 gap-16 md:grid-cols-3 md:gap-24 lg:grid-cols-4">
            {items.map((item, index) => (
              <Reveal as="li" key={item.id} delay={staggerDelay(index)} className="min-w-0">
                <ContestCard item={item} />
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </>
  )
}

export default Contests
