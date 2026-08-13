// /programs/contests — 공모전 목록
// 51_CONTEST_SPLIT: 공모전 1건 = post 1건(= 옛 회차 하나). 이전에는 한 post의 body.editions를
// 풀어 카드를 그렸으나, 이제 목록 응답 자체가 카드 하나에 대응한다.
// 정렬은 서버가 학기 라벨 내림차순으로 내려준다(content-config의 contest orderBy).
import Link from '../../components/common/LangLink'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import GlassCard from '../../components/common/GlassCard'
import ImageFrame from '../../components/common/ImageFrame'
import Reveal from '../../components/common/Reveal'
import InlineEditBar from '../../components/content/InlineEditBar'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'

const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

// 기간 표시 — period 컬럼이 원본이고, 없으면 게시글 일정(event_start~event_end)으로 폴백
function periodText(item) {
  if (item.period) return item.period
  const s = (item.event_start ?? '').slice(0, 10)
  const e = (item.event_end ?? '').slice(0, 10)
  if (s && e) return `${s} ~ ${e}`
  return s || e || null
}

function ContestCard({ item, isEn }) {
  const title = (isEn && item.title_en) || item.title_ko || item.title
  const period = periodText(item)

  return (
    <Link to={`/programs/contests/${item.id}`} className="group block h-full">
      <GlassCard hover className="flex h-full flex-col gap-12 p-12">
        <ImageFrame
          src={item.poster_url}
          alt={`${title} 포스터`}
          ratio="2/3"
          placeholder={item.semester_label || title}
        />
        <div className="flex min-w-0 flex-col gap-4">
          {item.semester_label && (
            <p className="font-mono text-caption-m text-text-meta">{item.semester_label}</p>
          )}
          <h3 className="min-w-0 text-body-m font-bold leading-snug text-text-pri underline-offset-4 group-hover:underline md:text-body-d">
            {title}
          </h3>
          {period && <p className="font-mono text-caption-m text-text-meta">{period}</p>}
        </div>
      </GlassCard>
    </Link>
  )
}

function Contests() {
  const { lang, t } = useLang()
  useTitle(t('titles.contests'))
  const isEn = lang === 'en'
  // G1.3: 페이지네이션 UI 없는 목록은 전량 요청(서버 기본 12건 상한 회피)
  const { data, loading, error, offline } = useApi('/content/contest', {
    params: { pageSize: 100 },
  })
  const items = data?.items ?? []

  return (
    <>
      <PageBanner
        titleKo="공모전"
        titleEn="CONTESTS"
        breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.events') }, { label: t('titles.contests'), to: '/programs/contests' }]}
        nebulaX="46%"
        nebulaY="14%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        <div className="flex flex-wrap items-center justify-end gap-16">
          <InlineEditBar
            type="contest"
            addTo="/admin/posts/contest/new"
            manageTo="/admin/posts/contest"
          />
        </div>
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {error && !offline ? t('common.error') : t('common.empty')}
          </p>
        ) : (
          <ul className="mt-32 grid gap-16 [grid-template-columns:repeat(auto-fill,minmax(min(220px,40vw),1fr))] md:gap-24">
            {items.map((item, index) => (
              <li key={item.id} className="min-w-0">
                <Reveal delay={staggerDelay(index)} className="h-full min-w-0">
                  <ContestCard item={item} isEn={isEn} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  )
}

export default Contests
