// /showcase/:id — 쇼케이스 상세 (T3: 메인 16:9 + 메타 + 서브 이미지 2)
import { useParams } from 'react-router-dom'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import ImageFrame from '../../components/common/ImageFrame'
import ShareButton from '../../components/common/ShareButton'
import Button from '../../components/common/Button'
import Tag from '../../components/common/Tag'
import { EditPencil } from '../../components/content/EditControls'
import { useApi, itemOf } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'

function MetaRow({ label, children }) {
  return (
    <div className="flex gap-16 border-b border-border-subtle py-12">
      <dt className="w-80 shrink-0 font-mono text-caption-m text-text-meta">{label}</dt>
      <dd className="min-w-0 flex-1 text-body-m text-text-pri md:text-body-d">{children}</dd>
    </div>
  )
}

function ShowcaseDetail() {
  const { t } = useLang()
  const { id } = useParams()
  const { data, loading } = useApi(`/content/showcase/${id}`)
  const item = itemOf(data)
  useTitle(item?.title ?? t('titles.showcase'))

  const tools = Array.isArray(item?.tools) ? item.tools : []
  const subImgs = Array.isArray(item?.sub_imgs) ? item.sub_imgs : []

  return (
    <>
      <PageBanner
        titleKo="쇼케이스"
        titleEn="SHOWCASE"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('titles.showcase'), to: '/showcase' },
          { label: item?.title ?? t('actions.detail') },
        ]}
        nebulaX="70%"
        nebulaY="42%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : !item ? (
          <div className="flex flex-col items-start gap-24 py-64">
            <p className="font-mono text-caption-m text-text-meta">{t('notFoundPage.showcase')}</p>
            <Button variant="secondary" href="/showcase">
              {t('common.backToList')}
            </Button>
          </div>
        ) : (
          <article className="flex min-w-0 flex-col gap-48">
            {/* M3-3: 메인 이미지 16:9 고정 (ImageFrame) */}
            <ImageFrame
              src={item.main_img || undefined}
              alt={`${item.title} 메인 이미지`}
              ratio="16/9"
              loading="eager"
              placeholder="NO IMAGE"
            />

            <div className="flex min-w-0 flex-col gap-24">
              <div className="flex flex-wrap items-start justify-between gap-16">
                <h1 className="min-w-0 text-h1-m font-bold leading-snug text-text-pri md:text-h1-d">
                  {item.title}
                </h1>
                <EditPencil type="showcase" to="/admin/showcase" />
              </div>
              <dl className="border-t border-border-subtle">
                {item.topic && <MetaRow label={t('meta.topic')}>{item.topic}</MetaRow>}
                {item.creator && <MetaRow label={t('meta.team')}>{item.creator}</MetaRow>}
                {item.description && (
                  <MetaRow label={t('meta.description')}>
                    <span className="leading-relaxed text-text-sec">
                      {item.description}
                    </span>
                  </MetaRow>
                )}
                {tools.length > 0 && (
                  <MetaRow label={t('meta.tools')}>
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
                    {t('meta.projectLink')}
                  </Button>
                )}
                <ShareButton title={item.title} />
              </div>
            </div>

            {/* 서브 이미지 2 (16:9) */}
            {subImgs.length > 0 && (
              <section className="flex flex-col gap-16">
                <h2 className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
                  {t('sections.subImages')}
                </h2>
                <ul className="grid grid-cols-1 gap-16 md:grid-cols-2">
                  {subImgs.map((url, idx) => (
                    <li key={url} className="min-w-0">
                      <ImageFrame
                        src={url}
                        alt={`${item.title} 서브 이미지 ${idx + 1}`}
                        ratio="16/9"
                      />
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

export default ShowcaseDetail
