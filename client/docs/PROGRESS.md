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
- [x] 커밋·푸시: 6135e2e → main (36 files, +527/-207). Vercel·Render가 GitHub 연동이면 자동 배포, 미연동이면 대시보드에서 수동 배포 1회 필요
- [!] 실사이트 검증(사용자 수행 확정) — 체크리스트:
  (H1) 헤더 6메뉴: About 클릭=홈 / 전공 소개 하위 4종 / 학생 활동 하위 5종(쇼케이스·취업 현황 포함) / 멘토단·진로 표기 0건
  (H2) /programs/exhibitions 포스터 대형(카드 p-12), 특강·공모전 동일
  (H3) /students/council 첫 탭 2026(강조) → 2017, 각 기수 소개문+임원 명단 원문 전량
  (H4) /en 홈 히어로·트랙 영문, /en/about 영문, 페이지 배너 eyebrow+제목 구조 동일, EN↔KR 전환 시 스크롤 유지
  (H5) 2560+에서 홈 프로그램·트랙·공지 좌측선 = 헤더 로고 좌측선
  (H6) 공지 상세 본문 흰 카드+어두운 텍스트
  (H7) 어드민: 포스터 미리보기 비율 유지, 토글 켜짐 화이트 채움, 사이드바 이동 시 스크롤 유지, "웹&앱 쇼케이스" 명칭, 우측 유틸 정렬
  (H8) 푸터 TEL 033-248-3556 / (H9) 배경 그라데이션+스크롤 성운 이동(reduced-motion 정지)
  (H10) /admin/exhibition 기간을 현재로 설정 + /admin/settings 노출 on → 헤더(또는 플로팅) 접수 버튼 → /submit. 즉시 테스트: 관리자 로그인 후 /submit?preview=1

## PHASE 8 — 크리틱 반영 + 전수 검사 (20_PHASE8_FIXES)
- [x] J2 [최우선] 어드민 편집 빈 화면: 근본 원인 2종 — (a)시드 professors.links가 객체({website,…})인데 PairsField가 배열 기대 → value.map 크래시. EntityCrud pickForm/PairsField 비배열 방어 + ProfessorsAdmin fromItem이 객체→pairs 변환 (b)레거시 body jsonb({paragraphs}·{field,intro})가 RichEditor(Tiptap)에 들어가면 스키마 크래시 → doc 형태만 통과(safeValue). 추가 안전망: AdminLayout에 ErrorBoundary(빈 화면 대신 오류+다시 시도). 전 유형 진입 경로(라우트 posts/:type/:id/edit, EntityCrud 인라인, 싱글턴) 코드 전수 확인
- [x] J1 어드민 레이아웃: 콘텐츠 영역 공용 Container 정렬 + 사이드바 sticky+max-h(100vh 기준)+overflow-y-auto 독립 스크롤
- [x] J3 접수 버튼 상시 노출: show_button = header_visible만(기간 무관). 기간 검증은 제출 시점 서버 403 + /submit 안내 유지. 설정 화면 문구 갱신
- [x] J4 언어 유지: localizeTo(lang,to) + LangLink/LangNavLink 신설, 공개 링크 전수 치환(Header·GlassDock·Footer·PageBanner·Button·ArrowLink·NoticeItem·BoardList·ProgramShowcase·목록 카드 4종). /admin·/submit은 국문 전용 예외. GlassDock 현재 페이지 매칭 /en 정규화
- [x] J4 레이아웃 고정: 히어로 본문 lg:min-h-[4lh](긴 언어 기준 예약), 트랙 카드 flex-col + 요약 min-h-[2lh] + 키워드 min-h-64 + 자세히 보기 mt-auto 하단 고정 — 1440에서 KR/EN 버튼 위치 동일(코드 보증)
- [x] J5 콘텐츠 영문화(어드민 제외): professors roleEn·affiliationEn(11명), council introEn(7개 기수), codeSharing definitionEn·noteEn·stepsEn, curriculum nameEn(38과목), 트랙 summaryEn·keywordsEn, 히어로 subEn·bodyEn(기반영). People·Council·CodeSharing·Curriculum lang 분기. 공지 등 게시물은 KR 폴백+뱃지 정책 유지
- [x] J6 운영위 구성: eyebrow COMMITTEE + "운영위원회 구성" + 부서별 행(좌 라벨 mono 보조색/우 이름, 위원장·부위원장 괄호 소속·학번 흐리게, 헤어라인). 전 기수 동일 컴포넌트, 모노크롬 토큰만
- [x] J7 공지 상세 재설계: 밝은 타이틀 카드(제목+등록일·태그+첨부 줄: 파일명·미리보기·다운로드) + 밝은 본문 카드(행간 1.8). 원문 보기·구글 사이트 아웃바운드 전면 삭제(NewsDetail·NoticeItem·Resources 행, viewOriginal 사전 키 제거)
- [x] J8 동아리 카드: 로고(또는 이니셜) 중앙 상단 + 이름·설명 중앙 정렬
- [x] J9 FinalCTA 삭제: Home 사용 제거 + FinalCTA.jsx 삭제
- [x] J10 교육과정: curriculum.js 원문 전면 교체(38과목, 학기·"학점-강의-실습"·nameEn). 페이지를 트랙별 1·2학기 표 2열(모바일 세로)로 재설계(컬럼 학년/과목명/학점-강의-실습, radius 4·헤어라인·다크). 로드맵 SVG 학기 서브컬럼 반영·공통기초 최상단. 어드민 폼 credit 필드 + schema/curriculum.credit + content-config. 배포 Neon 재시드 38건 확인(seed-curriculum.mjs)
- [x] J11 성과 설명 상시 노출: 원인 — 라이브 API의 awardee/host/desc가 body jsonb에 있는데 normalize가 최상위만 읽음 → body 판독 추가. 목록에서 항상 펼침(접힘 없음)
- [x] J12 "총 N건" 삭제: 공개 목록 전체(전시회·공모전·특강·동아리·쇼케이스·성과·BoardList). 어드민 목록은 운영 정보로 유지
- [x] J13 모바일: 히어로 영상 object-cover 크롭+Container 안전영역 확인, 교육과정 표 모바일 세로 스택, 운영위 행 flex-col, 공지 카드·동아리 그리드 1열 — 코드 레벨 확인(390px 육안은 배포 후 사용자 확인)
- [x] J14 텍스트 검수: 신규 문구 G11 기준 작성(능동태·명사형), em dash 공개 번들 0건 재확인, t() 100키 ko/en 누락 0
- [x] J15 전수 검사 결과(수정 목록):
  - 크래시: PairsField 비배열(J2-a), RichEditor 비doc body(J2-b) — 수정
  - 죽은 코드 13파일 삭제: NewsBar·IdentitySection·CurriculumSection·StatsSection·PeoplePreview(v1 홈), Card·Stat·PageHero·LogoWordmark·common/PageBanner(심), data/identity.js·stats.js(고아 데이터), AttachmentViewer(J7로 고아화)
  - 미사용 import: NewsDetail Tag 제거. 미사용 사전 키: viewOriginal·bodyElsewhere 제거
  - console.log 0건(서버 부트 로그 1건은 정상 유지), TODO/FIXME 0건, JSX 하드코딩 HEX 0건
  - img alt 멀티라인 전수 검증 누락 0건, 아이콘 버튼 aria-label 유지 확인
  - 서버 전 파일 node --check 통과, client npm run build 성공
