import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

// COMPONENTS.md §1 Button — primary: bg invert / secondary: border.subtle
// radius 6, 높이 모바일 44(h-11) 데스크탑 48, px 24. external이면 ArrowUpRight 16
const base =
  'inline-flex h-11 cursor-pointer items-center justify-center gap-8 whitespace-nowrap rounded-sm px-24 text-body-m font-semibold transition duration-fast ease-out md:h-48 md:text-body-d'

const variants = {
  primary: 'bg-bg-invert text-text-invert hover:opacity-90',
  secondary:
    'border border-border-subtle bg-transparent text-text-pri hover:border-border-strong',
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
