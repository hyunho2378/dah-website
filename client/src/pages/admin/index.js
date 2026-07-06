// index.js — 어드민 라우트 → 컴포넌트 매핑 (14_ROUTES_V2 관리 라우트, BR 조립용)
// 전부 AdminLayout(자체 RequireRole manager 래핑) 하위. role은 라우트별 최소 롤 —
// manager 초과 라우트는 BR이 <RequireRole role={route.role}> 로 감싼다.
//
// 조립 예 (App.jsx, BR):
//   <Route path="/admin" element={<AdminLayout />}>
//     {ADMIN_ROUTES.map(({ path, index, Component, role }) => (
//       <Route
//         key={path || 'index'}
//         index={index}
//         path={path}
//         element={role === 'manager' ? <Component /> : (
//           <RequireRole role={role}><Component /></RequireRole>
//         )}
//       />
//     ))}
//   </Route>

import AdminLayout from '../../components/admin/AdminLayout'
import Dashboard from './Dashboard'
import PostList from './PostList'
import PostForm from './PostForm'
import ShowcaseQueue from './ShowcaseQueue'
import ProfessorsAdmin from './ProfessorsAdmin'
import MentorsAdmin from './MentorsAdmin'
import CurriculumAdmin from './CurriculumAdmin'
import CodeSharingAdmin from './CodeSharingAdmin'
import CouncilAdmin from './CouncilAdmin'
import CareersAdmin from './CareersAdmin'
import ExhibitionAdmin from './ExhibitionAdmin'
import SettingsAdmin from './SettingsAdmin'
import UsersAdmin from './UsersAdmin'

export { AdminLayout }

/** @type {Array<{ path?: string, index?: boolean, Component: Function, role: 'manager'|'admin'|'owner' }>} */
export const ADMIN_ROUTES = [
  { index: true, Component: Dashboard, role: 'manager' },
  { path: 'posts/:type', Component: PostList, role: 'manager' },
  { path: 'posts/:type/new', Component: PostForm, role: 'manager' },
  { path: 'posts/:type/:id/edit', Component: PostForm, role: 'manager' },
  { path: 'showcase', Component: ShowcaseQueue, role: 'manager' },
  { path: 'professors', Component: ProfessorsAdmin, role: 'admin' },
  { path: 'mentors', Component: MentorsAdmin, role: 'admin' },
  { path: 'curriculum', Component: CurriculumAdmin, role: 'admin' },
  { path: 'codesharing', Component: CodeSharingAdmin, role: 'admin' },
  { path: 'council', Component: CouncilAdmin, role: 'admin' },
  { path: 'careers', Component: CareersAdmin, role: 'admin' },
  { path: 'exhibition', Component: ExhibitionAdmin, role: 'admin' },
  { path: 'settings', Component: SettingsAdmin, role: 'admin' },
  { path: 'users', Component: UsersAdmin, role: 'owner' },
]
