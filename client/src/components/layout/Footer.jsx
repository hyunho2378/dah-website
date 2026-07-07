import Link from '../common/LangLink'
import { useLang } from '../../i18n/LangContext'
import Container from './Container'
import logoUrl from '../../assets/logo.svg'

// G7(18_PHASE6) 가로 재배치 — 세로 높이 축소(데스크탑 상하 32 이내).
// 데스크탑: 좌(로고 h-20 + 학과명 KR/EN·주소 2줄) | 우(개인정보처리방침 | 이용약관), 최하단 저작권 한 줄.
// 모바일만 세로 스택 허용(하단 여백은 GlassDock 가림 방지 유지).
// 상단 1px 헤어라인 + 불투명 배경(bg-bg-elev)으로 우주 배경(성운) 푸터 영역 제외.
function Footer() {
  const { lang, t } = useLang()
  return (
    <footer className="relative z-10 border-t border-border-subtle bg-bg-elev">
      <Container className="flex flex-col gap-16 pb-96 pt-24 lg:py-32">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:justify-between">
          {/* 좌: 로고 + 학과 정보 2줄 */}
          <div className="flex items-start gap-16">
            <img src={logoUrl} alt="디지털인문예술전공" className="h-20 w-auto" />
            <div className="flex flex-col gap-2">
              <p className="text-small-m text-text-pri md:text-small-d">
                {t('footer.university')} {t('footer.department')}
                {/* EN 모드는 학과명이 이미 영문 — 병기 생략(중복 방지) */}
                {lang === 'ko' && (
                  <span className="ml-8 text-text-sec">Digital Arts and Humanities</span>
                )}
              </p>
              <p className="text-small-m text-text-meta md:text-small-d">
                {t('footer.address')}
              </p>
              {/* H8: 대표 전화 */}
              <p className="text-small-m text-text-meta md:text-small-d">
                TEL 033-248-3556
              </p>
            </div>
          </div>

          {/* 우: 정책 링크 */}
          <div className="flex items-center gap-x-12 text-small-m text-text-sec md:text-small-d">
            <Link
              to="/privacy"
              className="transition-colors duration-fast ease-out hover:text-text-pri"
            >
              {t('footer.privacy')}
            </Link>
            <span aria-hidden="true" className="text-text-meta">|</span>
            <Link
              to="/terms"
              className="transition-colors duration-fast ease-out hover:text-text-pri"
            >
              {t('footer.terms')}
            </Link>
          </div>
        </div>

        {/* 최하단: 저작권 한 줄 */}
        <p className="font-mono text-caption-m text-text-meta md:text-caption-d">
          {t('footer.copyright')}
        </p>
      </Container>
    </footer>
  )
}

export default Footer
