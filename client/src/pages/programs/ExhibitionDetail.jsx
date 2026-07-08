// /programs/exhibitions/:id — 전시회 상세 (T2 확장)
// 좌 포스터 2:3 / 우 메타 표 / RichBody / 하단 현장·작품 갤러리(라이트박스 없이 원본 새탭) / 공유.
import { useParams } from 'react-router-dom'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import ShareButton from '../../components/common/ShareButton'
import Button from '../../components/common/Button'
import ImageFrame from '../../components/common/ImageFrame'
import RichBody from '../../components/content/RichBody'
import InlineEditBar from '../../components/content/InlineEditBar'
import { EditPencil } from '../../components/content/EditControls'
import { useApi, itemOf } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang, KoreanOnlyBadge } from '../../i18n/LangContext'

// gallery jsonb 정규화: 배열 → 단일 갤러리, 객체 → 현장·작품 구분 섹션
const GALLERY_LABELS = {
  site: '현장',
  venue: '현장',
  scene: '현장',
  field: '현장',
  works: '작품',
  work: '작품',
  artworks: '작품',
}

function normalizeGalleries(gallery) {
  if (!gallery) return []
  if (Array.isArray(gallery)) {
    return gallery.length ? [{ label: '갤러리', images: gallery }] : []
  }
  return Object.entries(gallery)
    .filter(([, images]) => Array.isArray(images) && images.length > 0)
    .map(([key, images]) => ({ label: GALLERY_LABELS[key] ?? key, images }))
}

const toImage = (img) => (typeof img === 'string' ? { url: img, alt: '' } : img)

// 전시 기간: start_date~end_date(DATE 문자열), 없으면 held_at 폴백
function periodText(start, end, fallback) {
  const s = (start ?? '').slice(0, 10)
  const e = (end ?? '').slice(0, 10)
  if (s && e) return `${s} ~ ${e}`
  return s || e || (fallback ?? null)
}

function MetaRow({ label, children }) {
  return (
    <div className="flex gap-16 border-b border-border-subtle py-12">
      <dt className="w-80 shrink-0 font-mono text-caption-m text-text-meta">{label}</dt>
      <dd className="min-w-0 flex-1 text-body-m text-text-pri md:text-body-d">{children}</dd>
    </div>
  )
}

function GallerySection({ label, images, title }) {
  return (
    <section className="flex flex-col gap-16">
      <h2 className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
        {label}
      </h2>
      <ul className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-16">
        {images.map(toImage).map((img, idx) => (
          <li key={img.url} className="min-w-0">
            <a
              href={img.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block aspect-[4/3] overflow-hidden rounded-md border border-border-subtle bg-bg-elev transition-colors duration-fast ease-out hover:border-border-strong"
              aria-label={`${title} ${label} 이미지 ${idx + 1} 원본 새 탭 열기`}
            >
              <img
                src={img.url}
                alt={img.alt || `${title} ${label} 이미지 ${idx + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ExhibitionDetail() {
  const { lang, t } = useLang()
  const { id } = useParams()
  const { data, loading } = useApi(`/content/exhibitions/${id}`)
  const item = itemOf(data)
  // R1(27_I18N): EN 모드는 영문 제목·소개·본문 우선(전시회 영문 필수 — 없으면 국문 폴백 뱃지)
  const isEn = lang === 'en'
  const title = (isEn && item?.title_en) || item?.title
  const body = isEn && item?.body_en ? item.body_en : item?.body
  const intro = isEn && item?.intro_en ? item.intro_en : item?.intro
  const koFallback = isEn && item && (!item.title_en || (item.body ? !item.body_en : item.intro && !item.intro_en))
  useTitle(title ?? t('titles.exhibitions'))

  const galleries = normalizeGalleries(item?.gallery)

  return (
    <>
      <PageBanner
        titleKo="프로젝트 전시회"
        titleEn="EXHIBITIONS"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.events') },
          { label: t('titles.exhibitions'), to: '/programs/exhibitions' },
          { label: item?.title ?? t('actions.detail') },
        ]}
        nebulaX="18%"
        nebulaY="30%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        <div className="mb-32 flex flex-wrap items-center justify-end gap-16">
          <InlineEditBar type="exhibitions" manageTo="/admin/posts/exhibitions" />
        </div>
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : !item ? (
          <div className="flex flex-col items-start gap-24 py-64">
            <p className="font-mono text-caption-m text-text-meta">{t('notFoundPage.exhibitions')}</p>
            <Button variant="secondary" href="/programs/exhibitions">
              {t('common.backToList')}
            </Button>
          </div>
        ) : (
          <article className="flex min-w-0 flex-col gap-64">
            <div className="grid gap-32 lg:grid-cols-3 lg:gap-48">
              <figure className="mx-auto w-full max-w-container lg:col-span-1">
                <ImageFrame
                  src={item.poster_url}
                  alt={`${item.title} 포스터`}
                  ratio="2/3"
                  loading="eager"
                  placeholder={item.semester_label || item.title}
                />
              </figure>
              <div className="flex min-w-0 flex-col gap-24 lg:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-16">
                  <div className="flex min-w-0 flex-col gap-8">
                    {koFallback && <KoreanOnlyBadge />}
                    <h1 className="min-w-0 text-h1-m font-bold leading-snug text-text-pri md:text-h1-d">
                      {title}
                    </h1>
                  </div>
                  <EditPencil
                    type="exhibitions"
                    to={`/admin/posts/exhibitions/${id}/edit`}
                  />
                </div>
                <dl className="border-t border-border-subtle">
                  {item.semester_label && (
                    <MetaRow label={t('meta.semester')}>{item.semester_label}</MetaRow>
                  )}
                  {periodText(item.start_date, item.end_date, item.held_at) && (
                    <MetaRow label={t('meta.period')}>
                      {periodText(item.start_date, item.end_date, item.held_at)}
                    </MetaRow>
                  )}
                </dl>
                <div className="flex flex-wrap items-center gap-16">
                  {item.site_url && (
                    <Button variant="secondary" href={item.site_url} external>
                      {t('actions.exhibitionSite')}
                    </Button>
                  )}
                  <ShareButton title={item.title} />
                </div>
              </div>
            </div>
            {body ? (
              <RichBody body={body} />
            ) : intro ? (
              <p className="whitespace-pre-line text-body-m leading-relaxed text-text-sec md:text-body-d">
                {intro}
              </p>
            ) : null}
            {galleries.map((g) => (
              <GallerySection
                key={g.label}
                label={g.label}
                images={g.images}
                title={item.title}
              />
            ))}
          </article>
        )}
      </Container>
    </>
  )
}

export default ExhibitionDetail