- [!] 실사이트 육안 검증(사용자 수행) 체크리스트: 어드민 교수진 편집 폼 프리필 / 접수 스위치 on→버튼 상시 / EN 내비 유지+1440 버튼 고정 / EN 콘텐츠(트랙·운영위·코드쉐어링·교수 직함·교육과정) / 운영위 구성 행 디자인 / 공지 밝은 타이틀·본문 카드+원문 보기 없음 / 동아리 중앙 카드 / 홈 FinalCTA 없음 / 교육과정 표(1·2학기 2열)+로드맵 학기 / 성과 설명 펼침 / 총 N건 없음 / 390px 가로 스크롤 0

## PHASE 9 — 병렬 2에이전트 배치 (21_PHASE9_FIXES, K1 어드민·백엔드 / K2 공개·디자인)
### AGENT-K1 (완료)
- [x] K1-1 공지 태그 시스템: site_settings key 'tags'(JSONB 문자열배열) 저장소. server/src/routes/tags.js — GET /tags(공개 {items:[]}) / POST·DELETE /admin/tags(manager+, 삭제 시 UPDATE posts SET tag=NULL WHERE tag=$1). PostForm TagField(기존 선택+인라인 생성+삭제). postTypes notice 하드코딩 태그 제거(tags:true)
- [x] K1-2 자료실 형식 확대: upload.js 허용 hwp·hwpx·pdf·docx·xlsx·pptx·zip·jpg·jpeg·png·webp·gif, 차단 exe·sh·bat·js·cmd·msi(블록리스트 우선), 확장자+mimetype 병행, 20MB. 이미지=WebP 파이프, 비이미지=원본(HWP 동작)
- [x] K1-3 이미지 섹션 분리: PostForm 본문 에디터와 별도 "이미지" 섹션(gallery=이미지 URL 배열, 다중·순서·삭제), 문서 첨부는 attachments=[{name,url}]. emptyForm/fromItem/toPayload 정합
- [x] K1-4 링크 이름: RichEditor 링크 삽입 URL+표시 이름 2필드, 생 URL 삽입 금지(표시 이름 필수/선택 텍스트에 링크). 기존 글 불변
- [x] K1-5 Toggle 알약형: 트랙·노브 rounded-full, 켜짐 화이트 채움+어두운 노브/꺼짐 아웃라인, h-24 w-40 border 고정, 노브만 translate → 주변 불변
- [x] K1-6 인라인 수정: EntityCrud 수정 시 해당 행이 그 자리에서 폼으로 교체(목록 안 밀림), 저장·취소 시 행 복귀
- [x] K1-7 드래그 핸들: 화살표 제거 → GripVertical + HTML5 DnD 자체구현, 드롭 시 sort 재계산·순차 PUT. orderable=false 미표시
- [x] K1-8 어드민 운영위 정렬: CouncilAdmin sortFn year_label 숫자 내림차순(2026 LUCID 최상단)
- [x] K1-9 상담 시스템: consultations 테이블 + server/src/routes/consult.js(POST /consult 공개·검증·DB 저장 항상 + SMTP·텔레그램 알림 env 기반 fire-and-forget, GET/PUT admin). nodemailer 설치. Consult.jsx 공개 폼(원문 그대로, /privacy 내부 링크). ConsultationsAdmin(SYSTEM 그룹). 통합자: /consult 라우트(App 국문 standalone+localizeTo 제외), Footer·About 하단 링크
- [x] K1-10 나노디그리 백엔드: nanodegree 싱글턴 테이블+content-config, NanodegreeAdmin(STRUCTURE 그룹, codesharing 패턴)

### AGENT-K2 (완료)
- [x] K2-1 프로그램 마스터-디테일 높이 정합(items-stretch, 패널 h-full)
- [x] K2-2 구 트랙명 전면 교체(KR·EN, tracks.js summary/summaryEn): 미래융합디자인→디자인, AI디지털인문학→AI, 문화예술콘텐츠→엔터컬쳐 트랙. 전역 grep 잔존 0건(원문 데이터 제외)
- [x] K2-3 공지 상세 다크 회귀+가독성: 밝은 카드 제거→다크, 본문 text-pri·행간 1.8(.rich-bright), 메타 대비, 제목·본문 헤어라인, 이미지 갤러리(gallery)
- [x] K2-4 운영위 표기·로고: 타이틀 "{year_label} {name}" 한 줄, 로고 박스 제거·1.5배·수직 중앙
- [x] K2-5 강제 줄바꿈 해제: About·Curriculum·CodeSharing·Council·히어로 max-w 상향(960급)
- [x] K2-6 useTitle "디지털인문예술전공 - 페이지명"(하이픈)
- [x] K2-7 연혁 최신순(렌더 정렬 내림차순)
- [x] K2-8 미션·비전 SVG 아이콘 3종(모노크롬 스트로크)
- [x] K2-9 마이크로 인터랙션: 페이지 크로스페이드(.page-fade opacity, translate 금지), Button press 감광, 포커스 링 전환, 전부 motion 토큰·reduced-motion 무효
- [x] K2-10 푸터: 좌 로고+학과명 한 줄, 우 정책·상담·TEL 033-248-3556·de46141@hallym.ac.kr, 저작권 유지
- [x] K2-11 교육과정 표: 학점 컬럼 nowrap(잘림 해소), 라벨 "학년"→"수준"(en Level), 표 높이 자연화
- [x] K2-12 로드맵: 제목 "학년별 교육 과정", 블록 겹침 재계산(높이·간격·텍스트 말줄임)
- [x] K2-13 나노디그리 공개: data/nanodegree.js 원문+En, Nanodegree.jsx(/curriculum/nanodegree, DB body 우선 폴백 정적), Curriculum 섹션+nav 전공 소개 하위 링크
- [x] K2-14 반응형 유동화: 타이포 clamp(-d 값), 카드 그리드 auto-fill minmax, 히어로 % 유동

