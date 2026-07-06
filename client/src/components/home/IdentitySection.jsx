import { useState } from 'react'
import SectionLabel from '../common/SectionLabel'
import Reveal from '../common/Reveal'
import { identity } from '../../data/identity'
import { colors, motion } from '../../styles/tokens.js'

// 에셋 이미지 부재·로드 실패 시 모노크롬 아이소메트릭 와이어프레임 폴백
function WireframeFallback({ title }) {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={title} className="h-full w-full">
      <g fill="none" stroke={colors.border.subtle}>
        <path d="M60 150 L200 80 L340 150 L200 220 Z" />
        <path d="M100 170 L240 100" />
        <path d="M160 100 L300 170" />
      </g>
      <g fill="none" stroke={colors.text.meta} strokeWidth="1.5">
        <path d="M200 90 L270 125 L270 185 L200 220 L130 185 L130 125 Z" />
        <path d="M130 125 L200 160 L270 125" />
        <path d="M200 160 L200 220" />
      </g>
    </svg>
  )
}

function IdentityFigure({ item }) {
  const [failed, setFailed] = useState(false)
  const showFallback = failed || !item.asset

  return (
    <div className="aspect-[4/3] w-full overflow-hidden bg-bg-elev">
      {showFallback ? (
        <WireframeFallback title={item.title} />
      ) : (
        <img
          src={item.asset}
          alt={item.title}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover grayscale"
        />
      )}
    </div>
  )
}

function IdentitySection() {
  if (!identity?.length) return null

  return (
    <section className="py-section-m lg:py-section-d">
      <div className="mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide">
        <Reveal>
          <SectionLabel index="01" text="우리가 일하는 방식" />
          <h2 className="mt-24 max-w-2xl text-h1-m font-extrabold leading-snug tracking-display text-text-pri lg:text-h1-d">
            AI로 배우고, 융합으로 만들고, 전시로 증명합니다
          </h2>
        </Reveal>

        <div className="mt-64 grid gap-x-24 gap-y-64 lg:grid-cols-3">
          {identity.map((item, i) => (
            <Reveal key={item.id} delay={i < 6 ? i * motion.stagger : 0}>
              <IdentityFigure item={item} />
              <p className="mt-20 font-mono text-label-m uppercase tracking-label text-text-meta lg:text-label-d">
                {item.fig}
              </p>
              <h3 className="mt-12 text-h3-m font-bold text-text-pri lg:text-h3-d">{item.title}</h3>
              <p className="mt-12 text-body-m leading-relaxed text-text-sec lg:text-body-d">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default IdentitySection
