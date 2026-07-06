import { useEffect, useRef, useState } from 'react'
import { colors } from '../../styles/tokens.js'

// COMPONENTS.md §3 OrbitCanvas — 순수 Canvas 2D + rAF
// 중심 우측 55%, 동심 궤도 4개(border.subtle), 노드 2~4px 공전, 근접 노드 헤어라인 연결
// 마우스 패럴랙스 최대 16px(lerp 0.06), 파티클 min(뷰포트폭/32, 48), dpr 상한 2
// document.hidden 시 rAF 중단, reduced-motion 시 캔버스 미마운트 → 정적 SVG
const ORBIT_COUNT = 4
const MAX_PARALLAX = 16
const LERP = 0.06
const LINK_DIST = 96

function OrbitCanvas() {
  const canvasRef = useRef(null)
  const [reduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (reduced) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let width = 0
    let height = 0
    let orbits = []
    let particles = []
    let rafId = 0
    let running = false
    const mouse = { tx: 0, ty: 0, x: 0, y: 0 }

    const setup = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const base = Math.min(width, height)
      orbits = Array.from(
        { length: ORBIT_COUNT },
        (_, i) => base * (0.22 + i * 0.16)
      )

      const count = Math.min(Math.floor(window.innerWidth / 32), 48)
      particles = Array.from({ length: count }, () => ({
        r: orbits[Math.floor(Math.random() * orbits.length)],
        angle: Math.random() * Math.PI * 2,
        speed:
          (Math.random() * 0.0016 + 0.0004) * (Math.random() < 0.5 ? -1 : 1),
        size: Math.random() + 1, // 반지름 1~2 → 지름 2~4px
        alpha: Math.random() * 0.4 + 0.4,
        px: 0,
        py: 0,
      }))
    }

    const draw = () => {
      if (!running) return

      mouse.x += (mouse.tx - mouse.x) * LERP
      mouse.y += (mouse.ty - mouse.y) * LERP

      ctx.clearRect(0, 0, width, height)
      const cx = width * 0.55 + mouse.x
      const cy = height * 0.5 + mouse.y

      // 동심 궤도
      ctx.strokeStyle = colors.border.subtle
      ctx.lineWidth = 1
      orbits.forEach((r) => {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()
      })

      // 노드 위치 갱신
      particles.forEach((p) => {
        p.angle += p.speed
        p.px = cx + Math.cos(p.angle) * p.r
        p.py = cy + Math.sin(p.angle) * p.r
      })

      // 근접 노드 헤어라인 연결
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].px - particles[j].px
          const dy = particles[i].py - particles[j].py
          const dist = Math.hypot(dx, dy)
          if (dist < LINK_DIST) {
            ctx.globalAlpha = 1 - dist / LINK_DIST
            ctx.beginPath()
            ctx.moveTo(particles[i].px, particles[i].py)
            ctx.lineTo(particles[j].px, particles[j].py)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1

      // 노드 점
      ctx.fillStyle = colors.text.pri
      particles.forEach((p) => {
        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      rafId = requestAnimationFrame(draw)
    }

    const start = () => {
      if (running) return
      running = true
      rafId = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(rafId)
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }
    const onMouseMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2 * MAX_PARALLAX
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2 * MAX_PARALLAX
    }
    const onResize = () => setup()

    setup()
    start()
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced])

  if (reduced) {
    return (
      <img
        src="/images/orbit-static.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  )
}

export default OrbitCanvas
