import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Link, { LangNavLink as NavLink } from '../common/LangLink'
import { CalendarCheck, Settings } from 'lucide-react'
import { nav } from '../../data/nav'
import { useLang } from '../../i18n/LangContext'
import { useAuth } from '../../context/AuthContext'
import { useLoginModal } from '../../context/LoginModalContext'
import { useApi } from '../../hooks/useApi'
import { cosmos } from '../../styles/tokens'
import Container from './Container'
import LangToggle from './LangToggle'
import logoUrl from '../../assets/logo.svg'

// 헤더 — KPC 문법. G8 IA 8메뉴, G9 fixed 포지셔닝, G14 관리 아이콘, G15 언어 전환 시프트 0.
// G9: sticky → fixed. 메가메뉴 패널은 헤더 기준 absolute top-full — 스크롤 위치와 무관하게
//     항상 헤더 바로 아래에 뜬다. 본문은 Header가 렌더하는 스페이서가 밀어낸다.
// G15: 메뉴·로그인 라벨은 KR/EN 두 라벨을 같은 칸에 겹쳐 렌더(비활성 invisible)해
//     언어 전환 시 폭이 변하지 않는다(레이아웃 시프트 0).
// 성능 규칙(11_DESIGN_V2 2절): blur 상한 3 중 헤더 1계층.
const SHRINK_Y = 80

// G15: 언어 전환 폭 고정 — 두 라벨을 같은 grid 칸에 겹치고 비활성 쪽은 invisible
function FixedWidthLabel({ current, other, className = '' }) {
  return (
    <span className={`grid ${className}`}>
      <span className="col-start-1 row-start-1">{current}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {other}
      </span>
    </span>
  )
}

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [openIndex, setOpenIndex] = useState(null) // 메가메뉴 활성 1차 메뉴 index
  const { lang, t } = useLang()
  const navLabel = (item) => (lang === 'en' ? item.labelEn : item.label)
  const navOther = (item) => (lang === 'en' ? item.label : item.labelEn)
  const { user } = useAuth()
  const { openLogin } = useLoginModal()
  const { pathname } = useLocation()
  const headerRef = useRef(null)
  // H10: 전시회 접수 버튼 — /settings/public의 exhibition.show_button(기간 중 + 노출 허용) 판정
  const { data: pub } = useApi('/settings/public')
  const exhibitionState = pub?.exhibition
  const showSubmit = exhibitionState?.show_button === true
  const submitMode = exhibitionState?.button_mode || 'header'

  // 스크롤 rAF 스로틀 (80px 이후 높이 72→56)
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

  // 라우트 이동 시 메가메뉴 닫기
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

  // 메가메뉴 열림 시 본문 스크롤 잠금 — 닫힘·라우트 이동 시 클린업으로 복구
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
      {/* 열림 시 본문 딤 오버레이 — 헤더(z-50) 아래, 클릭 시 닫힘. lg 전용 */}
      {menuOpen && (
        <button
          type="button"
          aria-label={t('aria.closeMenu')}
          tabIndex={-1}
          onClick={close}
          className="fixed inset-0 z-40 hidden bg-black/40 lg:block"
        />
      )}
      <header
        ref={headerRef}
        onMouseLeave={close}
        onBlur={onBlur}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-base ease-out [will-change:backdrop-filter] ${
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
          {/* 높이 28: 11_DESIGN_V2 9절 명시값. hover 시 stroke 미세 글로우 */}
          <img
            src={logoUrl}
            alt="디지털인문예술전공 홈"
            style={{ '--logo-glow': cosmos.star }}
            className="h-[28px] w-auto transition-[filter] duration-base ease-out group-hover/logo:[filter:drop-shadow(0_0_8px_var(--logo-glow))]"
          />
        </Link>

        <nav aria-label={t('aria.mainMenu')} className="hidden h-full items-center lg:flex">
          {nav.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              aria-expanded={item.children.length > 0 ? openIndex === i : undefined}
              onMouseEnter={() => setOpenIndex(i)}
              onFocus={() => setOpenIndex(i)}
              className={({ isActive }) =>
                `flex h-full items-center px-12 text-body-d transition-colors duration-fast ease-out hover:text-text-pri ${
                  isActive ? 'text-text-pri' : 'text-text-sec'
                }`
              }
            >
              <FixedWidthLabel current={navLabel(item)} other={navOther(item)} className="text-center" />
            </NavLink>
          ))}
        </nav>

        <div onMouseEnter={close} className="flex shrink-0 items-center gap-16">
          {/* H10: 접수 기간 중 헤더 접수 버튼 (button_mode=header) */}
          {showSubmit && submitMode === 'header' && (
            <Link
              to="/submit"
              className="inline-flex h-32 items-center gap-8 rounded-sm bg-bg-invert px-16 text-small-m font-semibold text-text-invert transition-opacity duration-fast ease-out hover:opacity-90 md:text-small-d"
            >
              <CalendarCheck size={16} aria-hidden="true" />
              {t('actions.submitExhibition')}
            </Link>
          )}
          {/* EN 토글은 데스크탑 유틸만 — lg 미만은 GlassDock 확장부에 노출 */}
          <span className="hidden lg:block">
            <LangToggle />
          </span>
          <span aria-hidden="true" className="hidden h-16 w-px bg-border-subtle lg:block" />
          {/* G14: 로그인 상태는 관리 아이콘 버튼 하나로만 — 역할은 호버 툴팁(title). 텍스트 뱃지 금지 */}
          {user ? (
            <Link
              to="/admin"
              title={`${user.role} ${t('actions.admin')}`}
              aria-label={`${user.role} ${t('actions.admin')}`}
              /* H7.5: 아이콘 시각 여백(7px)을 상쇄해 Container 우측선에 정렬 */
              className="-mr-8 flex h-32 w-32 items-center justify-center rounded-sm text-text-sec transition-colors duration-fast ease-out hover:bg-glass-strong hover:text-text-pri"
            >
              <Settings size={18} aria-hidden="true" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={openLogin}
              className="cursor-pointer text-small-m text-text-sec transition-colors duration-fast ease-out hover:text-text-pri md:text-small-d"
            >
              <FixedWidthLabel
                current={t('actions.login')}
                other={lang === 'en' ? '로그인' : 'Login'}
                className="text-center"
              />
            </button>
          )}
        </div>
      </Container>

      {/* 풀폭 메가메뉴 — G9: fixed 헤더 기준 absolute top-full → 스크롤 무관, 항상 헤더 바로 아래.
          배경 완전 불투명(bg-cosmos-depth1)으로 아래 콘텐츠 비침 차단 + 하단 그림자. */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-20 hidden border-b border-glass-line bg-cosmos-depth1 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.7)] lg:block">
          <Container
            as="nav"
            aria-label={`${navLabel(active)} ${t('aria.submenu')}`}
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
                  {navLabel(child)}
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
      {/* G9: fixed 헤더가 차지하던 자리를 본문에서 확보하는 스페이서 */}
      <div aria-hidden="true" className="h-header-s lg:h-header" />
      {/* H10: 접수 버튼 플로팅 모드 (button_mode=floating) — 우하단 고정 */}
      {showSubmit && submitMode === 'floating' && (
        <Link
          to="/submit"
          className="fixed bottom-24 right-24 z-40 inline-flex h-48 items-center gap-8 rounded-sm bg-bg-invert px-24 text-body-m font-semibold text-text-invert shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] transition-opacity duration-fast ease-out hover:opacity-90"
        >
          <CalendarCheck size={16} aria-hidden="true" />
          {t('actions.submitExhibition')}
        </Link>
      )}
    </>
  )
}

export default Header
