# 14_ROUTES_V2 — React Router v6 전체 라우트

## 공개

| path | element | 데이터 |
|---|---|---|
| / | Home | settings, posts 요약 |
| /about | About | 정적 + history |
| /about/people | People | professors, mentors |
| /curriculum | Curriculum | curriculum(트랙: common 최상단) |
| /curriculum/codesharing | CodeSharing | codesharing + HWP 링크 |
| /programs/exhibitions | ExhibitionList | exhibitions (포스터 그리드) |
| /programs/exhibitions/:id | ExhibitionDetail | T2 확장 |
| /programs/contests | ContestList | posts?type=contest |
| /programs/contests/:id | ContestDetail | external_url 있으면 리스트에서 직행 옵션 |
| /programs/lectures | LectureList / :id Detail | posts?type=lecture |
| /students/council | CouncilArchive | council 기수별 |
| /students/clubs | Clubs | posts?type=club |
| /students/achievements | Achievements | 성좌 전용 뷰 |
| /students/careers | Careers | careers + portfolios |
| /showcase | ShowcaseGrid | showcase?status=published |
| /showcase/:id | ShowcaseDetail | T3 |
| /showcase/submit | ShowcaseSubmit | 비로그인 제출 |
| /news | NewsList | posts?type=notice (태그 필터·검색·페이지네이션) |
| /news/:id | NewsDetail | T1 + 공유 |
| /resources | Resources | posts?type=resource |
| /submit | ExhibitSubmit | 기간 검증(서버) |
| /submit/edit | ExhibitEdit | 이메일+비번 |
| /login | Login | 온보딩 분기 |
| * | NotFound | |

## 영문 미러

/en 프리픽스로 위 공개 라우트 전체 1:1. LangContext가 prefix 감지. 어드민·접수 플로우는 국문만(v2 스코프).

## 관리 (RequireRole 가드, 비로그인 접근 시 /login)

| path | 최소 롤 |
|---|---|
| /admin | manager |
| /admin/posts/:type (+ /new, /:id/edit) | manager |
| /admin/professors, /admin/mentors | admin |
| /admin/curriculum, /admin/codesharing | admin |
| /admin/council | admin |
| /admin/careers | admin |
| /admin/showcase (승인 큐) | manager |
| /admin/exhibition (일정·접수 현황) | admin |
| /admin/settings | admin (히어로 버튼 포함) |
| /admin/users, /admin/export | owner |

## 가드 구현

- AuthContext: GET /auth/me 부트스트랩(쿠키), user {role} 보관(메모리만)
- RequireRole(role): 미충족 시 로그인 또는 403 뷰
- 편집 인라인 버튼: useAuth().canEdit(type) 헬퍼로 조건 렌더(미렌더 원칙)
- ScrollToTop·useTitle 유지, en 라우트는 title 영문