import Link from './LangLink'
import { ArrowUpRight } from 'lucide-react'

// COMPONENTS.md §1 Button — primary: bg invert / secondary: 글래스 톤(v2 스킨, 11_DESIGN_V2 5절)
// radius 6, 높이 모바일 44(h-11) 데스크탑 48, px 24. external이면 ArrowUpRight 16
// 성능 규칙: 버튼 표면은 blur 미사용(backdrop-filter 상한 3 보존) — glass bg·border 톤만
const base =
  'inline-flex h-11 cursor-pointer items-center justify-center gap-8 whitespace-nowrap rounded-sm px-24 text-body-m font-semibold transition duration-fast ease-out md:h-48 md:text-body-d'

// K2-9: press 시 미세 감광(active) — transition은 base의 duration-fast(motion 토큰) 공유
const variants = {
  primary: 'bg-bg-invert text-text-invert hover:opacity-90 active:opacity-80',
  secondary:
    'border border-glass-line bg-glass-bg text-text-pri hover:border-border-strong hover:bg-glass-strong active:opacity-90',
}

function Button({ variant = 'primary', href, external = false, children }) {
  const className = `${base} ${variants[variant] || variants.primary}`

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
        <ArrowUpRight size={16} />
      </a>
    )
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}

export default Button
