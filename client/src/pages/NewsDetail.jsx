// /news/:id — 공지 상세 (T1 게시글형: 메타 + 리치 콘텐츠 + 첨부 뷰어 + 공유)
// offline 폴백: src/data/notices에서 동일 id 검색 — 본문 없음, 원문 링크 안내.
import { useParams } from 'react-router-dom'
import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import ShareButton from '../components/common/ShareButton'
import Button from '../components/common/Button'
import Tag from '../components/common/Tag'
import RichBody from '../components/content/RichBody'
import AttachmentViewer from '../components/content/AttachmentViewer'
import { EditPencil } from '../components/content/EditControls'
import { useApi } from '../hooks/useApi'
import { useTitle } from '../hooks/useTitle'
import { notices } from '../data/notices'

const NOT_FOUND_TEXT = '게시글을 찾을 수 없습니다'

function NewsDetail() {
  const { id } = useParams()
  const { data, loading, offline } = useApi(`/content/notice/${id}`)

  const fallback = offline ? notices.find((n) => n.id === id) : null
  const post = data && !data.items ? data : fallback

  const title = post?.title_ko ?? post?.title ?? ''
  const tag = post?.tag ?? post?.org ?? null
  const date = post?.date ?? (post?.created_at ?? '').slice(0, 10)
  const author = post?.author ?? null
  const attachments = post?.attachments ?? post?.files ?? []
  useTitle(title || '공지사항')

  return (
    <>
      <PageBanner
        titleKo="공지사항"
        titleEn="NEWS"
        breadcrumb={[
          { label: '홈', to: '/' },
          { label: '소식' },
          { label: '공지사항', to: '/news' },
          { label: title || '상세' },
        ]}
        nebulaX="72%"
        nebulaY="18%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">불러오는 중</p>
        ) : !post ? (
          <div className="flex flex-col items-start gap-24 py-64">
            <p className="font-mono text-caption-m text-text-meta">{NOT_FOUND_TEXT}</p>
            <Button variant="secondary" href="/news">
              목록으로 이동
            </Button>
          </div>
        ) : (
          <article className="mx-auto flex min-w-0 max-w-container flex-col gap-32">
            <header className="flex flex-col gap-16 border-b border-border-subtle pb-32">
              <div className="flex flex-wrap items-center gap-12 font-mono text-caption-m text-text-meta">
                {tag && <Tag>{tag}</Tag>}
                {date && (
                  <time dateTime={date}>{date}</time>
                )}
                {author && <span>{author}</span>}
                <EditPencil type="notice" to={`/admin/posts/notice/${id}/edit`} />
              </div>
              <h1 className="text-h1-m font-bold leading-snug text-text-pri md:text-h1-d">
                {title}
              </h1>
            </header>
            {post.body ? (
              <RichBody body={post.body} />
            ) : (
              <div className="flex flex-col items-start gap-24">
                <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
                  이 공지의 본문은 원문 페이지에서 확인할 수 있습니다.
                </p>
                {post.url && (
                  <Button variant="secondary" href={post.url} external>
                    원문 보기
                  </Button>
                )}
              </div>
            )}
            {attachments.length > 0 && (
              <section className="flex flex-col gap-16">
                <h2 className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
                  첨부
                </h2>
                <AttachmentViewer attachments={attachments} />
              </section>
            )}
            <footer className="flex flex-wrap items-center justify-between gap-16 border-t border-border-subtle pt-32">
              <Button variant="secondary" href="/news">
                목록으로 이동
              </Button>
              <ShareButton title={title} />
            </footer>
          </article>
        )}
      </Container>
    </>
  )
}

export default NewsDetail
