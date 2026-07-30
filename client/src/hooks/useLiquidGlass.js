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

    // vendor가 타겟에 건 인라인 스타일 중 "보이지 않음·클릭 불가"를 만드는 두 가지를
    // 되돌린다. 생성자는 동기 실행되므로 liquidGL() 반환 직후엔 이미 적용된 뒤다.
    //
    // (1) 34_HEADER_AUDIT — pointerEvents:none: vendor는 시각을 캔버스가 대신하므로
    //     타겟 자신을 숨기고 클릭도 막는 설계다. 그런데 pointer-events는 상속 속성이라
    //     타겟 안의 실제 인터랙티브 자식(내비 링크·버튼)까지 전부 클릭 불가가 된다.
    //     캔버스·미러는 이미 pointer-events:none이라 클릭은 항상 타겟까지 내려오므로,
    //     타겟만 auto로 되돌리면 시각은 그대로 두고 클릭만 복구된다.
    //
    // (2) 35_HEADER_HOVER_WHALE — opacity:0: 생성자가 타겟을 즉시 숨기지만 이를 되돌리는
    //     _reveal()은 renderer.texture가 생긴 뒤에만 호출된다(addLens는 texture가 없으면
    //     _pendingReveal에 쌓아두고 스냅샷 완료 시 flush). 즉 html2canvas 전체 스냅샷이
    //     느리면 그동안, 재시도까지 전부 실패하면 영구히 타겟이 보이지 않는다. 우리는
    //     reveal:'none'으로 쓰므로 opacity:0은 의도된 UI 상태가 아니라 순수 과도기 값이다
    //     — 인라인 opacity를 지워 "보이지 않는 창"을 없앤다(이후 _reveal()이 1로 세팅해도
    //     결과는 동일). 이 복구는 성공·실패 경로 모두에서 반드시 실행한다.
    const restoreTargets = () => {
      document.querySelectorAll(selector).forEach((el) => {
        el.style.pointerEvents = 'auto'
        el.style.opacity = ''
      })
    }

    // 39_FIX: 스냅샷 치수를 폰트·레이아웃 확정 전에 읽으면 html2canvas scale이 NaN이
    // 되어 스냅샷이 통째로 실패한다(vendor 측에도 폴백 가드를 뒀다). 로드가 끝나도
    // document.fonts.ready + 다음 프레임까지 기다린 뒤에 초기화한다.
    const layoutSettled = () =>
      (document.fonts?.ready ?? Promise.resolve()).then(
        () => new Promise((resolve) => requestAnimationFrame(resolve))
      )

    Promise.all([loadScript(H2C_SRC), loadScript(LG_SRC)])
      .then(layoutSettled)
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
        restoreTargets()
      })
      .catch(() => {
        // 로드·초기화 실패 = CSS 글래스 유지. 콘솔 오염 없이 조용히 폴백한다.
        // 단 vendor가 예외 직전까지 타겟을 숨겼을 수 있으므로 복구는 반드시 수행한다.
        restoreTargets()
      })

    return () => {
      cancelled = true
      // vendor는 명시적 destroy API가 없으므로 렌즈만 해제 시도(있을 때만)
      if (instance && typeof instance.destroy === 'function') instance.destroy()
    }
  }, [selector, enabled])
}
