import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { site } from '../../data/site.js'
import { nav } from '../../data/nav.js'
import { useLang } from '../../i18n/LangContext'
import Container from './Container'

// F5(16_PHASE4) 실사이트화 — 상단 헤어라인 + 불투명 배경(bg-bg-elev)으로 StarField 차단.
// 3열: (1) 학과 정보 (2) 사이트맵(nav.js 전 페이지) (3) 관련 사이트(외부 링크)
// 최하단 바: 개인정보처리방침 | 이용약관 | © 2026 Hallym University DAH
// blur 미사용(성능 상한 3 보존) — 불투명 배경이 우주 배경 비침을 대신 차단한다.
// 표시 라벨은 사전(footer.links.*)에서 조회 — key로 site.links 및 사전 동시 참조
const externalLinks = ['hallym', 'exhibition', 'instagram']

function Footer() {
  const { lang, t } = useLang()
  const navLabel = (item) => (lang === 'en' ? item.labelEn : item.label)
  return (
    <footer className="relative z-10 border-t border-border-subtle bg-bg-elev">
      {/* lg 미만 하단 여백 확대: 하단 고정 GlassDock(56 + 마진)에 카피라이트가 가리지 않도록 */}
      <Container className="pb-128 pt-64 lg:py-80">
        <div className="grid grid-cols-1 gap-48 lg:grid-cols-3 lg:gap-32">
          {/* (1) 학과 정보 */}
          <div>
            <p className="font-display text-h3-m leading-none text-text-pri md:text-h3-d">
              DAH
            </p>
            <p className="mt-16 text-body-m text-text-pri md:text-body-d">
              {t('footer.university')} {site.nameKr}
            </p>
            <p className="mt-4 text-small-m text-text-sec md:text-small-d">
              {site.nameEn}
            </p>
            <p className="mt-16 text-small-m text-text-meta md:text-small-d">
              강원특별자치도 춘천시 한림대학길 1
            </p>
            {/* 데이터 갭: site.js에 대표 문의 메일 없음 — 추가되면 아래에 노출한다.
                site.mail 값이 생기면: <p>대표 문의: {site.mail}</p> */}
          </div>

          {/* (2) 사이트맵 — nav.js 전 페이지 */}
          <nav aria-label={t('aria.sitemap')}>
            <div className="flex flex-col gap-24">
              {nav.map((section) => (
                <div key={section.to}>
                  <p className="font-display text-caption-m uppercase tracking-label text-text-meta md:text-caption-d">
                    {section.labelEn}
                  </p>
                  <ul className="mt-8 flex flex-col gap-8">
                    {section.children.map((child) => (
                      <li key={child.to}>
                        <Link
                          to={child.to}
                          className="text-small-m text-text-sec transition-colors duration-fast ease-out hover:text-text-pri md:text-small-d"
                        >
                          {navLabel(child)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          {/* (3) 관련 사이트 — 외부 링크 */}
          <nav aria-label={t('aria.relatedSites')}>
            <p className="font-display text-caption-m uppercase tracking-label text-text-meta md:text-caption-d">
              Related
            </p>
            <ul className="mt-8 flex flex-col gap-12">
              {externalLinks.map((key) => (
                <li key={key}>
                  <a
                    href={site.links[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-8 text-body-m text-text-sec transition-colors duration-fast ease-out hover:text-text-pri md:text-body-d"
                  >
                    {t(`footer.links.${key}`)}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 최하단 바 — 정책 내부 링크 + 카피라이트 */}
        <div className="mt-64 flex flex-wrap items-center gap-x-12 gap-y-8 border-t border-border-subtle pt-24 font-mono text-caption-m text-text-meta md:text-caption-d">
          <Link
            to="/privacy"
            className="transition-colors duration-fast ease-out hover:text-text-pri"
          >
            {t('footer.privacy')}
          </Link>
          <span aria-hidden="true">|</span>
          <Link
            to="/terms"
            className="transition-colors duration-fast ease-out hover:text-text-pri"
          >
            {t('footer.terms')}
          </Link>
          <span aria-hidden="true">|</span>
          <span>© 2026 Hallym University DAH</span>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
