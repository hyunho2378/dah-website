// /news/:id — 공지 상세 (J7 재설계)
// 상단 타이틀 블록(밝은 카드): 제목 크게 + 등록일·태그 한 줄 + 첨부 줄(파일명·미리보기·다운로드).
// 그 아래 본문(밝은 카드, 어두운 텍스트, 행간 1.8). 구글 사이트 원문 아웃바운드 없음(J7).
import { useParams } from 'react-router-dom'
import { Download, ExternalLink, Paperclip } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import ShareButton from '../components/common/ShareButton'
import Button from '../components/common/Button'
import RichBody from '../components/content/RichBody'
import { EditPencil } from '../components/content/EditControls'
import { useApi, itemOf } from '../hooks/useApi'
import { useTitle } from '../hooks/useTitle'
import { useLang, KoreanOnlyBadge } from '../i18n/LangContext'
import { notices } from '../data/notices'

// J7: 첨부 줄 — 파일명 + 미리보기(새 탭) + 다운로드
function AttachmentRow({ file, t }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-12 border-t border-border-invert py-12">
      <span className="inline-flex min-w-0 items-center gap-8 text-small-m text-text-invert md:text-small-d">
        <Paperclip size={16} aria-hidden="true" className="shrink-0" />
        <span className="truncate">{file.name || file.url.split('/').pop()}</span>
      </span>
      <span className="flex shrink-0 items-center gap-8">
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 rounded-sm border border-border-invert px-12 py-4 text-caption-m text-text-invert transition-opacity duration-fast ease-out hover:opacity-70"
        >
          <ExternalLink size={12} aria-hidden="true" />
          {t('news.preview')}
        </a>
        <a
          href={file.url}
          download
          className="inline-flex items-center gap-4 rounded-sm border border-border-invert px-12 py-4 text-caption-m text-text-invert transition-opacity duration-fast ease-out hover:opacity-70"
        >
          <Download size={12} aria-hidden="true" />
          {t('news.download')}
        </a>
      </span>
    </div>
  )
}

function NewsDetail() {
  const { id } = useParams()
  const { t } = useLang()
  const { data, loading, offline } = useApi(`/content/notice/${id}`)

  const fallback = offline ? notices.find((n) => n.id === id) : null
  const post = itemOf(data) ?? fallback

  const title = post?.title_ko ?? post?.title ?? ''
  const tag = post?.tag ?? post?.org ?? null
  const date = post?.date ?? (post?.created_at ?? '').slice(0, 10)
  const attachments = (post?.attachments ?? post?.files ?? []).filter((f) => f && f.url)
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
          <article className="mx-auto flex min-w-0 max-w-container flex-col gap-24">
            <div className="flex flex-wrap items-center gap-12">
              {!post.title_en && <KoreanOnlyBadge />}
              <EditPencil type="notice" to={`/admin/posts/notice/${id}/edit`} />
            </div>

            {/* J7: 타이틀 블록 — 밝은 카드(제목 + 등록일·태그 + 첨부 줄) */}
            <header className="rounded-md bg-bg-invert p-24 md:p-40">
              <h1 className="text-h1-m font-bold leading-snug text-text-invert md:text-h1-d">
                {title}
              </h1>
              <div className="mt-16 flex flex-wrap items-center gap-12 text-small-m text-text-invert/70 md:text-small-d">
                {date && (
                  <time dateTime={date}>
                    {t('news.registered')} {date}
                  </time>
                )}
                {tag && (
                  <span className="inline-flex items-center rounded-sm border border-border-invert px-8 py-2 text-caption-m">
                    {tag}
                  </span>
                )}
              </div>
              {attachments.length > 0 && (
                <div className="mt-20">
                  {attachments.map((file) => (
                    <AttachmentRow key={file.url} file={file} t={t} />
                  ))}
                </div>
              )}
            </header>

            {/* J7: 본문 — 밝은 카드, 어두운 텍스트, 행간 1.8 */}
            {post.body ? (
              <div className="rounded-md bg-bg-invert p-24 md:p-40">
                <RichBody body={post.body} className="rich-on-light leading-[1.8]" />
              </div>
            ) : (
              <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
                {t('news.noBody')}
              </p>
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
