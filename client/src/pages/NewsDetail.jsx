// /news/:id — 공지 상세
// H3-5(37_SHEET_ROADMAP): 긴 글 가독성을 위해 J7 구조(타이틀 블록 / 첨부 줄 / 본문 /
// 이미지 갤러리)를 G4 밝은 읽기 표면(tokens.reading.*)으로 전환한다.
// 밝은 표면은 이 문서 블록 하나에만 국한 — 헤더·푸터·배너·목록 버튼 등 사이트 크롬은 다크 유지.
// 밝은 배경에서 연보라·Mid Purple은 대비 부족이라 금지 — 강조는 reading.accent 계열만 쓴다.
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

// J7: 첨부 줄 — 파일명 + 미리보기(새 탭) + 다운로드 (H3-5: 밝은 읽기 표면 토큰)
const ATTACH_LINK =
  'inline-flex items-center gap-4 rounded-sm border border-reading-hairline bg-reading-surface px-12 py-4 text-caption-m text-reading-accent transition-colors duration-fast ease-out hover:border-reading-accent hover:text-reading-accentStrong'

function AttachmentRow({ file, t }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-12 border-t border-reading-hairline py-12">
      <span className="inline-flex min-w-0 items-center gap-8 text-small-m text-reading-textStrong md:text-small-d">
        <Paperclip size={16} aria-hidden="true" className="shrink-0 text-reading-textMeta" />
        <span className="truncate">{file.name || file.url.split('/').pop()}</span>
      </span>
      <span className="flex shrink-0 items-center gap-8">
        <a href={file.url} target="_blank" rel="noopener noreferrer" className={ATTACH_LINK}>
          <ExternalLink size={12} aria-hidden="true" />
          {t('news.preview')}
        </a>
        <a href={file.url} download className={ATTACH_LINK}>
          <Download size={12} aria-hidden="true" />
          {t('news.download')}
        </a>
      </span>
    </div>
  )
}

function NewsDetail() {
  const { id } = useParams()
  const { lang, t } = useLang()
  const { data, loading, offline } = useApi(`/content/notice/${id}`)

  const fallback = offline ? notices.find((n) => n.id === id) : null
  const post = itemOf(data) ?? fallback

  // R1(27_I18N): EN 모드는 영문 필드 우선(공지는 영문 선택 — 없으면 국문 폴백 + Korean only 뱃지)
  const isEn = lang === 'en'
  const title = (isEn && post?.title_en) || post?.title_ko || post?.title || ''
  const body = isEn && post?.body_en ? post.body_en : post?.body
  const koFallback = isEn && (!post?.title_en || !post?.body_en)
  const tag = post?.tag ?? post?.org ?? null
  const date = post?.date ?? (post?.created_at ?? '').slice(0, 10)
  const attachments = (post?.attachments ?? post?.files ?? []).filter((f) => f && f.url)
  // K2-3 데이터 계약: posts.gallery = 이미지 URL 배열 → 본문 아래 갤러리
  const gallery = (Array.isArray(post?.gallery) ? post.gallery : []).filter(Boolean)
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
              {koFallback && <KoreanOnlyBadge />}
              <EditPencil type="notice" to={`/admin/posts/notice/${id}/edit`} />
            </div>

            {/* H3-5: 문서 블록 = G4 밝은 읽기 표면(제목 + 등록일·태그 + 첨부 + 본문 + 갤러리) */}
            <div className="rounded-md bg-reading-bg p-24 md:p-40">
              <header className="border-b border-reading-hairline pb-24">
                <h1 className="text-h1-m font-bold leading-snug text-reading-textStrong md:text-h1-d">
                  {title}
                </h1>
                <div className="mt-16 flex flex-wrap items-center gap-12 text-small-m text-reading-textMeta md:text-small-d">
                  {date && (
                    <time dateTime={date}>
                      {t('news.registered')} {date}
                    </time>
                  )}
                  {tag && (
                    <span className="inline-flex items-center rounded-sm border border-reading-hairline bg-reading-surface px-8 py-2 text-caption-m text-reading-accent">
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

              {/* 본문 — 밝은 표면 대비(reading.text 15.0:1) */}
              {body ? (
                <div className="pt-32">
                  <RichBody body={body} tone="light" />
                </div>
              ) : (
                <p className="pt-32 text-body-l-m leading-relaxed text-reading-textMeta md:text-body-l-d">
                  {t('news.noBody')}
                </p>
              )}

              {/* K2-3: 이미지 갤러리 — 본문 아래 그리드, 원본은 새 탭 */}
              {gallery.length > 0 && (
                <ul className="mt-32 grid grid-cols-2 gap-12 md:grid-cols-3 md:gap-16">
                  {gallery.map((url, i) => (
                    <li key={url} className="min-w-0">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block overflow-hidden rounded-md border border-reading-hairline bg-reading-surface"
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
            </div>

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
