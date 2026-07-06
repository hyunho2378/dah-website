import { useEffect, useRef, useState } from 'react'
import { Check, Link as LinkIcon, Share2 } from 'lucide-react'
import GlassPill from './GlassPill'

// 13_CMS_SPEC 4절 ShareButton — 전 상세 페이지 공유 필(비로그인 포함)
// 다이나믹 아일랜드 원리(11_DESIGN_V2 5절 적용처 3 중 하나):
// 탭 → 필이 옆으로 부풀며 링크 복사 / X / 카카오(URL 스킴만, SDK 금지) 노출
// 링크 복사: navigator.clipboard, 성공 시 필 안 "복사됨" 1.5초
// <ShareButton title url? /> — url 생략 시 현재 주소
// 스프링 느낌 CSS cubic-bezier 자체 구현(외부 애니메이션 라이브러리 금지)
const SPRING = 'cubic-bezier(0.32, 1.32, 0.5, 1)'
const COPIED_MS = 1500

const actionClass =
  'flex h-full shrink-0 cursor-pointer items-center gap-4 whitespace-nowrap px-8 text-small-m text-text-sec transition-colors duration-fast ease-out hover:text-text-pri md:text-small-d'

function ShareButton({ title, url }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const rootRef = useRef(null)
  const timerRef = useRef(0)

  const shareUrl = url || window.location.href

  useEffect(() => () => clearTimeout(timerRef.current), [])

  // 바깥 탭·ESC 수축
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), COPIED_MS)
    } catch {
      // 클립보드 미지원 환경: 무동작 (폼·모달 폴백 없음, 13_CMS_SPEC 4절 범위)
    }
  }

  const xHref = `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
  // 카카오는 SDK 없이 URL 스킴만 (13_CMS_SPEC 4절)
  const kakaoHref = `kakaotalk://web/openExternal?url=${encodeURIComponent(shareUrl)}`

  return (
    <div ref={rootRef} className="relative inline-flex">
      <GlassPill className="h-11 pl-16 pr-8">
        <button
          type="button"
          aria-expanded={open}
          aria-label="공유 옵션 열기"
          onClick={() => setOpen(!open)}
          className="flex h-full cursor-pointer items-center gap-8 pr-8 text-small-m font-semibold text-text-pri md:text-small-d"
        >
          <Share2 size={16} aria-hidden="true" />
          공유
        </button>
        {/* 확장부: grid-cols 0fr→1fr 폭 트랜지션으로 필이 부풀어 콘텐츠를 드러냄 */}
        <div
          className={`grid ${open ? 'grid-cols-[1fr]' : 'grid-cols-[0fr]'}`}
          style={{ transition: `grid-template-columns 320ms ${SPRING}` }}
        >
          <div inert={!open} className="flex min-w-0 items-stretch overflow-hidden">
            <span aria-hidden="true" className="my-8 w-px shrink-0 bg-border-subtle" />
            <button type="button" onClick={copy} className={actionClass}>
              {copied ? (
                <>
                  <Check size={16} aria-hidden="true" />
                  복사됨
                </>
              ) : (
                <>
                  <LinkIcon size={16} aria-hidden="true" />
                  링크 복사
                </>
              )}
            </button>
            <a
              href={xHref}
              target="_blank"
              rel="noopener noreferrer"
              className={actionClass}
            >
              X
            </a>
            <a href={kakaoHref} className={actionClass}>
              카카오
            </a>
          </div>
        </div>
      </GlassPill>
    </div>
  )
}

export default ShareButton
