// useContentVisibility.js — 콘텐츠 유형별 공개/비공개 (Y3-3, 33_PHASE18)
// 어드민 대시보드의 토글이 site_settings.contentVisibility에 저장하고,
// GET /settings/public이 기본값과 병합해 내려준다(서버 settings.js DEFAULT_VISIBILITY).
//
// 사용법:
//   const { isPublic, loading } = useContentVisibility()
//   if (!isPublic('portfolios')) { ... 섹션·메뉴 숨김 ... }
//
// 값이 아직 안 왔을 때는 기본값을 쓴다 — 공개 콘텐츠가 깜빡이며 사라지지 않게.
import { useApi } from './useApi'

export const DEFAULT_VISIBILITY = {
  notice: true,
  resource: true,
  lecture: true,
  contest: true,
  exhibitions: true,
  achievement: true,
  club: true,
  portfolios: false,
  showcase: true,
  professors: true,
  mentors: true,
  curriculum: true,
  council: true,
  careers: true,
}

export function useContentVisibility() {
  const { data, loading } = useApi('/settings/public')
  const remote = data?.settings?.contentVisibility
  const visibility =
    remote && typeof remote === 'object' ? { ...DEFAULT_VISIBILITY, ...remote } : DEFAULT_VISIBILITY

  return {
    visibility,
    loading,
    isPublic: (type) => visibility[type] !== false,
  }
}

export default useContentVisibility
