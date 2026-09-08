// useSeo.js — React SPA에서도 현재 경로의 공식 메타데이터를 일관되게 갱신한다.
// 제목뿐 아니라 설명·canonical·Open Graph·JSON-LD를 함께 관리해 화면 텍스트와 검색 신호가 어긋나지 않게 한다.
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PAGE_SEO, SITE_NAME, SITE_URL, normalizeSeoPath } from '../data/seo'

const truncate = (value, max = 180) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

export function plainText(value) {
  if (!value) return ''
  if (typeof value === 'string') return truncate(value)
  if (Array.isArray(value)) return truncate(value.map(plainText).join(' '))
  if (typeof value === 'object') {
    if (typeof value.text === 'string') return value.text
    if (Array.isArray(value.content)) return truncate(value.content.map(plainText).join(' '))
  }
  return ''
}

function upsertMeta(selector, attributes) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.dataset.dahSeo = 'true'
    document.head.appendChild(el)
  }
  Object.entries(attributes).forEach(([name, value]) => el.setAttribute(name, value))
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    el.dataset.dahSeo = 'true'
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * @param {{title?: string|null, description?: string|null, image?: string|null, type?: string,
 *   jsonLd?: object|object[]|null, canonicalPath?: string|null}} options
 */
export function useSeo(options = {}) {
  const { pathname } = useLocation()
  const path = normalizeSeoPath(pathname)
  const preset = PAGE_SEO[path]

  useEffect(() => {
    // 관리자·접수 등 공개 콘텐츠가 아닌 화면은 기존 title 동작만 유지한다.
    if (!preset && !options.description && !options.jsonLd) {
      if (options.title) document.title = options.title
      return
    }

    // 정적 공개 페이지는 검토된 제목 맵을 우선한다. 상세 페이지처럼 맵에 없는 경로만
    // 호출자가 전달한 실제 게시물 제목을 사용한다.
    const title = preset?.title || options.title || SITE_NAME
    const description = truncate(options.description || preset?.description || '')
    const canonicalPath = options.canonicalPath || pathname
    const canonical = new URL(canonicalPath, SITE_URL).toString()
    const image = options.image ? new URL(options.image, SITE_URL).toString() : `${SITE_URL}/og.png`

    document.title = title
    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertCanonical(canonical)
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })

    const jsonLd = options.jsonLd || preset?.jsonLd
    const id = 'dah-seo-jsonld'
    let script = document.getElementById(id)
    if (!jsonLd) {
      script?.remove()
      return
    }
    if (!script) {
      script = document.createElement('script')
      script.id = id
      script.type = 'application/ld+json'
      script.dataset.dahSeo = 'true'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLd)
  }, [pathname, path, preset, options.title, options.description, options.image, options.type, options.jsonLd, options.canonicalPath])
}
