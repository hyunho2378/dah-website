import OrbitCanvas from './OrbitCanvas'
import Button from '../common/Button'
import Reveal from '../common/Reveal'
import { hero } from '../../data/site'

function HeroSection() {
  if (!hero) return null

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
          <div className="mt-40 flex flex-wrap gap-16">
            {(hero.ctas || []).map((cta, i) => (
              <Button
                key={cta.label}
                variant={i === 0 ? 'primary' : 'secondary'}
                href={cta.href || cta.to}
                external={Boolean(cta.external)}
              >
                {cta.label}
              </Button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default HeroSection
