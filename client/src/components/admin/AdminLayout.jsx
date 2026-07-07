// AdminLayout.jsx — 어드민 공통 골격 (13_CMS_SPEC 6절, 14_ROUTES_V2 가드)
// RequireRole(manager) 래핑 + 글래스 사이드 네비 + <Outlet />.
// PageBanner는 B2 계약 컴포넌트(components/common/) — BR 통합 시 경로 확인.

import { NavLink, Outlet } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import PageBanner from '../common/PageBanner'
import { RequireRole, useAuth } from '../../context/AuthContext'

const NAV_GROUPS = [
  {
    label: 'CONTENT',
    role: 'manager',
    items: [
      { to: '/admin', label: '대시보드', end: true },
      { to: '/admin/posts/notice', label: '공지사항' },
      { to: '/admin/posts/resource', label: '자료실' },
      { to: '/admin/posts/lecture', label: '특강' },
      { to: '/admin/posts/contest', label: '공모전' },
      { to: '/admin/posts/exhibitions', label: '전시회' },
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
    ],
  },
  {
    label: 'OWNER',
    role: 'owner',
    items: [{ to: '/admin/users', label: '사용자' }],
  },
]

const navLinkClass = ({ isActive }) =>
  `flex items-center rounded-md px-12 py-8 text-body-m transition duration-fast ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus ${
    isActive
      ? 'bg-glass-strong text-text-pri'
      : 'text-text-sec hover:bg-glass-strong hover:text-text-pri'
  }`

function AdminNav() {
  const { user, logout, hasRole } = useAuth()

  return (
    <nav
      aria-label="관리 메뉴"
      className="flex flex-col gap-24 rounded-glass border border-glass-line bg-glass-bg p-16 backdrop-blur-glass-mobile lg:sticky lg:top-96"
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
          onClick={logout}
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
  )
}

function AdminLayout() {
  return (
    <RequireRole role="manager">
      <PageBanner titleKo="관리" titleEn="ADMIN" nebulaX="76%" nebulaY="18%" />
      <div className="mx-auto w-full max-w-container-wide px-gutter-m pb-section-m pt-32 md:px-gutter-t lg:grid lg:grid-cols-[240px,minmax(0,1fr)] lg:gap-32 lg:px-gutter-d">
        <aside className="mb-32 lg:mb-0">
          <AdminNav />
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </RequireRole>
  )
}

export default AdminLayout
