import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MoreHorizontal, X } from 'lucide-react'
import { nav } from '../../data/nav'
import { useAuth } from '../../hooks/useAuth'
import Tag from '../common/Tag'
import LangToggle from './LangToggle'
import logoUrl from '../../assets/logo.svg'

// 11_DESIGN_V2 6절 GlassDock — 모바일(lg 미만) 하단 고정 리퀴드 글래스 필 (햄버거 폐기)
// 다이나믹 아일랜드 원리: 탭 시 필이 위로 부풀어(스프링 320ms 자체 구현) 메뉴를 드러낸다
// 접힘: 로고 + 현재 페이지명 + 점 3개 / 확장: 6개 메뉴 + EN·로그인 세로 노출
// 바깥 탭·스와이프 다운 수축, 확장 시 포커스 트랩 + ESC 수축
// safe-area: pb-[env(safe-area-inset-bottom)] — 시스템 값(하드코딩 아님)
// 성능 규칙(11_DESIGN_V2 2절): blur 상한 3 중 GlassDock 1계층(모바일 12px).
// will-change는 Header·GlassDock 2곳만 허용 — 여기서 1곳 사용
const SPRING = 'cubic-bezier(0.32, 1.32, 0.5, 1)'
const SWIPE_CLOSE_PX = 32

// 현재 경로 → 페이지명 매칭 (구체 경로 우선: to 길이 내림차순)
const flatChildren = nav
  .flatMap((item) => item.children)
  .sort((a, b) => b.to.length - a.to.length)

function currentLabel(pathname) {
  if (pathname === '/') return '홈'
  const hit = flatChildren.find(
    (c) => pathname === c.to || pathname.startsWith(`${c.to}/`)
  )
  return hit ? hit.label : '메뉴'
}

const utilLinkClass =
  'text-small-m text-text-sec transition-colors duration-fast ease-out hover:text-text-pri'

function GlassDock() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { user } = useAuth()
  const dockRef = useRef(null)
  const triggerRef = useRef(null)
  const touchY = useRef(null)

  // 라우트 변경 시 수축
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // 바깥 탭 수축
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (dockRef.current && !dockRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // 확장 시 포커스 트랩 + ESC 수축
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab' || !dockRef.current) return
      const focusables = dockRef.current.querySelectorAll(
        'a[href], button:not([disabled])'
      )
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // 스와이프 다운 수축
  const onTouchStart = (e) => {
    touchY.current = e.touches[0].clientY
  }
  const onTouchMove = (e) => {
    if (touchY.current === null) return
    if (e.touches[0].clientY - touchY.current > SWIPE_CLOSE_PX) {
      setOpen(false)
      touchY.current = null
    }
  }

  const close = () => setOpen(false)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-gutter-m pb-[env(safe-area-inset-bottom)] lg:hidden">
      {/* 필 표면: GlassPill 표면 언어. 확장 시 rounded-full → rounded-glass 모핑이 필요해 직접 구성 */}
      {/* max-w는 sm 브레이크포인트 폭(tokens layout.breakpoints.sm = 390) 상한 */}
      <div
        ref={dockRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        className={`pointer-events-auto mb-12 w-full max-w-[390px] overflow-hidden border border-glass-line bg-glass-bg backdrop-blur-glass-mobile [will-change:transform] ${
          open ? 'rounded-glass' : 'rounded-full'
        }`}
        style={{ transition: `border-radius 320ms ${SPRING}` }}
      >
        {/* 확장부: grid-rows 0fr→1fr 높이 트랜지션 — 하단 고정이므로 위로 부풀어 오른다 */}
        <div
          className={`grid ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
          style={{ transition: `grid-template-rows 320ms ${SPRING}` }}
        >
          <div inert={!open} className="min-h-0 overflow-hidden">
            <nav aria-label="모바일 메뉴" className="flex flex-col px-8 pt-12">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={close}
                  className="flex items-baseline justify-between gap-12 rounded-md px-12 py-12 transition-colors duration-fast ease-out hover:bg-glass-strong"
                >
                  <span className="text-body-m font-semibold text-text-pri">
                    {item.label}
                  </span>
                  <span className="font-display text-caption-m uppercase tracking-label text-text-meta">
                    {item.labelEn}
                  </span>
                </Link>
              ))}
            </nav>
            <div className="mx-20 mt-8 flex items-center justify-between border-t border-border-subtle py-16">
              <LangToggle />
              {/* 비로그인 = 로그인 링크만 / 로그인 = 역할 뱃지 + 관리 진입 (편집 UI 미렌더 원칙) */}
              {user ? (
                <span className="flex items-center gap-8">
                  <Tag>{user.role}</Tag>
                  <Link to="/admin" onClick={close} className={utilLinkClass}>
                    관리
                  </Link>
                </span>
              ) : (
                <Link to="/login" onClick={close} className={utilLinkClass}>
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 접힘 필(항상 표시, 높이 56 = h-header-s 토큰): 로고 + 현재 페이지명 + 점 3개 */}
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          onClick={() => setOpen(!open)}
          className="flex h-header-s w-full cursor-pointer items-center justify-between gap-12 px-20"
        >
          <span className="flex min-w-0 items-center gap-12">
            <img src={logoUrl} alt="" className="h-20 w-auto" />
            <span className="truncate text-small-m text-text-pri">
              {currentLabel(pathname)}
            </span>
          </span>
          {open ? (
            <X size={20} aria-hidden="true" className="shrink-0 text-text-sec" />
          ) : (
            <MoreHorizontal
              size={20}
              aria-hidden="true"
              className="shrink-0 text-text-sec"
            />
          )}
        </button>
      </div>
    </div>
  )
}

export default GlassDock