### K3-1 통합 마무리 (완료)
- [x] 충돌 확인: K1/K2 파일 소유 계약 무충돌(server·admin·editor=K1 / App·public·i18n·tokens=K2). 공용 Toggle(K1)·tokens/index.css(K2) 겹침 없음
- [x] /consult 라우트 등록(App 국문 standalone, localizeTo 예외), About 하단 상담 링크 추가(K1-9.5 완결)
- [x] migrate-phase9.mjs 배포 Neon 실행: 공지 태그 19건 초기화, tags '[]', nanodegree 4과정 시드, consultations 테이블. 검증: nanodegree programs 4·tags []·consultations 0·curriculum credit 38
- [x] EN 반영: 나노디그리 render 라벨·데이터 En 필드 완비. 상담·태그 UI는 국문(어드민·접수 플로우 v2 스코프). t() 106키 ko/en 누락 0
- [x] npm run build 성공, em dash 소스 0, 서버 전 파일 node --check 통과
- [x] 커밋·푸시 예정(아래 배포 절), Render 재배포 시 npm install(nodemailer). 신규 env(선택): SMTP_HOST/PORT/USER/PASS·CONSULT_NOTIFY_TO·TELEGRAM_BOT_TOKEN/CHAT_ID — 없으면 알림 스킵·DB 저장은 항상
- [!] 실사이트 육안(사용자): 공지 글쓰기 태그 선택·생성 / 자료실 hwp 업로드 / 이미지·첨부 분리 / 링크 표시 이름 / 어드민 인라인 수정·드래그 정렬 / 상담 /consult 제출→알림 / 나노디그리 페이지·어드민 / 공지 상세 다크 가독 / 운영위 로고 1.5배 / 반응형 연속 축소
- [!] achievement 유형은 이미지 섹션 제외(성좌 전용) — 의도적. nanodegree DB body는 KR 3필드만 저장(EN은 파일 렌더)

## PHASE 10 — 병렬 3에이전트 배치 (22_PHASE10_FIXES, M1 서버·어드민 / M2 전시·공모전 / M3 동아리·교수·쇼케이스)
### 공용 선결 (통합자 생성)
- [x] C1 ImageFrame(components/common/ImageFrame.jsx): ratio·bg prop. bg=false→object-cover 꽉 채움(사진·포스터), bg=true→투명 로고 object-contain+중성배경(bg-bg-frame). tokens.bg.frame #202227 신설
- [x] C2 InlineEditBar(components/content/InlineEditBar.jsx): 로그인+canEdit 시 추가·정렬·전체관리 한 곳. 비로그인 미렌더
- [x] C3 DragHandle+useDragSort(components/common/DragHandle.jsx): 노션식 6점 HTML5 DnD 자체구현(라이브러리 없음), 어드민·공개 공용
### M1 서버·어드민 (완료)
- [x] M1-1 has_bg: professors·council·showcase·posts 컬럼(schema+migrate+content-config). ProfessorsAdmin·CouncilAdmin·PostForm(club)에 "배경" 토글
- [x] M1-2 전시회 스키마: start_date·end_date·is_featured 컬럼. exhibitions.body(JSONB)=리치 인트로(RichEditor), intro 평문 유지. PostForm exhibition에 시작·종료일·상단고정·리치본문
- [x] M1-3 공모전: posts.body={host(여러 줄), editions[{semester_label,poster_url,period,link}]}(신규 컬럼 없음). PostForm contest에 host+회차 리피터(type==='contest' 게이팅)
- [x] M1-5 어드민 사용자(OWNER 그룹) 최상단 이동. 상담 SYSTEM 그룹 확인
- [x] M1-6 신규 필드 작성·수정 폼 프리필·저장 검증. EntityCrud 정렬을 공용 DragHandle로 교체(기존 화살표·자체 DnD 제거)
### M2 전시회·공모전 (완료)
- [x] M2-1 전시회 피처드: is_featured 전시회를 목록 최상단 히어로(좌 포스터 ImageFrame 2:3, 우 타이틀+기간+리치인트로+긴 CTA). 나머지 그리드
- [x] M2-2 전시회 상세: 기간(start~end, 폴백 held_at), 리치 인트로(RichBody), 포스터 2:3 ImageFrame
- [x] M2-3 공모전 재구성: 공모전별 블록(제목+주최 원문+회차 가로 나열 ImageFrame 카드). 포스터 없는 회차 깔끔 플레이스홀더
- [x] M2-4 공모전 상세: 포스터 좌·주최/기간/설명 우
### M3 동아리·교수·쇼케이스 (완료)
- [x] M3-1 [최우선] 교수 사진 버그: 근본원인 (a)ProfessorCard가 photo_url 미렌더(이니셜만) (b)People이 정적만 읽고 API(저장처) 미조회. 수정: /content/professors 우선 로드+normalize, ImageFrame ratio='306/427'(cover), 없으면 이니셜
- [x] M3-2 동아리 재설계: 로고 ImageFrame(1:1, bg={has_bg}) 중앙 상단·크게, lg 4열, DragHandle 정렬
- [x] M3-3 쇼케이스 카드 확대(ImageFrame 16:9, 밀도↑)
- [x] M3-4 학생 성과 중복 수상자 블록 제거(제목+본문만, 원문 텍스트 유지)
- [x] M3-5 공개 편집 버튼 InlineEditBar 전환(Clubs·People·Showcase·Achievements·Resources·CodeSharing·Nanodegree)
- [x] M3-6 헤더 전공소개 메가메뉴에 코드쉐어링·나노디그리 링크(nav.js)
### M4-1 통합 (완료)
- [x] 충돌 0(소유 계약 준수, 공용 컴포넌트 통합자 선생성·에이전트 import만, 전역 파일 통합자만 편집)
- [x] 통합 픽스: club sortable(content-config, 정렬 영구저장) + AuthContext EDIT_MIN_ROLE nanodegree:'admin'(+Nanodegree type 교정) + meta.host i18n ko/en('주최'/'Host') 스왑
- [x] migrate-phase10.mjs 배포 Neon 실행: has_bg 4테이블·exhibitions 3컬럼 추가 검증. 2026-1 is_featured=true 설정(피처드 히어로 노출)
- [x] npm run build 성공, 서버 node --check 통과, EN 반영(신규 공개 문자열 meta.host만, 나머지 어드민=국문 스코프)
- [!] 콘텐츠 입력 후속(버그 아님): 전시회 start/end·리치인트로는 어드민 입력 전까지 빈 값(기간 미표시), 공모전 editions는 어드민에서 회차 추가 전까지 단일 폴백, 쇼케이스 has_bg는 전용 어드민 폼 부재(제출·큐만)로 미노출, contest edition.link는 상세로만 링크
- [!] 실사이트 육안(사용자): 교수 사진 렌더 / 전시 피처드 히어로 / 공모전 회차 블록·주최 / 동아리 4열·로고 배경옵션 / 쇼케이스 확대 / 인라인 편집 바(로그인)

