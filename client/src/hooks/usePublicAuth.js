// usePublicAuth.js — 공개 제출자(구글 로그인) 인증 훅 (41_GOOGLE_AUTH_PUBLIC)
//
// 스태프용 AuthContext(useAuth)와 별개다. 신원 클래스가 다르므로 상태도 섞지 않는다.
// 토큰은 httpOnly 쿠키 — JS가 읽지 않는다. storage 사용 금지(전역 규칙).
//
// 로그인은 SPA 안에서 처리할 수 없다(구글 동의 화면은 최상위 내비게이션 필요).
// login()은 백엔드 /auth/google/login으로 전체 페이지 이동시키고, 백엔드가 콜백 처리 후
// CLIENT_ORIGIN + next 로 되돌려보낸다.

import { useCallback, useEffect, useState } from 'react'
import { api, API_BASE } from './useApi'

/**
 * @returns {{ user: {id,email,name}|null, loading: boolean, login: Function, logout: Function, refresh: Function }}
 *   user: 로그인된 구글 계정. 비로그인 null
 *   login(next): next 경로(기본 현재 URL)를 보존한 채 구글 동의 화면으로 이동
 */
export function usePublicAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let alive = true
    api
      .get('/auth/public/me')
      .then((data) => {
        if (alive) setUser(data?.user ?? null)
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
  }, [tick])

  const login = useCallback((next) => {
    const target = next || `${window.location.pathname}${window.location.search}`
    window.location.href = `${API_BASE}/auth/google/login?next=${encodeURIComponent(target)}`
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/public/logout')
    } finally {
      setUser(null)
    }
  }, [])

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  return { user, loading, login, logout, refresh }
}

export default usePublicAuth
