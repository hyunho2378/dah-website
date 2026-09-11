// /programs/lectures — 특강 (포스터 그리드)
import Link from '../../components/common/LangLink'
import Container from '../../components/layout/Container'
import GlassCard from '../../components/common/GlassCard'
import ImageFrame from '../../components/common/ImageFrame'
import Reveal from '../../components/common/Reveal'
import { AddButton } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

function LectureCard({ item, isEn, t }) {
  const title = (isEn && item.title_en) || item.title_ko || item.title
  const date = (item.event_start ?? '').slice(0, 10)

  return (
    <Link to={`/programs/lectures/${item.id}`} className="group block h-full">
      {/* H2: 포스터 축소 원복 — p-12 소패딩만, 포스터 크게 유지 */}
      <GlassCard hover className="flex h-full flex-col gap-12 p-12">
        <ImageFrame
          src={item.poster_url || undefined}
          alt={`${title} ${t('aria.poster')}`}
          ratio="2/3"
          placeholder={title}
        />
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
  const { lang, t } = useLang()
  const isEn = lang === 'en'
  useTitle(t('titles.lectures'))
  // G1.3: 페이지네이션 UI 없는 목록은 전량 요청(서버 기본 12건 상한 회피)
  const { data, loading, error, offline } = useApi('/content/lecture', {
    params: { pageSize: 100 },
  })
  const items = data?.items ?? []

  return (
      <Container as="section" className="pb-section-m pt-page-start-m md:pt-page-start-d lg:pb-section-d">
        {/* 공모전과 같은 목록 규칙: 배너의 브레드크럼·중복 제목을 제외하고
            헤더 아래에서 바로 관리 동선과 목록을 시작한다. */}
        <h1 className="sr-only">{t('titles.lectures')}</h1>
        <div className="flex flex-wrap items-center justify-end gap-16">
          <AddButton type="lecture" to="/admin/posts/lecture/new" />
        </div>
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {error && !offline ? t('common.error') : t('common.empty')}
          </p>
        ) : (
          <ul className="mt-32 grid gap-16 [grid-template-columns:repeat(auto-fill,minmax(min(220px,40vw),1fr))] md:gap-24">
            {/* K2-14: 포스터 그리드 유동화 — 220px = 기존 lg 4열 카드폭 근사 하한, 40vw로 모바일 2열 유지 */}
            {items.map((item, index) => (
              <Reveal as="li" key={item.id} delay={staggerDelay(index)} className="min-w-0">
                <LectureCard item={item} isEn={isEn} t={t} />
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
  )
}

export default Lectures
