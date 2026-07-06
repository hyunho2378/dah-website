import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '../common/Reveal'
import { finalCta } from '../../data/site'

// 반전 블록 전용 버튼: 공통 Button은 다크 표면 기준이라 여기서만 색을 뒤집는다.
// border.subtle(백색 8%)의 반전 대응으로 text.invert 톤에 동일 비율 알파를 적용.
const BTN_BASE =
  'inline-flex cursor-pointer items-center gap-8 rounded-sm px-24 py-12 text-body-m font-semibold transition-colors duration-base ease-out focus-visible:outline-text-invert lg:text-body-d'
const BTN_VARIANT = {
  primary: 'bg-bg-base text-text-pri hover:bg-bg-elev',
  secondary: 'border border-text-invert/10 text-text-invert hover:border-text-invert/20',
}

function CtaButton({ cta, variant }) {
  const cls = `${BTN_BASE} ${BTN_VARIANT[variant]}`
  const href = cta.href || cta.to

  if (cta.external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {cta.label}
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    )
  }
  return (
    <Link to={href} className={cls}>
      {cta.label}
    </Link>
  )
}

function FinalCTA() {
  if (!finalCta?.titleEn) return null

  return (
    <section className="bg-bg-invert">
      <div className="mx-auto w-full max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        <Reveal>
          <h2 className="font-display text-display-l-m uppercase leading-tight tracking-display text-text-invert lg:text-display-l-d">
            {finalCta.titleEn}
          </h2>
          <p className="mt-24 text-body-l-m font-regular text-text-invert lg:text-body-l-d">
            {finalCta.subKr}
          </p>
          <div className="mt-40 flex flex-wrap gap-16">
            {(finalCta.ctas || []).map((cta, i) => (
              <CtaButton key={cta.label} cta={cta} variant={i === 0 ? 'primary' : 'secondary'} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default FinalCTA
