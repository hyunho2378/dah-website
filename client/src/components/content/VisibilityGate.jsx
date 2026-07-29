import { useLocation } from 'react-router-dom'
import useContentVisibility from '../../hooks/useContentVisibility'
import { useAuth } from '../../context/AuthContext'
import { visibilityTypesForPath } from '../../data/visibility'
import NotFound from '../../pages/NotFound'

// VisibilityGate.jsx — 38_VISIBILITY: 비공개 콘텐츠의 직접 URL 접근 차단.
//
// 메뉴에서 숨기는 것만으로는 주소를 아는 사람이 그대로 들어올 수 있다. 이 게이트가
// 공개 라우트를 감싸 비공개 유형이면 NotFound를 렌더한다.
//
// 계약:
//   - 로그인한 관리자는 그대로 통과 — 비공개 상태에서 내용을 확인·관리해야 한다.
//   - 비로그인 사용자에게는 존재 자체를 알리지 않도록 403이 아니라 404(NotFound)를 준다.
//   - 설정·인증이 아직 로딩 중이면 아무것도 렌더하지 않는다. 기본값으로 먼저 그렸다가
//     뒤늦게 404로 바뀌는 깜빡임(및 그 반대)을 막기 위함.
//   - 제어 대상이 아닌 경로(visibilityTypesForPath === null)는 그대로 통과.
function VisibilityGate({ children }) {
  const { pathname } = useLocation()
  const { isPublic, loading: visLoading } = useContentVisibility()
  const { user, loading: authLoading } = useAuth()

  const types = visibilityTypesForPath(pathname)
  if (!types) return children

  if (visLoading || authLoading) return null
  // 관리자는 비공개 콘텐츠도 볼 수 있다(운영상 필요)
  if (user) return children
  // 여러 유형이 걸린 페이지는 하나라도 공개면 연다(예: 교수진 비공개여도 멘토가 공개면 진입)
  if (types.some((t) => isPublic(t))) return children

  return <NotFound />
}

export default VisibilityGate
