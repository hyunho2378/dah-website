import Link from '../common/LangLink'
import { useLang } from '../../i18n/LangContext'
import Container from './Container'
import logoUrl from '../../assets/logo.svg'

// K2-10 최종 조정 — 좌: 로고 + "한림대학교 디지털인문예술전공" 한 줄(영문 병기·주소 제거).
// 우: 정책 링크 줄(개인정보처리방침 | 이용약관 | 상담 신청) / TEL / 메일. 최하단 저작권 유지.
// /consult 라우트는 통합자가 연결(K1이 페이지 생성 중) — 여기서는 LangLink 배치만.
// 상단 1px 헤어라인 + 불투명 배경(bg-bg-elev)으로 우주 배경(성운) 푸터 영역 제외.
function Footer() {
  const { t } = useLang()
  return (
    <footer className="relative z-10 border-t border-border-subtle bg-bg-elev">
      {/* Y1-2로 하단 GlassDock이 사라져 도크 회피용 pb-96 여백은 불필요해졌다 */}
      <Container className="flex flex-col gap-16 py-24 lg:py-32">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:justify-between">
          {/* 좌: 로고 + 학과명 한 줄 */}
          <div className="flex items-center gap-16">
            <img src={logoUrl} alt="디지털인문예술전공" className="h-20 w-auto" />
            <p className="text-small-m text-text-pri md:text-small-d">
              {t('footer.university')} {t('footer.department')}
            </p>
          </div>

          {/* 우: 정책 링크 줄 + TEL + 메일 */}
          <div className="flex flex-col gap-4 lg:items-end">
            {/* Y1-6: 정책·상담 링크는 새 탭. target이 _self가 아니면 react-router가 클릭을
                가로채지 않고 실제 새 문서 로드가 일어나므로, 열린 탭은 항상 최상단에서 시작한다. */}
            <div className="flex flex-wrap items-center gap-x-12 text-small-m text-text-sec md:text-small-d">
              <Link
                to="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-fast ease-out hover:text-text-pri"
              >
                {t('footer.privacy')}
              </Link>
              <span aria-hidden="true" className="text-text-meta">|</span>
              <Link
                to="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-fast ease-out hover:text-text-pri"
              >
                {t('footer.terms')}
              </Link>
              <span aria-hidden="true" className="text-text-meta">|</span>
              <Link
                to="/consult"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-fast ease-out hover:text-text-pri"
              >
                {t('footer.consult')}
              </Link>
            </div>
            <p className="text-small-m text-text-meta md:text-small-d">TEL 033-248-3556</p>
            <a
              href="mailto:de46141@hallym.ac.kr"
              className="text-small-m text-text-meta transition-colors duration-fast ease-out hover:text-text-pri md:text-small-d"
            >
              de46141@hallym.ac.kr
            </a>
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
