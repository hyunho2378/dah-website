import { useTitle } from '../hooks/useTitle'
import { useApi } from '../hooks/useApi'
import useContentVisibility from '../hooks/useContentVisibility'
import { HOME_SECTION_VISIBILITY } from '../data/visibility'
import HeroSection from '../components/home/HeroSection'
import ProgramShowcase from '../components/home/ProgramShowcase'
import TracksSection from '../components/home/TracksSection'
import AchievementsHighlight from '../components/home/AchievementsHighlight'
import NewsSection from '../components/home/NewsSection'

// 홈 v2 (10_IA_V2 4절, 순서 고정):
// 1 Hero → 2 퀵링크 → 3 프로그램 마스터-디테일 → 4 트랙 3 → 5 성과 하이라이트 → 6 최신 소식 → 7 Final CTA
// v1 섹션(NewsBar·Identity·Curriculum·Stats·PeoplePreview)은 홈에서 제외 — 파일 정리는 BR 담당.
// 38_UI_FIX_BATCH: 홈에서는 Divider를 쓰지 않는다(P10 예외). 섹션 구분은 여백만.
// Divider 컴포넌트 자체는 People·Careers가 계속 사용하므로 유지한다.
function Home() {
  useTitle(null)

  // site_settings 공개 설정 — 히어로 버튼 오버라이드 + 접수 기간 노출 판정에 공용
  const { data: settings } = useApi('/settings/public')

  // 38_VISIBILITY: 섹션이 다루는 유형이 전부 비공개면 섹션 자체를 렌더하지 않는다
  // (P6 빈 상태 규칙: 홈에서는 데이터가 비면 섹션을 아예 그리지 않는다).
  // 트랙 섹션은 정적 데이터(data/tracks.js) 기반이라 가시성 제어 대상이 아니다.
  const { isPublic } = useContentVisibility()
  const showSection = (key) => HOME_SECTION_VISIBILITY[key].some((t) => isPublic(t))

  return (
    <>
      <HeroSection settings={settings} />
      {/* G13: 퀵링크 바 삭제 — 히어로 하단 페이드가 다음 섹션으로 바로 이어진다 */}
      {showSection('programs') && <ProgramShowcase />}
      <TracksSection />
      {showSection('achievements') && <AchievementsHighlight />}
      {showSection('news') && <NewsSection />}
      {/* J9: FinalCTA(BUILD WHAT'S NEXT) 섹션 삭제 */}
    </>
  )
}

export default Home
