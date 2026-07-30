import { LogIn } from 'lucide-react'
import { usePublicAuth } from '../../hooks/usePublicAuth'

// GoogleLoginButton — 공개 제출자 구글 로그인 진입 (41_GOOGLE_AUTH_PUBLIC)
//
// COMPONENTS.md §1 Button과 같은 치수·위계를 쓰되 <button>이라 별도 컴포넌트다
// (공용 Button은 링크 전용). 색·간격은 전부 토큰 경유 — 구글 브랜드 다색 로고는
// 색 하드코딩 금지 규칙과 충돌하므로 쓰지 않고 사이트 아이콘 세트(lucide)로 통일한다.
//
// 클릭 시 백엔드 /auth/google/login으로 전체 페이지 이동한다(구글 동의 화면은 iframe·fetch
// 불가). 복귀 경로는 next로 보존된다.
const base =
  'inline-flex h-11 cursor-pointer items-center justify-center gap-8 whitespace-nowrap rounded-sm px-24 text-body-m font-semibold transition duration-fast ease-out md:h-48 md:text-body-d'

const variants = {
  primary:
    'bg-button-primary text-button-primaryText shadow-btn hover:bg-button-primaryHover hover:shadow-btn-hover active:bg-button-primaryPressed active:shadow-btn',
  secondary:
    'border border-glass-line bg-glass-bg text-text-pri shadow-glass hover:border-border-purple hover:bg-glass-strong active:opacity-90',
}

/**
 * @param {'primary'|'secondary'} [variant]
 * @param {string} [next]      로그인 후 돌아올 경로. 생략 시 현재 URL
 * @param {string} [label]     버튼 문구
 */
function GoogleLoginButton({ variant = 'primary', next, label = 'Google로 로그인' }) {
  const { login } = usePublicAuth()

  return (
    <button
      type="button"
      onClick={() => login(next)}
      className={`${base} ${variants[variant] || variants.primary}`}
    >
      <LogIn size={16} />
      {label}
    </button>
  )
}

export default GoogleLoginButton
