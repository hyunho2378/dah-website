// /students/clubs/:id — 동아리 상세 (Y3-5, 33_PHASE18)
// 로고·이름·분야·소개·활동·추천 대상 + 사이트 링크 버튼(새 탭). 목록 카드 클릭으로 진입한다.
// 데이터: GET /content/club/:id. 오프라인·미존재 시 data/clubs.js 원문 폴백(id 매칭).
// 원문 보존 — 소개·활동·추천 대상 문장은 시드 원문 그대로 렌더한다.
import { useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import GlassCard from '../../components/common/GlassCard'
import ImageFrame from '../../components/common/ImageFrame'
import Tag from '../../components/common/Tag'
import { EditPencil } from '../../components/content/EditControls'
import { useApi, itemOf } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'
import { clubs as staticClubs, clubFieldEn } from '../../data/clubs'

// API 행(posts type=club, body={field,intro,activities,targets})과 정적 원문(clubs.js)을 한 형태로.
function normalize(row, isEn) {
  if (!row) return null
  const body = row.body && typeof row.body === 'object' ? row.body : {}
  const titleKo = row.title_ko ?? row.name ?? ''
  const titleEn = row.title_en ?? null
  const fieldKo = row.tag ?? row.field ?? body.field ?? null
  return {
    id: String(row.id),
    title: isEn ? titleEn || titleKo : titleKo,
    field: isEn ? row.fieldEn || clubFieldEn?.[fieldKo] || fieldKo : fieldKo,
    intro: row.intro ?? body.intro ?? null,
    activities: Array.isArray(row.activities) ? row.activities : body.activities || [],
    targets: Array.isArray(row.targets) ? row.targets : body.targets || [],
    logo: row.poster_url || null,
    hasBg: Boolean(row.has_bg),
    siteUrl: row.site_url || row.external_url || null,
    // 정적 폴백(문자열 id)은 어드민 수정 대상이 아니다 — 편집 연필은 DB 행에만
    isRemote: typeof row.id === 'number',
  }
}

function ListBlock({ title, items }) {
  if (!items?.length) return null
  return (
    <section className="flex flex-col gap-12">
      <h2 className="text-h3-m font-bold text-text-pri md:text-h3-d">{title}</h2>
      <ul className="flex flex-col gap-8">
        {items.map((line) => (
          <li
            key={line}
            className="flex gap-12 break-keep text-body-m leading-relaxed text-text-sec md:text-body-d"
          >
            <span aria-hidden="true" className="text-purple-mid">
              ·
            </span>
            <span className="min-w-0">{line}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ClubDetail() {
  const { id } = useParams()
  const { lang, t } = useLang()
  const isEn = lang === 'en'
  const { data, loading, error, offline } = useApi(`/content/club/${id}`)

  const remote = itemOf(data)
  const fallback = staticClubs?.find((c) => c.id === id) || null
  const club = normalize(remote || fallback, isEn)

  useTitle(club?.title || t('titles.clubs'))

  return (
    <>
      <PageBanner
        titleKo={club?.title || '동아리'}
        titleEn="CLUB"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.activities') },
          { label: t('titles.clubs'), to: '/students/clubs' },
        ]}
        nebulaX="30%"
        nebulaY="20%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        {!club ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {loading
              ? t('common.loading')
              : error && !offline
                ? t('common.error')
                : t('common.empty')}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-32 lg:grid-cols-[320px,minmax(0,1fr)] lg:items-start lg:gap-48">
            {/* 로고 + 사이트 링크 */}
            <div className="flex flex-col gap-16">
              <GlassCard className="p-24">
                <ImageFrame
                  src={club.logo || undefined}
                  alt={`${club.title} 로고`}
                  ratio="4/3"
                  contain
                  bg={club.hasBg}
                  placeholder={
                    <span aria-hidden="true" className="font-mono text-h1-m text-text-meta">
                      {(club.title || '').trim().charAt(0)}
                    </span>
                  }
                />
              </GlassCard>
              {club.siteUrl && (
                <a
                  href={club.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-8 rounded-sm bg-button-primary px-24 text-body-m font-semibold text-button-primaryText shadow-btn transition duration-fast ease-out hover:bg-button-primaryHover hover:shadow-btn-hover active:bg-button-primaryPressed md:h-48 md:text-body-d"
                >
                  사이트 바로가기
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
            </div>

            {/* 이름·분야·소개·활동 */}
            <div className="flex min-w-0 flex-col gap-32">
              <div className="flex flex-col gap-12">
                <div className="flex items-start justify-between gap-12">
                  <h1 className="min-w-0 text-h1-m font-bold leading-tight text-text-pri md:text-h1-d">
                    {club.title}
                  </h1>
                  {club.isRemote && (
                    <EditPencil type="club" to={`/admin/posts/club/${club.id}/edit`} />
                  )}
                </div>
                {club.field && <Tag>{club.field}</Tag>}
                {club.intro && (
                  <p className="break-keep text-body-m leading-relaxed text-text-sec md:text-body-d">
                    {club.intro}
                  </p>
                )}
              </div>
              <ListBlock title="활동 내용" items={club.activities} />
              <ListBlock title="추천 대상" items={club.targets} />
            </div>
          </div>
        )}
      </Container>
    </>
  )
}

export default ClubDetail
