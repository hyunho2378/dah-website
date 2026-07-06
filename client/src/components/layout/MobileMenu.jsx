import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { site, nav } from '../../data/site.js'
import { motion } from '../../styles/tokens.js'

// COMPONENTS.md §2 MobileMenu — 트리거(Menu 24) 포함 자급형(props 없음 계약)
// 풀스크린 bg.base 오버레이, h2 링크 스태거 리빌, ESC 닫기, 열림 시 body overflow hidden
function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [shown, setShown] = useState(false)

  // 마운트 후 한 프레임 뒤 스태거 리빌 시작
  useEffect(() => {
    if (!open) {
      setShown(false)
      return
    }
    const rafId = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(rafId)
  }, [open])

  // 열림 시 body 스크롤 잠금
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // ESC 닫기
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <button
        type="button"
        aria-label="메뉴 열기"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center justify-center text-text-pri"
      >
        <Menu size={24} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="메뉴"
          className="fixed inset-0 z-50 flex flex-col bg-bg-base lg:hidden"
        >
          <div className="flex h-header items-center justify-end px-gutter-m md:px-gutter-t">
            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={close}
              className="flex cursor-pointer items-center justify-center text-text-pri"
            >
              <X size={24} />
            </button>
          </div>

          <nav
            aria-label="모바일 메뉴"
            className="flex flex-1 flex-col justify-center gap-24 px-gutter-m md:px-gutter-t"
          >
            {nav.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={close}
                className={`text-h2-m font-extrabold tracking-display text-text-pri transition duration-slow ease-out md:text-h2-d ${
                  shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: `${(i < 6 ? i : 0) * motion.stagger}ms` }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-32 border-t border-border-subtle px-gutter-m py-24 md:px-gutter-t">
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-8 text-body-m text-text-sec transition-colors duration-fast ease-out hover:text-text-pri"
            >
              Instagram
              <ArrowUpRight size={16} />
            </a>
            <a
              href={site.links.exhibition}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-8 text-body-m text-text-sec transition-colors duration-fast ease-out hover:text-text-pri"
            >
              Exhibition
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileMenu
