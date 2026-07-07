import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ROUTES.md: pathname 변경 시 최상단 이동, hash 있으면 해당 id로 스크롤
// P5-6: 라우트 전환·새로고침·창 복귀 시 무조건 최상단에서 시작.
//   - 브라우저 자동 스크롤 복원을 끔(scrollRestoration='manual')
//   - 전역 scroll-behavior:smooth(index.css)를 무시하고 즉시 이동(behavior 'instant')
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  // 새로고침·뒤로가기 시 브라우저가 이전 스크롤 위치를 복원하지 않게 함(마운트 시 1회)
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        const reduced = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches
        el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

export default ScrollToTop
