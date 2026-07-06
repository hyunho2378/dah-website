import Container from '../layout/Container'
import Button from '../common/Button'
import Reveal from '../common/Reveal'
import { finalCta } from '../../data/site'

// F4: 반전(화이트) 블록 제거 → 다크 배경 유지 한 줄 CTA(제목 + 버튼 2).
// 버튼은 공통 Button(primary/secondary) 재사용.
function FinalCTA() {
  if (!finalCta?.titleEn) return null

  return (
    <section className="border-t border-border-subtle">
      <Container className="py-section-m lg:py-section-d">
        <Reveal>
          <h2 className="font-display text-display-l-m font-bold uppercase leading-heading tracking-display text-text-pri lg:text-display-l-d">
            {finalCta.titleEn}
          </h2>
          <p className="mt-24 text-body-l-m leading-body text-text-sec lg:text-body-l-d">
            {finalCta.subKr}
          </p>
          <div className="mt-40 flex flex-wrap gap-16">
            {(finalCta.ctas || []).map((cta, i) => (
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
      </Container>
    </section>
  )
}

export default FinalCTA
