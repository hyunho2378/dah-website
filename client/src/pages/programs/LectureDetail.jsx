// /programs/lectures/:id — 특강 상세 (T2 포스터형)
import { useParams } from 'react-router-dom'
import PageBanner from '../../components/common/PageBanner'
import ShareButton from '../../components/common/ShareButton'
import Button from '../../components/common/Button'
import Tag from '../../components/common/Tag'
import RichBody from '../../components/editor/RichBody'
import { EditPencil } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'

const NOT_FOUND_TEXT = '특강을 찾을 수 없습니다'

function MetaRow({ label, children }) {
  return (
    <div className="flex gap-16 border-b border-border-subtle py-12">
      <dt className="w-80 shrink-0 font-mono text-caption-m text-text-meta">{label}</dt>
      <dd className="min-w-0 flex-1 text-body-m text-text-pri md:text-body-d">{children}</dd>
    </div>
  )
}

function LectureDetail() {
  const { id } = useParams()
  const { data, loading } = useApi(`/content/lecture/${id}`)
  const item = data && !data.items ? data : null
  const title = item?.title_ko ?? item?.title
  useTitle(title ?? '특강')

  const start = (item?.event_start ?? '').slice(0, 10)
  const end = (item?.event_end ?? '').slice(0, 10)
  const gallery = Array.isArray(item?.gallery) ? item.gallery : []

  return (
    <>
      <PageBanner
        titleKo="특강"
        titleEn="LECTURES"
        breadcrumb={[
          { label: '홈', to: '/' },
          { label: '프로그램' },
          { label: '특강', to: '/programs/lectures' },
          { label: title ?? '상세' },
        ]}
        nebulaX="80%"
        nebulaY="34%"
      />
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">불러오는 중</p>
        ) : !item ? (
          <div className="flex flex-col items-start gap-24 py-64">
            <p className="font-mono text-caption-m text-text-meta">{NOT_FOUND_TEXT}</p>
            <Button variant="secondary" href="/programs/lectures">
              목록으로 이동
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
                    {item.tag && <Tag>{item.tag}</Tag>}
                    <h1 className="min-w-0 text-h1-m font-bold leading-snug text-text-pri md:text-h1-d">
                      {title}
                    </h1>
                  </div>
                  <EditPencil type="lecture" to={`/admin/posts/lecture/${id}/edit`} />
                </div>
                <dl className="border-t border-border-subtle">
                  {(start || end) && (
                    <MetaRow label="일시">
                      {start && end && start !== end ? `${start} ~ ${end}` : start || end}
                    </MetaRow>
                  )}
                </dl>
                <div className="flex flex-wrap items-center gap-16">
                  {item.external_url && (
                    <Button variant="primary" href={item.external_url} external>
                      신청 페이지
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
                  갤러리
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
      </section>
    </>
  )
}

export default LectureDetail
