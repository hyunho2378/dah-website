import Link from './LangLink'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

// COMPONENTS.md §1 ArrowLink — hover: 언더라인 좌→우 draw(250ms), 화살표 translate-x 4px
// P5: 내부 ArrowRight / 외부 ArrowUpRight(16), 외부는 _blank + noopener noreferrer
const linkClass =
  'group inline-flex cursor-pointer items-center gap-8 text-body-m text-text-pri md:text-body-d'

const arrowClass =
  'shrink-0 transition-transform duration-base ease-out group-hover:translate-x-4'

function Label({ children }) {
  return (
    <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-base after:ease-out group-hover:after:w-full">
      {children}
    </span>
  )
}

function ArrowLink({ href, external = false, children }) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <Label>{children}</Label>
        <ArrowUpRight size={16} className={arrowClass} />
      </a>
    )
  }

  return (
    <Link to={href} className={linkClass}>
      <Label>{children}</Label>
      <ArrowRight size={16} className={arrowClass} />
    </Link>
  )
}

export default ArrowLink
