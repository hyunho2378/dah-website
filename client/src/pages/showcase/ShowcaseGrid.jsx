// /showcase — 웹&앱 쇼케이스 그리드 (published만, 16:9 카드)
import Link from '../../components/common/LangLink'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import GlassCard from '../../components/common/GlassCard'
import ImageFrame from '../../components/common/ImageFrame'
import Reveal from '../../components/common/Reveal'
import Tag from '../../components/common/Tag'
import Button from '../../components/common/Button'
import InlineEditBar from '../../components/content/InlineEditBar'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

function ShowcaseCard({ item }) {
  const tools = Array.isArray(item.tools) ? item.tools : []

  return (
    <Link to={`/showcase/${item.id}`} className="group block h-full">
      <GlassCard hover className="flex h-full flex-col gap-16 p-24 md:p-32">
        {/* M3-3: 카드 메인 이미지 16:9 (사진 → object-cover로 꽉 채움) — 카드 최상단 지배 요소 */}
        <ImageFrame
          src={item.main_img || undefined}
          alt={`${item.title} 메인 이미지`}
          ratio="16/9"
          placeholder="NO IMAGE"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-12">
          <h3 className="min-w-0 text-h3-m font-bold leading-snug text-text-pri underline-offset-4 group-hover:underline md:text-h3-d">
            {item.title}
          </h3>
          <p className="font-mono text-caption-m text-text-meta">
            {[item.topic, item.creator].filter(Boolean).join(' · ')}
          </p>
          {tools.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-8 pt-4">
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
  const { t } = useLang()
  useTitle(t('titles.showcase'))
  // G1.3: 페이지네이션 UI 없는 목록은 전량 요청(서버 기본 12건 상한 회피)
  const { data, loading, error, offline } = useApi('/content/showcase', {
    params: { status: 'published', pageSize: 100 },
  })
  const items = data?.items ?? []

  return (
    <>
      <PageBanner
        titleKo="쇼케이스"
        titleEn="SHOWCASE"
        breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('titles.showcase'), to: '/showcase' }]}
        nebulaX="70%"
        nebulaY="42%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        <div className="flex flex-wrap items-center justify-end gap-16">
          <InlineEditBar type="showcase" manageTo="/admin/showcase" />
          <Button variant="secondary" href="/showcase/submit">
            {t('actions.submitShowcase')}
          </Button>
        </div>
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {error && !offline ? t('common.error') : t('common.empty')}
          </p>
        ) : (
          <ul className="mt-32 grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24 lg:grid-cols-3">
            {/* M3-3: 그리드 밀도↑·이미지 비중↑ — md 2열 / lg 3열 고정 */}
            {items.map((item, index) => (
              <Reveal as="li" key={item.id} delay={staggerDelay(index)} className="min-w-0">
                <ShowcaseCard item={item} />
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </>
  )
}

export default ShowcaseGrid
