import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loadGtag, sendPageview } from '../utils/analytics'

// Analytics.jsx — GA4 라우트 추적 (39_GA4)
// 로그인한 관리자(어드민)의 활동이 일반 방문자 통계에 섞이지 않도록,
// 인증 확인이 끝나기 전(loading)과 로그인 상태(user)에서는 전송을 건너뛴다.
function Analytics() {
  const { pathname, search } = useLocation()
  const { user, loading } = useAuth()

  useEffect(() => {
    loadGtag()
  }, [])

  useEffect(() => {
    if (loading || user) return
    sendPageview(pathname + search)
  }, [pathname, search, user, loading])

  return null
}

export default Analytics
