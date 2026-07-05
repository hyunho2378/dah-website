# COMPONENTS.md — 컴포넌트 목록과 스펙

경로 규칙: 공통 src/components/common/, 레이아웃 src/components/layout/, 홈 섹션 src/components/home/, 페이지 src/pages/. 여기 없는 컴포넌트 임의 추가 금지.

## 1. 공통 (common/)

### SectionLabel.jsx
- props: index("01"), text("전공 소개"), as="p"
- mono 11~12px uppercase tracking 0.12em, index는 text.pri, text는 text.meta, 사이 헤어라인 24px
- 모든 섹션 도입부 필수 사용

### Reveal.jsx + useReveal.js (hooks/)
- IntersectionObserver 훅. threshold 0.15, 1회만 발동
- props: delay(ms), as. reduced-motion 시 즉시 표시
- 구현: 초기 opacity-0 translate-y-6, 발동 시 transition으로 해제

### Button.jsx
- props: variant("primary"|"secondary"), href, external(bool), children
- primary: bg text-invert / secondary: border.subtle. 둘 다 radius 6, 높이 모바일 44 데스크탑 48, px 24
- external이면 ArrowUpRight(lucide, 16) 우측
- focus-visible 아웃라인 필수

### ArrowLink.jsx
- 텍스트 + ArrowRight(16). hover: 언더라인 좌→우 draw(::after width 0→100%, 250ms), 화살표 translate-x 4px
- props: href, external, children

### Card.jsx
- bg.elev, border.subtle, radius 10, p 모바일24 데스크탑32
- hover: border.strong. group 클래스 제공. scale 금지

### Tag.jsx
- mono caption, border.subtle, radius full, px 10 py 4, text.sec
- 공지 기관 태그, 트랙 과목 태그 공용

### Stat.jsx
- props: value, label, suffix
- value: mono, 모바일 40 데스크탑 72, text.pri / label: small text.sec
- 뷰포트 진입 시 카운트업(rAF, 800ms). reduced-motion 시 즉시 최종값

### PageHero.jsx
- 서브페이지 공통 도입부. props: eyebrow(EN), titleKr, desc
- eyebrow mono → h1(h1 스케일, Pretendard 800) → desc(bodyL, text.sec, max-w 640)
- 하단 헤어라인. 섹션 패딩 상단만 절반

### Divider.jsx
- border.subtle 1px 수평선. 컨테이너 폭

## 2. 레이아웃 (layout/)

### Header.jsx
- sticky top-0 z-50. 기본 h-72, 스크롤 80px 후 h-56 + backdrop-blur + bg base/80 + 하단 헤어라인
- 좌: 로고 "DAH"(Anton 20) + "디지털인문예술전공"(small, md 이상 표시)
- 우(lg 이상): NavLink 6개(body, text.sec, 활성·hover 시 text.pri) + Button secondary "Exhibition"(external)
- lg 미만: Menu 아이콘(lucide 24) → MobileMenu

### MobileMenu.jsx
- 풀스크린 fixed 오버레이 bg.base. 링크 수직(h2 스케일, 스태거 리빌), 하단 인스타·전시회 외부 링크
- X 아이콘으로 닫기, ESC 지원, 열림 시 body 스크롤 잠금(overflow hidden, storage 사용 금지)

### Footer.jsx
- 상단 헤어라인. 3열(lg): 학과 정보 / 페이지 링크 / 외부 링크. 모바일 1열 수직
- 최하단: mono caption "© 2026 Hallym University Digital Arts and Humanities"

## 3. 홈 섹션 (home/) — IA 순서 고정

### HeroSection.jsx
- min-h [100svh-헤더], 좌정렬. 구성: eyebrow(mono "HALLYM UNIVERSITY — SINCE 2017") → EN 캡스 h1(Anton displayXL, 2줄 "DIGITAL ARTS / & HUMANITIES") → KR 서브(h2 스케일 800) → 본문(bodyL sec, max-w 560) → Button 2
- 배경: OrbitCanvas absolute inset-0 -z-10, 상단·하단 base로 페이드 마스크

### OrbitCanvas.jsx
- 순수 Canvas 2D. 중심 오프셋(우측 55%)에 동심 궤도 3~4개(border.subtle 톤 스트로크), 궤도 위 노드(text.pri 톤 점, 크기 2~4px) 공전, 노드 간 근접 시 헤어라인 연결(노드-엣지)
- 마우스 이동 시 전체 캔버스 최대 16px 패럴랙스(lerp 0.06)
- 파티클 수: min(뷰포트폭/32, 48). dpr 상한 2. 탭 비활성 시 rAF 중단
- prefers-reduced-motion: 캔버스 미마운트, 동일 구도의 정적 SVG(public/images/orbit-static.svg) 렌더
- aria-hidden true

