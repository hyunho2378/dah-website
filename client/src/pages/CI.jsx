// /about/ci — CI(브랜드 아이덴티티) 공개 페이지 (26_CI_PAGE, 진흥원 gidp_ci 구조 이식)
// 섹션 순서: 의미(심벌+다운로드 3) → 구성요소별 의미 → 로고가이드 → 시그니처 → 전용색상 → 그래픽모티브.
// DB 단일 문서(GET /content/ci, body) 우선, 없으면 정적 폴백(data/ci). 이미지 슬롯은 /ci/ 정적 경로,
// 파일 부재 시 ImageFrame 플레이스홀더. 다운로드는 HEAD 존재 확인 후 부재 시 "준비 중" 비활성.
import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import SectionLabel from '../components/common/SectionLabel'
import Reveal from '../components/common/Reveal'
import GlassCard from '../components/common/GlassCard'
import ImageFrame from '../components/common/ImageFrame'
import { EditPencil } from '../components/content/EditControls'
import { useApi, firstItem } from '../hooks/useApi'
import { useTitle } from '../hooks/useTitle'
import { useLang } from '../i18n/LangContext'
import { ci } from '../data/ci'
import { motion } from '../styles/tokens'

const staggerDelay = (i) => (i < 6 ? i * motion.stagger : 0)
const isHex = (v) => /^#[0-9a-fA-F]{6}$/.test(v || '')

