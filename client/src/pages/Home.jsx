import { useTitle } from '../hooks/useTitle'
import HeroSection from '../components/home/HeroSection'
import NewsBar from '../components/home/NewsBar'
import IdentitySection from '../components/home/IdentitySection'
import TracksSection from '../components/home/TracksSection'
import CurriculumSection from '../components/home/CurriculumSection'
import StatsSection from '../components/home/StatsSection'
import PeoplePreview from '../components/home/PeoplePreview'
import NewsSection from '../components/home/NewsSection'
import FinalCTA from '../components/home/FinalCTA'
import Divider from '../components/common/Divider'

// P10: 연속 그리드 섹션 사이에만 Divider (Identity–Tracks, Stats–PeoplePreview)
const DIVIDER_WRAP =
  'mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide'

function Home() {
  useTitle(null)

  return (
    <>
      <HeroSection />
      <NewsBar />
      <IdentitySection />
      <div className={DIVIDER_WRAP}>
        <Divider />
      </div>
      <TracksSection />
      <CurriculumSection />
      <StatsSection />
      <div className={DIVIDER_WRAP}>
        <Divider />
      </div>
      <PeoplePreview />
      <NewsSection />
      <FinalCTA />
    </>
  )
}

export default Home
