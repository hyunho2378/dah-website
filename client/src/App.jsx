import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LoginModalProvider } from './context/LoginModalContext'
import { LangProvider } from './i18n/LangContext'
import CosmosBackground from './components/cosmos/CosmosBackground'
import ScrollToTop from './components/layout/ScrollToTop'
import Header from './components/layout/Header'
import GlassDock from './components/layout/GlassDock'
import Footer from './components/layout/Footer'
import LoginModal from './components/auth/LoginModal'

import Home from './pages/Home'
import About from './pages/About'
import People from './pages/People'
import Curriculum from './pages/Curriculum'
import CodeSharing from './pages/CodeSharing'
import Exhibitions from './pages/programs/Exhibitions'
import ExhibitionDetail from './pages/programs/ExhibitionDetail'
import Contests from './pages/programs/Contests'
import ContestDetail from './pages/programs/ContestDetail'
import Lectures from './pages/programs/Lectures'
import LectureDetail from './pages/programs/LectureDetail'
import Council from './pages/students/Council'
import Clubs from './pages/students/Clubs'
import StudentsAchievements from './pages/students/Achievements'
import StudentsCareers from './pages/students/Careers'
import ShowcaseGrid from './pages/showcase/ShowcaseGrid'
import ShowcaseDetail from './pages/showcase/ShowcaseDetail'
import ShowcaseSubmit from './pages/showcase/ShowcaseSubmit'
import ExhibitSubmit from './pages/submit/ExhibitSubmit'
import ExhibitEdit from './pages/submit/ExhibitEdit'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Resources from './pages/Resources'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

// 어드민(Tiptap 포함)은 코드 분할 — 공개 방문자는 다운로드하지 않는다
const AdminRoutes = lazy(() => import('./pages/AdminRoutes'))

// 공개 콘텐츠 라우트 — ko 원본과 /en 미러 1:1 (14_ROUTES_V2).
// 접수·제출·로그인 플로우는 국문만(v2 스코프)이라 미러에서 제외.
const PUBLIC_ROUTES = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/about/people', element: <People /> },
  { path: '/curriculum', element: <Curriculum /> },
  { path: '/curriculum/codesharing', element: <CodeSharing /> },
  { path: '/programs/exhibitions', element: <Exhibitions /> },
  { path: '/programs/exhibitions/:id', element: <ExhibitionDetail /> },
  { path: '/programs/contests', element: <Contests /> },
  { path: '/programs/contests/:id', element: <ContestDetail /> },
  { path: '/programs/lectures', element: <Lectures /> },
  { path: '/programs/lectures/:id', element: <LectureDetail /> },
  { path: '/students/council', element: <Council /> },
  { path: '/students/clubs', element: <Clubs /> },
  { path: '/students/achievements', element: <StudentsAchievements /> },
  { path: '/students/careers', element: <StudentsCareers /> },
  { path: '/showcase', element: <ShowcaseGrid /> },
  { path: '/showcase/:id', element: <ShowcaseDetail /> },
  { path: '/news', element: <News /> },
  { path: '/news/:id', element: <NewsDetail /> },
  { path: '/resources', element: <Resources /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/terms', element: <Terms /> },
]

function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <AuthProvider>
          <LoginModalProvider>
          <CosmosBackground />
          <ScrollToTop />
          <Header />
          <main className="relative">
            <Routes>
              {PUBLIC_ROUTES.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
              {/* /en 미러 — LangContext가 프리픽스를 감지해 영문 라벨 렌더 */}
              {PUBLIC_ROUTES.map(({ path, element }) => (
                <Route
                  key={`/en${path}`}
                  path={path === '/' ? '/en' : `/en${path}`}
                  element={element}
                />
              ))}

              {/* 제출·접수 플로우 (국문만) */}
              <Route path="/showcase/submit" element={<ShowcaseSubmit />} />
              <Route path="/submit" element={<ExhibitSubmit />} />
              <Route path="/submit/edit" element={<ExhibitEdit />} />

              {/* 관리 (지연 로드, 라우트별 RequireRole은 AdminRoutes 내부) */}
              <Route
                path="/admin/*"
                element={
                  <Suspense
                    fallback={
                      <p className="px-gutter-m py-section-m font-mono text-caption-m text-text-meta">
                        로딩 중
                      </p>
                    }
                  >
                    <AdminRoutes />
                  </Suspense>
                }
              />

              {/* v1 경로 리다이렉트 (IA v2 이관) */}
              <Route path="/tracks" element={<Navigate to="/curriculum" replace />} />
              <Route path="/people" element={<Navigate to="/about/people" replace />} />
              <Route path="/achievements" element={<Navigate to="/students/achievements" replace />} />
              <Route path="/careers" element={<Navigate to="/students/careers" replace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <GlassDock />
          <LoginModal />
          </LoginModalProvider>
        </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  )
}

export default App
