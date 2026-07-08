// /about/ci — CI(브랜드 아이덴티티) 공개 페이지 (N2-4, 23_PHASE11)
// DB 단일 문서(GET /content/ci, body {intro,elements,logoGuide,colors,downloads}) 우선,
// 없으면 정적 폴백(data/ci). 이미지 슬롯은 전부 플레이스홀더 프레임(ImageFrame src null).
// 색상 스와치의 backgroundColor는 콘텐츠(CI 전용색상 hex) 자체라 인라인 스타일 불가피(데이터 구동).
import { Download } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import SectionLabel from '../components/common/SectionLabel'
import Reveal from '../components/common/Reveal'
import GlassCard from '../components/common/GlassCard'
import ImageFrame from '../components/common/ImageFrame'
import { EditPencil } from '../components/content/EditControls'
import { useApi, itemOf } from '../hooks/useApi'
import { useTitle } from '../hooks/useTitle'
import { useLang } from '../i18n/LangContext'
import { ci } from '../data/ci'
import { motion } from '../styles/tokens'

const staggerDelay = (i) => (i < 6 ? i * motion.stagger : 0)

function CI() {
  const { t } = useLang()
  useTitle(t('titles.ci'))

  // DB 단일 문서 body 우선, 미기동·미등록이면 정적 폴백 — 필드 단위 병합으로 undefined 안전
  const { data } = useApi('/content/ci')
  const body = itemOf(data)?.body
  const source = body && typeof body === 'object' ? { ...ci, ...body } : ci
  const intro = source.intro
  const elements = Array.isArray(source.elements) ? source.elements : []
  const logoGuide = Array.isArray(source.logoGuide) ? source.logoGuide : []
  const colors = Array.isArray(source.colors) ? source.colors : []
  const downloads = Array.isArray(source.downloads) ? source.downloads : []

  return (
    <>
      <PageBanner
        titleKo="CI"
        titleEn="CI"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.people'), to: '/about' },
          { label: t('titles.ci'), to: '/about/ci' },
        ]}
        nebulaX="55%"
        nebulaY="35%"
      />

      <div className="pb-section-m md:pb-section-d">
        {/* 01 CI의 의미 */}
        <Container as="section" className="pt-section-m md:pt-section-d">
          <Reveal>
            <div className="flex flex-wrap items-center gap-12">
              <SectionLabel index="01" text="IDENTITY" />
              {/* CI 단일 문서 편집(admin+, 13_CMS_SPEC 1절). 비로그인 미렌더 */}
              <EditPencil type="ci" to="/admin/ci" />
            </div>
            <h2 className="mt-24 text-h1-m font-extrabold leading-tight tracking-display text-text-pri md:mt-32 md:text-h1-d">
              {t('ci.title')}
            </h2>
            {intro && (
              <p className="mt-24 max-w-[960px] whitespace-pre-line text-body-l-m leading-relaxed text-text-sec md:mt-32 md:text-body-l-d">
                {intro}
              </p>
            )}
          </Reveal>
        </Container>

        {/* 02 구성요소별 의미 */}
        {elements.length > 0 && (
          <Container as="section" className="pt-section-m md:pt-section-d">
            <Reveal>
              <SectionLabel index="02" text="ELEMENTS" />
              <h2 className="mt-24 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
                {t('ci.elements')}
              </h2>
            </Reveal>
            <div className="mt-32 grid grid-cols-1 gap-16 md:mt-48 md:grid-cols-3 md:gap-24">
              {elements.map((el, i) => (
                <Reveal key={el.title || i} delay={staggerDelay(i)}>
                  <GlassCard className="flex h-full flex-col gap-16 p-24 md:p-32">
                    <ImageFrame
                      src={el.image || undefined}
                      alt={el.title || ''}
                      ratio="16/9"
                      bg
                      placeholder={el.title}
                    />
                    <div className="flex flex-col gap-8">
                      <h3 className="text-h3-m font-bold leading-snug text-text-pri md:text-h3-d">
                        {el.title}
                      </h3>
                      {el.text && (
                        <p className="text-body-m leading-relaxed text-text-sec md:text-body-d">
                          {el.text}
                        </p>
                      )}
                    </div>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </Container>
        )}

        {/* 03 로고 가이드 */}
        {logoGuide.length > 0 && (
          <Container as="section" className="pt-section-m md:pt-section-d">
            <Reveal>
              <SectionLabel index="03" text="LOGO GUIDE" />
              <h2 className="mt-24 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
                {t('ci.logoGuide')}
              </h2>
            </Reveal>
            <div className="mt-32 grid grid-cols-1 gap-16 md:mt-48 md:grid-cols-3 md:gap-24">
              {logoGuide.map((logo, i) => (
                <Reveal key={logo.title || i} delay={staggerDelay(i)}>
                  <div className="flex flex-col gap-12">
                    <ImageFrame
                      src={logo.image || undefined}
                      alt={logo.title || ''}
                      ratio="16/9"
                      bg
                      placeholder={logo.title}
                    />
                    <p className="text-small-m text-text-sec md:text-small-d">{logo.title}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        )}

        {/* 04 전용 색상 */}
        {colors.length > 0 && (
          <Container as="section" className="pt-section-m md:pt-section-d">
            <Reveal>
              <SectionLabel index="04" text="COLORS" />
              <h2 className="mt-24 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
                {t('ci.colors')}
              </h2>
            </Reveal>
            <div className="mt-32 grid grid-cols-2 gap-16 md:mt-48 md:grid-cols-4 md:gap-24">
              {colors.map((c, i) => (
                <Reveal key={c.hex || c.name || i} delay={staggerDelay(i)}>
                  <div className="flex flex-col gap-8">
                    <div
                      className="aspect-[3/2] w-full rounded-md border border-border-subtle"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="flex flex-col gap-4">
                      <p className="text-small-m font-semibold text-text-pri md:text-small-d">
                        {c.name}
                      </p>
                      <p className="font-mono text-caption-m uppercase text-text-meta">{c.hex}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        )}

        {/* 05 다운로드 (url 없으면 비활성) */}
        {downloads.length > 0 && (
          <Container as="section" className="pt-section-m md:pt-section-d">
            <Reveal>
              <SectionLabel index="05" text="DOWNLOADS" />
              <h2 className="mt-24 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
                {t('ci.downloads')}
              </h2>
            </Reveal>
            <div className="mt-32 flex flex-wrap gap-12 md:mt-48 md:gap-16">
              {downloads.map((d, i) =>
                d.url ? (
                  <a
                    key={d.label || i}
                    href={d.url}
                    download
                    className="inline-flex h-11 cursor-pointer items-center gap-8 rounded-sm border border-glass-line bg-glass-bg px-24 text-body-m font-semibold text-text-pri backdrop-blur-glass-mobile transition-colors duration-fast ease-out hover:bg-glass-strong md:h-48 md:backdrop-blur-glass md:text-body-d"
                  >
                    <Download size={16} aria-hidden="true" />
                    {d.label}
                  </a>
                ) : (
                  <span
                    key={d.label || i}
                    aria-disabled="true"
                    className="inline-flex h-11 cursor-not-allowed items-center gap-8 rounded-sm border border-border-subtle px-24 text-body-m font-semibold text-text-meta md:h-48 md:text-body-d"
                  >
                    <Download size={16} aria-hidden="true" />
                    {d.label}
                  </span>
                )
              )}
            </div>
          </Container>
        )}
      </div>
    </>
  )
}

export default CI
