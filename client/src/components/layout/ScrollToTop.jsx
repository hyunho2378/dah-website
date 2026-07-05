import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// ROUTES.md: pathname 변경 시 최상단 이동, hash 있으면 해당 id로 스크롤
// reduced-motion이면 behavior auto
function ScrollToTop() {
  const { pathname, hash } = useLocation()

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
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default ScrollToTop
