// /showcase/:id — 쇼케이스 상세 (T3: 메인 16:9 + 메타 + 서브 이미지 2)
import { useParams } from 'react-router-dom'
import PageBanner from '../../components/common/PageBanner'
import ShareButton from '../../components/common/ShareButton'
import Button from '../../components/common/Button'
import Tag from '../../components/common/Tag'
import { EditPencil } from '../../components/admin/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'

const NOT_FOUND_TEXT = '쇼케이스 항목을 찾을 수 없습니다'

function MetaRow({ label, children }) {
  return (
    <div className="flex gap-16 border-b border-border-subtle py-12">
      <dt className="w-80 shrink-0 font-mono text-caption-m text-text-meta">{label}</dt>
      <dd className="min-w-0 flex-1 text-body-m text-text-pri md:text-body-d">{children}</dd>
    </div>
  )
}

function ShowcaseDetail() {
  const { id } = useParams()
  const { data, loading } = useApi(`/content/showcase/${id}`)
  const item = data && !data.items ? data : null
  useTitle(item?.title ?? '쇼케이스')

  const tools = Array.isArray(item?.tools) ? item.tools : []
  const subImgs = Array.isArray(item?.sub_imgs) ? item.sub_imgs : []

  return (
    <>
      <PageBanner
        titleKo="쇼케이스"
        titleEn="SHOWCASE"
        breadcrumb={[
          { label: '홈', to: '/' },
          { label: '쇼케이스', to: '/showcase' },
          { label: item?.title ?? '상세' },
        ]}
        nebulaX="70%"
        nebulaY="42%"
      />
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">불러오는 중</p>
        ) : !item ? (
          <div className="flex flex-col items-start gap-24 py-64">
            <p className="font-mono text-caption-m text-text-meta">{NOT_FOUND_TEXT}</p>
            <Button variant="secondary" href="/showcase">
              목록으로 이동
            </Button>
          </div>
        ) : (
          <article className="flex min-w-0 flex-col gap-48">
            {/* 메인 이미지 16:9 고정 */}
            <figure className="aspect-video w-full overflow-hidden rounded-glass border border-glass-line bg-bg-elev">
              {item.main_img ? (
                <img
                  src={item.main_img}
                  alt={`${item.title} 메인 이미지`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-mono text-caption-m text-text-meta">
                  NO IMAGE
                </span>
              )}
            </figure>

            <div className="flex min-w-0 flex-col gap-24">
              <div className="flex flex-wrap items-start justify-between gap-16">
                <h1 className="min-w-0 text-h1-m font-bold leading-snug text-text-pri md:text-h1-d">
                  {item.title}
                </h1>
                <EditPencil type="showcase" to="/admin/showcase" />
              </div>
              <dl className="border-t border-border-subtle">
                {item.topic && <MetaRow label="주제">{item.topic}</MetaRow>}
                {item.creator && <MetaRow label="팀·개인">{item.creator}</MetaRow>}
                {item.description && (
                  <MetaRow label="설명">
                    <span className="leading-relaxed text-text-sec">
                      {item.description}
                    </span>
                  </MetaRow>
                )}
                {tools.length > 0 && (
                  <MetaRow label="활용 툴">
                    <span className="flex flex-wrap gap-8">
                      {tools.map((tool) => (
                        <Tag key={tool}>{tool}</Tag>
                      ))}
                    </span>
                  </MetaRow>
                )}
              </dl>
              <div className="flex flex-wrap items-center gap-16">
                {item.link && (
                  <Button variant="primary" href={item.link} external>
                    프로젝트 링크
                  </Button>
                )}
                <ShareButton title={item.title} />
              </div>
            </div>

            {/* 서브 이미지 2 (16:9) */}
            {subImgs.length > 0 && (
              <section className="flex flex-col gap-16">
                <h2 className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
                  서브 이미지
                </h2>
                <ul className="grid grid-cols-1 gap-16 md:grid-cols-2">
                  {subImgs.map((url, idx) => (
                    <li key={url} className="min-w-0">
                      <figure className="aspect-video w-full overflow-hidden rounded-md border border-border-subtle bg-bg-elev">
                        <img
                          src={url}
                          alt={`${item.title} 서브 이미지 ${idx + 1}`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </figure>
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

export default ShowcaseDetail
