// analytics.js — GA4(gtag.js) 로더 + 수동 pageview 전송 (39_GA4)
// React Router v6 SPA는 구글이 주는 정적 스니펫으로는 라우트 이동을 못 잡는다
// (config 호출의 자동 page_view는 최초 로드 1회뿐) — 그래서 스크립트는 로드만 하고
// send_page_view는 꺼둔 뒤, 라우트가 바뀔 때마다 이 모듈의 sendPageview()로 직접 보낸다.
export const GA_ID = import.meta.env.VITE_GA_ID

let loaded = false

// VITE_GA_ID가 없으면 아무것도 하지 않는다 — 로컬 개발 환경에 스크립트 자체가 안 실린다.
export function loadGtag() {
  if (!GA_ID || loaded) return
  loaded = true

  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  // send_page_view:false — 최초 pageview도 sendPageview()로 통일해서 보낸다(중복 전송 방지)
  window.gtag('config', GA_ID, { send_page_view: false })
}

export function sendPageview(path) {
  if (!GA_ID || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}
