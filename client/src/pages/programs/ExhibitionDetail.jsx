// /programs/exhibitions/:id — 전시회 상세 (T2 확장)
// 좌 포스터 2:3 / 우 메타 표 / RichBody / 하단 현장·작품 갤러리(라이트박스 없이 원본 새탭) / 공유.
import { useParams } from 'react-router-dom'
import PageBanner from '../../components/common/PageBanner'
import ShareButton from '../../components/common/ShareButton'
import Button from '../../components/common/Button'
import RichBody from '../../components/editor/RichBody'
import { EditPencil } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'

const NOT_FOUND_TEXT = '전시회를 찾을 수 없습니다'

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
  const { id } = useParams()
  const { data, loading } = useApi(`/content/exhibitions/${id}`)
  const item = data && !data.items ? data : null
  useTitle(item?.title ?? '전시회')

  const galleries = normalizeGalleries(item?.gallery)

  return (
    <>
      <PageBanner
        titleKo="전시회"
        titleEn="EXHIBITIONS"
        breadcrumb={[
          { label: '홈', to: '/' },
          { label: '프로그램' },
          { label: '전시회', to: '/programs/exhibitions' },
          { label: item?.title ?? '상세' },
        ]}
        nebulaX="18%"
        nebulaY="30%"
      />
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">불러오는 중</p>
        ) : !item ? (
          <div className="flex flex-col items-start gap-24 py-64">
            <p className="font-mono text-caption-m text-text-meta">{NOT_FOUND_TEXT}</p>
            <Button variant="secondary" href="/programs/exhibitions">
              목록으로 이동
            </Button>
          </div>
        ) : (
          <article className="flex min-w-0 flex-col gap-64">
            <div className="grid gap-32 lg:grid-cols-3 lg:gap-48">
              <figure className="mx-auto w-full max-w-container lg:col-span-1">
                <div className="aspect-[2/3] w-full overflow-hidden rounded-glass border border-glass-line bg-bg-elev">
                  {item.poster_url ? (
                    <img
                      src={item.poster_url}
                      alt={`${item.title} 포스터`}
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
                  <h1 className="min-w-0 text-h1-m font-bold leading-snug text-text-pri md:text-h1-d">
                    {item.title}
                  </h1>
                  <EditPencil
                    type="exhibitions"
                    to={`/admin/posts/exhibitions/${id}/edit`}
                  />
                </div>
                <dl className="border-t border-border-subtle">
                  {item.semester_label && (
                    <MetaRow label="학기">{item.semester_label}</MetaRow>
                  )}
                  {item.held_at && <MetaRow label="개최">{item.held_at}</MetaRow>}
                  {item.intro && <MetaRow label="소개">{item.intro}</MetaRow>}
                </dl>
                <div className="flex flex-wrap items-center gap-16">
                  {item.site_url && (
                    <Button variant="secondary" href={item.site_url} external>
                      전시 사이트
                    </Button>
                  )}
                  <ShareButton title={item.title} />
                </div>
              </div>
            </div>
            {item.body && <RichBody body={item.body} />}
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
      </section>
    </>
  )
}

export default ExhibitionDetail
