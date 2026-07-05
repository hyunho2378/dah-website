import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Tracks from './pages/Tracks'
import People from './pages/People'
import Achievements from './pages/Achievements'
import Careers from './pages/Careers'
import News from './pages/News'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* <Header /> — AGENT-2 담당, PHASE 1에서 추가 */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tracks" element={<Tracks />} />
          <Route path="/people" element={<People />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/news" element={<News />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* <Footer /> — AGENT-2 담당, PHASE 1에서 추가 */}
    </BrowserRouter>
  )
}

export default App
