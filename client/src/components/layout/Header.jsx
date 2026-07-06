import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { site, nav } from '../../data/site.js'
import Button from '../common/Button.jsx'
import LogoWordmark from '../common/LogoWordmark.jsx'
import MobileMenu from './MobileMenu.jsx'

// COMPONENTS.md §2 Header — sticky, 스크롤 80px 후 h 72→56 + blur + base/80 + 하단 헤어라인
// scroll 리스너 rAF 스로틀
const SHRINK_Y = 80

function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let rafId = 0
    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > SHRINK_Y)
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
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-base ease-out ${
        scrolled
          ? 'border-border-subtle bg-bg-base/80 backdrop-blur'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div
        className={`mx-auto flex max-w-container items-center justify-between px-gutter-m transition-[height] duration-base ease-out md:px-gutter-t lg:px-gutter-d ${
          scrolled ? 'h-header-s' : 'h-header'
        }`}
      >
        <Link to="/" className="flex items-baseline gap-12">
          <LogoWordmark size={20} className="text-text-pri" />
          <span className="hidden text-small-m text-text-sec md:block md:text-small-d">
            디지털인문예술전공
          </span>
        </Link>

        <nav
          aria-label="주 메뉴"
          className="hidden items-center gap-32 lg:flex"
        >
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-body-m transition-colors duration-fast ease-out hover:text-text-pri md:text-body-d ${
                  isActive ? 'text-text-pri' : 'text-text-sec'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Button variant="secondary" href={site.links.exhibition} external>
            Exhibition
          </Button>
        </nav>

        <div className="lg:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

export default Header
