// /programs/exhibitions — 전시회 아카이브 (포스터 그리드, 2017~)
// 포스터는 원색 유지(grayscale 금지 — 전시 포스터 정체성). 로드 전 bg-elev, lazy, alt.
import { Link } from 'react-router-dom'
import PageBanner from '../../components/common/PageBanner'
import GlassCard from '../../components/common/GlassCard'
import Reveal from '../../components/common/Reveal'
import { AddButton } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'

const EMPTY_TEXT = '등록된 항목이 없습니다'
const LOADING_TEXT = '불러오는 중'

// P9: 스태거 지연은 최대 6개까지만
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

function PosterCard({ item }) {
  return (
    <Link to={`/programs/exhibitions/${item.id}`} className="group block h-full">
      <GlassCard hover className="flex h-full flex-col gap-12">
        <figure className="aspect-[2/3] w-full overflow-hidden rounded-md bg-bg-elev">
          {item.poster_url ? (
            <img
              src={item.poster_url}
              alt={`${item.title} 포스터`}
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
          {item.semester_label && (
            <p className="font-mono text-caption-m text-text-meta">
              {item.semester_label}
            </p>
          )}
          <h3 className="min-w-0 text-body-l-m font-bold leading-snug text-text-pri underline-offset-4 group-hover:underline md:text-body-l-d">
            {item.title}
          </h3>
        </div>
      </GlassCard>
    </Link>
  )
}

function Exhibitions() {
  useTitle('전시회')
  const { data, loading, error, offline } = useApi('/content/exhibitions')
  const items = data?.items ?? []

  return (
    <>
      <PageBanner
        titleKo="전시회"
        titleEn="EXHIBITIONS"
        breadcrumb={[{ label: '홈', to: '/' }, { label: '프로그램' }, { label: '전시회', to: '/programs/exhibitions' }]}
        nebulaX="18%"
        nebulaY="30%"
      />
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        <div className="flex flex-wrap items-center justify-between gap-16">
          <p className="font-mono text-caption-m text-text-sec">
            총 <span className="text-text-pri">{data?.total ?? items.length}</span>건
          </p>
          <AddButton type="exhibitions" to="/admin/posts/exhibitions/new" />
        </div>
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{LOADING_TEXT}</p>
        ) : items.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {error && !offline ? '목록을 불러오지 못했습니다' : EMPTY_TEXT}
          </p>
        ) : (
          <ul className="mt-32 grid grid-cols-2 gap-16 md:grid-cols-3 md:gap-24 lg:grid-cols-4">
            {items.map((item, index) => (
              <Reveal as="li" key={item.id} delay={staggerDelay(index)} className="min-w-0">
                <PosterCard item={item} />
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export default Exhibitions
