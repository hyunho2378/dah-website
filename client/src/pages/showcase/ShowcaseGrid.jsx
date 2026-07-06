// /showcase — 웹&앱 쇼케이스 그리드 (published만, 16:9 카드)
import { Link } from 'react-router-dom'
import PageBanner from '../../components/common/PageBanner'
import GlassCard from '../../components/common/GlassCard'
import Reveal from '../../components/common/Reveal'
import Tag from '../../components/common/Tag'
import Button from '../../components/common/Button'
import { AddButton } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'

const EMPTY_TEXT = '등록된 항목이 없습니다'
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

function ShowcaseCard({ item }) {
  const tools = Array.isArray(item.tools) ? item.tools : []

  return (
    <Link to={`/showcase/${item.id}`} className="group block h-full">
      <GlassCard hover className="flex h-full flex-col gap-12">
        <figure className="aspect-video w-full overflow-hidden rounded-md bg-bg-elev">
          {item.main_img ? (
            <img
              src={item.main_img}
              alt={`${item.title} 메인 이미지`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-mono text-caption-m text-text-meta">
              NO IMAGE
            </span>
          )}
        </figure>
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <h3 className="min-w-0 text-body-l-m font-bold leading-snug text-text-pri underline-offset-4 group-hover:underline md:text-body-l-d">
            {item.title}
          </h3>
          <p className="font-mono text-caption-m text-text-meta">
            {[item.topic, item.creator].filter(Boolean).join(' · ')}
          </p>
          {tools.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-8">
              {tools.slice(0, 3).map((tool) => (
                <Tag key={tool}>{tool}</Tag>
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </Link>
  )
}

function ShowcaseGrid() {
  useTitle('쇼케이스')
  const { data, loading, error, offline } = useApi('/content/showcase', {
    params: { status: 'published' },
  })
  const items = data?.items ?? []

  return (
    <>
      <PageBanner
        titleKo="쇼케이스"
        titleEn="SHOWCASE"
        breadcrumb={[{ label: '홈', to: '/' }, { label: '쇼케이스', to: '/showcase' }]}
        nebulaX="70%"
        nebulaY="42%"
      />
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        <div className="flex flex-wrap items-center justify-between gap-16">
          <p className="font-mono text-caption-m text-text-sec">
            총 <span className="text-text-pri">{data?.total ?? items.length}</span>건
          </p>
          <div className="flex flex-wrap items-center gap-12">
            <AddButton type="showcase" to="/admin/showcase" />
            <Button variant="secondary" href="/showcase/submit">
              쇼케이스 제출
            </Button>
          </div>
        </div>
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">불러오는 중</p>
        ) : items.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {error && !offline ? '목록을 불러오지 못했습니다' : EMPTY_TEXT}
          </p>
        ) : (
          <ul className="mt-32 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24 lg:grid-cols-3">
            {items.map((item, index) => (
              <Reveal as="li" key={item.id} delay={staggerDelay(index)} className="min-w-0">
                <ShowcaseCard item={item} />
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export default ShowcaseGrid
