import { useEffect, useRef } from 'react'

// useLiquidGlass — X3(33_PHASE18) 리퀴드글래스(liquidGL) 적용 훅.
//
// 성능 계약: 핵심 fixed 표면 3곳에만 쓴다(데스크탑 헤더 바 / 전시회 피처드 CTA 패널 /
// 모바일 메뉴 시트). 일반 카드에는 절대 쓰지 않는다 — 스냅샷·WebGL 비용이 크다.
//
// 폴백 계약(기능 저하 없이): 아래 어느 하나라도 해당하면 아무것도 하지 않고
// 요소의 기존 CSS 글래스(backdrop-filter)를 그대로 둔다.
//   - prefers-reduced-motion / prefers-reduced-transparency (apple-design 14절)
//   - 모바일·저성능(뷰포트 < lg, 논리 코어 4 미만)
//   - WebGL 미지원 또는 스크립트 로드 실패
// liquidGL 자체도 WebGL 부재 시 CSS backdrop-filter로 폴백한다(vendor 내장).
//
// 스크립트는 public/vendor/liquidgl/ 에서 지연 로드한다(번들 미포함 — html2canvas 198KB).

const BASE = '/vendor/liquidgl'
const LG_SRC = `${BASE}/liquidGL.js`
const H2C_SRC = `${BASE}/html2canvas.min.js`

// 동일 스크립트 중복 삽입 방지 — src별 1회만 로드하고 Promise를 캐시한다
const loaded = new Map()

function loadScript(src) {
  if (loaded.has(src)) return loaded.get(src)
  const p = new Promise((resolve, reject) => {
    const el = document.createElement('script')
    el.src = src
    el.async = true
    el.onload = () => resolve()
    el.onerror = () => reject(new Error(`liquidGL: ${src} 로드 실패`))
    document.head.appendChild(el)
  })
  loaded.set(src, p)
  return p
}

function shouldSkip() {
  if (typeof window === 'undefined') return true
  const mq = window.matchMedia
  if (mq?.('(prefers-reduced-motion: reduce)').matches) return true
  if (mq?.('(prefers-reduced-transparency: reduce)').matches) return true
  // lg 미만(모바일·태블릿)은 비용 대비 이득이 없어 CSS 글래스 유지
  if (window.innerWidth < 1024) return true
  if ((navigator.hardwareConcurrency || 8) < 4) return true
  return false
}

/**
 * @param {string} selector  적용 대상 CSS 선택자(단일 표면)
 * @param {object} options   liquidGL 옵션 오버라이드
 * @param {boolean} enabled  false면 미적용(조건부 표면용)
 */
export default function useLiquidGlass(selector, options = {}, enabled = true) {
  // 호출부가 인라인 객체를 넘겨도 매 렌더 재초기화되지 않게 ref로 고정한다
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    if (!enabled || !selector || shouldSkip()) return undefined

    let cancelled = false
    let instance = null

    // 대상이 실제로 마운트된 뒤에만 초기화(선택자 미존재 시 vendor가 경고만 내고 종료)
    if (!document.querySelector(selector)) return undefined

    Promise.all([loadScript(H2C_SRC), loadScript(LG_SRC)])
      .then(() => {
        if (cancelled || typeof window.liquidGL !== 'function') return
        if (!document.querySelector(selector)) return
        instance = window.liquidGL({
          target: selector,
          snapshot: 'body',
          // 해상도는 성능 상한 — 2.0은 4K에서 과하다
          resolution: 1.5,
          refraction: 0.012,
          bevelDepth: 0.08,
          bevelWidth: 0.15,
          specular: true,
          shadow: false, // 그림자는 우리 토큰(shadow-glass)이 담당
          tilt: false,
          reveal: 'none',
          ...optionsRef.current,
        })
      })
      .catch(() => {
        // 로드 실패 = CSS 글래스 유지. 콘솔 오염 없이 조용히 폴백한다.
      })

    return () => {
      cancelled = true
      // vendor는 명시적 destroy API가 없으므로 렌즈만 해제 시도(있을 때만)
      if (instance && typeof instance.destroy === 'function') instance.destroy()
    }
  }, [selector, enabled])
}
