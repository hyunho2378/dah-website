// LangLink — 언어 프리픽스 보존 내부 링크 (J4.1)
// EN 미러(/en/*)에서 내부 이동 시 /en을 유지한다. Link/NavLink 대체용.
import { Link, NavLink } from 'react-router-dom'
import { useLang, localizeTo } from '../../i18n/LangContext'

function LangLink({ to, ...rest }) {
  const { lang } = useLang()
  return <Link to={localizeTo(lang, to)} {...rest} />
}

export function LangNavLink({ to, ...rest }) {
  const { lang } = useLang()
  return <NavLink to={localizeTo(lang, to)} {...rest} />
}

export default LangLink
