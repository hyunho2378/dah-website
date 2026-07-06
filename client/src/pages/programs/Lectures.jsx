// /programs/lectures — 특강 (포스터 그리드)
import { Link } from 'react-router-dom'
import PageBanner from '../../components/common/PageBanner'
import GlassCard from '../../components/common/GlassCard'
import Reveal from '../../components/common/Reveal'
import { AddButton } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'

const EMPTY_TEXT = '등록된 항목이 없습니다'
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

function LectureCard({ item }) {
  const title = item.title_ko ?? item.title
  const date = (item.event_start ?? '').slice(0, 10)

  return (
    <Link to={`/programs/lectures/${item.id}`} className="group block h-full">
      <GlassCard hover className="flex h-full flex-col gap-12">
        <figure className="aspect-[2/3] w-full overflow-hidden rounded-md bg-bg-elev">
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
        </figure>
        <div className="flex min-w-0 flex-col gap-4">
          {date && <p className="font-mono text-caption-m text-text-meta">{date}</p>}
          <h3 className="min-w-0 text-body-l-m font-bold leading-snug text-text-pri underline-offset-4 group-hover:underline md:text-body-l-d">
            {title}
          </h3>
        </div>
      </GlassCard>
    </Link>
  )
}

function Lectures() {
  useTitle('특강')
  const { data, loading, error, offline } = useApi('/content/lecture')
  const items = data?.items ?? []

  return (
    <>
      <PageBanner
        titleKo="특강"
        titleEn="LECTURES"
        breadcrumb={[{ label: '홈', to: '/' }, { label: '프로그램' }, { label: '특강', to: '/programs/lectures' }]}
        nebulaX="80%"
        nebulaY="34%"
      />
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        <div className="flex flex-wrap items-center justify-between gap-16">
          <p className="font-mono text-caption-m text-text-sec">
            총 <span className="text-text-pri">{data?.total ?? items.length}</span>건
          </p>
          <AddButton type="lecture" to="/admin/posts/lecture/new" />
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
                <LectureCard item={item} />
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export default Lectures
