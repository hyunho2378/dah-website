import { useEffect, useRef } from 'react'
import { cosmos } from '../../styles/tokens'

// CosmosBackground — 우주 톤 배경 (H9, 19_PHASE7 배경 고급화)
// 1) 생검정 탈피: 상단 depth1 → 하단 depth0 세로 그라데이션(토큰 경유, 하드코딩 없음)
// 2) 성운 글로우: 좌상 보라 / 우하 청록 / 중앙 상단 보강 — COSMOS-TONE 상한(0.05 내외) 유지
// 3) 스크롤 패럴랙스: 글로우 레이어가 스크롤의 0.1/0.06배로 미세 이동(rAF, transform만).
//    prefers-reduced-motion 시 리스너 미부착(정지). blur 미사용 — 성능 상한 무관.
const PARALLAX_A = 0.1
const PARALLAX_B = 0.06

function CosmosBackground() {
  const layerARef = useRef(null)
  const layerBRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let rafId = 0
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY
        if (layerARef.current)
          layerARef.current.style.transform = `translate3d(0, ${-(y * PARALLAX_A) % 240}px, 0)`
        if (layerBRef.current)
          layerBRef.current.style.transform = `translate3d(0, ${(y * PARALLAX_B) % 240}px, 0)`
        rafId = 0
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10"
      style={{ background: `linear-gradient(to bottom, ${cosmos.depth1}, ${cosmos.depth0})` }}
    >
      {/* 글로우는 뷰포트보다 크게 잡아 패럴랙스 이동 시 가장자리 노출 방지 */}
      <div
        ref={layerARef}
        className="pointer-events-none absolute -inset-y-[240px] inset-x-0 bg-nebula-violet [will-change:transform]"
      />
      <div
        ref={layerBRef}
        className="pointer-events-none absolute -inset-y-[240px] inset-x-0 bg-nebula-teal [will-change:transform]"
      />
      <div className="pointer-events-none absolute inset-0 bg-nebula-soft" />
    </div>
  )
}

export default CosmosBackground
