// /programs/exhibitions — 전시회 아카이브 (포스터 그리드, 2017~)
// 포스터는 원색 유지(grayscale 금지 — 전시 포스터 정체성). 로드 전 bg-elev, lazy, alt.
import Link from '../../components/common/LangLink'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import GlassCard from '../../components/common/GlassCard'
import Reveal from '../../components/common/Reveal'
import { AddButton } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'

// P9: 스태거 지연은 최대 6개까지만
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

function PosterCard({ item }) {
  return (
    <Link to={`/programs/exhibitions/${item.id}`} className="group block h-full">
      {/* H2: 포스터 축소 원복 — 여백은 그리드 간격+소패딩(p-12)으로만, 포스터는 크게(2:3) */}
      <GlassCard hover className="flex h-full flex-col gap-12 p-12">
        <figure className="aspect-[2/3] w-full overflow-hidden rounded-md bg-bg-elev">
          {item.poster_url ? (
            <img
              src={item.poster_url}
              alt={`${item.title} 포스터`}
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
  const { t } = useLang()
  useTitle(t('titles.exhibitions'))
  // 아카이브는 단일 페이지에 전량 노출(페이지네이션 UI 없음) — 서버 최대치(100)로 요청
  const { data, loading, error, offline } = useApi('/content/exhibitions', {
    params: { pageSize: 100 },
  })
  const items = data?.items ?? []

  return (
    <>
      <PageBanner
        titleKo="전시회"
        titleEn="EXHIBITIONS"
        breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.events') }, { label: t('titles.exhibitions'), to: '/programs/exhibitions' }]}
        nebulaX="18%"
        nebulaY="30%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        <div className="flex flex-wrap items-center justify-end gap-16">
          <AddButton type="exhibitions" to="/admin/posts/exhibitions/new" />
        </div>
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {error && !offline ? t('common.error') : t('common.empty')}
          </p>
        ) : (
          <ul className="mt-32 grid gap-16 [grid-template-columns:repeat(auto-fill,minmax(min(220px,40vw),1fr))] md:gap-24">
            {/* K2-14: 포스터 그리드 유동화 — 220px는 기존 lg 4열 카드폭(약 260px) 근사 하한,
                40vw 상한으로 모바일 2열 유지. 열 수가 뷰포트에 연속 대응(급전환 없음) */}
            {items.map((item, index) => (
              <Reveal as="li" key={item.id} delay={staggerDelay(index)} className="min-w-0">
                <PosterCard item={item} />
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </>
  )
}

export default Exhibitions
