import { Link } from 'react-router-dom'
import Container from './Container'
import logoUrl from '../../assets/logo.svg'

// FOOTER(16_PHASE4 v2) 전면 축소 — 사이트맵(헤더 메뉴 복제)·Related 섹션 제거.
// 구성: (1) 로고 + 학과명/영문/주소 (2) 정책 링크 한 줄 (3) 카피라이트.
// 상단 1px 헤어라인 + 불투명 배경(bg-bg-elev)으로 StarField 푸터 영역 제외.
// 세로 패딩 대폭 축소(데스크탑 상하 48). 모바일 하단은 GlassDock(56+마진) 가림 방지로 확대 유지.
function Footer() {
  return (
    <footer className="relative z-10 border-t border-border-subtle bg-bg-elev">
      <Container className="flex flex-col gap-24 pb-96 pt-40 lg:py-48">
        {/* (1) 로고 + 학과 정보 */}
        <div>
          <img src={logoUrl} alt="디지털인문예술전공" className="h-24 w-auto md:h-28" />
          <p className="mt-16 text-body-m text-text-pri md:text-body-d">
            한림대학교 디지털인문예술전공
          </p>
          <p className="mt-4 text-small-m text-text-sec md:text-small-d">
            Digital Arts and Humanities
          </p>
          <p className="mt-4 text-small-m text-text-meta md:text-small-d">
            강원특별자치도 춘천시 한림대학길 1
          </p>
        </div>

        {/* (2) 정책 링크 한 줄 */}
        <div className="flex flex-wrap items-center gap-x-12 gap-y-8 text-small-m text-text-sec md:text-small-d">
          <Link
            to="/privacy"
            className="transition-colors duration-fast ease-out hover:text-text-pri"
          >
            개인정보처리방침
          </Link>
          <span aria-hidden="true" className="text-text-meta">|</span>
          <Link
            to="/terms"
            className="transition-colors duration-fast ease-out hover:text-text-pri"
          >
            이용약관
          </Link>
        </div>

        {/* (3) 카피라이트 */}
        <p className="font-mono text-caption-m text-text-meta md:text-caption-d">
          © 2026 디지털인문예술전공. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}

export default Footer
