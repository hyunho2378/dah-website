import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav } from '../../data/nav'
import { useAuth } from '../../context/AuthContext'
import { useLoginModal } from '../../context/LoginModalContext'
import { cosmos } from '../../styles/tokens'
import Container from './Container'
import Tag from '../common/Tag'
import LangToggle from './LangToggle'
import logoUrl from '../../assets/logo.svg'

// 10_IA_V2 1절 · 11_DESIGN_V2 헤더 재작업 — KPC 문법 이식
// 데스크탑(lg+): 로고 SVG + 1차 메뉴 6 + 우측 유틸(EN 토글 + 로그인/역할 뱃지)
//   호버·포커스 시 풀폭 메가메뉴(글래스 패널, 하위 페이지 그리드). ESC·포커스 이탈 시 닫힘
// lg 미만: 로고 + 로그인만 있는 초슬림 바(하단 내비는 GlassDock 담당, BR이 App 조립)
// 스크롤 80px 또는 메가메뉴 열림 시 투명 → 글래스화(backdrop-blur)
// 성능 규칙(11_DESIGN_V2 2절): blur 상한 3 중 헤더 1계층(바+메가메뉴 패널).
// will-change는 Header·GlassDock 2곳만 허용 — 여기서 1곳 사용
const SHRINK_Y = 80

const utilLinkClass =
  'text-small-m text-text-sec transition-colors duration-fast ease-out hover:text-text-pri md:text-small-d'

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [openIndex, setOpenIndex] = useState(null) // 메가메뉴 활성 1차 메뉴 index
  const { user } = useAuth()
  const { openLogin } = useLoginModal()
  const { pathname } = useLocation()
  const headerRef = useRef(null)

  // 스크롤 rAF 스로틀 (v1 유지: 80px 이후 높이 72→56)
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

  // ESC로 메가메뉴 닫기 (키보드 접근)
  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openIndex])

  // 라우트 이동 시 메가메뉴 닫기 (스크롤 복구는 아래 잠금 effect 클린업이 담당)
  useEffect(() => {
    setOpenIndex(null)
  }, [pathname])

  const close = () => setOpenIndex(null)

  // 포커스가 헤더 밖으로 나가면 메가메뉴 닫기
  const onBlur = (e) => {
    if (headerRef.current && !headerRef.current.contains(e.relatedTarget)) close()
  }

  const glassed = scrolled || openIndex !== null
  const active = openIndex !== null ? nav[openIndex] : null
  const menuOpen = Boolean(active && active.children.length > 0)

  // 메가메뉴 열림 시 본문 스크롤 잠금 (storage 미사용) — 닫힘·라우트 이동 시 클린업으로 복구
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  return (
    <>
      {/* 열림 시 본문 딤 오버레이 — 헤더(z-50) 아래, 클릭 시 닫힘. lg 전용(메가메뉴가 lg+).
          헤더의 backdrop-filter가 containing block을 만들어 fixed 자식을 가두므로 헤더 밖 형제로 렌더 */}
      {menuOpen && (
        <button
          type="button"
          aria-label="메뉴 닫기"
          tabIndex={-1}
          onClick={close}
          className="fixed inset-0 z-40 hidden bg-black/40 lg:block"
        />
      )}
      <header
        ref={headerRef}
        onMouseLeave={close}
        onBlur={onBlur}
        className={`sticky top-0 z-50 border-b transition-colors duration-base ease-out [will-change:backdrop-filter] ${
          glassed
            ? 'border-glass-line bg-glass-bg backdrop-blur-glass-mobile md:backdrop-blur-glass'
            : 'border-transparent bg-transparent'
        }`}
      >
      <Container
        className={`relative z-10 flex items-center justify-between transition-[height] duration-base ease-out ${
          scrolled ? 'h-header-s' : 'h-header-s lg:h-header'
        }`}
      >
        <Link
          to="/"
          onMouseEnter={close}
          className="group/logo flex shrink-0 items-center"
        >
          {/* 높이 28: 11_DESIGN_V2 9절 명시값. hover 시 stroke 미세 글로우(색은 tokens.cosmos.star) */}
          <img
            src={logoUrl}
            alt="디지털인문예술전공 홈"
            style={{ '--logo-glow': cosmos.star }}
            className="h-[28px] w-auto transition-[filter] duration-base ease-out group-hover/logo:[filter:drop-shadow(0_0_8px_var(--logo-glow))]"
          />
        </Link>

        <nav aria-label="주 메뉴" className="hidden h-full items-center lg:flex">
          {nav.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              aria-expanded={openIndex === i}
              onMouseEnter={() => setOpenIndex(i)}
              onFocus={() => setOpenIndex(i)}
              className={({ isActive }) =>
                `flex h-full items-center px-16 text-body-d transition-colors duration-fast ease-out hover:text-text-pri ${
                  isActive ? 'text-text-pri' : 'text-text-sec'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div onMouseEnter={close} className="flex shrink-0 items-center gap-16">
          {/* EN 토글은 데스크탑 유틸만 — lg 미만은 GlassDock 확장부에 노출 */}
          <span className="hidden lg:block">
            <LangToggle />
          </span>
          <span aria-hidden="true" className="hidden h-16 w-px bg-border-subtle lg:block" />
          {/* 로그인 상태: 비로그인 = 로그인 링크만 / 로그인 = 역할 뱃지 + 관리 진입 (편집 UI 미렌더 원칙) */}
          {user ? (
            <span className="flex items-center gap-8">
              <Tag>{user.role}</Tag>
              <Link to="/admin" className={utilLinkClass}>
                관리
              </Link>
            </span>
          ) : (
            <button
              type="button"
              onClick={openLogin}
              className={`cursor-pointer ${utilLinkClass}`}
            >
              로그인
            </button>
          )}
        </div>
      </Container>

      {/* 풀폭 메가메뉴 — KPC 방식. 즉답성 우선(11_DESIGN_V2 5절), 전환 애니메이션 없음 */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-10 hidden border-b border-glass-line bg-cosmos-depth1/[0.96] backdrop-blur-glass lg:block">
          <Container
            as="nav"
            aria-label={`${active.label} 하위 메뉴`}
            className="grid grid-cols-4 gap-16 py-32"
          >
            {active.children.map((child) => (
              <Link
                key={child.to}
                to={child.to}
                onClick={close}
                className="rounded-md border border-transparent p-16 transition-colors duration-fast ease-out hover:border-glass-line hover:bg-glass-strong"
              >
                <span className="block text-body-d font-semibold text-text-pri">
                  {child.label}
                </span>
                <span className="mt-4 block font-display text-caption-d uppercase tracking-label text-text-meta">
                  {child.labelEn}
                </span>
              </Link>
            ))}
          </Container>
        </div>
      )}
      </header>
    </>
  )
}

export default Header