## PHASE 11 — 병렬 2에이전트 (23_PHASE11_FIXES, N1 서버·어드민·CI데이터 / N2 헤더·공개레이아웃)
### 공용 선결 (통합자 생성)
- [x] data/exhibitionTitle.js: exhibitionFullTitle(ordinal)="제{n}회 디지털인문예술전공 프로젝트 전시회"(고정 접미). data/ci.js: CI body 형태 계약+기본값(intro/elements/logoGuide/colors/downloads)
### N1 서버·어드민·CI (완료)
- [x] N1-1 자료실 상세: Resources 행 /resources/:id 링크, 목록 첨부 숨김. ResourceDetail.jsx(다크 카드+RichBody+첨부 줄+갤러리). resource(t1)는 이미 RichEditor 본문·attachments 보유 확인
- [x] N1-2 전시회 타이틀: exhibitions.ordinal 컬럼. full_title은 exhibitionFullTitle(ordinal) 파생(저장 안 함). PostForm 회차(ordinal)+전시명 입력
- [x] N1-3 날짜 단일화: held_at content-config 제거(컬럼 존치·미사용), 폼 시작·종료일만. orderBy start_date DESC. migrate가 held_at→start_date 백필
- [x] N1-4 공모전 풀네임: body={host,editions} 기구축 확인(변경 없음, 주최 원문 불변)
- [x] N1-5 CI: ci 싱글턴 테이블+content-config+CIAdmin(섹션별 편집)+ADMIN_ROUTES 'ci'+STRUCTURE 'CI'. migrate가 data/ci 시드(body NULL일 때만)
- [x] N1-6 취업 데이터 확인(변경 없음)
### N2 헤더·공개 (완료)
- [x] N2-1 헤더 세로 드롭다운: 가로 메가메뉴→메뉴별 세로 드롭다운(진흥원식). grid-rows 0fr↔1fr+opacity 전환(전역 CSS 없이 tailwind), 불투명 depth1, 헤더 바로 아래 좌측 정렬. ESC·포커스·마우스 이탈 닫기. lg 미만 GlassDock 미변경
- [x] N2-2 전시회 피처드 축소·박스 제거: GlassCard 래퍼 제거, 포스터 좁은 컬럼 좌측 밀착(ImageFrame 2:3), 높이 절반. 제목·CTA=full_title(exhibitionFullTitle), 학기코드 버튼 금지
- [x] N2-3 취업 박스 제거: CareerCard GlassCard→상단 헤어라인 경량 셀(멘토·교수급)
- [x] N2-4 CI 공개 /about/ci: 의미→구성요소→로고가이드→전용색상→다운로드, 이미지 전부 ImageFrame 플레이스홀더, useApi('/content/ci') 우선·data/ci 폴백, 토큰만
- [x] N2-5 nav.js 전공소개 children: 전공소개·교육과정·교수진·멘토·코드쉐어링·나노디그리·CI
### N3-1 통합 (완료)
- [x] App 라우트 /resources/:id·/about/ci 등록. AuthContext EDIT_MIN_ROLE ci:'admin'. i18n titles.ci·ci.{title,elements,logoGuide,colors,downloads}·news.resourceNoBody ko/en 추가+CI.jsx/ResourceDetail 리터럴 t() 스왑
- [x] migrate-phase11 배포 Neon 실행: exhibitions.ordinal·ci 테이블·ci 시드·start_date 백필(0건, held_at 원래 null). 2026-1 ordinal=18 설정(full_title "제18회..." 렌더)
- [x] npm run build 성공, 서버 node --check 통과, t() 110키 ko/en 누락 0
- [!] 콘텐츠 입력 후속(버그 아님): 전시회 start/end·리치인트로·ordinal은 어드민 입력 전 빈 값(2026-1만 ordinal 18·featured 시드). CI 이미지·색상·다운로드는 슬롯만(어드민 업로드 대기)
- [!] 실사이트 육안(사용자): 헤더 세로 드롭다운 전 메뉴 / 전시 피처드 축소·박스 없음·full_title / 자료실 상세 진입·리치본문 / CI 페이지 / 취업 경량 카드

