// /programs/contests/:id — 공모전 상세 (T2 포스터형)
// 좌 포스터 2:3 / 우 메타 표 / RichBody / 하단 갤러리(원본 새탭) / 공유 / 외부 접수 버튼.
import { useParams } from 'react-router-dom'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import ShareButton from '../../components/common/ShareButton'
import Button from '../../components/common/Button'
import ImageFrame from '../../components/common/ImageFrame'
import Tag from '../../components/common/Tag'
import RichBody from '../../components/content/RichBody'
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

function ContestDetail() {
  const { lang, t } = useLang()
  const { id } = useParams()
  const { data, loading } = useApi(`/content/contest/${id}`)
  const item = itemOf(data)
  // R1(27_I18N): EN 모드는 영문 제목 우선(공모전 영문 필수 — 없으면 국문 폴백 뱃지). 본문은 구조화(주최·회차)라 EN 대역 없음
  const isEn = lang === 'en'
  const title = (isEn && item?.title_en) || item?.title_ko || item?.title
  const koFallback = isEn && item && !item.title_en
  useTitle(title ?? t('titles.contests'))

  const start = (item?.event_start ?? '').slice(0, 10)
  const end = (item?.event_end ?? '').slice(0, 10)
  const gallery = Array.isArray(item?.gallery) ? item.gallery : []
  const host = hostText(item?.body?.host)
  const editions = Array.isArray(item?.body?.editions) ? item.body.editions : []
  const posterUrl = item?.poster_url || editions[0]?.poster_url

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
        ) : !item ? (
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
                  src={posterUrl}
                  alt={`${title} 포스터`}
                  ratio="2/3"
                  loading="eager"
                  placeholder={title}
                />
              </figure>
              <div className="flex min-w-0 flex-col gap-24 lg:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-16">
                  <div className="flex min-w-0 flex-col gap-12">
                    <div className="flex flex-wrap items-center gap-8">
                      {item.tag && <Tag>{item.tag}</Tag>}
                      {koFallback && <KoreanOnlyBadge />}
                    </div>
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
                  {(start || end) && (
                    <MetaRow label={t('meta.period')}>
                      {start && end ? `${start} ~ ${end}` : start || end}
                    </MetaRow>
                  )}
                </dl>
                <div className="flex flex-wrap items-center gap-16">
                  {item.external_url && (
                    <Button variant="primary" href={item.external_url} external>
                      {t('actions.applyExternal')}
                    </Button>
                  )}
                  <ShareButton title={title} />
                </div>
              </div>
            </div>
            {item.body && <RichBody body={item.body} />}
            {gallery.length > 0 && (
              <section className="flex flex-col gap-16">
                <h2 className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
                  {t('sections.gallery')}
                </h2>
                <ul className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-16">
                  {gallery
                    .map((img) => (typeof img === 'string' ? { url: img, alt: '' } : img))
                    .map((img, idx) => (
                      <li key={img.url} className="min-w-0">
                        <a
                          href={img.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block aspect-[4/3] overflow-hidden rounded-md border border-border-subtle bg-bg-elev transition-colors duration-fast ease-out hover:border-border-strong"
                          aria-label={`${title} 갤러리 이미지 ${idx + 1} 원본 새 탭 열기`}
                        >
                          <img
                            src={img.url}
                            alt={img.alt || `${title} 갤러리 이미지 ${idx + 1}`}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </a>
                      </li>
                    ))}
                </ul>
              </section>
            )}
          </article>
        )}
      </Container>
    </>
  )
}

export default ContestDetail
