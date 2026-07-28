// /students/clubs — 동아리 (로고 중심 카드 그리드, 데스크탑 4열)
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from '../../components/common/LangLink'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import GlassCard from '../../components/common/GlassCard'
import ImageFrame from '../../components/common/ImageFrame'
import Reveal from '../../components/common/Reveal'
import Tag from '../../components/common/Tag'
import { DragHandle, useDragSort } from '../../components/common/DragHandle'
import InlineEditBar from '../../components/content/InlineEditBar'
import { EditPencil } from '../../components/content/EditControls'
import { useApi, api } from '../../hooks/useApi'
import { useContentVisibility } from '../../hooks/useContentVisibility'
import { useTitle } from '../../hooks/useTitle'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../i18n/LangContext'
import { clubs as staticClubs, clubFieldEn } from '../../data/clubs'
const staggerDelay = (index) => (index < 6 ? index * 80 : 0)

// F 폴백: 서버 오프라인·빈 응답 시 data/clubs.js 원문(동아리 4종)을 카드로 렌더
const FALLBACK_CLUBS = (staticClubs ?? []).map((c) => ({
  id: c.id,
  title: c.name,
  tag: c.field,
  fieldEn: c.fieldEn,
  intro: c.intro,
}))

function ClubCard({ item, sorting }) {
  const { lang } = useLang()
  // R3: EN 모드는 영문 동아리명(title_en) 우선 — '더 인스튜디오' 등 EN 미표시 버그 해결
  const title =
    lang === 'en' ? item.title_en || item.title_ko || item.title : item.title_ko ?? item.title
  // R3: EN 분야 라벨 — 정적 폴백은 fieldEn, API 항목은 clubFieldEn 맵(국문→영문), 매핑 없으면 국문
  const field =
    lang === 'en' ? item.fieldEn || clubFieldEn?.[item.tag] || item.tag : item.tag
  // API 항목은 소개가 body.intro에 들어 있다(시드 계약). 정적 폴백은 평면 intro.
  const intro = item.intro ?? item.body?.intro ?? null

  // Q3: 로고 크게 중앙 상단. contain으로 원본 비율 유지(잘림 없음). 투명 PNG는 has_bg 배경 프레임.
  const content = (
    <>
      <div className="w-full">
        <ImageFrame
          src={item.poster_url || undefined}
          alt={`${title} 로고`}
          ratio="4/3"
          contain
          bg={Boolean(item.has_bg)}
          placeholder={
            <span aria-hidden="true" className="font-mono text-h1-m text-text-meta">
              {(title || '').trim().charAt(0)}
            </span>
          }
        />
      </div>
      <h3 className="text-h3-m font-bold leading-snug text-text-pri underline-offset-4 group-hover:underline md:text-h3-d">
        {title}
      </h3>
      {field && <Tag>{field}</Tag>}
      {intro && (
        <p className="text-small-m leading-relaxed text-text-sec md:text-small-d">{intro}</p>
      )}
    </>
  )

  // Y3-5: 카드 클릭 = 동아리 상세 진입(외부 사이트 직행 폐기 — 사이트 링크는 상세의 버튼).
  // 중첩 앵커 금지 — EditPencil(내부 링크)은 카드 링크 밖에 둔다. 정렬 모드에선 링크 비활성.
  return (
    <GlassCard hover glow className="flex h-full flex-col p-20 md:p-24">
      {sorting && (
        <div className="mb-8 flex justify-center">
          <DragHandle />
        </div>
      )}
      {sorting ? (
        <div className="flex min-w-0 flex-1 flex-col items-center gap-12 text-center">
          {content}
        </div>
      ) : (
        <Link
          to={`/students/clubs/${item.id}`}
          className="group flex min-w-0 flex-1 flex-col items-center gap-12 text-center"
        >
          {content}
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="text-text-meta transition-colors duration-fast ease-out group-hover:text-text-pri"
          />
        </Link>
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

  const [sorting, setSorting] = useState(false)
  const [items, setItems] = useState([])
  useEffect(() => {
    setItems(data?.items?.length ? data.items : FALLBACK_CLUBS)
  }, [data])

  // Y3-3: 비공개 전환 시 일반 방문자에겐 목록 미렌더(편집 권한자는 유지)
  const { isPublic } = useContentVisibility()
  const { canEdit } = useAuth()
  const hidden = !isPublic('club') && !canEdit('club')

  // 정렬: 드롭 시 새 순서대로 sort 재계산 — 값이 달라진 항목만 순차 PUT (12_BACKEND api.put)
  const { dragIndex, overIndex, rowProps } = useDragSort((from, to) => {
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setItems(next)
    next.forEach((it, i) => {
      if (it.sort !== i) api.put(`/admin/content/club/${it.id}`, { sort: i }).catch(() => {})
    })
  })

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
        <InlineEditBar
          type="club"
          addTo="/admin/posts/club/new"
          manageTo="/admin/posts/club"
          sortable
          sorting={sorting}
          onToggleSort={() => setSorting((s) => !s)}
        />
        {hidden ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.empty')}</p>
        ) : loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {error && !offline ? t('common.error') : t('common.empty')}
          </p>
        ) : (
          <ul className="mt-32 grid grid-cols-1 gap-16 sm:grid-cols-2 md:gap-24 lg:grid-cols-4">
            {/* J8: 데스크탑 4열 — 로고 크게, 스크롤 없이 한눈에 4개 */}
            {items.map((item, index) => (
              <li
                key={item.id}
                className={`min-w-0 rounded-glass transition-opacity duration-fast ${
                  dragIndex === index ? 'opacity-40' : ''
                } ${
                  overIndex === index && dragIndex !== null && dragIndex !== index
                    ? 'bg-glass-bg'
                    : ''
                }`}
                {...(sorting ? rowProps(index) : {})}
              >
                <Reveal delay={sorting ? 0 : staggerDelay(index)}>
                  <ClubCard item={item} sorting={sorting} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  )
}

export default Clubs
