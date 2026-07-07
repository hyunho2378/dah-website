// /students/clubs — 동아리 (카드 그리드)
import { ArrowUpRight } from 'lucide-react'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import GlassCard from '../../components/common/GlassCard'
import Reveal from '../../components/common/Reveal'
import Tag from '../../components/common/Tag'
import { AddButton, EditPencil } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'
import { clubs as staticClubs } from '../../data/clubs'
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

// F 폴백: 서버 오프라인·빈 응답 시 data/clubs.js 원문(동아리 4종)을 카드로 렌더
const FALLBACK_CLUBS = (staticClubs ?? []).map((c) => ({
  id: c.id,
  title: c.name,
  tag: c.field,
  intro: c.intro,
}))

function ClubCard({ item }) {
  const title = item.title_ko ?? item.title

  // J8: 로고 중앙 상단 + 이름·설명 중앙 정렬. 로고 없으면 이니셜 플레이스홀더.
  const content = (
    <>
      <div className="flex h-96 w-96 items-center justify-center overflow-hidden rounded-sm border border-border-subtle bg-bg-panel">
        {item.poster_url ? (
          <img
            src={item.poster_url}
            alt={`${title} 로고`}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        ) : (
          <span aria-hidden="true" className="font-mono text-h2-m text-text-meta">
            {(title || '').trim().charAt(0)}
          </span>
        )}
      </div>
      <h3 className="text-h3-m font-bold leading-snug text-text-pri underline-offset-4 group-hover:underline md:text-h3-d">
        {title}
      </h3>
      {item.tag && <Tag>{item.tag}</Tag>}
      {item.intro && (
        <p className="text-small-m leading-relaxed text-text-sec md:text-small-d">
          {item.intro}
        </p>
      )}
    </>
  )

  // 중첩 앵커 금지 — EditPencil(내부 링크)은 외부 링크 앵커 밖에 둔다
  return (
    <GlassCard hover className="flex h-full flex-col p-20 md:p-28">
      {item.external_url ? (
        <a
          href={item.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-w-0 flex-1 flex-col items-center gap-16 text-center"
        >
          {content}
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="text-text-meta transition-colors duration-fast ease-out group-hover:text-text-pri"
          />
        </a>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col items-center gap-16 text-center">
          {content}
        </div>
      )}
      <div className="mt-16 flex justify-end">
        <EditPencil type="club" to={`/admin/posts/club/${item.id}/edit`} />
      </div>
    </GlassCard>
  )
}

function Clubs() {
  const { t } = useLang()
  useTitle(t('titles.clubs'))
  // G1.3: 페이지네이션 UI 없는 목록은 전량 요청(서버 기본 12건 상한 회피)
  const { data, loading, error, offline } = useApi('/content/club', {
    params: { pageSize: 100 },
  })
  const items = data?.items?.length ? data.items : FALLBACK_CLUBS

  return (
    <>
      <PageBanner
        titleKo="동아리"
        titleEn="CLUBS"
        breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.activities') }, { label: t('titles.clubs'), to: '/students/clubs' }]}
        nebulaX="64%"
        nebulaY="26%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        <div className="flex flex-wrap items-center justify-end gap-16">
          <AddButton type="club" to="/admin/posts/club/new" />
        </div>
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {error && !offline ? t('common.error') : t('common.empty')}
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
      </Container>
    </>
  )
}

export default Clubs
