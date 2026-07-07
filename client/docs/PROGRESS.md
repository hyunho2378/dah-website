# PROGRESS.md — 진행 상태

컨텍스트 85% 도달 시 즉시 중단하고 이 파일 갱신 후 대기. 재시작 시 이 파일 먼저 읽는다.

## 상태 범례
[ ] 대기 / [~] 진행 중 / [x] 완료 / [!] 블로킹

## PHASE 0 — 셋업
- [x] 프로젝트 스캐폴드 (01_SETUP_PROMPT.md 실행)
- [x] 폰트 CDN 로드 확인 (Pretendard, Anton, IBM Plex Mono)
- [x] tokens.js → tailwind.config.js 매핑 동작 확인

## PHASE 1 — 병렬 (02_PARALLEL_PROMPTS.md)
- [x] AGENT-1 데이터·기반: data/ 12파일 원문 이관, index.css, 훅
- [x] AGENT-2 코어 UI: common 9종, layout 3종, OrbitCanvas
- [x] AGENT-3 홈 섹션: home/ 9섹션 + Home.jsx
- [x] AGENT-4 서브 A: About, Tracks
- [x] AGENT-5 서브 B: People, Achievements, Careers, News, NotFound

## PHASE 2 — 검증
- [ ] AGENT-REVIEW: CHECKLIST 전 항목 + App.jsx 조립 + vercel.json

## PHASE 3 — v2 재설계 (우주 컨셉 · 글래스 · 백엔드 · CMS)
- [x] PHASE 3-0 준비: v2 md 5개(10~14) docs 배치 / tokens glass·cosmos·Space Grotesk·displayXL 104 / tailwind glass·cosmos·5xl 매핑 / index.css 가로스크롤 박멸(overflow-x clip, break-keep) / server 스캐폴드(Express+pg+bcrypt+jwt+multer, /health) / logo.svg 슬롯

