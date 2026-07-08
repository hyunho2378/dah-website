// AdminLayout.jsx — 어드민 공통 골격 (13_CMS_SPEC 6절, 14_ROUTES_V2 가드)
// RequireRole(manager) 래핑 + 글래스 사이드 네비 + <Outlet />.
// J1: 콘텐츠 영역을 공용 Container 정렬로 통일 + 사이드바는 독립 스크롤
//     (sticky, 뷰포트 높이 기준 overflow-y-auto — 길어져도 콘텐츠와 따로 스크롤).
// J2: ErrorBoundary — 렌더 크래시 시 빈 화면 대신 오류 안내를 표시한다.

import { Component, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, Outlet } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import PageBanner from '../layout/PageBanner'
import Container from '../layout/Container'
import { GhostButton, PrimaryButton } from './FormControls'
import { RequireRole, useAuth } from '../../context/AuthContext'

const NAV_GROUPS = [
  {
    label: 'OWNER',
    role: 'owner',
    items: [{ to: '/admin/users', label: '사용자' }],
  },
  {
    label: 'CONTENT',
    role: 'manager',
    items: [
      { to: '/admin', label: '대시보드', end: true },
      { to: '/admin/posts/notice', label: '공지사항' },
      { to: '/admin/posts/resource', label: '자료실' },
      { to: '/admin/posts/lecture', label: '특강' },
      { to: '/admin/posts/contest', label: '공모전' },
      { to: '/admin/posts/exhibitions', label: '프로젝트 전시회' },
      { to: '/admin/posts/achievement', label: '학생 성과' },
      { to: '/admin/posts/club', label: '동아리' },
      { to: '/admin/posts/portfolios', label: '포트폴리오' },
      { to: '/admin/showcase', label: '웹&앱 쇼케이스' },
    ],
  },
  {
    label: 'STRUCTURE',
    role: 'admin',
    items: [
      { to: '/admin/professors', label: '교수진' },
      { to: '/admin/mentors', label: '멘토' },
      { to: '/admin/curriculum', label: '교과목' },
      { to: '/admin/codesharing', label: '코드쉐어링' },
      { to: '/admin/nanodegree', label: '나노디그리' },
      { to: '/admin/ci', label: 'CI' },
      { to: '/admin/council', label: '운영위원회' },
      { to: '/admin/careers', label: '취업 현황' },
    ],
  },
  {
    label: 'SYSTEM',
    role: 'admin',
    items: [
      { to: '/admin/exhibition', label: '전시회 설정' },
      { to: '/admin/settings', label: '사이트 설정' },
      { to: '/admin/consultations', label: '상담 신청' },
    ],
  },
]

const navLinkClass = ({ isActive }) =>
  `flex items-center rounded-md px-12 py-8 text-body-m transition duration-fast ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus ${
    isActive
      ? 'bg-glass-strong text-text-pri'
      : 'text-text-sec hover:bg-glass-strong hover:text-text-pri'
  }`

// J2: 어드민 렌더 크래시 안전망 — 빈 화면 금지, 오류 원인 노출
class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-start gap-16 rounded-md border border-border-subtle bg-bg-elev p-24">
          <h2 className="text-h3-m font-bold text-text-pri md:text-h3-d">
            화면 렌더 중 오류가 발생했습니다
          </h2>
          <p className="font-mono text-caption-m text-state-error">
            {String(this.state.error?.message || this.state.error)}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="cursor-pointer rounded-sm border border-border-subtle px-16 py-8 text-small-m text-text-pri transition duration-fast ease-out hover:border-border-strong"
          >
            다시 시도
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// 로그아웃 확인 모달 — 즉시 로그아웃 방지. LoginModal과 동일 글래스 패턴(백드롭·ESC 닫기).
// 브라우저 네이티브 다이얼로그(window.confirm) 금지. 포커스 트랩은 요구 안 함(ESC·백드롭만).
function LogoutConfirm({ onCancel, onConfirm }) {
  const panelRef = useRef(null)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector('button')?.focus()
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [onCancel])

  // U2-1: 포털로 document.body에 렌더 — AdminNav 내부 중첩 스택 컨텍스트 탈출.
  // z-[100]으로 헤더(z-50)·콘텐츠 위에 확실히 올린다.
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-gutter-m">
      <button
        type="button"
        aria-label="닫기"
        tabIndex={-1}
        onClick={onCancel}
        className="absolute inset-0 bg-black/60"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        className="relative w-full max-w-sm rounded-glass border border-glass-line bg-cosmos-depth1/[0.96] p-32 backdrop-blur-glass"
      >
        <h2 id="logout-confirm-title" className="text-h3-m font-bold text-text-pri md:text-h3-d">
          로그아웃 하시겠습니까?
        </h2>
        <div className="mt-24 flex justify-end gap-8">
          <GhostButton onClick={onCancel}>취소</GhostButton>
          <PrimaryButton onClick={onConfirm}>확인</PrimaryButton>
        </div>
      </div>
    </div>,
    document.body
  )
}

function AdminNav() {
  const { user, logout, hasRole } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <nav
        aria-label="관리 메뉴"
        className="flex flex-col gap-24 rounded-glass border border-glass-line bg-glass-bg p-16 backdrop-blur-glass-mobile"
      >
        <div className="flex items-center justify-between gap-8 border-b border-border-subtle pb-16">
          <span className="min-w-0">
            <span className="block truncate text-body-m font-semibold text-text-pri">
              {user?.name}
            </span>
            <span className="block font-mono text-caption-m uppercase tracking-label text-text-meta">
              {user?.role}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            aria-label="로그아웃"
            className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-sm text-text-sec transition duration-fast ease-out hover:bg-glass-strong hover:text-text-pri focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
          >
            <LogOut size={16} />
          </button>
        </div>

        {NAV_GROUPS.filter((group) => hasRole(group.role)).map((group) => (
          <div key={group.label} className="flex flex-col gap-8">
            <p className="font-mono text-label-m uppercase tracking-label text-text-meta">
              {group.label}
            </p>
            <ul className="flex flex-wrap gap-4 lg:flex-col">
              {group.items.map((item) => (
                <li key={item.to} className="min-w-0">
                  <NavLink to={item.to} end={item.end} className={navLinkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      {confirmOpen && (
        <LogoutConfirm
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false)
            logout()
          }}
        />
      )}
    </>
  )
}

function AdminLayout() {
  return (
    <RequireRole role="manager">
      <PageBanner titleKo="관리" titleEn="ADMIN" nebulaX="76%" nebulaY="18%" />
      {/* J1: 공용 Container 정렬 — 공개 페이지와 좌우선 일치 */}
      <Container className="pb-section-m pt-32 lg:grid lg:grid-cols-[240px,minmax(0,1fr)] lg:items-start lg:gap-32">
        {/* J1: 사이드바 독립 스크롤 — 뷰포트 기준 sticky + 내부 overflow */}
        <aside className="mb-32 lg:sticky lg:top-96 lg:mb-0 lg:max-h-[calc(100vh-theme(spacing.128))] lg:overflow-y-auto">
          <AdminNav />
        </aside>
        <main className="min-w-0">
          <AdminErrorBoundary>
            <Outlet />
          </AdminErrorBoundary>
        </main>
      </Container>
    </RequireRole>
  )
}

export default AdminLayout
