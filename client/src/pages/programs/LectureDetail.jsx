// /programs/lectures/:id — 특강 상세 (T2 포스터형)
import { useParams } from 'react-router-dom'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import ShareButton from '../../components/common/ShareButton'
import Button from '../../components/common/Button'
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

function LectureDetail() {
  const { lang, t } = useLang()
  const { id } = useParams()
  const { data, loading } = useApi(`/content/lecture/${id}`)
  const item = itemOf(data)
  // R1(27_I18N): EN 모드는 영문 제목·본문 우선(특강 영문 필수 — 없으면 국문 폴백 뱃지)
  const isEn = lang === 'en'
  const title = (isEn && item?.title_en) || item?.title_ko || item?.title
  const body = isEn && item?.body_en ? item.body_en : item?.body
  const koFallback = isEn && item && (!item.title_en || !item.body_en)
  useTitle(title ?? t('titles.lectures'))

  const start = (item?.event_start ?? '').slice(0, 10)
  const end = (item?.event_end ?? '').slice(0, 10)
  const gallery = Array.isArray(item?.gallery) ? item.gallery : []

  return (
    <>
      <PageBanner
        titleKo="특강"
        titleEn="LECTURES"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.events') },
          { label: t('titles.lectures'), to: '/programs/lectures' },
          { label: title ?? t('actions.detail') },
        ]}
        nebulaX="80%"
        nebulaY="34%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : !item ? (
          <div className="flex flex-col items-start gap-24 py-64">
            <p className="font-mono text-caption-m text-text-meta">{t('notFoundPage.lectures')}</p>
            <Button variant="secondary" href="/programs/lectures">
              {t('common.backToList')}
            </Button>
          </div>
        ) : (
          <article className="flex min-w-0 flex-col gap-64">
            <div className="grid gap-32 lg:grid-cols-3 lg:gap-48">
              <figure className="w-full lg:col-span-1">
                <div className="aspect-[2/3] w-full overflow-hidden rounded-glass border border-glass-line bg-bg-elev">
                  {item.poster_url ? (
                    <img
                      src={item.poster_url}
                      alt={`${title} 포스터`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center font-mono text-caption-m text-text-meta">
                      NO POSTER
                    </span>
                  )}
                </div>
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
                  <EditPencil type="lecture" to={`/admin/posts/lecture/${id}/edit`} />
                </div>
                <dl className="border-t border-border-subtle">
                  {(start || end) && (
                    <MetaRow label={t('meta.datetime')}>
                      {start && end && start !== end ? `${start} ~ ${end}` : start || end}
                    </MetaRow>
                  )}
                </dl>
                <div className="flex flex-wrap items-center gap-16">
                  {item.external_url && (
                    <Button variant="primary" href={item.external_url} external>
                      {t('actions.applyLecture')}
                    </Button>
                  )}
                  <ShareButton title={title} />
                </div>
              </div>
            </div>
            {body && <RichBody body={body} />}
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

export default LectureDetail