## PHASE 12 — 단독 배치 (24_PHASE12_FIXES Q1~Q7)
- [x] Q1 [최우선] 단일 문서 저장 반영: 근본원인 — 공개 CodeSharing.jsx가 시드(data/tracks.js)만 읽고 DB를 안 봄. 나노디그리·CI는 fetch하나 itemOf(data)가 목록형 {items}를 null 처리해 시드 폴백에 갇힘. 수정: useApi.js firstItem(data)=items[0] 헬퍼 신설, 3개 싱글턴 공개 페이지(codesharing 신규 fetch+병합, nanodegree·CI itemOf→firstItem) DB 우선 렌더. 검증: 배포 Neon codesharing.def="과목과 전공에 한해서…"(시드 "과목에 한해서…"와 다름)=저장은 됐고 읽기만 깨졌음 확인. 서버 싱글턴 POST upsert(ON CONFLICT DO UPDATE)는 정상
- [x] Q2 전시 피처드 제목·버튼: (1)full_title displayL·extrabold로 위계 상향 (2)exhibitions cta_show·cta_label·cta_url 컬럼(schema+migrate-phase12+content-config). PostForm exhibition은 상단 고정(is_featured) on일 때만 버튼 표시 토글+텍스트+링크 노출, 끄면 숨김·값 비움. 공개는 cta_show일 때만 CTA(라벨 cta_label>full_title, 링크 cta_url>site_url>상세)
- [x] Q3 [버그] 동아리 로고: 근본원인 — club(t1 폼)에 로고 업로드 필드 자체가 없어 poster_url 미저장. PostForm에 type==='club' 로고 ImageUpload + toPayload poster_url 저장. ClubCard ImageFrame contain(원본 비율·잘림 없음)·크게(w-full 4/3)
- [x] Q4 [버그] 배경 토글: ImageFrame에 contain prop 분리(bg=true도 contain 유지=하위호환). ClubCard·Council 로고 bg={has_bg} 연동 — 켜면 투명 PNG 뒤 bg-bg-frame(#202227, elev보다 밝음, 순백 아님, radius 4). Q3 로고필드 부재로 그동안 배경 효과가 안 보였던 것 동반 해소. has_bg 저장은 기존 정상
- [x] Q5 교수진 4열: 그리드 minmax 300→220px(데스크탑 4열), 카드 패딩 p-24/32→p-16/20 축소. 사진 306/427 유지
- [x] Q6 헤더 균등 간격: nav gap-32 고정 + 링크 px 제거(글자폭 아닌 gap 기준 균등). 6항목 일정 간격
- [x] Q7 라벨 단일화: FixedWidthLabel(숨김 other span→DOM 트리 "AboutAbout" 병기) 제거, navLabel(활성 언어)만 렌더. 최상위·로그인 단일화(드롭다운·모바일은 이전 커밋서 단일). 시프트 우려는 Q6 gap 고정으로 흡수
- [x] 검증: npm run build 성공, 서버 node --check 통과, migrate-phase12 배포 Neon 실행(cta 3컬럼, Neon control-plane 일시 오류로 재시도 후 성공)
- [!] 실사이트 육안(사용자): 코드쉐어링 문장 수정 반영 / 전시 제목 크게·버튼 편집 / 동아리 로고 표시·배경 토글 / 교수 4열 / 헤더 균등·단일 라벨

## PHASE 13 — 업로드 레이스 컨디션 (동아리 로고·위원회 로고·교수 사진·전시 포스터)
- [x] [버그] 업로드 불안정 근본원인: ImageUpload.handleFile은 async(setBusy→await api.upload→onChange(url))라 URL은 업로드 완료 후에야 form에 들어감. 그런데 저장 버튼은 폼 자체 busy(저장 진행)만 보고 업로드 진행(busy)은 안 봄 → "업로드 중"에 저장 클릭 시 poster_url='' 빈 값 저장 후 PostForm이 navigate로 이탈, 뒤늦은 onChange 유실. 재시도(미리보기 뜬 뒤 저장)는 됨 = "한두 번 재시도해야 뜬다" 정확히 일치. "아예 안 뜬다"=Render 콜드스타트 업로드 실패(이미 ErrorText 노출, 웜업 후 재시도 성공)
- [x] 수정: ImageUpload에 onUploadingChange(active) prop 신설 — 업로드 시작/종료를 상위에 전파. PostForm·EntityCrud가 진행 중 업로드 카운터(uploading) 유지, uploading>0이면 저장 버튼 disabled('업로드 완료 대기') + save() 조기 return으로 빈 URL 저장 원천 차단
- [x] 전 업로드 필드 배선: PostForm(동아리 로고·t2 포스터·전시 포스터·공모전 회차 EditionsField·전시 갤러리·본문 갤러리·첨부 AttachmentsField), EntityCrud(FieldControl image·file → 위원회 로고·교수 사진·자료 등 공용). GalleryField·AttachmentsField·EditionsField도 onUploadingChange 관통
- [x] 피드백: 업로드 중 "업로드 중 — 완료된 뒤 저장하세요" 캡션 + 버튼 "업로드 중", 성공=미리보기 렌더, 실패=ErrorText(성공 URL만 onChange로 저장). 서버 Blob put 실패·sharp 디코드 실패는 wrap→500→ErrorText로 이미 노출(삼키지 않음), 투명 PNG→WebP는 알파 보존(정상)
- [x] 재조회: 저장 후 PostForm은 목록으로 navigate(마운트 시 새 fetch), EntityCrud는 refetch() — 클라이언트 캐시 없음(useApi는 마운트마다 fetch), 옛 데이터 고착 없음. (공개 페이지의 3초 타임아웃→스냅샷 폴백은 콜드스타트 산물이며 offline 플래그로 구분 — 앱 캐시 아님)
- [x] 검증: npm run build 성공(2014 모듈). 3파일 수정(ImageUpload·EntityCrud·PostForm), 토큰 경유·JSX·하드코딩 없음
- [!] 실사이트 육안(사용자): 동아리 로고 업로드 반복 안정 표시 / 위원회 로고 / 교수 사진 / 전시 포스터 — 업로드 중 저장 버튼 비활성 확인

## PHASE 13 · IA — 헤더 IA 개편 + 코드쉐어링/나노디그리 표 (25_PHASE13_IA_FIXES, 병렬 P1·P2 + 통합 P3)
### P1 IA·헤더·공개 (data/nav.js, GlassDock.jsx, Curriculum.jsx, About.jsx)
- [x] P1-1 헤더 IA 진흥원식 6그룹: About(→/about) · 학사 안내(→/curriculum) · 학과 행사(→/programs/exhibitions) · 학생 활동(→/students/council) · 공지사항(→/news) · 자료실(→/resources). 각 그룹 대표 to=첫 하위 경로라 클릭 시 첫 하위로 점프. About 하위=전공 소개·연혁(/about#history)·교수진·멘토·CI / 학사 안내=교육과정·코드쉐어링·나노디그리 / 학과 행사=프로젝트 전시회·공모전·특강 / 학생 활동=운영위·동아리·학생 성과·웹&앱 쇼케이스·취업 현황. Header.jsx는 hasChildren·navLabel 제네릭 로직으로 무변경(검증만)
- [x] GlassDock(모바일): 각 그룹 라벨 링크 + 하위 항목 들여쓰기 서브링크로 전개(코드쉐어링·나노디그리·연혁·CI 모바일 도달 가능). 활성 언어 단일 라벨·포커스트랩·스와이프/ESC 유지
- [x] About #history: 연혁 섹션 Container에 id="history" + scroll-mt-header (연혁 하위 항목 앵커 착지)
- [x] P1-2 교육과정 하단 "자세히 보기"(06 코드쉐어링·07 나노디그리) 블록 삭제 + 그로 인해 유휴가 된 import(ArrowLink·nanodegree·motion) 정리(SectionLabel은 05 로드맵서 계속 사용 → 유지). 트랙 표+로드맵만 남김
### P2 코드쉐어링·나노디그리 표·데이터·어드민 (Table.jsx 신설, 페이지·데이터·어드민·마이그레이션)
- [x] P2-3 공용 Table.jsx(common): 다크·헤어라인·radius 4, 컬럼 {key,label,align,nowrap,mono}, 표만 overflow-x-auto(min-w-0)로 격리해 페이지 가로 스크롤 0. Curriculum SemesterTable 토큰 언어 그대로
- [x] P2-1 코드쉐어링 표 재구성: 01 개요(정의·유의·HWP) · 02 절차 유지 + 03 대체형(없음) · 04 인정형(타과교과목 14개 Table: 개설학기/교과목 번호/과목명/학점-강의-실습/전공) · 05 학점인정형(인정 학과 18개 Tag) · 06 졸업인증 기준(3항). 데이터는 tracks.js codeSharing에 substitute·recognizedCourses(14)·graduation(3) 추가 + departments 19→18 교체(사용자 확정본 그대로). DB 우선·시드 폴백 유지
- [x] P2-2 나노디그리 표(학교 레이아웃): 과정별 제목 + 이수기준·유관기관 메타 + 과목표(과목번호/교과목명/학점) + 이수 규칙. data/nanodegree.js programs 새 구조 {name,criteria,partner,completion,courses:[{code,name,credit}]}로 전면 교체 — AI 디자인/UX 디자인/디지털 디자인/AI와 길 정보 구축(HUSS), 과목번호=학교 페이지 번호·과목명=사용자 확정본·학점-강의-실습 그대로. 이전 잘못된 시드 대체
- [x] 어드민 편집: CodeSharingAdmin에 substitute·graduation·recognizedCourses(5입력 행 리피터) 추가+저장 배선. NanodegreeAdmin은 새 program 구조(name/criteria/partner/completion + 과목 code/name/credit 리피터), 구 shape 관대 하이드레이션
- [x] Nanodegree.jsx 방어 가드(통합): DB body가 새 구조(program.courses 배열)일 때만 채택, 구 시드(courses 문자열)면 새 시드 폴백 — migrate-phase13 실행 전에도 Table .map 크래시 없이 새 데이터 렌더
### P3 통합
- [x] "전시회"→"프로젝트 전시회" 개명: nav.js 하위 라벨 + i18n titles.exhibitions·hero.ctaExhibition·programs.exhibitions.label·notFoundPage.exhibitions + Exhibitions·ExhibitionDetail PageBanner + 어드민 콘텐츠 라벨(AdminLayout·Dashboard·postTypes). "전시회 접수/설정/출품" 및 council·clubs 사용자 원문은 별개 개념이라 미변경
- [x] i18n 신규 키(ko+en): codesharing.{substituteType,recognizedType,creditType,none,graduationTitle,thSemester,thCode,thCourse,thCredit,thMajor} · nanodegree.{criteria,completion,thCode,thCourse,thCredit}
- [x] 검증: npm run build 성공(2015 모듈). 20파일(수정 18 + 신규 Table.jsx·migrate-phase13.mjs). 토큰 경유·JSX·하드코딩 없음
- [x] migrate-phase13 배포 Neon 실행 완료 + DB 검증: nanodegree body 4과정(AI 디자인/UX 디자인/디지털 디자인/AI와 길 정보 구축(HUSS)) courses 배열·유관기관(파이미디어/H9/루아흐 스튜디오/파이미디어) 정정, codesharing depts 18개(언론방송융합미디어전공·MICE기획경영전공 포함, 스타트업비즈니스전공 제외)
- [!] 실사이트 육안(사용자): 헤더 6그룹·그룹 클릭 첫 하위 점프·호버 세로 드롭다운 미잘림 / 프로젝트 전시회 개명 / 코드쉐어링·나노디그리 표 렌더

## PHASE 14 · CI — CI 페이지 진흥원 구조 이식 (26_CI_PAGE)
- [x] 섹션 순서 진흥원(gidp_ci) 이식: 01 CI의 의미(대표 심벌 + 설명 + 다운로드 3버튼) · 02 구성요소별 의미(곡선·컬러·워드마크) · 03 로고가이드(한글·영문 가로형) · 04 시그니처(상하·좌우조합형) · 05 전용색상(Main·Secondary) · 06 그래픽모티브. 우리 토큰(다크·글래스·radius 4)만, 진흥원 red/charcoal 색상 이식 안 함(빈 편집 슬롯)
- [x] 다운로드 3버튼 정적 경로: /ci/dah-ci-manual.pdf · /ci/dah-ci.jpg · /ci/dah-ci.ai. HEAD 존재확인(text/html SPA폴백 제외) 후 파일 부재 시 "준비 중" 비활성
- [x] 이미지 슬롯 정적 경로(/ci/symbol·logo-kr·logo-en·signature-vertical·signature-horizontal·motif.png): ImageFrame 사용. 파일 부재 시 "이미지 준비 중" 플레이스홀더. ImageFrame에 onError→placeholder 폴백 추가(src별 추적, 하위호환). client/public/ci/ 폴더 생성(README에 예상 파일명 안내)
- [x] 단일 문서 어드민 편집(코드쉐어링·나노디그리 패턴): CIAdmin에 symbol·signatures·motif 필드 추가 + intro·downloads·elements·logoGuide·colors 유지. 다운로드·이미지는 어드민 업로드 또는 정적 파일 교체 둘 다 지원
- [x] ci body 스키마 확장: {intro, symbol, downloads[], elements[], logoGuide[], signatures[], colors[], motif}. content-config ci는 body jsonb라 서버 변경 불필요
- [x] migrate-phase14 배포 Neon 실행·검증: Phase11 구 시드가 {...ci,...body} 병합서 새 구조를 덮어쓰던 문제 해소 — ci body를 새 구조로 재설정(intro·색상 편집분 보존). DB 8키 확인(symbol/motif 정적경로·downloads 3·elements 곡선/컬러/워드마크·logoGuide 한글/영문·signatures 상하/좌우·colors Main/Secondary 빈값)
- [x] i18n ci.* ko+en: title(CI의 의미)·elements·logoGuide·signatures·colors·motif·downloads·comingSoon(준비 중)·imagePending(이미지 준비 중)·pending(미정)
- [x] 텍스트는 빈값 유지(어드민 편집) — 가짜 CI 의미·색상값 생성 금지(DESIGN.md). 구조 슬롯·제목만 시드
- [x] 검증: npm run build 성공(2015 모듈). 헤더 About 하위 CI는 25번서 이미 반영
- [!] 실사이트 육안(사용자): /about/ci 6섹션 순서·레이아웃 / 다운로드 준비 중 비활성 / 이미지 준비 중 플레이스홀더 / 어드민(/admin/ci) 전 섹션 편집

## PHASE 15 · I18N — 수동 영문 정책 + 정적 영문 확정 (27_I18N_MANUAL, 병렬 R1·R2·R3 + 통합 R4)
### R1 에디터 영문 정책·발행 게이트 (PostForm.jsx, postTypes.js)
- [x] 자동번역 API 미사용(수동 입력 정책). postTypes에 enRequired 플래그: lecture·contest·exhibitions·achievement·resource·club=true, notice·portfolios=false
- [x] 발행 게이트: enRequired 유형은 form.published=true + 영문 제목(title_en) 미입력 시 저장 차단('영문 제목을 입력해야 발행할 수 있습니다. 임시저장은 영문 없이도 가능') + 발행 버튼 disabled. 게시 토글 끄면 임시저장(draft) 허용
- [x] KO/EN 본문 분리: t1/t2(비-contest)·exhibition에 영문 리치 에디터(body_en) 추가. exhibition은 title_en·intro_en 필드 신설. emptyForm/fromItem/toPayload 배선
### R2 정적 영문 데이터 확정 (data/*.js, 원문 verbatim + EN 형제 필드만 추가)
- [x] history.js textEn 12건(연혁 확정 영문). mentors.js nameEn·companyEn·roleEn 14명(성 뒤 로마자). careers.js nameEn·majorsEn·companyEn·roleEn 26건(전공 매핑 사전 일관, 회사 공식영문/음역). clubs.js fieldEn 4종 + clubFieldEn 맵. 학과명 Digital Arts & Humanities 풀네임
### R3 공개 i18n·인터랙션 (i18n, People·About·Council·Clubs·HeroSection·Exhibitions + council.js)
- [x] tracks 라벨 '3개 트랙'→'전공 트랙'(Three Tracks→Tracks). 히어로 CTA EN. 전시 피처드 EN 풀네임('The 18th Digital Arts & Humanities Project Exhibition')·intro_en·CTA
- [x] council.js titleEn 10기수 + 멤버 nameEn 56명(로마자). Council EN 렌더(titleEn·멤버명·소속 Digital Arts & Humanities 풀네임). '2026 제1대 운영위원회 LUCID'→'2026 1st Student Council LUCID'
- [x] People EN: 교수 영문명만 크게·한글 숨김(Prof., Digital Arts & Humanities). MentorCard nameEn/companyEn/roleEn. Clubs EN: title_en 렌더(더 인스튜디오 영문명 노출 수정) + fieldEn/clubFieldEn 매핑
- [!] 동아리 로고(CON:NECT·DS4H): 코드 버그 아님 — 해당 레코드 poster_url 미저장(로고 미업로드)이라 플레이스홀더 표시. CMS에서 로고 업로드 필요(업로드 race는 이전 phase서 해소)
- [x] 언어 전환 시프트 0: 기존 App PageFade(pathname 키 재마운트 opacity 크로스페이드, translate 금지)가 /↔/en 전환에도 적용 — 신규 래퍼 불필요. R3가 컴포넌트 단위 레이아웃 시프트 0 확인
### R4 통합 (스키마·상세 렌더·나노디그리·마이그레이션)
- [x] 스키마: posts.body_en(jsonb) + exhibitions.title_en·intro_en(text)·body_en(jsonb). content-config 화이트리스트 반영. migrate-phase15 배포 Neon 실행·컬럼 검증 완료
- [x] 상세 EN 렌더: NewsDetail·ResourceDetail·LectureDetail(title_en·body_en) + ContestDetail(title_en, 본문 구조화라 EN 대역 없음) + ExhibitionDetail(title_en·intro_en·body_en). EN이고 영문 없으면 국문 폴백 + Korean only 뱃지
- [x] Careers EN: DB careers가 시드와 id 일치 → EN 모드는 정적 EN(nameEn 등)을 id 매칭 렌더(별도 en 컬럼 없이). 나노디그리 auto-rows-fr로 4과정 박스 동일 높이
- [x] 검증: npm run build 성공(2015 모듈), 서버 node --check 통과. 22파일(수정 21 + migrate-phase15)
- [!] 실사이트 육안(사용자): /en 미러 — 연혁·멘토·취업·운영위·교수·동아리 영문 / 발행 게이트(영문 없이 발행 불가, 공지 예외) / 나노디그리 균일 / 언어 전환 시프트 0

## PHASE 16 · CRITIC — 성과 원문 복구 + i18n 잔여 + UI 크리틱 (28_PHASE14_FIXES, 병렬 S1·S2·S3 + 통합 S4)
### S1 성과·연혁·운영위 정적데이터
- [x] S1-1 학생 성과 전면 재시드[절대 원문]: seed-achievements-phase14가 achievements_SOURCE.md를 직접 파싱(토씨 불변) → 기존 41건 DELETE 후 30건 재생성(title_ko·body{desc,descEn,year}·title_en, tag=연도, sort=등장순). 영문은 achievementsEn.js(S1, 30건 키=### 원문 그대로) 매칭. 소스 이상 2건 처리(중복 제목=EN 배열 순서 배정, 트레일링 스페이스 키 보존). 정적 폴백 data/achievements.js도 동일 파싱으로 자동 재생성. 문자 대조 3건(#0·#15·#29) 전부 일치 ✓
- [x] S1-2 연혁[근본원인]: About.jsx는 data/history.js를 정상 참조(데이터 정확)했으나 HistoryTimeline이 item.text(국문)만 렌더+KoreanOnlyBadge라 EN 미반영이었음. 수정: lang 전달→EN은 textEn 렌더, 뱃지 제거. 12건 데이터 확인
- [x] S1-4 미션 EN 중복: EN 모드에서 MISSION_EN(영문)+copy.missionKr(영문) 두 줄이 중복 → EN일 때 두 번째 줄 미렌더
- [x] S1-3 운영위 전원 로마자: council.js 10기수 전 멤버 nameEn 이미 존재(0건 누락 확인), Council.jsx EN 렌더·소속 Digital Arts & Humanities 풀네임 확인
### S2 i18n 잔여 버그
- [x] S2-1 히어로 버튼[근본원인]: settings.hero.ctas(트랙 살펴보기·전시회 보러가기)에 영문 라벨이 없어 i18n 기본을 덮어써 EN 전환 시 국문으로 되돌아감('바뀌려다 만다'). 수정: HeroSection이 EN 모드에서 cta.labelEn→i18n 기본(index)→cta.label 순 폴백. 배포 DB hero.ctas에 labelEn(Explore Tracks·Visit the Exhibition) 반영 + SettingsAdmin 영문 라벨 입력칸 추가
- [x] S2-1 Curriculum '학년별 교육 과정'은 t('sections.roadmap')로 정상 전환(오보). 대신 로드맵 SVG 과목 블록이 course.name(국문) 고정이던 갭 발견→courseName(course,lang) 적용, SVG aria-label i18n화
- [x] S2-2 전시 피처드 EN: full title EN·intro_en·기간 정상 확인 + CTA 라벨이 국문 cta_label 누출되던 것 수정(EN은 cta_label_en→full title 폴백)
- [x] S2-3 언어 전환: 기존 App PageFade(pathname 재마운트 opacity 크로스페이드)로 충족, 컴포넌트 레이아웃 시프트 0 확인
### S3 공개·어드민 UI
- [x] S3-1 상담: 전공 소개 하단 상담 링크 제거(About), Consult 폼 회사명 삭제 + 이름/학년/주전공/복수전공/연락처/문의내용 순, 수집항목 문구 갱신. 서버 /consult가 grade·mainMajor·doubleMajor 수신+저장(migrate-phase16: consultations.grade·main_major·double_major), ConsultationsAdmin 학년·전공 표시. 진입은 푸터만
- [x] S3-2 쇼케이스 카드: 16:9 유지·제목 h3로 확대·텍스트 간격(gap-12)·패딩(p-24/32) 상향
- [x] S3-3 사용자 3열: UsersAdmin 세로 나열→반응형 3열 그리드 컴팩트 카드, 역할 셀렉트 카드 내부로 폭 제한
- [x] S3-4 로그아웃 확인 모달: AdminLayout 로그아웃 버튼→글래스 확인 모달(취소/확인, ESC·백드롭 닫기, window.confirm 미사용), 확인 시에만 로그아웃
- [x] S3-5 동아리 로고[파일단위 진단·DB 확정]: CON:NECT(#27)·DS4H(#28)는 DB poster_url이 비어있음(로고 미업로드) → 코드 버그 아님, 플레이스홀더 정상. 더 인스튜디오는 title_en='The in Studio' 존재+ClubCard EN title_en·fieldEn 렌더 확인. 코드 수정 불필요
- [!] 후속(콘텐츠 입력, 버그 아님): CON:NECT·DS4H 로고는 CMS에서 업로드 필요(파일 부재)
### S4 통합
- [x] 검증: npm run build 성공(2015 모듈), 서버 node --check 통과. migrate-phase16·seed-achievements 배포 Neon 실행+문자대조, hero labelEn DB 반영. 19파일(수정 14 + 신규 achievementsEn·migrate-phase16·seed·소스 문서)
- [!] 실사이트 육안(사용자): /students/achievements 원문 30건(국·영) / 연혁 EN / 히어로 버튼 EN / Curriculum EN / 상담 필드 / 쇼케이스 카드 / 사용자 3열 / 로그아웃 모달

## 배포
- [ ] Vercel 연결, 도메인, vercel.json 리라이트
- [ ] Lighthouse: 모바일 Performance 90+, A11y 100 목표