import { createContext, useContext, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { ko } from './ko'
import { en } from './en'

// LangContext — /en 프리픽스 미러 라우트 감지 + UI 라벨 사전 조회 (13_CMS_SPEC 5절, 14_ROUTES_V2)
// 계약: useLang() → { lang: 'ko'|'en', t(key), switchHref(pathname) }

const DICTS = { ko, en }

function isEnPath(pathname) {
  return pathname === '/en' || pathname.startsWith('/en/')
}

// 'sections.news' 같은 점 표기 키를 중첩 사전에서 조회
function lookup(dict, key) {
  return key
    .split('.')
    .reduce(
      (node, part) => (node && typeof node === 'object' ? node[part] : undefined),
      dict
    )
}

// en에 키가 없으면 ko 폴백, ko에도 없으면 키 원문 반환(누락 탐지 용이)
function translate(lang, key) {
  const hit = lookup(DICTS[lang], key)
  if (hit !== undefined) return hit
  const fallback = lookup(ko, key)
  return fallback !== undefined ? fallback : key
}

// ko↔en 경로 변환. 인자 pathname 기준으로 판정하므로 어느 언어에서 호출해도 동작
export function switchHref(pathname) {
  if (isEnPath(pathname)) {
    const stripped = pathname.slice('/en'.length)
    return stripped || '/'
  }
  return pathname === '/' ? '/en' : `/en${pathname}`
}

// 기본값: Provider 미장착 상태(BR 조립 전)에서도 ko로 안전 동작
const LangContext = createContext({
  lang: 'ko',
  t: (key) => translate('ko', key),
  switchHref,
})

export function LangProvider({ children }) {
  const { pathname } = useLocation()
  const lang = isEnPath(pathname) ? 'en' : 'ko'

  const value = useMemo(
    () => ({ lang, t: (key) => translate(lang, key), switchHref }),
    [lang]
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

// 콘텐츠 en 부재 패턴(13_CMS_SPEC 5절): 영문 페이지에서 국문 원문을 렌더할 때 병기하는 뱃지.
// ko 페이지에서는 미렌더. 기계번역 자동 삽입 금지 원칙의 UI 구현체.
export function KoreanOnlyBadge() {
  const { lang, t } = useLang()
  if (lang !== 'en') return null

  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-sm border border-border-subtle px-8 py-4 font-mono text-caption-m text-text-meta">
      {t('common.koreanOnly')}
    </span>
  )
}
