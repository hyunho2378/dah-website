// /programs/exhibitions — 전시회 아카이브 (상단 피처드 히어로 + 포스터 그리드, 2017~)
// 포스터는 원색 유지(grayscale 금지 — 전시 포스터 정체성). ImageFrame(2:3)로 통일.
import Link from '../../components/common/LangLink'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import GlassCard from '../../components/common/GlassCard'
import ImageFrame from '../../components/common/ImageFrame'
import Button from '../../components/common/Button'
import RichBody from '../../components/content/RichBody'
import Reveal from '../../components/common/Reveal'
import InlineEditBar from '../../components/content/InlineEditBar'
import { exhibitionFullTitle } from '../../data/exhibitionTitle'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'

// P9: 스태거 지연은 최대 6개까지만
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

// 전시 기간: start_date~end_date(DATE 문자열), 없으면 held_at 폴백
function periodText(start, end, fallback) {
  const s = (start ?? '').slice(0, 10)
  const e = (end ?? '').slice(0, 10)
  if (s && e) return `${s} ~ ${e}`
  return s || e || (fallback ?? null)
}

// 피처드 전시(is_featured) — 목록 최상단 히어로 블록
// H(N2-2): 감싸는 카드(GlassCard) 제거 + 포스터 축소로 세로 높이 약 절반. 포스터는 페이지
// 좌측 마진에 붙는 좁은 컬럼(ImageFrame bg 없이 포스터만). 제목은 풀네임(ordinal 파생).
function FeaturedExhibition({ item }) {
  const fullTitle = exhibitionFullTitle(item.ordinal) || item.title
  const period = periodText(item.start_date, item.end_date, item.held_at)
  const showTitle = item.title && item.title !== fullTitle
  return (
    <div className="grid gap-24 md:grid-cols-[220px_1fr] md:gap-40 lg:grid-cols-[260px_1fr] lg:gap-48">
      <div className="w-full max-w-[220px] md:max-w-none">
        <ImageFrame
          src={item.poster_url}
          alt={`${item.title} 포스터`}
          ratio="2/3"
          loading="eager"
          placeholder={fullTitle}
        />
      </div>
      <div className="flex min-w-0 flex-col justify-center gap-16">
        <div className="flex min-w-0 flex-col gap-8">
          {/* Q2.1: 풀네임 제목 위계 상향 — displayL급, 더 볼드 */}
          <h2 className="min-w-0 text-display-l-m font-extrabold leading-tight tracking-display text-text-pri md:text-display-l-d">
            {fullTitle}
          </h2>
          {showTitle && (
            <p className="min-w-0 text-body-l-m text-text-sec md:text-body-l-d">{item.title}</p>
          )}
          {period && (
            <p className="font-mono text-caption-m text-text-meta">{period}</p>
          )}
        </div>
        {item.body ? (
          <RichBody body={item.body} />
        ) : item.intro ? (
          <p className="whitespace-pre-line text-body-m leading-relaxed text-text-sec md:text-body-d">
            {item.intro}
          </p>
        ) : null}
        {/* Q2.2: 상단 고정(피처드)일 때만 CTA. 라벨=cta_label 우선(없으면 full_title), 링크=cta_url>site_url>상세 */}
        {item.cta_show !== false && (
          <div className="mt-4">
            <Button
              variant="primary"
              href={item.cta_url || item.site_url || `/programs/exhibitions/${item.id}`}
              external={Boolean(item.cta_url || item.site_url)}
            >
              {item.cta_label || fullTitle}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function PosterCard({ item }) {
  return (
    <Link to={`/programs/exhibitions/${item.id}`} className="group block h-full">
      {/* H2: 포스터 축소 원복 — 여백은 그리드 간격+소패딩(p-12)으로만, 포스터는 크게(2:3) */}
      <GlassCard hover className="flex h-full flex-col gap-12 p-12">
        <ImageFrame
          src={item.poster_url}
          alt={`${item.title} 포스터`}
          ratio="2/3"
          placeholder={item.semester_label || item.title}
        />
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
  const featured = items.find((it) => it?.is_featured)
  const rest = items.filter((it) => it !== featured)

  return (
    <>
      <PageBanner
        titleKo="프로젝트 전시회"
        titleEn="EXHIBITIONS"
        breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.events') }, { label: t('titles.exhibitions'), to: '/programs/exhibitions' }]}
        nebulaX="18%"
        nebulaY="30%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        <div className="flex flex-wrap items-center justify-end gap-16">
          <InlineEditBar
            type="exhibitions"
            addTo="/admin/posts/exhibitions/new"
            manageTo="/admin/posts/exhibitions"
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
            {featured && (
              <Reveal className="min-w-0">
                <FeaturedExhibition item={featured} />
              </Reveal>
            )}
            {rest.length > 0 && (
              <ul className="grid gap-16 [grid-template-columns:repeat(auto-fill,minmax(min(220px,40vw),1fr))] md:gap-24">
                {/* K2-14: 포스터 그리드 유동화 — 220px는 기존 lg 4열 카드폭(약 260px) 근사 하한,
                    40vw 상한으로 모바일 2열 유지. 열 수가 뷰포트에 연속 대응(급전환 없음) */}
                {rest.map((item, index) => (
                  <Reveal as="li" key={item.id} delay={staggerDelay(index)} className="min-w-0">
                    <PosterCard item={item} />
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        )}
      </Container>
    </>
  )
}

export default Exhibitions