## PHASE 3 — 병렬 (15_PHASE3_PROMPTS.md)
- [x] AGENT-B1 백엔드: schema.sql, seed, 인증, CRUD 권한, 업로드 WebP, 접수, 쇼케이스, settings, export
- [x] AGENT-B2 디자인 v2 코어: StarField, GlassCard·GlassPill·PageBanner, Header 메가메뉴, GlassDock, ShareButton, LangToggle, 글래스 스킨
- [x] AGENT-B3 어드민·에디터: /admin CRUD, Tiptap+렌더러, useApi·useAuth, 인라인 편집 버튼
- [x] AGENT-B4 공개 A: 홈 v2, About 통합, 교육과정, 코드쉐어링, /en·i18n
- [x] AGENT-B5 공개 B: 프로그램 3종, 운영위, 성좌, 진로, 쇼케이스, 접수 폼, 공지·자료실
- [~] AGENT-BR 리뷰: App 조립 완료(StarField·Header·GlassDock·Footer·라우트 v2 전체·admin 코드분할·en 미러·v1 리다이렉트·v1 페이지 3종 정리). 검증 완료: 빌드, 서버 테스트 8/8, 비로그인 /admin 로그인 게이트, en 감지, 1920 가로스크롤 0(+정적 보증), 크로스 임포트 드리프트 3종 교정(EditControls·RichBody·useAuth). 잔여: 320px 실기기, 3840 상한, reduced-motion 에뮬레이션, Lighthouse
- [!] /en PageBanner 타이틀 lang 미반영(국문 유지) — titleEn 전달 또는 PageBanner lang 연동 필요
- [!] HWP·비이미지 첨부 업로드 서버 400(image/* 필터) — 문서 업로드 경로 필요
- [!] 쿠키 SameSite=Lax — Vercel↔Render 크로스 사이트 배포 시 /api 프록시 또는 None 전환 결정 필요

## PHASE 4 — 전면 수정 배치 (16_PHASE4_FIXES)
- [x] F1 폰트 Pretendard 단일화 + 스케일 하향(displayXL 40/64 등) + label 0.06em
- [x] F2 Container 단일 컴포넌트 (Header·Footer·PageBanner·PageHero·페이지 정렬 통일)
- [x] F3 메가메뉴 불투명(cosmos.depth1 96%+blur) + 딤 오버레이 + 스크롤 잠금
- [x] F4 FinalCTA 반전 블록 제거 → 다크 한 줄 CTA
- [x] F5 푸터 실사이트(3열+최하단 바) + /privacy·/terms
- [x] F6 성좌 제거 → 연도 앵커 원문 리스트 + 홈 하이라이트 톤다운
- [x] F7 운영위 LUCID 원문(data/council.js) + 서버 오프라인 폴백 렌더
- [x] F8 상세 T1/T2 + PDF 뷰어(AttachmentViewer) + 시드 원문(공모전 공지 등 유형별 1건+) + attachments·문서 업로드
- [x] F9 로그인 모달화(/login 제거, LoginModalContext, 가드 시 모달 오픈)
- [x] F10 히어로 영상 슬롯(hero.mp4 존재 시 영상+60% 오버레이, 없으면 OrbitCanvas)
- [x] F11 i18n 실작동(PageBanner titleEn, UI 라벨 사전, KR 뱃지 폴백)
- [x] F12 QA 완료 (2026-07-07):
  - 반응형 가로스크롤: 전 페이지(홈·소개·교육과정·프로그램·운영위·동아리·성과·진로·뉴스·자료실) 0. overflow-x:clip 전역 + flex-wrap CTA 확인.
  - 320px: 코드 감사 완료. overflow-x:clip(index.css) + flex-wrap 버튼 → 절대 가로스크롤 없음. (macOS 브라우저 최소 창 ~500px 제약으로 직접 리사이즈 불가, viewport meta 조작도 미반영)
  - prefers-reduced-motion: StarField(matchMedia 리스너→RAF 정지), HeroSection(OrbitCanvas 폴백), index.css(animation/transition:none !important) 전부 구현 확인
  - Lighthouse (프로덕션 빌드, desktop): 홈 Perf99/A11y100, 뉴스 Perf92/A11y100, 전시회 Perf100/A11y100 — 전 목표 달성
  - A11y 100 수정 내역: text-meta #5C6066→#7C8088(WCAG AA 4.5:1+), BoardList bg-glass-bg→bg-bg-elev(solid), ProgramShowcase DetailPanel GlassCard→div bg-bg-elev
- [!] 고정 페이지(About·교육과정·코드쉐어링) 영문 원고 미보유 → en.js 예약 키에 KR 폴백. 사용자 감수 원고 필요
- [!] 대표 문의 메일 미보유 → site.js에 mail 추가 시 Footer·Privacy 노출
- [!] hero.mp4 미배치(사용자) / 고정페이지 titleEn 대문자 렌더(원할 시 proper-case 키 전달)

## PHASE 4 v2 — 재실행 배치 (16_PHASE4_FIXES v2: F6·F8·FOOTER·COSMOS-TONE)
- [x] F6 학생 성과 (검증): data/achievements.js 41건(2026:13·2025:13·2024:1·2023:9·2020:2·2019:3) 원문 유지, /students/achievements 연도 앵커+수직 리스트(성좌 없음), 홈 AchievementsHighlight 최근 3건 제목 리스트 — 이미 반영 확인. seed.mjs가 achievements→posts(type='achievement') 41건 삽입(SELECT COUNT=41 예상, 로컬 DB 미기동으로 라이브 쿼리 미실행)
- [x] F8 공지 상세 T1 본문 복구: seed.mjs notice-01 body가 {paragraphs} 스텁(RichBody 렌더 불가)이었음 → 사용자 제공 원문 그대로 Tiptap doc JSON 9문단(메달→1등/2등/3등 텍스트, 마지막 줄 전시 URL 링크 마크)으로 교체. T1/T2 상세·AttachmentViewer(PDF iframe 640/모바일 카드)·리스트 내부 링크는 기존 반영분 유지
- [x] FOOTER 전면 축소: Footer.jsx 재작성 — 사이트맵(nav.js)·Related 섹션 제거. logo.svg(h-24/28) + 학과명 3줄 + 정책 링크(개인정보처리방침|이용약관) + 카피라이트 "© 2026 디지털인문예술전공. All rights reserved.". 세로 패딩 축소(lg:py-48, 모바일 pb-96은 GlassDock 가림 방지). 상단 헤어라인 + bg-bg-elev(StarField 차단). site/nav/useLang/ArrowUpRight import 제거
- [x] COSMOS-TONE 히어로 톤 연결: (1) HeroSection 하단 페이드 96→240px + QuickLinks 상단 여백 pt-80 확대 (2) tokens.js cosmos.accentViolet rgba(139,127,232,0.05)·accentTeal rgba(64,180,160,0.05) 추가, star 오프화이트 rgba(242,242,252,0.9)로 미세 보라 (3) tailwind bg-nebula-violet(좌상)·bg-nebula-teal(우하) 정적 radial 글로우 → StarField 전역 성운 2겹(blur 미사용, reduced-motion 무관) (4) GlassCard 상단 하이라이트 1px 화이트10% + 하단 그림자, hover 시 보라/청록 글로우 0.06 상한 (5) 모노크롬 유지(텍스트·보더 미채색)
- [x] 검증: `npm run build` 성공(2004 modules), nebula-violet·nebula-teal CSS 방출 확인, `node --check seed.mjs` 통과. 잔여: 로컬 Postgres 미기동 → achievement/notice 라이브 COUNT·렌더는 DB 연결 후 재확인 필요

## PHASE 5 — 배포 진단 기반 수정 (17_PHASE5_FIXES)
- [x] P5-1 상세 응답 파싱 수정: 서버 GET /content/:type/:id 는 { item }로 감싸 반환하는데 상세 페이지들이 최상위(data.title/poster_url)를 읽어 전부 undefined → "NO POSTER". useApi.js에 itemOf(data) 언랩 헬퍼 추가({item}→내부, 스냅샷 단일객체→그대로, {items}→null). 5개 상세 전수 적용: ExhibitionDetail·ContestDetail·LectureDetail·ShowcaseDetail·NewsDetail
- [x] P5-2 배포 Neon 시드 주입: server/.env가 이미 배포 Neon(ep-dark-grass…neon.tech) 지향 → node scripts/seed.mjs 실행 성공. 배포 DB SELECT COUNT 검증: achievement 41, notice 19(본문 시드 1=notice-01 원문), professors 11, mentors 14, curriculum 35, careers 26, portfolios 8, council 10, exhibitions 18. GET /content/achievement 이제 실건수 반환
- [!] P5-2 부작용(전시회) → 복구 방침 확정(사용자: Neon PITR 후 성과만 재시드): 재시드가 배포 전시회의 CMS 입력 미디어(poster/body/site_url)를 삭제함. 아래 복구 런북 대기 중(사용자가 Neon 콘솔에서 PITR 수행 후 스크립트 실행)
- [x] P5-2 후속(시드 전면 additive 개편, 사용자 지시 2): seed.mjs에서 TRUNCATE/DELETE 완전 제거. 참조 테이블(professors·mentors·curriculum·careers·portfolios·council·exhibitions)은 empty-guard(비었을 때만 삽입), posts는 seed_key(안정 키)+ON CONFLICT DO NOTHING, site_settings는 DO NOTHING, codesharing은 body NULL일 때만. schema.sql에 posts.seed_key + uq_posts_seed_key 인덱스 추가. 재시드가 사용자 입력을 다시는 지우지 않음
- [x] P5-2 후속(타깃 스크립트, 지시 1): server/scripts/seed-achievements.mjs — achievement만 seed_key로 ON CONFLICT DO NOTHING 삽입, 다른 테이블 미변경. seed_key 없는 기존 achievement 감지 시 중단(PITR 미완료 중복삽입 방지)
- [x] P5-2 후속(포스터 파일경로 지원, 지시 3): 역대 전시회 포스터를 client/public/images/exhibitions/<학기>.png로 이관(18장), seed가 학기 역순으로 poster_url 매핑. 복구 후 적용용 seed-exhibition-posters.mjs 추가(poster_url IS NULL인 행만 채움 → 복구된 Against the Flow의 CMS 포스터 보존)
- [x] P5-3 전시회 목록 카드: GlassCard 과한 radius(glass 20) → !rounded-lg(16)로 통일 + p-12 내부 패딩. 포스터는 기존 aspect-[2/3] object-cover 유지. NO POSTER는 poster_url 없을 때만(정상 항목의 오표시는 P5-1 원인이었음)
- [x] P5-4 StarField 전면 제거: StarField.jsx 삭제 + App에서 언마운트. 별/트윙클/캔버스/rAF 제거. 대체 CosmosBackground.jsx(정적 성운 글로우 3겹: 좌상 보라·우하 청록·중앙 상단 초저채도 보강, 전부 radial-gradient·blur 미사용·reduced-motion 무관)로 우주 톤만 유지
- [x] P5-5 메가메뉴: 패널 배경 반투명(depth1/0.96)+blur → 완전 불투명 bg-cosmos-depth1 + 하단 그림자로 콘텐츠 비침 차단, z-20으로 헤더 바 위. 위치는 헤더(positioned) 바로 아래 absolute top-full 유지(딤 오버레이 기존)
- [x] P5-6 스크롤 초기화: ScrollToTop이 window.scrollTo({behavior:'instant'})로 전역 smooth 무시하고 즉시 최상단 이동 + 마운트 시 history.scrollRestoration='manual'(새로고침·복귀 시 위치 복원 차단)
- [x] P5-7 푸터 로고 축소: h-24/md:h-28 → h-16(약 1/4, ≤24)
- [x] P5-8 언어 토글: 텍스트 링크 → 스위치 UI(KR·EN 세그먼트 병렬, 현재 언어 채움 강조). role="switch"+aria-checked, switchHref로 /en 미러 전환
- [x] 검증: `npm run build` 성공(2004 modules), nebula-violet·teal·soft CSS 방출, seed 배포 실행+COUNT 확인. 잔여: 배포 재빌드·배포(Vercel) 후 육안 QA, 전시회 미디어 복구 결정

## 데이터 갭 (사용자 확인 필요)
- [!] 교수 개별 사진: 미보유 → 이니셜 플레이스홀더로 v1 출시, 사진 확보 시 교체
- [!] 수상 실적 원문 중 2021~2025 구간: source_content.md에서 확인 후 이관 (원문에 있는 것만)
- [!] 재학생·전체 수치(재학생 수 등): 공식 수치 미보유 → Stats에 미포함 유지
- [ ] OG 이미지 1600x840: 03_ASSET_PROMPTS.md B4로 제작 후 public/og.png

## 전시회 아카이브 시드 완료 (P5-2 부작용 해소)
- [x] 전시회 18건 메타 정합화: 이전 seed로 이미 존재하던 18행(id 2~19)을 제자리 UPDATE(중복·삭제 없음). server/scripts/seed-exhibitions-archive.mjs 신규 — 최신 학기부터 semester_label('2026-1'~'2017-2') + poster_url('/images/exhibitions/{label}.png', 실제 파일 18개 존재) + 평문 제목(「」 제거, 사용자 목록 원문) 설정. intro/body/site_url/gallery/held_at 미변경(2026-1 intro 보존 확인). poster_url은 COALESCE로 기존값 보존. 멱등(행수≠18이면 중단)
- [x] 정렬 수정: content-config exhibitions orderBy `held_at DESC NULLS LAST, id DESC` → `held_at DESC NULLS LAST, semester_label DESC NULLS LAST, id DESC`. 전 행 held_at null이라 기존엔 id역순(2017-2가 최상단)으로 뒤집혀 있었음 → semester_label 문자열 역순=학기 역순으로 교정(held_at 미조작)
- [x] 목록 페이지네이션 상한: Exhibitions.jsx `/content/exhibitions` 요청에 pageSize=100 추가(기본 12 상한이라 18중 12만 노출되던 것 해소, 아카이브는 단일 페이지 전량 노출)
- [x] 검증(로컬 서버→배포 Neon): GET /content/exhibitions?pageSize=100 → total 18·18건 반환, 2026-1 최상단·2017-2 최하단 학기 역순 확인. 상세 /content/exhibitions/2(2026-1, intro 보존)·/19(2017-2) 정상 item 반환, 잘못된 id→404. client `npm run build` 성공(P5-1 itemOf 언랩 전제)
- [ ] 잔여: 서버(Render)·클라(Vercel) 재배포 후 /programs/exhibitions 육안 QA(18카드 학기역순·포스터 표시)

## PHASE 6 — 배포 실측 크리틱 반영 (18_PHASE6_FIXES)
- [x] G1 학생 성과 재정비: posts.sort 컬럼 신설(schema), achievement orderBy `tag DESC, sort ASC NULLS LAST`(content-config, sortable 컬럼 화이트리스트 추가), seed에 sort=원문 등장 순서(1..41). seed-achievements.mjs를 G1 지시대로 achievement 한정 전량 삭제 후 재시드로 개편·배포 Neon 실행. 검증: 41건, 2026 대상=sort1 → HUSS=13 → 2025 첫=14 → 2019 끝=41 (원문 1:1). 클라 pageSize=100(페이지네이션 없는 전 목록 전수: achievements·contests·lectures·clubs·council·careers·portfolios·showcase). AwardItem 렌더 원문 구조 유지 확인
- [x] G2 공지 내부 상세: News toRow가 전 항목 `to=/news/:id`(external_url 항목 포함). NewsDetail에 원문 보기 버튼(본문 유무 무관, external_url∥url 존재 시)
- [x] G3 어드민 프리필: 원인=useApi 3초 abort가 Render 콜드스타트에서 단건 GET을 죽여 빈 폼 노출. /admin 경로 기본 타임아웃 15초(timeoutMs 옵션 신설) + PostForm·CodeSharingAdmin은 hydrated 전 폼 미렌더(로딩/에러+다시 불러오기), 수정 저장은 PUT(기존), 싱글턴은 POST upsert(B1 계약)
- [x] G4 라디우스 4px: tokens radius sm/md/lg=4, glass.radius=4. rounded-full 전수 → rounded-sm(예외: LangToggle·GlassDock만 유지). 카드 내부 패딩 p-20 md:p-28(전시회·공모전·특강·동아리·쇼케이스·진로 카드; People은 기존 24/32 유지)
- [x] G5 WebP: convert-posters-webp.mjs(sharp, q80→400KB 초과 시 감쇠, 대형 3장은 1200px 리사이즈) → 18장 전부 ≤400KB, PNG 삭제. 배포 Neon poster_url 18건 .webp UPDATE. seed 3종 .webp 경로 갱신. 포스터 img에 width/height+lazy
- [x] G6 Container 통일: 자체 max-w/px 클래스 전수 교체(About·Curriculum·CodeSharing CONTAINER 상수 제거, People·Clubs·Council·Careers·ShowcaseGrid·ShowcaseDetail). common/PageBanner는 layout 재노출 심 → 직접 임포트로 정리
- [x] G7 푸터 가로 재배치: 좌(로고 h-20 + 학과명 KR/EN·주소 2줄) | 우(개인정보처리방침|이용약관), 최하단 저작권 1줄. lg:py-32(상하 32 이내), 모바일 세로 스택+GlassDock 여백
- [x] G8 헤더 IA: nav 8메뉴(About/전공 소개/교육과정/학과 행사/학생 활동/쇼케이스/공지사항/자료실). 전공 소개=교수진·멘토단 하위, 소식 폐지, 공지·자료실 최상위(하위 없음=단일 링크). i18n nav·titles 사전 동기화, GlassDock 현재 페이지 매칭에 무자식 메뉴 포함
- [x] G9 메가메뉴: 헤더 sticky → fixed inset-x-0 top-0 + 본문 스페이서(h-header-s lg:h-header). 패널은 헤더 기준 absolute top-full(z-20, 불투명 depth1+그림자) — 스크롤 위치 무관 노출. overflow 잘림 없음 확인(헤더에 overflow 없음)
- [x] G10 em dash 0건: useTitle "페이지명 | 한림대학교 디지털인문예술전공", hero eyebrow 'HALLYM UNIVERSITY SINCE 2017', 에러 힌트 `(hint)` 형식, 빌드 산출물 grep — 공개 번들 0건(어드민 번들 1건은 Tiptap 라이브러리 내부 regex)
- [x] G11 카피 교정: UI 사전 전면 재작성(능동태·간결, 예: "실시간 동기화를 기다리는 중", "본문은 원문 페이지에서 확인하세요"). 사용자 원문(성과·공지·운영위·About KR)은 제외·유지
- [x] G12 About 재구성: 리드 문단(h3 스케일·행간 1.8·max-w 720) → WHY 소섹션(헤어라인 구분) → 미션·비전 → 연혁. 기존 텍스트 재배치만, 창작 없음
- [x] G13 퀵링크 바 삭제(QuickLinks.jsx 제거), G14 owner 뱃지 제거(헤더·GlassDock: Settings 아이콘 버튼 + title 툴팁으로 역할 안내)
- [x] G15 토글·시프트: LangToggle 활성=화이트 배경+어두운 글자/비활성 투명(role=switch, aria-checked). 헤더 메뉴·로그인 라벨 KR/EN 이중 렌더(비활성 invisible)로 폭 예약 → 전환 시 레이아웃 시프트 0
- [x] G16 영문 전면: 사전 95키 전량 ko/en 커버(누락 0, 스크립트 검증). About 고정 페이지 EN 원고(정보 증감 없는 대역). 목록·상세 템플릿 라벨(메타·버튼·빈 상태·브레드크럼) 전수 t() 전환. 콘텐츠(공지·성과·연혁·코드쉐어링 본문·법률 문안)는 KR 폴백+Korean only 뱃지 정책 유지
- [!] Privacy·Terms 법률 문안 EN: 감수 없는 번역 위험 → KR+뱃지 유지. 감수 번역 확보 시 교체
- [!] 어드민·접수 플로우는 국문 전용(v2 스코프) — i18n 제외 유지

## PHASE 7 — 크리틱 반영 수정 (19_PHASE7_FIXES)
- [x] H1 헤더 IA 재수정: About=홈(/, 하위 없음, end 매칭) / 전공 소개(전공소개·교육 과정·교수진·멘토) / 학과 행사 / 학생 활동(운영위·동아리·성과·웹&앱 쇼케이스·취업 현황) / 공지사항 / 자료실. 멘토단→멘토·진로→취업 현황 전수(페이지·어드민·사전), 쇼케이스 최상위 제거→학생 활동 하위, /about/people#mentors 앵커(id) 신설. i18n ko/en 동시 갱신
- [x] H2 목록 원복: 학과 행사 3종(전시회·공모전·특강) 카드 p-20/28 → p-12로 되돌림. 포스터 2:3 대형 유지, 여백은 그리드 간격으로만
- [x] H3 운영위 재시드: data/council.js를 사용자 원문 전량으로 재작성(2026 LUCID~2017 임시학생회, 소개문·임원 명단 원문 그대로, members [{role,name,majors}]). seed-council.mjs(대상 테이블 한정 삭제+재삽입) 배포 Neon 실행 — 10건, 2026 선두(sort 0)·구성원 전량(10/12/7/6/5/4/6/2/2/2) 검증. content-config orderBy year_label DESC. Council 페이지: 2026 첫 탭 강조(font-bold+큰 사이즈), intro whitespace-pre-line, 폴백도 councils 사용
- [x] H4 i18n 잔여: (1)/about lang 분기 기반영 확인 (2)PageBanner 두 언어 동일 구조 — eyebrow(EN 캡스) 항상 유지 + 헤드라인만 교체(en은 proper-case) (3)히어로 subEn/bodyEn(site.js)·트랙 summaryEn/keywordsEn(tracks.js) 추가, Hero·TracksSection lang 분기 (4)언어 전환 시 스크롤 유지 — ScrollToTop이 /en 정규화 경로 동일하면 스킵(앵커는 예외 처리)
- [x] H5 4K 정렬: 홈 프로그램(ProgramShowcase)·3개 트랙(TracksSection)·공지사항(NewsSection) 자체 max-w-container(1280/1440) 래퍼 → 공용 Container로 교체. 2560·3840에서 헤더와 동일 토큰 정렬(코드 보증)
- [x] H6 공지 상세 가독성: 본문만 bg.invert(#F7F8F8) 밝은 카드(radius 4, p-24/40) 반전. index.css .rich-on-light 오버라이드(text.invert, border.invert 토큰 신설) — 페이지 배경·메타는 다크 유지
- [x] H7 어드민 5종: (1)ImageUpload 미리보기 object-contain + poster는 2:3 세로 프레임 (2)Toggle 켜짐=화이트 채움+어두운 노브/꺼짐=아웃라인 (3)사이드바 lg:sticky 유지 + 어드민 내부 이동 시 스크롤 점프 제거(ScrollToTop /admin→/admin 스킵) (4)쇼케이스 큐→웹&앱 쇼케이스(사이드바·페이지 타이틀) (5)헤더 설정 아이콘 -mr-8로 Container 우측선 정렬
- [x] H8 푸터 TEL 033-248-3556 (주소 아래 줄, 가로 배치 유지)
- [x] H9 배경 고급화: CosmosBackground를 depth1→depth0 세로 그라데이션(토큰 경유)으로, 성운 글로우(보라 0.05·청록 0.05·소프트 0.03) 실적용 + 스크롤 패럴랙스(0.1/0.06배, rAF·transform만, reduced-motion 시 정지). ProgramShowcase의 불투명 bg-bg-base 제거(그라데이션 비침)
- [x] H10 접수 노출: 어드민 UI 기존재 확인(/admin/settings 노출 허용 토글+위치, /admin/exhibition 기간 datetime 편집). Header에 show_button 판정 버튼 신설 — header 모드는 헤더 우측, floating 모드는 우하단 고정, /submit 이동. 어드민 미리보기 우회: manager+ 로그인 후 /submit?preview=1(기간 검증 우회, 실제 제출은 서버 403 차단 유지)
- [!] H10 테스트 절차: (1)관리자 로그인 → /submit?preview=1 로 폼 화면 즉시 테스트, 또는 (2)/admin/exhibition에서 접수 기간을 현재 포함으로 설정 + /admin/settings에서 노출 허용 on → 헤더(또는 플로팅) "전시회 접수" 버튼 노출 확인
- [ ] 배포 후 실사이트 H1~H10 육안 검증 (아래 배포 절 참조)

## 배포
- [ ] Vercel 연결, 도메인, vercel.json 리라이트
- [ ] Lighthouse: 모바일 Performance 90+, A11y 100 목표