### NewsBar.jsx
- 풀폭, 상하 헤어라인, py 20. mono 라벨 "NOW SHOWING" + 제목 "26-1 전공 프로젝트 전시회 — Against the Flow" + ArrowLink external
- hover 시 배경 bg.elev 전환

### IdentitySection.jsx
- SectionLabel("01","우리가 일하는 방식") + h1 헤드 → 3열 그리드(lg), 각 열: 에셋 이미지(aspect 4/3, grayscale) 또는 인라인 SVG → mono "FIG 1.n" → h3 → body sec
- 스태거 리빌

### TracksSection.jsx
- SectionLabel("02","트랙") → Card 3개 그리드(md 3열, 모바일 1열)
- 카드 내부: mono "TRACK 0n" → h3 트랙명 → body 요약(2줄 클램프) → 키워드 Tag 3개 → ArrowLink "/tracks#track-n"

### CurriculumSection.jsx
- SectionLabel("03","4년의 설계") → 인라인 SVG 로드맵: x축 1~4학년(mono), 트랙별 레인 3개, 과목 블록은 bg.panel + border.subtle 라운드 사각, 대표 과목만 8~10개 표기
- viewBox 반응형(width 100%), 모바일에서는 세로 방향 리스트 폴백(md 미만 SVG 숨기고 리스트)
- ArrowLink "/tracks"

### StatsSection.jsx
- SectionLabel("04","숫자로 보는 DAH") → Stat 6개(모바일 2열, lg 3열 또는 6열)
- stats.js의 실측값만

### PeoplePreview.jsx
- SectionLabel("05","사람") → 교수 Card 4(이름 KR h3 + EN mono caption + 직함 small sec) → ArrowLink "/people"

### NewsSection.jsx
- SectionLabel("06","소식") → NoticeItem 4개 수직 리스트 → ArrowLink "/news"
- NoticeItem: 좌 mono 날짜(meta) + Tag 기관 + 제목(body pri, hover 언더라인). 행 hover 시 bg.elev, 외부 링크

### FinalCTA.jsx
- bg.invert 반전 풀폭 블록. EN 캡스(Anton displayL, text.invert) "BUILD WHAT'S NEXT." + KR 한 줄(sec 아님, #3A3D40 계열은 금지이므로 text.invert 그대로 굵기만 400) + Button 2(primary 반전: bg base + text pri / secondary 반전 보더)
- 반전 블록은 사이트 전체에서 이곳 1곳만

## 4. 페이지 (pages/)

Home.jsx(섹션 조립만), About.jsx, Tracks.jsx, People.jsx, Achievements.jsx, Careers.jsx, News.jsx, NotFound.jsx

### 페이지 내 전용 조각
- About: HistoryTimeline(수직, 좌 mono 날짜 + 우 내용, 좌측 헤어라인 세로선)
- Tracks: TrackDetail(앵커 id="track-1..3", 과목 리스트는 mono "n.m" 넘버 + 과목명 행), CodeSharing(절차 4단계 넘버 리스트 + 학과 19개 Tag 랩)
- People: ProfessorCard(이메일 mono small, 링크 아이콘 ExternalLink 16), MentorCard(기업 외부 링크)
- Achievements: YearTabs(mono, 활성 pri + 하단 2px 보더), AwardItem(연도 그룹 하 수직 리스트)
- Careers: CareerCard(이름 + 전공 조합 caption + 회사 ArrowLink + 직무 small sec), PortfolioItem
- News: NoticeItem 재사용 + 기관 필터 Tag 토글(상태는 useState만)
- NotFound: EN 캡스 "404" + KR 안내 + Button 홈으로

## 5. 반응형 변형 요약

- Header: lg 미만 햄버거 / Hero displayXL 48→128 단계적(sm 56, md 80, lg 104, xl 128) / 그리드: 카드류 모바일 1열 → md 2~3열 → lg 완성형 / CurriculumSection: md 미만 SVG 대신 리스트 / Footer: lg 3열, 미만 1열
- 320px에서 가로 스크롤 0, 잘림 0. 2560px에서 컨테이너 1440 중앙 + 배경 base 연속