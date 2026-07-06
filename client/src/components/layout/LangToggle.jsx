import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../../i18n/LangContext'

// 13_CMS_SPEC 5절 LangToggle — KPC 우측 유틸 위치의 KR/EN 전환
// B4 산출 계약: useLang() → { lang: 'ko'|'en', switchHref(pathname) }
// 현재 경로의 /en 미러(또는 국문 원본)로 링크 전환
function LangToggle() {
  const { lang, switchHref } = useLang()
  const { pathname } = useLocation()

  return (
    <Link
      to={switchHref(pathname)}
      aria-label={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
      className="font-mono text-label-m uppercase tracking-label text-text-sec transition-colors duration-fast ease-out hover:text-text-pri md:text-label-d"
    >
      {lang === 'ko' ? 'EN' : 'KO'}
    </Link>
  )
}

export default LangToggle
