// AuthContext.jsx — 인증 컨텍스트 (12_BACKEND 3절, 14_ROUTES_V2 가드)
// user는 메모리만 보관. 토큰은 httpOnly 쿠키 — JS가 읽지 않는다. storage 금지.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../hooks/useApi'
import { useLoginModal } from './LoginModalContext'

const ROLE_RANK = { manager: 1, admin: 2, owner: 3 }

// 13_CMS_SPEC 1절 편집 가능 매트릭스 (유형 → 최소 롤)
const EDIT_MIN_ROLE = {
  // manager+
  notice: 'manager',
  resource: 'manager',
  lecture: 'manager',
  contest: 'manager',
  exhibition: 'manager',
  exhibitions: 'manager',
  achievement: 'manager',
  portfolio: 'manager',
  portfolios: 'manager',
  club: 'manager',
  showcase: 'manager',
  // admin+
  professor: 'admin',
  professors: 'admin',
  mentor: 'admin',
  mentors: 'admin',
  curriculum: 'admin',
  codesharing: 'admin',
  nanodegree: 'admin',
  council: 'admin',
  career: 'admin',
  careers: 'admin',
  // 사이트 설정 — 13_CMS 1절 owner·admin, 14_ROUTES_V2 /admin/settings admin
  settings: 'admin',
  // owner 전용
  users: 'owner',
  export: 'owner',
}

function unwrapUser(data) {
  if (!data) return null
  if (data.user) return data.user
  if (data.id && data.role) return data
  return null
}

// Provider 밖에서 useAuth가 호출돼도 편집 UI가 전부 미렌더되도록 안전 기본값
const FALLBACK = {
  user: null,
  loading: false,
  login: async () => {
    throw new Error('AuthProvider가 마운트되지 않았습니다.')
  },
  setupPassword: async () => {
    throw new Error('AuthProvider가 마운트되지 않았습니다.')
  },
  logout: async () => {},
  canEdit: () => false,
  hasRole: () => false,
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 부트스트랩 — 쿠키로 GET /auth/me
  useEffect(() => {
    let alive = true
    api
      .get('/auth/me')
      .then((data) => {
        if (alive) setUser(unwrapUser(data))
      })
      .catch(() => {
        if (alive) setUser(null)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password })
      // 최초 온보딩: must_set_pw면 비밀번호 설정 플로우로 전환 (12_BACKEND 3절)
      if (data?.must_set_pw) return data
      setUser(unwrapUser(data))
      return data
    } catch (err) {
      // B1 실제 계약: 미설정 계정은 403 + { mustSetPassword: true } — setup 분기로 정규화
      if (err.status === 403 && err.body?.mustSetPassword) return { must_set_pw: true }
      throw err
    }
  }, [])

  const setupPassword = useCallback(async (email, password) => {
    const data = await api.post('/auth/setup-password', { email, password })
    setUser(unwrapUser(data))
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      setUser(null)
    }
  }, [])

  /** 편집 매트릭스 판정 — 비로그인·미지정 유형은 항상 false (미렌더 원칙) */
  const canEdit = useCallback(
    (type) => {
      if (!user) return false
      const min = EDIT_MIN_ROLE[String(type || '').toLowerCase()]
      if (!min) return false
      return (ROLE_RANK[user.role] || 0) >= ROLE_RANK[min]
    },
    [user]
  )

  /** 최소 롤 충족 판정 — 라우트 가드·네비 필터용 */
  const hasRole = useCallback(
    (role) => Boolean(user) && (ROLE_RANK[user.role] || 0) >= (ROLE_RANK[role] || 0),
    [user]
  )

  const value = useMemo(
    () => ({ user, loading, login, setupPassword, logout, canEdit, hasRole }),
    [user, loading, login, setupPassword, logout, canEdit, hasRole]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth — { user, loading, login, setupPassword, logout, canEdit, hasRole }
 * user: { id, name, role } | null
 */
export function useAuth() {
  return useContext(AuthContext) || FALLBACK
}

function ForbiddenView() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-container flex-col items-center justify-center gap-16 px-gutter-m py-section-m text-center md:px-gutter-t lg:px-gutter-d">
      <p className="font-display text-display-l-m font-bold tracking-display text-text-pri md:text-display-l-d">
        403
      </p>
      <h1 className="text-h3-m font-bold text-text-pri md:text-h3-d">접근 권한 없음</h1>
      <p className="text-body-m text-text-sec md:text-body-d">
        이 페이지에 접근할 수 있는 권한이 없습니다.
      </p>
      <Link
        to="/"
        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-sm border border-border-subtle px-24 text-body-m font-semibold text-text-pri transition duration-fast ease-out hover:border-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus md:h-48"
      >
        홈으로 돌아가기
      </Link>
    </section>
  )
}

/**
 * AuthWall — 비로그인 가드 뷰 (F9, 16_PHASE4).
 * /login 페이지가 폐기돼 리다이렉트 대신 로그인 모달을 연다.
 * 현재 URL을 유지하므로 로그인 성공 시 RequireRole이 재평가되어 자식이 노출된다.
 */
function AuthWall() {
  const { openLogin } = useLoginModal()

  useEffect(() => {
    openLogin()
  }, [openLogin])

  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-container flex-col items-center justify-center gap-16 px-gutter-m py-section-m text-center md:px-gutter-t lg:px-gutter-d">
      <h1 className="text-h3-m font-bold text-text-pri md:text-h3-d">로그인 필요</h1>
      <p className="text-body-m text-text-sec md:text-body-d">
        이 페이지는 로그인 후 이용할 수 있습니다.
      </p>
      <button
        type="button"
        onClick={openLogin}
        className="inline-flex h-11 cursor-pointer items-center justify-center rounded-sm border border-border-subtle px-24 text-body-m font-semibold text-text-pri transition duration-fast ease-out hover:border-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus md:h-48"
      >
        로그인
      </button>
    </section>
  )
}

/**
 * RequireRole — 라우트 가드 (14_ROUTES_V2).
 * 비로그인 → 로그인 모달 오픈(AuthWall, URL 유지), 롤 미충족 → 403 뷰.
 */
export function RequireRole({ role = 'manager', children }) {
  const { user, loading, hasRole } = useAuth()

  if (loading) return null
  if (!user) return <AuthWall />
  if (!hasRole(role)) return <ForbiddenView />
  return children
}
