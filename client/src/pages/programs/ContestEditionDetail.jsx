// /programs/contests/:id/:edition — 공모전 회차 상세
// 한 공모전(posts 1행)의 body.editions 중 한 회차를 단독 페이지로 보여준다.
// 레이아웃은 ContestDetail(좌 포스터 2:3 / 우 메타)과 같은 패턴.
//
// :edition 매칭 규칙 — semester_label 우선, 없거나 못 찾으면 배열 인덱스.
// 목록 카드는 최신 학기순으로 정렬해 보여주므로 정렬 후 인덱스로 링크를 걸면
// 원본 배열과 어긋난다. 학기 라벨을 키로 쓰면 그 어긋남이 생기지 않는다.
import { useParams } from 'react-router-dom'
import Link from '../../components/common/LangLink'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import ShareButton from '../../components/common/ShareButton'
import Button from '../../components/common/Button'
import ImageFrame from '../../components/common/ImageFrame'
import { EditPencil } from '../../components/content/EditControls'
import { useApi, itemOf } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang, KoreanOnlyBadge } from '../../i18n/LangContext'

function MetaRow({ label, children }) {
  return (
    <div className="flex gap-16 border-b border-border-subtle py-12">
      <dt className="w-80 shrink-0 font-mono text-caption-m text-text-meta">{label}</dt>
      <dd className="min-w-0 flex-1 text-body-m text-text-pri md:text-body-d">{children}</dd>
    </div>
  )
}

// 주최 원문: 배열이면 줄바꿈 join, 문자열이면 그대로(whitespace-pre-line로 여러 줄 보존)
function hostText(host) {
  if (!host) return null
  if (Array.isArray(host)) return host.join('\n')
  return String(host)
}

/** 라우트 파라미터 → editions 중 한 항목. 학기 라벨 우선, 실패 시 인덱스 */
export function findEdition(editions, key) {
  if (!Array.isArray(editions) || !editions.length) return null
  const byLabel = editions.find((e) => String(e.semester_label ?? '') === String(key))
  if (byLabel) return byLabel
  const i = Number(key)
  return Number.isInteger(i) && i >= 0 && i < editions.length ? editions[i] : null
}

function ContestEditionDetail() {
  const { lang, t } = useLang()
  const { id, edition: editionKey } = useParams()
  const { data, loading } = useApi(`/content/contest/${id}`)
  const item = itemOf(data)

  const editions = Array.isArray(item?.body?.editions) ? item.body.editions : []
  const edition = findEdition(editions, editionKey)

  const isEn = lang === 'en'
  const contestTitle = (isEn && item?.title_en) || item?.title_ko || item?.title
  // 회차 제목이 원본. EN은 title_en 우선, 없으면 국문 폴백 + Korean only 뱃지.
  const koTitle =
    edition?.title ||
    (edition?.semester_label ? `${edition.semester_label} ${contestTitle ?? ''}`.trim() : contestTitle)
  const title = (isEn && edition?.title_en) || koTitle
  const koFallback = isEn && Boolean(edition) && !edition.title_en

  useTitle(title ?? t('titles.contests'))

  const host = hostText(item?.body?.host)

  return (
    <>
      <PageBanner
        titleKo="공모전"
        titleEn="CONTESTS"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.events') },
          { label: t('titles.contests'), to: '/programs/contests' },
          { label: title ?? t('actions.detail') },
        ]}
        nebulaX="46%"
        nebulaY="14%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : !edition ? (
          <div className="flex flex-col items-start gap-24 py-64">
            <p className="font-mono text-caption-m text-text-meta">{t('notFoundPage.contests')}</p>
            <Button variant="secondary" href="/programs/contests">
              {t('common.backToList')}
            </Button>
          </div>
        ) : (
          <article className="flex min-w-0 flex-col gap-64">
            <div className="grid gap-32 lg:grid-cols-3 lg:gap-48">
              <figure className="w-full lg:col-span-1">
                <ImageFrame
                  src={edition.poster_url}
                  alt={`${title} 포스터`}
                  ratio="2/3"
                  loading="eager"
                  placeholder={edition.semester_label || title}
                />
              </figure>
              <div className="flex min-w-0 flex-col gap-24 lg:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-16">
                  <div className="flex min-w-0 flex-col gap-12">
                    {koFallback && (
                      <div className="flex flex-wrap items-center gap-8">
                        <KoreanOnlyBadge />
                      </div>
                    )}
                    <h1 className="min-w-0 text-h1-m font-bold leading-snug text-text-pri md:text-h1-d">
                      {title}
                    </h1>
                  </div>
                  <EditPencil type="contest" to={`/admin/posts/contest/${id}/edit`} />
                </div>
                {host && (
                  <div className="flex min-w-0 flex-col gap-4">
                    <p className="font-mono text-caption-m uppercase tracking-label text-text-meta">
                      {t('meta.host')}
                    </p>
                    <p className="whitespace-pre-line text-body-m leading-relaxed text-text-sec md:text-body-d">
                      {host}
                    </p>
                  </div>
                )}
                <dl className="border-t border-border-subtle">
                  {edition.semester_label && (
                    <MetaRow label={t('meta.semester')}>{edition.semester_label}</MetaRow>
                  )}
                  {edition.period && <MetaRow label={t('meta.period')}>{edition.period}</MetaRow>}
                </dl>
                <div className="flex flex-wrap items-center gap-16">
                  {edition.link && (
                    <Button variant="secondary" href={edition.link} external>
                      {t('actions.detail')}
                    </Button>
                  )}
                  <ShareButton title={title} />
                </div>
              </div>
            </div>
            <div>
              <Link
                to="/programs/contests"
                className="font-mono text-caption-m text-text-sec underline underline-offset-4 transition-colors duration-fast ease-out hover:text-text-pri"
              >
                {t('common.backToList')}
              </Link>
            </div>
          </article>
        )}
      </Container>
    </>
  )
}

export default ContestEditionDetail
