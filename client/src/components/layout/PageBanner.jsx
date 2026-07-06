import { Link } from 'react-router-dom'

// 10_IA_V2 5절 · 11_DESIGN_V2 4절 PageBanner — 전 서브페이지 공통 골격(KPC 문법)
// 페이지명(명사형) + 브레드크럼(Link) + 우주 배경 변주
// 성운(bg-nebula)은 CSS 변수 --x/--y 좌표만 페이지별로 다르게 → "같은 우주, 다른 좌표"
// 시그니처 계약 고정 — B4·B5가 이대로 사용한다:
// <PageBanner titleKo titleEn breadcrumb={[{label,to}]} nebulaX="30%" nebulaY="20%" />
function PageBanner({ titleKo, titleEn, breadcrumb = [], nebulaX = '30%', nebulaY = '20%' }) {
  return (
    <section
      className="border-b border-border-subtle bg-nebula"
      style={{ '--x': nebulaX, '--y': nebulaY }}
    >
      <div className="mx-auto max-w-container px-gutter-m pb-40 pt-48 md:px-gutter-t md:pb-64 md:pt-80 lg:px-gutter-d">
        {breadcrumb.length > 0 && (
          <nav aria-label="브레드크럼">
            <ol className="flex flex-wrap items-center gap-8 font-mono text-caption-m text-text-meta md:text-caption-d">
              {breadcrumb.map((crumb, i) => {
                const isLast = i === breadcrumb.length - 1
                return (
                  <li key={`${crumb.label}-${i}`} className="flex items-center gap-8">
                    {i > 0 && <span aria-hidden="true">/</span>}
                    {crumb.to && !isLast ? (
                      <Link
                        to={crumb.to}
                        className="transition-colors duration-fast ease-out hover:text-text-pri"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        aria-current={isLast ? 'page' : undefined}
                        className={isLast ? 'text-text-sec' : undefined}
                      >
                        {crumb.label}
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
        )}
        {titleEn && (
          <p
            className={`font-display text-label-m font-bold uppercase tracking-label text-text-sec md:text-label-d ${
              breadcrumb.length > 0 ? 'mt-24' : ''
            }`}
          >
            {titleEn}
          </p>
        )}
        {/* v2: KR 헤드라인 700(font-bold), 800 남발 금지 */}
        <h1
          className={`text-h1-m font-bold leading-tight tracking-display text-text-pri md:text-h1-d ${
            titleEn ? 'mt-12' : breadcrumb.length > 0 ? 'mt-24' : ''
          }`}
        >
          {titleKo}
        </h1>
      </div>
    </section>
  )
}

export default PageBanner
