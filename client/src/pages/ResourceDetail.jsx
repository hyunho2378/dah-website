// /resources/:id — 자료실 상세 (N1-1, 23_PHASE11)
// NewsDetail 다크 회귀 구조 재사용: 타이틀 블록(다크 표면) + 첨부 줄(파일명·미리보기·다운로드)
// + 리치 본문(RichBody) + 이미지 갤러리. 자료실은 정적 폴백이 없어 itemOf만 사용.
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

// 첨부 줄 — 파일명 + 미리보기(새 탭) + 다운로드 (NewsDetail과 동일한 다크 토큰)
function AttachmentRow({ file, t }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-12 border-t border-border-subtle py-12">
      <span className="inline-flex min-w-0 items-center gap-8 text-small-m text-text-pri md:text-small-d">
        <Paperclip size={16} aria-hidden="true" className="shrink-0 text-text-sec" />
        <span className="truncate">{file.name || file.url.split('/').pop()}</span>
      </span>
      <span className="flex shrink-0 items-center gap-8">
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 rounded-sm border border-border-subtle px-12 py-4 text-caption-m text-text-sec transition-colors duration-fast ease-out hover:border-border-strong hover:text-text-pri"
        >
          <ExternalLink size={12} aria-hidden="true" />
          {t('news.preview')}
        </a>
        <a
          href={file.url}
          download
          className="inline-flex items-center gap-4 rounded-sm border border-border-subtle px-12 py-4 text-caption-m text-text-sec transition-colors duration-fast ease-out hover:border-border-strong hover:text-text-pri"
        >
          <Download size={12} aria-hidden="true" />
          {t('news.download')}
        </a>
      </span>
    </div>
  )
}

function ResourceDetail() {
  const { id } = useParams()
  const { t } = useLang()
  const { data, loading } = useApi(`/content/resource/${id}`)

  const post = itemOf(data)

  const title = post?.title_ko ?? post?.title ?? ''
  const tag = post?.tag ?? null
  const date = post?.date ?? (post?.created_at ?? '').slice(0, 10)
  const attachments = (post?.attachments ?? post?.files ?? []).filter((f) => f && f.url)
  const gallery = (Array.isArray(post?.gallery) ? post.gallery : []).filter(Boolean)
  useTitle(title || t('titles.resources'))

  return (
    <>
      <PageBanner
        titleKo="자료실"
        titleEn="RESOURCES"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('titles.resources'), to: '/resources' },
          { label: title || t('actions.detail') },
        ]}
        nebulaX="28%"
        nebulaY="22%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : !post ? (
          <div className="flex flex-col items-start gap-24 py-64">
            <p className="font-mono text-caption-m text-text-meta">{t('common.notFound')}</p>
            <Button variant="secondary" href="/resources">
              {t('common.backToList')}
            </Button>
          </div>
        ) : (
          <article className="mx-auto flex min-w-0 max-w-container flex-col gap-24">
            <div className="flex flex-wrap items-center gap-12">
              {!post.title_en && <KoreanOnlyBadge />}
              <EditPencil type="resource" to={`/admin/posts/resource/${id}/edit`} />
            </div>

            {/* 타이틀 블록 — 다크 표면 카드(제목 + 등록일·태그 + 첨부 줄) */}
            <header className="rounded-md border border-border-subtle bg-bg-elev p-24 md:p-40">
              <h1 className="text-h1-m font-bold leading-snug text-text-pri md:text-h1-d">
                {title}
              </h1>
              <div className="mt-16 flex flex-wrap items-center gap-12 text-small-m text-text-sec md:text-small-d">
                {date && (
                  <time dateTime={date}>
                    {t('news.registered')} {date}
                  </time>
                )}
                {tag && (
                  <span className="inline-flex items-center rounded-sm border border-border-subtle px-8 py-2 text-caption-m">
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

            {/* 본문 — 배경 그대로 + 타이틀 블록과의 사이 헤어라인, text-pri·행간 1.8 */}
            {post.body ? (
              <div className="border-t border-border-subtle pt-32">
                <RichBody body={post.body} className="rich-bright" />
              </div>
            ) : (
              <p className="border-t border-border-subtle pt-32 text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
                {t('news.resourceNoBody')}
              </p>
            )}

            {/* 이미지 갤러리 — 본문 아래 그리드, 원본은 새 탭 */}
            {gallery.length > 0 && (
              <ul className="grid grid-cols-2 gap-12 md:grid-cols-3 md:gap-16">
                {gallery.map((url, i) => (
                  <li key={url} className="min-w-0">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block overflow-hidden rounded-md border border-border-subtle bg-bg-elev"
                    >
                      <img
                        src={url}
                        alt={`${title} 이미지 ${i + 1}`}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-opacity duration-fast ease-out group-hover:opacity-90"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <footer className="flex flex-wrap items-center justify-between gap-16 border-t border-border-subtle pt-32">
              <Button variant="secondary" href="/resources">
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

export default ResourceDetail
