// /students/clubs — 동아리 (카드 그리드)
import { ArrowUpRight } from 'lucide-react'
import PageBanner from '../../components/common/PageBanner'
import GlassCard from '../../components/common/GlassCard'
import Reveal from '../../components/common/Reveal'
import Tag from '../../components/common/Tag'
import { AddButton, EditPencil } from '../../components/admin/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'

const EMPTY_TEXT = '등록된 항목이 없습니다'
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

function ClubCard({ item }) {
  const title = item.title_ko ?? item.title

  const content = (
    <>
      {item.poster_url && (
        <figure className="aspect-video w-full overflow-hidden rounded-md bg-bg-elev">
          <img
            src={item.poster_url}
            alt={`${title} 이미지`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </figure>
      )}
      <div className="flex items-start justify-between gap-12">
        <h3 className="min-w-0 text-h3-m font-bold leading-snug text-text-pri underline-offset-4 group-hover:underline md:text-h3-d">
          {title}
        </h3>
        {item.external_url && (
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="mt-4 shrink-0 text-text-meta transition-colors duration-fast ease-out group-hover:text-text-pri"
          />
        )}
      </div>
      {item.tag && (
        <div>
          <Tag>{item.tag}</Tag>
        </div>
      )}
      {item.intro && (
        <p className="text-small-m leading-relaxed text-text-sec md:text-small-d">
          {item.intro}
        </p>
      )}
    </>
  )

  // 중첩 앵커 금지 — EditPencil(내부 링크)은 외부 링크 앵커 밖에 둔다
  return (
    <GlassCard hover className="flex h-full flex-col gap-12">
      {item.external_url ? (
        <a
          href={item.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-w-0 flex-1 flex-col gap-16"
        >
          {content}
        </a>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col gap-16">{content}</div>
      )}
      <div className="flex justify-end">
        <EditPencil type="club" to={`/admin/posts/club/${item.id}/edit`} />
      </div>
    </GlassCard>
  )
}

function Clubs() {
  useTitle('동아리')
  const { data, loading, error, offline } = useApi('/content/club')
  const items = data?.items ?? []

  return (
    <>
      <PageBanner
        titleKo="동아리"
        titleEn="CLUBS"
        breadcrumb={[{ label: '홈', to: '/' }, { label: '학생' }, { label: '동아리', to: '/students/clubs' }]}
        nebulaX="64%"
        nebulaY="26%"
      />
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        <div className="flex flex-wrap items-center justify-between gap-16">
          <p className="font-mono text-caption-m text-text-sec">
            총 <span className="text-text-pri">{data?.total ?? items.length}</span>건
          </p>
          <AddButton type="club" to="/admin/posts/club/new" />
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
                <ClubCard item={item} />
              </Reveal>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export default Clubs
