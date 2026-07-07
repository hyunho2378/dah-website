import { useState } from 'react'
import OrbitCanvas from './OrbitCanvas'
import Container from '../layout/Container'
import Button from '../common/Button'
import Reveal from '../common/Reveal'
import { EditPencil } from '../content/EditControls'
import { useLang } from '../../i18n/LangContext'
import { hero, site } from '../../data/site'

// F10: public/videos/hero.mp4 존재 시 영상 배경(muted loop autoplay playsinline + 60% 오버레이),
// 파일 부재(404) 또는 reduced-motion 시 OrbitCanvas 폴백.
function HeroBackground() {
  const [videoFailed, setVideoFailed] = useState(false)
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  if (videoFailed || reduced) return <OrbitCanvas />

  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/videos/hero-poster.jpg"
        onError={() => setVideoFailed(true)}
        className="h-full w-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-bg-base/60" />
    </>
  )
}

// 홈 v2 #1 Hero (10_IA_V2 4절) — 기존 OrbitCanvas+카피 유지.
// 버튼 2쌍은 site_settings.hero로 오버라이드(13_CMS_SPEC 1절 '히어로 버튼'),
// settings 미수신(서버 슬립·오프라인) 시 아래 v2 기본값 렌더.
function HeroSection({ settings }) {
  const { lang, t } = useLang()

  if (!hero) return null

  const defaultCtas = [
    { label: t('hero.ctaAbout'), to: '/about', external: false },
    { label: t('hero.ctaExhibition'), href: site.links.exhibition, external: true },
  ]
  // /settings/public 응답은 { settings, exhibition } — hero는 settings.settings.hero
  const remoteCtas = (settings?.settings?.hero ?? settings?.hero)?.ctas
  const ctas =
    Array.isArray(remoteCtas) && remoteCtas.length > 0 ? remoteCtas : defaultCtas

  return (
    <section className="relative flex min-h-[calc(100svh-theme(spacing.header))] flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <HeroBackground />
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-bg-base to-transparent" />
        {/* COSMOS-TONE 1절: 히어로→다음 섹션 심리스 — base로 향하는 하단 페이드 240px(영상 경계 은폐) */}
        <div className="absolute inset-x-0 bottom-0 h-[240px] bg-gradient-to-t from-bg-base to-transparent" />
      </div>

      <Container className="py-section-m lg:py-section-d">
        <Reveal>
          <p className="text-label-m font-medium uppercase tracking-label text-text-sec lg:text-label-d">
            {hero.eyebrow}
          </p>
          <h1 className="mt-24 font-display text-display-xl-m font-bold uppercase leading-heading tracking-display text-text-pri md:text-display-xl-d">
            {(hero.titleEn || []).map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-24 text-h2-m font-bold leading-heading text-text-pri lg:text-h2-d">
            {lang === 'en' && hero.subEn ? hero.subEn : hero.subKr}
          </p>
          {/* J4.2: KR/EN 중 긴 쪽(EN 4줄) 기준 높이 예약 — 언어 전환 시 CTA 위치 고정 */}
          <p className="mt-16 max-w-xl text-body-l-m leading-body text-text-sec lg:min-h-[4lh] lg:text-body-l-d">
            {lang === 'en' && hero.bodyEn ? hero.bodyEn : hero.body}
          </p>
          <div className="mt-40 flex flex-wrap items-center gap-16">
            {ctas.map((cta, i) => (
              <Button
                key={cta.label}
                variant={i === 0 ? 'primary' : 'secondary'}
                href={cta.href || cta.to}
                external={Boolean(cta.external)}
              >
                {cta.label}
              </Button>
            ))}
            {/* 히어로 버튼 편집(owner·admin, site_settings) — 비로그인 미렌더는 EditPencil 내부 처리 */}
            <EditPencil type="settings" to="/admin/settings" />
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export default HeroSection
