// /programs/lectures — 특강 (포스터 그리드)
import { Link } from 'react-router-dom'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import GlassCard from '../../components/common/GlassCard'
import Reveal from '../../components/common/Reveal'
import { AddButton } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

function LectureCard({ item }) {
  const title = item.title_ko ?? item.title
  const date = (item.event_start ?? '').slice(0, 10)

  return (
    <Link to={`/programs/lectures/${item.id}`} className="group block h-full">
      <GlassCard hover className="flex h-full flex-col gap-12 p-20 md:p-28">
        <figure className="aspect-[2/3] w-full overflow-hidden rounded-md bg-bg-elev">
          {item.poster_url ? (
            <img
              src={item.poster_url}
              alt={`${title} 포스터`}
              loading="lazy"
              width={600}
              height={900}
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
  const { t } = useLang()
  useTitle(t('titles.lectures'))
  // G1.3: 페이지네이션 UI 없는 목록은 전량 요청(서버 기본 12건 상한 회피)
  const { data, loading, error, offline } = useApi('/content/lecture', {
    params: { pageSize: 100 },
  })
  const items = data?.items ?? []

  return (
    <>
      <PageBanner
        titleKo="특강"
        titleEn="LECTURES"
        breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.events') }, { label: t('titles.lectures'), to: '/programs/lectures' }]}
        nebulaX="80%"
        nebulaY="34%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        <div className="flex flex-wrap items-center justify-between gap-16">
          <p className="font-mono text-caption-m text-text-sec">
            {t('common.total')} <span className="text-text-pri">{data?.total ?? items.length}</span>{t('common.count')}
          </p>
          <AddButton type="lecture" to="/admin/posts/lecture/new" />
        </div>
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {error && !offline ? t('common.error') : t('common.empty')}
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
      </Container>
    </>
  )
}

export default Lectures
