import { useTitle } from '../hooks/useTitle'
import { useApi } from '../hooks/useApi'
import HeroSection from '../components/home/HeroSection'
import QuickLinks from '../components/home/QuickLinks'
import ProgramShowcase from '../components/home/ProgramShowcase'
import TracksSection from '../components/home/TracksSection'
import AchievementsHighlight from '../components/home/AchievementsHighlight'
import NewsSection from '../components/home/NewsSection'
import FinalCTA from '../components/home/FinalCTA'
import Divider from '../components/common/Divider'

// 홈 v2 (10_IA_V2 4절, 순서 고정):
// 1 Hero → 2 퀵링크 → 3 프로그램 마스터-디테일 → 4 트랙 3 → 5 성과 하이라이트 → 6 최신 소식 → 7 Final CTA
// v1 섹션(NewsBar·Identity·Curriculum·Stats·PeoplePreview)은 홈에서 제외 — 파일 정리는 BR 담당.
// P10: 연속 그리드 섹션 사이에만 Divider(프로그램–트랙, 트랙–성과)
function Home() {
  useTitle(null)

  // site_settings 공개 설정 — 히어로 버튼 오버라이드 + 접수 기간 노출 판정에 공용
  const { data: settings } = useApi('/settings/public')

  return (
    <>
      <HeroSection settings={settings} />
      <QuickLinks settings={settings} />
      <ProgramShowcase />
      <Divider />
      <TracksSection />
      <Divider />
      <AchievementsHighlight />
      <NewsSection />
      <FinalCTA />
    </>
  )
}

export default Home
