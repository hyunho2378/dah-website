import { useEffect, useState } from 'react'
import { useReveal } from '../../hooks/useReveal'

// COMPONENTS.md §1 Stat — 뷰포트 진입 시 카운트업(rAF 800ms), reduced-motion 시 즉시 최종값
const DURATION = 800

function Stat({ value, label, suffix = '' }) {
  const { ref, revealed } = useReveal()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!revealed) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (reduced) {
      setDisplay(value)
      return
    }

    let rafId = 0
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / DURATION, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(value * eased))
      if (t < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [revealed, value])

  return (
    <div ref={ref}>
      <p className="font-mono text-stat-m leading-tight text-text-pri md:text-stat-d">
        {display}
        {suffix}
      </p>
      <p className="mt-8 text-small-m text-text-sec md:text-small-d">{label}</p>
    </div>
  )
}

export default Stat
