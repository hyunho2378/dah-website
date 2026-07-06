import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { site, nav } from '../../data/site.js'

// COMPONENTS.md §2 Footer — 상단 헤어라인, lg 3열(학과 정보/페이지 링크/외부 링크), 모바일 1열
const externalLinks = [
  { label: 'Exhibition', key: 'exhibition' },
  { label: 'Instagram', key: 'instagram' },
  { label: '한림대학교', key: 'hallym' },
]

function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto max-w-container px-gutter-m py-64 md:px-gutter-t lg:px-gutter-d lg:py-80">
        <div className="grid grid-cols-1 gap-48 lg:grid-cols-3 lg:gap-32">
          <div>
            <p className="font-display text-h3-m leading-none text-text-pri">
              DAH
            </p>
            <p className="mt-16 text-body-m text-text-pri md:text-body-d">
              {site.nameKr}
            </p>
            <p className="mt-4 text-small-m text-text-sec md:text-small-d">
              {site.nameEn}
            </p>
            <p className="mt-16 text-small-m text-text-meta md:text-small-d">
              {site.address}
            </p>
          </div>

          <nav aria-label="페이지 링크">
            <ul className="flex flex-col gap-12">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-body-m text-text-sec transition-colors duration-fast ease-out hover:text-text-pri md:text-body-d"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="외부 링크">
            <ul className="flex flex-col gap-12">
              {externalLinks.map((item) => (
                <li key={item.key}>
                  <a
                    href={site.links[item.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-8 text-body-m text-text-sec transition-colors duration-fast ease-out hover:text-text-pri md:text-body-d"
                  >
                    {item.label}
                    <ArrowUpRight size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-64 border-t border-border-subtle pt-24 font-mono text-caption-m text-text-meta">
          © 2026 Hallym University Digital Arts and Humanities
        </p>
      </div>
    </footer>
  )
}

export default Footer
