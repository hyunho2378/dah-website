import { Link } from 'react-router-dom'
import { useLang } from '../../i18n/LangContext'
import Container from './Container'

// 10_IA_V2 5절 · 11_DESIGN_V2 4절 PageBanner — 전 서브페이지 공통 골격(KPC 문법)
// 페이지명(명사형) + 브레드크럼(Link) + 우주 배경 변주
// 성운(bg-nebula)은 CSS 변수 --x/--y 좌표만 페이지별로 다르게 → "같은 우주, 다른 좌표"
// 시그니처 계약 고정 — B4·B5가 이대로 사용한다:
// <PageBanner titleKo titleEn breadcrumb={[{label,to}]} nebulaX="30%" nebulaY="20%" />
// EN 캡스 eyebrow → 헤드라인용 표기(단어별 첫 글자만 대문자)
function properCase(caps) {
  return String(caps)
    .toLowerCase()
    .replace(/(^|\s|&)\S/g, (c) => c.toUpperCase())
}

function PageBanner({ titleKo, titleEn, breadcrumb = [], nebulaX = '30%', nebulaY = '20%' }) {
  const { lang, t } = useLang()
  // H4.2: 두 언어 모두 동일 구조(eyebrow + 제목) 유지 — 레이아웃 변형 금지.
  // eyebrow는 항상 EN 캡스, 헤드라인만 언어에 맞게 교체(en: titleEn proper-case, ko: 국문).
  const headline = lang === 'en' && titleEn ? properCase(titleEn) : titleKo
  const eyebrow = titleEn

  return (
    <section
      className="border-b border-border-subtle bg-nebula"
      style={{ '--x': nebulaX, '--y': nebulaY }}
    >
      <Container className="pb-40 pt-48 md:pb-64 md:pt-80">
        {breadcrumb.length > 0 && (
          <nav aria-label={t('aria.breadcrumb')}>
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
        {eyebrow && (
          <p
            className={`font-display text-label-m font-bold uppercase tracking-label text-text-sec md:text-label-d ${
              breadcrumb.length > 0 ? 'mt-24' : ''
            }`}
          >
            {eyebrow}
          </p>
        )}
        {/* v2: KR 헤드라인 700(font-bold), 800 남발 금지 */}
        <h1
          className={`text-h1-m font-bold leading-tight tracking-display text-text-pri md:text-h1-d ${
            eyebrow ? 'mt-12' : breadcrumb.length > 0 ? 'mt-24' : ''
          }`}
        >
          {headline}
        </h1>
      </Container>
    </section>
  )
}

export default PageBanner
