import { useEffect, useRef } from 'react'
import { cosmos } from '../../styles/tokens'

// 11_DESIGN_V2 4절 StarField — 우주 파운데이션 캔버스
// App 레벨 공통 1개 인스턴스(BR이 마운트). 페이지별 재마운트 금지.
// - 정적 별 + 미세 트윙클, 파티클 200 이하
// - 스크롤 패럴랙스 0.2배, cosmos.depth0 바탕 위, 콘텐츠 뒤(-z)
// - dpr 상한 2, 탭 비활성 시 rAF 중단
// - prefers-reduced-motion: 트윙클·패럴랙스 정지, 정적 렌더 유지
// 성능 규칙(11_DESIGN_V2 2절): 이 레이어는 backdrop-filter 미사용(캔버스 페인트만)
const MAX_STARS = 200
const PARALLAX = 0.2
const DPR_CAP = 2

function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let stars = []
    let rafId = 0
    let width = 0
    let height = 0
    let scrollY = window.scrollY
    let reduced = reducedQuery.matches

    const makeStars = () => {
      // 뷰포트 면적 비례, 상한 200 (11_DESIGN_V2 4절)
      const count = Math.min(MAX_STARS, Math.round((width * height) / 9000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.4 + Math.random() * 1.1, // 반지름 0.4~1.5px
        base: 0.25 + Math.random() * 0.55, // 기본 알파
        amp: 0.08 + Math.random() * 0.18, // 트윙클 진폭(미세)
        speed: 0.4 + Math.random() * 1.2, // 트윙클 각속도(rad/s)
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height)
      const offset = reduced ? 0 : scrollY * PARALLAX
      ctx.fillStyle = cosmos.star
      for (const s of stars) {
        const y = (((s.y * height - offset) % height) + height) % height
        const alpha = reduced
          ? s.base
          : s.base + Math.sin((t / 1000) * s.speed + s.phase) * s.amp
        ctx.globalAlpha = Math.min(1, Math.max(0, alpha))
        ctx.beginPath()
        ctx.arc(s.x * width, y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = (t) => {
      draw(t)
      rafId = requestAnimationFrame(loop)
    }

    const start = () => {
      if (rafId || reduced || document.hidden) return
      rafId = requestAnimationFrame(loop)
    }

    const stop = () => {
      if (!rafId) return
      cancelAnimationFrame(rafId)
      rafId = 0
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      makeStars()
      if (reduced) draw(0) // 정적 렌더 유지
    }

    const onScroll = () => {
      scrollY = window.scrollY
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    const onReducedChange = () => {
      reduced = reducedQuery.matches
      if (reduced) {
        stop()
        draw(0)
      } else {
        start()
      }
    }

    resize()
    if (reduced) draw(0)
    else start()

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    reducedQuery.addEventListener('change', onReducedChange)
    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      reducedQuery.removeEventListener('change', onReducedChange)
    }
  }, [])

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 bg-cosmos-depth0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}

export default StarField
