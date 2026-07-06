import OrbitCanvas from './OrbitCanvas'
import Button from '../common/Button'
import Reveal from '../common/Reveal'
import { EditPencil } from '../content/EditControls'
import { useLang } from '../../i18n/LangContext'
import { hero, site } from '../../data/site'

// 홈 v2 #1 Hero (10_IA_V2 4절) — 기존 OrbitCanvas+카피 유지.
// 버튼 2쌍은 site_settings.hero로 오버라이드(13_CMS_SPEC 1절 '히어로 버튼'),
// settings 미수신(서버 슬립·오프라인) 시 아래 v2 기본값 렌더.
function HeroSection({ settings }) {
  const { t } = useLang()

  if (!hero) return null

  const defaultCtas = [
    { label: t('hero.ctaAbout'), to: '/about', external: false },
    { label: t('hero.ctaExhibition'), href: site.links.exhibition, external: true },
  ]
  const remoteCtas = settings?.hero?.ctas
  const ctas =
    Array.isArray(remoteCtas) && remoteCtas.length > 0 ? remoteCtas : defaultCtas

  return (
    <section className="relative flex min-h-[calc(100svh-theme(spacing.header))] flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <OrbitCanvas />
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-bg-base to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-bg-base to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        <Reveal>
          <p className="font-mono text-label-m uppercase tracking-label text-text-sec lg:text-label-d">
            {hero.eyebrow}
          </p>
          <h1 className="mt-24 font-display text-display-xl-m uppercase leading-tight tracking-display text-text-pri sm:text-display-xl-sm md:text-display-xl-md lg:text-display-xl-lg xl:text-display-xl-d">
            {(hero.titleEn || []).map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-24 text-h2-m font-extrabold leading-snug text-text-pri lg:text-h2-d">
            {hero.subKr}
          </p>
          <p className="mt-16 max-w-xl text-body-l-m leading-relaxed text-text-sec lg:text-body-l-d">
            {hero.body}
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
      </div>
    </section>
  )
}

export default HeroSection