function CI() {
  const { t } = useLang()
  useTitle(t('titles.ci'))

  // DB 단일 문서 body 우선, 미기동·미등록이면 정적 폴백 — 필드 단위 병합으로 undefined 안전
  const { data } = useApi('/content/ci')
  const body = firstItem(data)?.body
  const source = body && typeof body === 'object' ? { ...ci, ...body } : ci
  const intro = source.intro
  const symbol = source.symbol || null
  const downloads = Array.isArray(source.downloads) ? source.downloads : []
  const elements = Array.isArray(source.elements) ? source.elements : []
  const logoGuide = Array.isArray(source.logoGuide) ? source.logoGuide : []
  const signatures = Array.isArray(source.signatures) ? source.signatures : []
  const colors = Array.isArray(source.colors) ? source.colors : []
  const motif = source.motif || null

  // 다운로드 정적 파일 존재 확인 — 부재(404·SPA 폴백 text/html) 시 버튼 비활성("준비 중").
  const downloadUrls = downloads.map((d) => d.url || '').join('|')
  const [available, setAvailable] = useState({})
  useEffect(() => {
    const urls = downloads.map((d) => d.url).filter(Boolean)
    if (urls.length === 0) {
      setAvailable({})
      return undefined
    }
    let alive = true
    Promise.all(
      urls.map((u) =>
        fetch(u, { method: 'HEAD' })
          .then((r) => [u, r.ok && !(r.headers.get('content-type') || '').includes('text/html')])
          .catch(() => [u, false])
      )
    ).then((pairs) => {
      if (alive) setAvailable(Object.fromEntries(pairs))
    })
    return () => {
      alive = false
    }
    // downloadUrls(정적 URL 목록)만 실제 의존 — downloads 배열 참조는 매 렌더 갱신되므로 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadUrls])

  return (
    <>
      <PageBanner
        titleKo="CI"
        titleEn="CI"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.about'), to: '/about' },
          { label: t('titles.ci'), to: '/about/ci' },
        ]}
        nebulaX="55%"
        nebulaY="35%"
      />

      <div className="pb-section-m md:pb-section-d">
        {/* 01 CI의 의미 — 대표 심벌 + 설명 + 다운로드 3버튼 */}
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
          </Reveal>
          <div className="mt-32 grid grid-cols-1 items-start gap-24 md:mt-48 md:grid-cols-[minmax(0,320px)_1fr] md:gap-48">
            <Reveal>
              <ImageFrame
                src={symbol || undefined}
                alt={t('ci.title')}
                ratio="1/1"
                bg
                placeholder={t('ci.imagePending')}
              />
            </Reveal>
            <Reveal delay={motion.stagger}>
              <div className="flex flex-col gap-24">
                {intro && (
                  <p className="max-w-[720px] whitespace-pre-line text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
                    {intro}
                  </p>
                )}
                {downloads.length > 0 && (
                  <div className="flex flex-wrap gap-12">
                    {downloads.map((d, i) => {
                      const ready = Boolean(d.url) && available[d.url] === true
                      return ready ? (
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
                          <span className="font-mono text-caption-m">({t('ci.comingSoon')})</span>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </Container>

        {/* 02 구성요소별 의미 — 곡선 / 컬러 / 워드마크 */}
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
                    {el.image && (
                      <ImageFrame
                        src={el.image}
                        alt={el.title || ''}
                        ratio="16/9"
                        bg
                        placeholder={t('ci.imagePending')}
                      />
                    )}
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

        {/* 03 로고가이드 — 한글 타입 / 영문 타입 (가로형) */}
        {logoGuide.length > 0 && (
          <Container as="section" className="pt-section-m md:pt-section-d">
            <Reveal>
              <SectionLabel index="03" text="LOGO GUIDE" />
              <h2 className="mt-24 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
                {t('ci.logoGuide')}
              </h2>
            </Reveal>
            <div className="mt-32 grid grid-cols-1 gap-16 md:mt-48 md:grid-cols-2 md:gap-24">
              {logoGuide.map((logo, i) => (
                <Reveal key={logo.title || i} delay={staggerDelay(i)}>
                  <div className="flex flex-col gap-12">
                    <ImageFrame
                      src={logo.image || undefined}
                      alt={logo.title || ''}
                      ratio="16/9"
                      bg
                      placeholder={t('ci.imagePending')}
                    />
                    <p className="text-small-m text-text-sec md:text-small-d">{logo.title}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        )}

        {/* 04 시그니처 — 상하조합형 / 좌우조합형 */}
        {signatures.length > 0 && (
          <Container as="section" className="pt-section-m md:pt-section-d">
            <Reveal>
              <SectionLabel index="04" text="SIGNATURE" />
              <h2 className="mt-24 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
                {t('ci.signatures')}
              </h2>
            </Reveal>
            <div className="mt-32 grid grid-cols-1 gap-16 md:mt-48 md:grid-cols-2 md:gap-24">
              {signatures.map((sig, i) => (
                <Reveal key={sig.title || i} delay={staggerDelay(i)}>
                  <div className="flex flex-col gap-12">
                    <ImageFrame
                      src={sig.image || undefined}
                      alt={sig.title || ''}
                      ratio="16/9"
                      bg
                      placeholder={t('ci.imagePending')}
                    />
                    <p className="text-small-m text-text-sec md:text-small-d">{sig.title}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        )}

        {/* 05 전용색상 — Main / Secondary (hex 미지정 시 중성 슬롯) */}
        {colors.length > 0 && (
          <Container as="section" className="pt-section-m md:pt-section-d">
            <Reveal>
              <SectionLabel index="05" text="COLORS" />
              <h2 className="mt-24 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
                {t('ci.colors')}
              </h2>
            </Reveal>
            <div className="mt-32 grid grid-cols-2 gap-16 md:mt-48 md:grid-cols-4 md:gap-24">
              {colors.map((c, i) => {
                const valid = isHex(c.hex)
                return (
                  <Reveal key={c.name || c.hex || i} delay={staggerDelay(i)}>
                    <div className="flex flex-col gap-8">
                      {/* 색상 스와치의 backgroundColor는 콘텐츠(CI 전용색상 hex)라 인라인 스타일 불가피 */}
                      <div
                        className={`aspect-[3/2] w-full rounded-md border border-border-subtle ${
                          valid ? '' : 'bg-bg-elev'
                        }`}
                        style={valid ? { backgroundColor: c.hex } : undefined}
                      />
                      <div className="flex flex-col gap-4">
                        <p className="text-small-m font-semibold text-text-pri md:text-small-d">
                          {c.name}
                        </p>
                        <p className="font-mono text-caption-m uppercase text-text-meta">
                          {valid ? c.hex : t('ci.pending')}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </Container>
        )}

        {/* 06 그래픽모티브 — 이미지 슬롯 */}
        {motif && (
          <Container as="section" className="pt-section-m md:pt-section-d">
            <Reveal>
              <SectionLabel index="06" text="GRAPHIC MOTIF" />
              <h2 className="mt-24 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
                {t('ci.motif')}
              </h2>
            </Reveal>
            <div className="mt-32 max-w-[720px] md:mt-48">
              <Reveal>
                <ImageFrame
                  src={motif || undefined}
                  alt={t('ci.motif')}
                  ratio="16/9"
                  bg
                  placeholder={t('ci.imagePending')}
                />
              </Reveal>
            </div>
          </Container>
        )}
      </div>
    </>
  )
}

export default CI
