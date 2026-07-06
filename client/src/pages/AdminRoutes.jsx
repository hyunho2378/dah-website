// /admin/* 서브트리 — React.lazy 분할 로드용 래퍼 (Tiptap 포함 어드민 번들을 공개 페이지와 분리)
import { Routes, Route } from 'react-router-dom'
import { RequireRole } from '../context/AuthContext'
import { ADMIN_ROUTES, AdminLayout } from './admin/index'

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {ADMIN_ROUTES.map(({ path, index, Component, role }) => (
          <Route
            key={path || 'index'}
            index={index}
            path={path}
            element={
              role === 'manager' ? (
                <Component />
              ) : (
                <RequireRole role={role}>
                  <Component />
                </RequireRole>
              )
            }
          />
        ))}
      </Route>
    </Routes>
  )
}

export default AdminRoutes
