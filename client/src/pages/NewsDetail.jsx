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
import { useApi, itemOf } from '../hooks/useApi'
import { useTitle } from '../hooks/useTitle'
import { useLang, KoreanOnlyBadge } from '../i18n/LangContext'
import { notices } from '../data/notices'

function NewsDetail() {
  const { id } = useParams()
  const { t } = useLang()
  const { data, loading, offline } = useApi(`/content/notice/${id}`)

  const fallback = offline ? notices.find((n) => n.id === id) : null
  const post = itemOf(data) ?? fallback

  // en 번역(title_en/body_en)이 있으면 영문 렌더, 없으면 국문 + Korean only 뱃지
  const title = post?.title_ko ?? post?.title ?? ''
  const tag = post?.tag ?? post?.org ?? null
  const date = post?.date ?? (post?.created_at ?? '').slice(0, 10)
  const author = post?.author ?? null
  const attachments = post?.attachments ?? post?.files ?? []
  // G2: external_url 항목도 내부 상세를 먼저 열고, 원문은 버튼으로 이동
  const originalUrl = post?.external_url ?? post?.url ?? null
  useTitle(title || t('titles.notices'))

  return (
    <>
      <PageBanner
        titleKo="공지사항"
        titleEn="NEWS"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('titles.notices'), to: '/news' },
          { label: title || t('actions.detail') },
        ]}
        nebulaX="72%"
        nebulaY="18%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : !post ? (
          <div className="flex flex-col items-start gap-24 py-64">
            <p className="font-mono text-caption-m text-text-meta">{t('common.notFound')}</p>
            <Button variant="secondary" href="/news">
              {t('common.backToList')}
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
                {!post.title_en && <KoreanOnlyBadge />}
                <EditPencil type="notice" to={`/admin/posts/notice/${id}/edit`} />
              </div>
              <h1 className="text-h1-m font-bold leading-snug text-text-pri md:text-h1-d">
                {title}
              </h1>
            </header>
            {post.body ? (
              <RichBody body={post.body} />
            ) : (
              <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
                {t('news.bodyElsewhere')}
              </p>
            )}
            {/* G2: 원문 링크가 있으면 본문 유무와 무관하게 원문 보기 버튼 노출 */}
            {originalUrl && (
              <div>
                <Button variant="secondary" href={originalUrl} external>
                  {t('common.viewOriginal')}
                </Button>
              </div>
            )}
            {attachments.length > 0 && (
              <section className="flex flex-col gap-16">
                <h2 className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
                  {t('common.attachments')}
                </h2>
                <AttachmentViewer attachments={attachments} />
              </section>
            )}
            <footer className="flex flex-wrap items-center justify-between gap-16 border-t border-border-subtle pt-32">
              <Button variant="secondary" href="/news">
                {t('common.backToList')}
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
