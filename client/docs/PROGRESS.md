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

## PHASE 15 · COUNCIL+LANG — 운영위 원문 복구 + 언어전환 인터랙션 제거 (29_PHASE15_FIXES, 단독)
### T1 운영위원회 원문 그대로 재시드[절대 원문]
- [x] seed-council-phase15가 council_SOURCE.md를 직접 파싱(토씨 불변) → 기존 council 전량 DELETE 후 10기수 재생성(2026→2017). name=연도 제외 기수명·intro·members[{role,name,majors}] 원문 그대로, year_label·sort. 업로드된 logo_url·has_bg는 year_label 기준으로 보존
- [x] 영문: titleEn·introEn·멤버 nameEn은 검수 완료 data/council.js 재사용, 부서 EN(roleEn 매핑: 위원장=Chair 등), 소속 EN(majorsEn: Digital Arts & Humanities 유지·사회학과=Sociology·광고홍보=Advertising & PR·경영학과=Business Administration·디지털미디어콘텐츠=Digital Media Contents, 학번 보존). DB members jsonb에 roleEn·nameEn·majorsEn 저장. 정적 폴백 data/council.js 동일 파싱으로 자동 재생성
- [x] Council.jsx: 부서 라벨 EN(row.roleEn)·소속 EN(member.majorsEn) 렌더 배선. 멤버 nameEn·titleEn·introEn는 기존 경로 유지
- [x] 검증: 파싱 10기수·56명, nameEn 미매칭 0. 문자 대조 2026·2023·2019 intro·members 전부 일치 ✓. DB 순서 2026(10)→2017(2), 2026 위원장 주현호/Digital Arts & Humanities 22(원문)·Hyun Ho Ju/Chair, 2022 사회학과→Sociology 19, 로고 보존 확인
### T2 언어 전환 인터랙션 완전 제거[실측 원인 확정]
- [x] 근본원인: App PageFade가 key={pathname}라 언어 토글(/about↔/en/about)에 key가 바뀌어 전 트리 재마운트 → page-fade·Reveal(useReveal) 등장 애니메이션 재실행("띠용"). 수정: key={정규화 경로(/en 제외)} → 언어 토글은 정규화 경로 동일 → 재마운트·재애니메이션 없음, useLang 텍스트만 갱신
- [x] 내부 Reveal이 번역 텍스트로 key되던 4곳(About 비전 item.title, CodeSharing step·graduation, Nanodegree program.name)을 언어 무관 index key로 교체 → 언어 전환 시 해당 항목 리마운트·재페이드 방지. ScrollToTop은 이미 정규화 경로로 언어 토글 스크롤 미발동, GlassCard/PageBanner 등은 hover·비Reveal이라 무관
- [x] 허용 변화는 텍스트 즉시 교체(슬라이드·재등장 0, 레이아웃 시프트 0). 실페이지 나머지 map은 id/index key라 무영향 확인
- [x] 검증: npm run build 성공(2015 모듈). 9파일(수정 6 + 신규 seed·소스 문서·스펙)
- [!] 실사이트 육안(사용자): 운영위 2026 선두·전원 멤버·전원 로마자(EN)·소속 영문 / 전 페이지 언어 토글 시 어떤 섹션도 재슬라이드·재페이드 0

## PHASE 17 · CRITIC — 로그아웃 모달·성과 필수/강조·공모전 그리드·히어로 영상 (30_PHASE16_FIXES, 병렬 U1·U2 + 통합 U3)
### U1 공개 UI·히어로 영상
- [x] U1-1 성과 수상자 강조: Achievements.jsx가 body.awardees(KR)/awardeesEn(EN)로 본문 속 이름만 화이트 볼드(font-bold text-text-pri). 본문 원문 불변, highlightNames가 전체 이름 단위 매칭(긴 이름 우선 정렬로 과매칭 방지)·줄바꿈 보존. 이름 없으면 원문 그대로
- [x] U1-2 공모전·특강 그리드 통일: Lectures 카드가 raw img→ImageFrame(2:3), Contests editions가 고정폭 flex→전시회 auto-fill 그리드(minmax(220px,40vw))·GlassCard p-12로 전시회 rest 그리드와 동일 크기·비율·간격
- [x] U1-3 히어로 영상 즉시 로드: video preload=auto + poster 유지 + onCanPlay 시 opacity 페이드인(깜빡임 0), index.html에 link rel=preload as=video. object-cover(모바일 크롭) 유지, OrbitCanvas 폴백 유지
### U2 어드민·데이터·모달
- [x] U2-1 로그아웃 모달 z-index·딤[근본원인]: LogoutConfirm이 AdminNav 내부 중첩 스태킹 컨텍스트라 z-[60]이 헤더(z-50) 아래 깔림 → createPortal(document.body) + z-[100]. 딤 bg-black/60·중앙·스크롤 잠금 유지. LoginModal도 z-[100]로 통일. ShareButton은 인라인 확장(오버레이 아님)이라 무관
- [x] U2-2·U2-3 성과 필수 필드+모델 정합: PostForm achievement 템플릿을 구 {awardee,host,desc,year}→신 {desc,descEn,year,awardees,awardeesEn}로 전면 교체(국문 본문·영문 본문 TextArea, 수상자 국문·영문 Input, 연도, 대회 URL). 발행 게이트: 국문 제목·국문 본문·영문 제목·영문 본문·수상자 국문·영문 모두 채워야 발행(published)+빈 필드 안내, 임시저장은 허용. 기존 enGate 확장
### U3 통합
- [x] 성과 시드 확장·재실행: seed-achievements가 본문에서 수상자 KR 추출((a)시작부 이름 학생 (b)에 이름 학생이 선발/게재 (c)「」 블록 이름줄, 등급단어 제외) + 운영위·취업·멘토 로마자 맵으로 awardeesEn 생성. body.awardees·awardeesEn 시드 + 정적 폴백 재생성. 30건 재시드, 문자 대조 3건 일치, 수상자 24/30 추출(주현호→Hyun Ho Ju 등)
- [!] 후속(비버그): EN 수상자는 운영위·취업·멘토에 있는 이름만 로마자 매핑됨(신규 학생 미매핑은 EN 강조 생략). KR 강조는 24/30. 6건은 본문서 이름 추출 불가(빈 awardees). 신규·수정은 어드민이 수상자 국·영문 입력(발행 필수)
- [x] 검증: npm run build 성공(2015 모듈), 서버 node --check 통과. 11파일(수정 10 + 스펙 문서)
- [!] 사용자 액션: 히어로 poster는 client/public/videos/hero-poster.jpg에 넣으면 반영
- [!] 실사이트 육안(사용자): 로그아웃 모달 최상위·딤 / 성과 이름 볼드(국·영) / 공모전·특강 카드=전시회 크기 / 히어로 영상 즉시·부드럽게 / 성과 발행 게이트(수상자·영문 본문 필수)

## 배포
- [ ] Vercel 연결, 도메인, vercel.json 리라이트
- [ ] Lighthouse: 모바일 Performance 90+, A11y 100 목표

## PHASE 18 · 이관 준비 — 계정 이전 안전점검·백업 (MIGRATION_PREP)
계획: Render=학과 계정 신규 생성 / Neon=학과 조직으로 프로젝트 이전 / Vercel=학과 계정 멤버 추가 / Blob=당분간 현 계정 유지
### 코드 이관가능성 점검 (완료 — 코드 변경 불필요, .env.example만 정합화)
- [x] 하드코딩 인프라값 0 확인: 4대 변수(CLIENT_ORIGIN·VITE_API_URL·DATABASE_URL·BLOB_READ_WRITE_TOKEN) 전부 env 경유만(각각 app.js:28·useApi.js:7·db.js·upload.js). 그 외 JWT_SECRET·OWNER_EMAIL·EXPORT_DIR·PORT·NODE_ENV·SMTP*·TELEGRAM*도 전부 process.env. vite.config·index.html 하드코딩 백엔드 없음
- [x] 잔여 하드코딩 URL은 콘텐츠(인프라 아님): site.js 전시회 링크(26-1-dah-exhibition.vercel.app — 별개 프로젝트, DB site_settings로 CMS 오버라이드 가능)·notices.js 구 Google Sites 링크. upload.js blob.url은 Blob SDK 반환값(동적). → env 분리 대상 아님, 이관과 무관
- [x] .env.example 정합화: server는 누락분(NODE_ENV·SMTP*·TELEGRAM*) 추가+주석·잘못된 da11 줄 제거, client는 빈 파일→VITE_API_URL 문서화. 이관 시 값만 교체하면 되는 템플릿 완성
### 백업 (사용자 실행 — 실제 이관 전 필수)
- [ ] pg_dump 전체 백업: Neon 서버가 PG 18.4라 pg_dump 18 필요(구버전은 server version mismatch로 실패). `pg_dump "$DATABASE_URL" --no-owner --no-privileges -Fc -f dah-neon-$(date +%F).dump` (server/.env의 DATABASE_URL 사용, SSL은 URL의 sslmode=require로 자동)
- [ ] 어드민 "DB 백업"(owner) 실행 → 콘텐츠 JSON 저장(users·비번해시 제외 = 부분 백업. 완전본은 pg_dump)
### 이관 순서 (실제 계정 이동은 이 단계 밖 — 코드는 이관 가능 상태 보장 완료)
- [ ] 1) Neon: 프로젝트를 학과 조직으로 Transfer(데이터 보존됨. 이전 후 DATABASE_URL 호스트가 바뀔 수 있으니 새 연결문자열 확보)
- [ ] 2) Render: 학과 계정으로 Web Service 신규 생성(repo main, root=server/). 환경변수 재설정(server 목록) — **NODE_ENV=production 필수**(Secure·SameSite=None 쿠키). 새 Render URL 확보
- [ ] 3) Vercel: 학과 계정을 프로젝트 멤버로 추가. VITE_API_URL을 새 Render URL로 교체 후 재배포. Render의 CLIENT_ORIGIN을 정확한 Vercel 도메인(https, 끝 슬래시 없음)으로
- [ ] 4) Blob: 당분간 현 계정 유지(BLOB_READ_WRITE_TOKEN 불변). 추후 이전 시 신규 스토어 토큰 발급 + 기존 파일 마이그레이션
- [ ] 5) 검증: /health 200 → 로그인(DevTools서 쿠키 Secure·SameSite=None 저장 확인) → 어드민 CRUD → 이미지 업로드(Blob) → 공개 목록·상세 → UptimeRobot 모니터를 새 /health URL로 갱신

## PHASE 19 · REBRAND — CI 리브랜딩 전면 적용 (32_REBRAND, 단독 STEP1 → 병렬 W1·W2·W3 → 단독 STEP3)
유일 색상 기준: docs/CI.md(= 루트 CI.md). 딥 퍼플 블랙(우주) + 보라(지성). CI.md에 없는 색 생성 금지, 순수 검정·청록·옐로우·핑크 금지, Pretendard 단일, 콘텐츠 원문 불변.
### STEP 1 (단독, 토큰 전면 교체 — 사이트 전체가 토큰 구동식이라 토큰만 바꾸면 전파)
- [x] tokens.js 색상 전면 리브랜딩(CI 4.2/4.5): 배경 bg.base #100D18·elev #171321·panel/frame #211A31 / 텍스트 pri #F7F5FC·sec #C9C3D5·meta #938BA5·disabled #625A70 / 보라 스케일 purple.primary #815FD7·light #C8B9F2·mid #A286E9·deep #6844C4·deepDark #4B2D99 / 헤어라인 white10%·16%·purple 15% / 포커스 링 #A286E9
- [x] 버튼·링크·아이콘 토큰 신규(CI 4.5): button(primary #815FD7·hover #A286E9·pressed #6844C4·secondary·ghost)·link(#A286E9→#C8B9F2→#815FD7)·icon(#C9C3D5·active #A286E9·key #815FD7·disabled #938BA5). tailwind `...colors` 자동 노출. 주의: tokens 키가 camelCase라 클래스는 `bg-button-primary`·`text-button-primaryText`·`hover:bg-button-primaryHover`(kebab 스펠링은 미컴파일)
- [x] 핵심 결정: `bg-bg-invert`/`text-text-invert`가 Primary 버튼·토글 켜짐·선택 채움 쌍이라 #815FD7/#F7F5FC로 매핑 → JSX 변경 없이 CI Primary 즉시 반영
- [x] 잔존 색 전역 감사(S1-3): 청록(cosmos.accentTeal→accentDeep #6844C4·nebula-teal→nebula-deep 클래스·GlassCard 호버 글로우 rgba(64,180,160)→보라)·#000000(CIAdmin 컬러픽커 폴백→#100D18) 전부 교체. cosmos depth0 #100D18·depth1 #171321, nebula-soft #C8B9F2
- [x] 빌드 성공(2015 modules). 컴파일 CSS 확인: 옛 Linear 팔레트(#08090A 등) 0회, CI 보라값 정상 방출
### STEP 2 (병렬 3에이전트, tokens.js 불변 — 소유 계약 무충돌)
- [x] W1 CI 페이지·로고 에셋: /about/ci 7섹션 CI.md 원문 채움(의미·구성요소·로고가이드 4버전·시그니처·전용색상 12칩·모티브·슬로건, data/ci.js+CI.jsx, 창작 없음). 단색 로고 4종 SVG(logo-light #F7F5FC·purple #815FD7·dark #211A31·deepdark #100D18, 각 3 path 동일 fill, 좌표 불변) + motif.svg(D #C8B9F2·A #A286E9·H #815FD7) → public/ci/. 헤더/GlassDock/Footer 로고 = assets/logo.svg fill #F7F5FC(Light). 파비콘 black→#F7F5FC(구 파비콘은 새 배경서 안 보였음)
- [x] W2 공개 페이지 검수: 전 공개 페이지·홈 섹션 0 이탈·0 변경(토큰 자동 반영). 강한 보라(#815FD7)는 Primary CTA에만=면적 ≤10%. 본문 보라 0. 히어로 오버레이 bg-bg-base 계열 확인
- [x] W3 어드민·공용 컴포넌트: AdminLayout 로그아웃 모달 scrim bg-black/60→bg-bg-base/70(순수 검정 제거). Button.jsx primary·FormControls PrimaryButton → 명시 버튼 토큰(hover #A286E9·pressed #6844C4, CI 4.5 정확). Toggle 켜짐 bg-purple-primary(#815FD7). 상태색은 시스템 경고용 유지(브랜드 미승격). 접근성 대비 통과. 편집 UI 비로그인 미렌더 불변
### STEP 3 (단독 통합)
- [x] 충돌 확인: tokens.js·tailwind.config.js는 STEP1 이후 불변(에이전트 미수정). 소유 계약대로 파일 무충돌
- [x] 잔존 0건 확정: #fbbc04·#1c1c1c 0 / #000000·#000 0 / 청록 0 / bg-black scrim 0(추가로 auth/LoginModal.jsx bg-black/60→bg-bg-base/70 교정, W3 스코프 밖이라 통합자 처리)
- [x] 폰트: index.html Pretendard 단일 로드만(Space Grotesk·IBM Plex·Anton 미로드), tokens.js 폰트 패밀리 Pretendard 단일
- [x] npm run build 성공. 버튼 토큰 컴파일 확인(rgb(129 95 215)·rgb(162 134 233)·rgb(104 68 196)), 로고 4종 각 3 fill·파비콘·헤더 로고 #F7F5FC 확인
- [x] 로컬 프리뷰 육안 확인(vite preview): 홈(딥 퍼플 블랙·Light 로고·보라 Primary 버튼)·CI 페이지(4 단색 로고·색상 칩·모티브 전 섹션)·히어로 정상
- [x] 히어로 영상 주변 처리(W2-4): 영상 미교체, 오버레이 60%→72%로 강화해 딥 퍼플 블랙과 자연스럽게 연결(영상 원본의 CI 외 색 노출 완화)
- [ ] 커밋·푸시·배포: 커밋·푸시 완료 후 Vercel/Render GitHub 연동 시 자동 배포(미연동이면 대시보드 수동 배포 1회)
- [!] 실사이트 육안(사용자 수행): 배포 URL은 Vercel 대시보드 도메인(레포에 미기재). 홈·About·CI·전시회·학생 성과·어드민 육안 확인 필요
- [!] 남은 항목(콘텐츠·에셋, 버그 아님): (1)히어로 영상 hero.mp4 자체가 청록·핑크 3D 렌더 = CI 외 색 → 완전 준수하려면 사용자가 보라 계열 온브랜드 영상으로 교체(리브랜딩 스코프상 영상 교체 금지, 오버레이만 강화) (2)로고 원본 파일(AI/시그니처 이미지)·CI 매뉴얼 PDF는 어드민 업로드 또는 public/ci 교체 대기(현재 시그니처는 "이미지 준비 중" 플레이스홀더) (3)public/ci/README.md는 구 플레이스홀더 파일명 안내 유지(문서, 미갱신)

## PHASE 20 · GLASS — 위계 재정립·리퀴드글래스·접수 시스템 (33_PHASE18_GLASS, 단독 STEP1 → 병렬 Y1·Y2·Y3 → 단독 STEP3)
색상 유일 기준 docs/CI.md. 스킬 활용: apple-design(스프링·인터럽터빌러티·머티리얼 위계·타이포 트래킹·reduced-motion/-transparency), improve/review-animations 원칙. 진단 원칙: 위계 실종이 문제(보라 과다 아님) → CI 4.3(강조 보라 ≤10%) 유지하며 포인트 복원.
### STEP 1 (단독, 공용·시스템)
- [x] X1 보라 포인트 규약: `src/styles/accents.js`(ACCENT) + `common/Accent.jsx`. 섹션번호=purple.mid, 연도·기수·고유명=purple.light, 직책=purple.mid, 링크=링크토큰, 본문=text.sec 유지. SectionLabel 인덱스에 적용
- [x] X2 버튼 3위계: Primary=보라채움+상단 화이트 하이라이트(inset)+퍼플 글로우(shadow-btn `0 4px 24px rgba(129,95,215,.35)`), hover 글로우 강화, pressed 감광 / Secondary=유리+hairline→hover 보라 / Ghost 신설. 그림자는 tokens.shadow(btn/btn-hover/glass/glass-hover) 경유(하드코딩 없음)
- [x] X3 리퀴드글래스(liquidGL): vendor를 public/vendor/liquidgl/로 배치(번들 제외), `hooks/useLiquidGlass.js` 지연로드+4중 폴백가드(reduced-motion·reduced-transparency·뷰포트<1024·코어<4·WebGL 실패→CSS 글래스 유지). **적용 3곳만**: 데스크탑 헤더(`.dah-liquid-header`, glassed일 때)·전시회 피처드 CTA(`.dah-liquid-cta`, Y2)·모바일 메뉴 시트(`.dah-liquid-sheet`, Y1). GlassCard도 shadow-glass+hover 보라 hairline 강화. 성능 특성: html2canvas 스냅샷은 init·resize 시 1회(rAF 렌더 루프는 캐시 텍스처 셰이더만) — 페이지 첫 스크롤 시 일시 비용, 실패해도 CSS 글래스로 무저하 폴백
- [x] X4 선 장식 제거: SectionLabel `h-px w-24` 장식선 제거(간격만으로 구분). 전역 잔존 0(ArrowLink `after:h-px`는 링크 밑줄 draw 인터랙션이라 유지)
- [x] X5 네이티브 UI 전수 대체: `common/Select`(포털·키보드 ↑↓/Home/End/타이핑점프·listbox ARIA)·`DatePicker`(월그리드·연월네비·시간, 값계약 네이티브 동일 'YYYY-MM-DD'/'…THH:mm' → 저장 로직 무변경)·`Checkbox`·`RadioCards`(카드형 선택링). 교체: FormControls Select 위임(어드민 select 4곳 일괄), date 5곳+datetime-local 3곳→DateInput. **네이티브 select/date/time 잔존 0**
- [x] X6 어드민 사이드바 상태 유지[근본원인]: App.jsx PageFade key=pathname이 어드민 이동마다 AdminRoutes·AdminLayout 통째 재마운트 → 사이드바 스크롤 소실·페이드 재생. key를 `/admin`으로 고정(fadeKey) → 셸 유지·Outlet만 교체
- [x] 공용 유틸 `utils/format.js`: formatPhone(010-XXXX-XXXX 강제·비숫자 차단·11자 상한)·isValidPhone·isValidEmail·isValidPassword(4자). 단위검증 통과. STEP1 빌드 성공
### STEP 2 (병렬 Y1·Y2·Y3, 공용 X 산출물 수정 금지·사용만)
- [x] Y1 홈·헤더·푸터·상담·법적·운영위: 프로그램 패널 "02" 제거·좌우 높이 정합 / **모바일 하단 GlassDock 폐기 → 헤더 우측 [KR/EN][설정(관리자)][햄버거] + 유리 시트(아코디언·ESC·포커스트랩·스크롤잠금, liquidGL 표면 3/3)** / 히어로 버튼 텍스트만(화살표 제거)·1=primary 2=secondary·eyebrow 연도 purple.light / 운영위 연도·기수명=purple.light·직책=purple.mid(원문 불변) / 편집·전체관리 이중버튼 → 아이콘+「편집」 단일 / 푸터 정책·상담 링크 새 탭+최상단 / **Privacy·Terms 대학 격식 재작성**(실제 수집항목·bcrypt·GA 예정·보유기간·제3자 없음·파기·권리·문의처, 지어낸 수탁사·해외이전 없음) / 상담 재설계(Container 준수·2열 레이블·우측 sticky 동의패널+Checkbox·동의 전 비활성·formatPhone). 브라우저 375/1280 육안 검증
- [x] Y2 전시회·접수: 피처드 확대·포스터 유리 프레임·CTA liquidGL·퍼플 글로우 / 상세 상단 여백 축소(첫 화면에 헤드라인+포스터) / **접수 온보딩(전시회명·대상·기간·절차·유의사항 → 시작)** / 폼 정비(Container·이미지필드 삭제·비번 세로 4자·이메일 @검증·**연락처 formatPhone 강제**·작품명 '-'→'_' 안내 원문·기간 유리패널 purple.light 강조·과목 RadioCards) / **접수 확인·수정 진입 신설**(이메일+비번 lookup → 목록/단건 → readonly(유형·과목·이메일)/editable → 저장, 수정마감 서버검증). 신규 API POST /submit/exhibition/lookup(bcrypt·pw_hash strip·균일 401·서버시계 can_edit), PUT에 new_password(COALESCE)
- [x] Y3 어드민·시트·데이터: **성과 정렬[근본원인]** — PostForm이 sort 미전송 → NULL → 'sort ASC NULLS LAST'로 맨 아래. 수정: 서버 POST가 sortScope(achievement=tag/club=type)로 MIN(sort)-1 배정(맨 위) + 공개·어드민 DragHandle 순서변경 / 동아리 상세(site_url 필드·새탭 링크·카드 진입) / 전시회 설정에 접수노출 스위치·**과목 관리(1·2학기)** → GET /settings/public 노출 / 대시보드 유형별 공개·비공개 토글(useContentVisibility, 포트폴리오 기본 비공개) / **접수 관리 시트**(/admin/exhibition-entries/sheet, AdminLayout 밖 admin 가드, 과목탭·검색·정렬·sticky헤더·셀·행 복사·CSV+.xls(SpreadsheetML, 새 의존성 없음)·수동+20초 자동폴링·라이트 시트 스타일). server tests 9/9
### STEP 3 (단독 통합)
- [x] 통합 배선(에이전트 소유 밖, 통합자 처리): App.jsx `<GlassDock/>` 사용·import·파일 삭제(Y1이 return null로 대체) + /students/clubs/:id 라우트·ClubDetail import(선배치) / nav.js '학생 활동'에 포트폴리오(visibilityKey) 추가 + Header가 useContentVisibility로 visibleNav 필터(데스크탑·모바일 공용) / Careers 포트폴리오 섹션 id="portfolios"+scroll-mt-96 앵커
- [x] 잔존 재검색 0건: 네이티브 select/date/time(라이브) 0 · 선 장식 0 · JSX 비-CI 하드코딩 hex 0 · 금지색(fbbc04/1c1c1c/bg-black/#000000) 0 · Pretendard 단일
- [x] CI 위반 교정: EntriesSheet 라이트 시트에서 Y3가 CI에 없는 #DCD6E8(그리드선)을 만들었음 → #211A31(Glass Surface) 15% 헤어라인으로 대체(CI 4.2 "색+불투명도" 방식). 시트 전 색 CI.md HEX만
- [x] migrate-phase18.mjs 배포 Neon 실행(멱등·트랜잭션): posts.site_url 추가·동아리 백필 0건, achievement.sort 정규화 19건
- [x] client build 성공, server 전 라우트 node --check 통과, server npm test 9/9
- [x] 로컬 프리뷰 육안: 홈(2017 purple.light·Primary 글로우·CTA 텍스트만)·모바일 헤더 햄버거+시트 아코디언(학생활동 5하위·포트폴리오 비공개로 미노출)·운영위(2026 제1대 LUCID purple.light)·공지 정상
- [ ] 커밋·푸시·배포: 커밋·푸시 후 Vercel(client)·Render(server) 자동/수동 배포. **server 배포 필요**(submit lookup·settings subjects·admin sort API 신규)
- [!] 조율 필요(사용자 판단): (1)**접수 수정 비밀번호 최소길이 서버 6→4 완화**(Y2) — 클라 안내·공용 isValidPassword가 4자라 기존 6자 서버와 불일치(클라 통과 후 400)했던 것 해소. 보안상 6 유지 원하면 format.js·안내문구를 6으로 올려야 함 (2)/consult 연락처는 전화 전용(formatPhone)인데 미변경 원문 안내에 "전화 또는 이메일" 표기 잔존 — 이메일 경로 원하면 POST /consult 서버 계약 확장 필요 (3)접수 온보딩 "접수 대상" 문구("…수강생·개인 또는 팀")는 원문 부재로 Y2 임시 작성 → 확정본 필요
- [!] liquidGL 성능 특성: 데스크탑·WebGL에서만 동작(모바일·저성능은 CSS 글래스). html2canvas 스냅샷이 페이지 첫 스크롤 시 일시 비용(수백ms, 1회). 과하면 useLiquidGlass 옵션 resolution 하향 또는 헤더 표면만 비활성 가능 — 기능 저하 없이 CSS 폴백

## PHASE 21 · iOS Safari — 어드민 상세 진입 실패 수정
- [x] [최우선][근본원인 확정] 교수진·멘토단·취업 현황·포트폴리오(EntityCrud 기반, `orderable` 기본값 true) 목록에서 행이 항상(정렬모드 아닐 때도) `draggable="true"`였음(DragHandle.jsx useDragSort). iOS Safari(WebKit)는 HTML5 Drag&Drop을 애초에 지원 안 하면서도, `draggable=true`가 걸린 요소는 터치를 드래그 후보로 판정해 그 안의 "수정" 버튼 등 자식 인터랙티브 요소의 합성 click 이벤트를 통째로 삼킨다 — 데스크톱(마우스)은 무관해 정상, iOS Safari(터치)만 상세(수정) 진입이 막힘. 서버 콜드스타트·쿠키와 무관(순수 클라이언트 이벤트 버그)이라 "서버는 항상 깨어있음" 조건과도 정합
- [x] 수정: `useDragSort`(공용, PostList·EntityCrud 공유)의 `rowProps`가 `window.matchMedia('(pointer: coarse)')`로 터치를 감지하면 `draggable`·drag 핸들러를 아예 안 건다(빈 객체 반환). 터치에서 드래그 재정렬은 원래도 동작하지 않았으므로(HTML5 DnD 미지원) 기능 손실 없이 탭만 복구. 데스크톱 동작 100% 불변
- [x] 점검 1(쿠키): middleware/auth.js 확인 — 프로덕션 SameSite=None + Secure + httpOnly 이미 적용(직전 PHASE서 수정 완료). Partitioned는 third-party iframe(CHIPS) 시나리오용이라 이 구조(SPA→fetch credentials:'include', iframe 미사용)엔 해당 없고, Safari도 CHIPS 미지원이라 추가해도 무의미 — 변경 없음. 증상("상세만 안 열림", 목록·로그인은 정상)도 쿠키 실패 패턴(전면 401)과 불일치해 원인에서 제외
- [x] 점검 2(클릭 핸들러): 전 코드베이스 onMouseDown/onMouseEnter/onMouseOver 전수 검색 — 어드민 영역 0건(홈 ProgramShowcase·헤더 메가메뉴의 onMouseEnter는 공개 페이지 데스크톱 호버 보조용, 클릭 대체 아님). PostList·Dashboard의 상세 진입은 전부 react-router Link(onClick 기반) — 정상
- [x] 점검 3(100vh): 전수 검색 결과 3건 — AdminLayout.jsx 사이드바는 `lg:` 프리픽스(데스크톱 전용, 모바일 미적용이라 무관·미수정). EntriesSheet.jsx(접수 관리 시트, 전체화면 라우트) 2건은 모바일에도 적용돼 iOS 동적 툴바로 레이아웃이 흔들릴 수 있어 100dvh로 교체(`min-h-screen`→`min-h-[100dvh]`, `calc(100vh-260px)`→`calc(100dvh-260px)`). 상세 진입 실패의 원인은 아니었으나(레이아웃 흔들림이지 "안 열림"은 아님) 지시대로 선제 교정
- [x] 검증: npm run build 성공(2025 modules). DragHandle.jsx·EntriesSheet.jsx 2파일만 수정(surgical)
- [!] 실기기 확인(사용자): iPhone Safari에서 교수진·멘토단·취업 현황·포트폴리오 어드민 "수정" 탭 진입 확인 / 접수 관리 시트 스크롤 시 하단 잘림 없음
- [!] 실사이트 육안(사용자, 배포 후): 헤더 버튼 질감·보라 포인트 / 모바일 햄버거 시트 / 전시 피처드·온보딩·접수폼(하이픈·@·과목 카드)·수정 진입 / 접수 시트(정렬·복사·CSV/xls·폴링) / 대시보드 공개토글→메뉴 연동(포트폴리오) / 성과 신규 맨 위+드래그 저장 유지 / 어드민 사이드바 이동 시 스크롤 유지 / 커스텀 Select·DatePicker

## PHASE 22 · 헤더 회귀 진단 (34_HEADER_AUDIT)
git log·vendor 소스 추적으로 실제 원인 1건을 확정. 색상·레이아웃(리브랜딩)은 미변경.
- [x] 1단계(변경 이력): Header.jsx는 32_REBRAND(5a4df2a)에서는 무변경 — 실제로 헤더를 손댄 건 33_PHASE18(ab42412, GLASS phase)뿐. GlassDock.jsx 삭제, useLiquidGlass.js·useContentVisibility.js·accents.js 신규, nav.js+8줄(포트폴리오 visibilityKey). "리브랜딩 이후"로 체감되는 증상의 실제 원인 커밋은 GLASS phase로 특정
- [x] [최우선][근본원인 확정] **헤더·전시 CTA 클릭 불가**: public/vendor/liquidgl/liquidGL.js의 렌즈 생성자(1400행)가 타겟 요소에 `pointerEvents:none`을 건다(원본을 투명화하고 캔버스 스냅샷이 시각을 대신하는 설계). pointer-events는 CSS 상속 속성이라 타겟(`.dah-liquid-header`, `.dah-liquid-cta`) 안의 실제 인터랙티브 자식 — 내비 링크·드롭다운 하위 항목·햄버거·설정 아이콘·CTA 버튼 — 전부 클릭 불가가 됨. 캔버스·미러 레이어는 이미 pointer-events:none이라(vendor 75·1883행) 클릭은 항상 타겟까지 내려오는데, 타겟 자신이 none이라 막힘. 헤더는 스크롤 80px 이후 또는 드롭다운 오픈 시(`glassed`), CTA 패널은 페이지 로드 즉시(`hasCta||showSubmit`, 스크롤 무관) 트리거 — 데스크톱·WebGL·코어 4개↑ 환경에서 상시 재현되는 회귀(vendor 코드는 GLASS phase에서 신규 도입, REBRAND 자체와는 무관)
- [x] 수정: `useLiquidGlass.js`가 `window.liquidGL(...)` 호출(동기 실행, 렌즈 생성자가 이미 pointerEvents:none을 적용한 뒤) 직후 `document.querySelectorAll(selector)`로 타겟을 다시 찾아 `pointerEvents:'auto'`로 되돌림. 캔버스·미러는 pointer-events:none 그대로라 시각(리퀴드글래스 렌더)은 전혀 변경 없이 클릭만 복구. vendor 파일은 미수정(서드파티, 향후 업데이트 호환)
- [x] 점검(사라짐/안 보임): Header는 App.jsx에 ErrorBoundary·조건부 렌더 없이 상시 마운트, GlassDock 삭제 후 잔존 import 0(빌드 성공으로 재확인), nav.js 데이터 무결(label·labelEn 전부 존재), useContentVisibility 기본값 가드로 크래시 불가, tailwind `icon` 색상 객체가 정상 컴파일되어 `text-icon`/`text-icon-active` 유효 — 이 경로에서 별도의 "사라짐" 버그는 재현되지 않음(위 pointer-events 버그의 체감 효과일 가능성이 높음: 클릭이 안 먹히는 걸 "사라졌다"고 인지)
- [x] 검증: npm run build 성공(2025 modules). 수정 파일은 useLiquidGlass.js 1개(surgical). 실행 환경에 Chromium/Playwright가 없어 실 브라우저 클릭 재현은 불가했으나, vendor 소스를 직접 추적해 CSS 상속 규칙(pointer-events는 inherited 속성)을 코드에 그대로 적용한 결정론적 근거 — 추측 아님
- [!] 실기기 확인(사용자, 최우선): 데스크톱 브라우저에서 (1) 페이지를 80px 이상 스크롤한 뒤 헤더 메뉴·드롭다운·햄버거·설정 아이콘 클릭 (2) /programs/exhibitions에서 피처드 전시 CTA("전시 사이트"/"전시회 접수") 버튼 클릭 — 리브랜딩 이후 이 두 시나리오가 안 눌렸다면 이번 수정으로 해소돼야 함. 그 외 "사라짐" 증상이 실기기에서 재현되면(위 pointer-events와 무관한 별도 현상이면) 구체적 재현 조건을 알려주면 추가로 특정

## PHASE 23 · 헤더 호버 시 사라짐 — 웨일 (35_HEADER_HOVER_WHALE)
불변식 확정: **헤더는 어떤 브라우저·어떤 실패 모드에서도 완전히 사라지지 않는다.**
- [x] [근본원인 확정, vendor 소스 추적] liquidGL의 렌즈 생성자(liquidGL.js:1378)가 타겟에 `el.style.opacity = 0`을 **동기적으로** 걸어 즉시 숨긴다. 이를 되돌리는 `_reveal()`(1574~1580, reveal:'none'이면 opacity 복원)은 `addLens`(555~569)에서 **`renderer.texture`가 이미 있을 때만 즉시 호출**되고, 없으면 `_pendingReveal`에 쌓아뒀다가 스냅샷이 텍스처로 올라간 뒤(548~551) flush된다. 즉 순서가 "먼저 숨기고 → 나중에(성공하면) 되돌린다"라서, html2canvas 전체 body 스냅샷이 느린 만큼 헤더가 안 보이고, 캡처가 3회 재시도까지 전부 실패하면(478~490, 실패 시 `false` 반환·텍스처 미생성) `_pendingReveal`이 영영 flush되지 않아 **헤더가 영구히 opacity:0**이 된다. 35번 문서 가설 2번(“현재 순서가 반대라면 이것이 원인”)이 정확히 맞음
- [x] [호버가 트리거인 이유] Header의 `glassed = scrolled || openIndex !== null`을 `useLiquidGlass(..., glassed)`의 enabled로 쓰고 있어, **스크롤 0에서 메뉴에 호버하면 openIndex가 null→i로 바뀌며 glassed가 false→true** → 훅 effect의 deps(`[selector, enabled]`) 변경 → liquidGL 신규 초기화 → 위 opacity:0 경로 진입. 크롬은 스냅샷이 빨라 깜빡임 수준이지만 웨일에서는 지속·영구로 관측된 것. 드롭다운은 absolute라 헤더 높이를 바꾸지 않으므로 ResizeObserver 재캡처(1406~1412)는 원인이 아님(문서 가설 1번은 기각)
- [x] [악화 요인] 훅 cleanup의 `instance.destroy()`는 **vendor에 destroy API가 아예 없어** no-op(grep 0건). 호버를 뗐다 다시 하면 같은 요소에 렌즈가 계속 누적되고 매번 opacity:0부터 다시 시작
- [x] **수정 1(근본·보수적 선택, 35번 수정방향 4 채택): 헤더에서 liquidGL 전면 제거.** `useLiquidGlass('.dah-liquid-header', ...)` 호출과 `dah-liquid-header` 클래스 삭제. 헤더는 기존 CSS 글래스(`bg-glass-bg` + `backdrop-blur-glass-mobile md:backdrop-blur-glass` + `border-glass-line`)만 사용 — 색상·레이아웃·클래스 일절 미변경. 모바일·저성능·reduced-motion·WebGL 부재 사용자는 **이미 이 CSS 글래스를 보고 있었으므로 시각 회귀 0**이고, 호버마다 전체 body 스냅샷을 뜨던 비용도 제거됨. 빌드 산출물에서 `dah-liquid-header` 0건 확인
- [x] **수정 2(심층 방어, 남은 표면 보호): `useLiquidGlass`가 vendor의 인라인 `opacity`를 즉시 되돌린다.** 초기화 직후 `restoreTargets()`로 `pointerEvents='auto'`(34번 수정 승계) + `opacity=''`를 적용하고, **성공·실패(catch) 두 경로 모두에서 호출**해 vendor가 예외 직전까지 숨긴 경우도 복구. 우리는 `reveal:'none'`으로만 쓰므로 opacity:0은 의도된 UI 상태가 아니라 순수 과도기 값 → 지워도 최종 상태(=1) 동일. 이로써 전시 CTA·모바일 시트도 "영구 투명" 실패 모드가 구조적으로 불가능해짐
- [x] 점검: `.dah-liquid-sheet`는 훅의 `shouldSkip()`이 뷰포트 <1024를 거르고 시트 자체는 `lg:hidden`(≥1024에서 display:none)이라 사실상 초기화되지 않는 무해한 경로 — 수정 2로 보호되므로 호출부는 그대로 둠(기존 동작 보존). `client/vendor/`와 `client/public/vendor/` 사본은 내용 동일(실제 서빙은 public 쪽), vendor 파일은 서드파티라 미수정
- [x] 검증: npm run build 성공(2025 modules), lint 신규 경고 0(기존 vendor·LangContext 경고만). 수정 파일 2개(Header.jsx·useLiquidGlass.js) — surgical
- [!] 한계(정직 고지): 이 실행 환경에 Chromium/Playwright/웨일이 없어 **브라우저에서 직접 재현하지는 못함**. 대신 vendor 소스의 동기 opacity:0 ↔ 비동기 텍스처 게이트 순서를 줄 단위로 특정한 결정론적 근거이며, 헤더는 아예 해당 경로를 타지 않도록 제거해 불변식을 코드 구조로 보장함
- [!] (PHASE 24에서 후속) 시트도 liquidGL 제거 완료 — 아래 참조
- [!] 웨일 재확인 시나리오(사용자): **(A)** 웨일에서 홈 최상단(스크롤 0)에서 헤더 메뉴 5개에 차례로 마우스를 올렸다 뗐다 반복 → 헤더가 사라지지 않고 드롭다운 정상 표시. **(B)** 80px 이상 스크롤 후 동일 반복 → 유리 배경 유지·사라짐 없음. **(C)** 메뉴에 올린 채 3~5초 대기 → 지연 후에도 사라지지 않음(기존엔 스냅샷 완료/실패 타이밍에 사라졌음). **(D)** 헤더 메뉴·드롭다운 하위 항목·KR/EN 토글·설정 아이콘 클릭 이동 정상(34번 수정 유지 확인). **(E)** /programs/exhibitions 피처드 CTA 버튼 표시·클릭 정상(liquidGL 유지 표면이 여전히 정상인지 확인)
## PHASE 24 · 모바일 헤더 재설계 — 바는 로고+햄버거 고정, 유틸은 시트로 (36_MOBILE_HEADER)
증상: 로그인 상태의 모바일 헤더 바에 [접수 버튼][KR/EN][설정][햄버거]가 한 줄에 몰려 겹침·넘침.
- [x] **1) 모바일 바 = [로고][햄버거] 2개 고정**: 접수 버튼(`hidden … lg:inline-flex`)·KR/EN 토글(`hidden lg:block` 래퍼 span, Y1-2 이전 마크업으로 복귀)·구분선·설정 아이콘(`hidden … lg:flex`)을 전부 lg 전용으로 되돌림. 조건부 렌더되는 자식(접수·설정/로그인)도 전부 `hidden`을 갖고 있어 **렌더 여부와 무관하게 모바일 비노출** → 로그인·접수 노출 조합이 바의 요소 수를 바꾸지 못하므로 겹침·넘침이 구조적으로 불가능
- [x] **2) 시트 재구성(위→아래)**: (a) 상단 유틸 행 — KR/EN 토글 + (로그인 시에만) 설정 링크(아이콘+라벨, h-32 소형, 탭 시 시트 닫힘) / (b) 전시회 접수 CTA — `showSubmit`(=show_button 스위치)일 때만, h-48 풀폭 Primary 버튼(Button.jsx primary와 동일 토큰: `bg-button-primary`·`text-button-primaryText`·`shadow-btn`·hover/active 상태) / (c) 기존 최상위 아코디언(전부 접힘 시작, ChevronRight 탭 시 하위 펼침, 하위 탭 시 이동+시트 닫힘) — 아코디언 로직 자체는 무변경
- [x] **3) 데스크탑 무영향 검증**: 숨긴 유틸 5개 전부 `lg:inline-flex`/`lg:block`/`lg:flex` 복원 클래스 보유(스크립트 검증). 데스크탑 메가메뉴(nav·openIndex·NavLink·드롭다운) 변경 0줄(diff 확인)
- [x] **4) 시트 liquidGL 금지**: `useLiquidGlass('.dah-liquid-sheet', …)` 호출·`dah-liquid-sheet` 클래스 제거, 그로 인해 미사용이 된 `useLiquidGlass` import도 정리. 시트는 기존 CSS 글래스(`bg-glass-bg` + `backdrop-blur-glass-mobile` + `border-glass-line` + `shadow-glass`) 그대로 — PHASE 23의 "헤더 표면은 실패해도 사라지지 않는다" 원칙을 시트까지 확장. (이 호출은 훅의 `shouldSkip()`이 <1024를 거르고 시트는 `lg:hidden`이라 원래도 사실상 미동작이었음)
- [x] 검증: 소스 파싱 스크립트로 4개 조합(로그인 O/X × 접수노출 O/X) 전부 **모바일 바 요소 2개(로고+햄버거)** PASS. npm run build 성공(2025 modules), 신규 토큰 클래스 CSS 방출 확인(`bg-button-primary`·`shadow-btn`·`lg:inline-flex`·`lg:flex`), Header.jsx lint 경고 0건. 수정 파일 1개(Header.jsx)
- [!] 참고(변경 안 함): nav.js 최상위 항목은 지시문의 "5개"가 아니라 실제 **6개**(About·학사 안내·학과 행사·학생 활동·공지사항·자료실). 콘텐츠 변경은 요청 범위가 아니라 전부 그대로 렌더한다. 시트 CTA는 `submitMode`와 무관하게 `showSubmit`만 보고 노출(시트에는 header/floating 배치 개념이 없음) — floating 모드에서는 우하단 플로팅 버튼과 함께 보인다
- [!] 실기기 확인(사용자): 모바일 폭(예: 390px)에서 **① 비로그인+접수꺼짐 ② 비로그인+접수켜짐 ③ 로그인+접수꺼짐 ④ 로그인+접수켜짐** 네 조합 모두 헤더 바에 로고·햄버거만 보이고 겹침·잘림 없음 / 햄버거 탭 → 시트 상단 KR/EN(+관리자면 설정) → 접수 CTA(켜짐일 때만) → 6개 메뉴 아코디언 순서 / 하위 항목 탭 시 이동+시트 닫힘 / 데스크탑(≥1024px)은 기존과 동일

## PHASE 25 · 히어로 poster + OG 공유 미리보기 (37_OG)
- [x] **1) 히어로 poster 파일 생성**: 코드는 이미 완비돼 있었고(PHASE 17 U1-3: `poster="/videos/hero-poster.jpg"` + `preload="auto"` + `onCanPlay`에 opacity 페이드인) **파일만 없었다**. ffmpeg 부재라 macOS 기본 도구 `qlmanage -t`로 hero.mp4에서 프레임을 추출 → sharp로 1920x1080 JPEG(q78, mozjpeg) 변환 → `client/public/videos/hero-poster.jpg` **88KB** 생성. 영상 자신의 프레임이라 poster→영상 전환이 이질감 없음
- [x] 첫 화면 빈 화면 제거: index.html에 `<link rel="preload" as="image" href="/videos/hero-poster.jpg" fetchpriority="high">`를 **hero.mp4 preload보다 앞에** 배치 — 39MB 영상 preload가 대역폭을 먼저 점유해 88KB poster가 늦게 뜨는 문제를 막는다
- [x] **2) OG·트위터 메타 전면 갱신**(index.html): og:type·site_name·locale·url·title·description·image(+secure_url·type·width·height·alt), twitter:card(summary_large_image)·title·description·image, canonical 추가. 문구는 CI.md 원문 기준 — 슬로건 "읽고, 다정하게 답하다"(CI.md 8.1), 설명은 CI.md 33행 "디지털 기술, 디자인, 인문학을 연결해 사람과 사회의 변화를 읽고 새로운 경험으로 응답하는 융합 전공입니다."(어미만 존댓말로). em dash 미사용(G10)
- [x] **도메인 하드코딩 금지 구조**: index.html은 `%SITE_URL%` 토큰만 두고 `vite.config.js`의 `dah-html-site-url` 플러그인이 `VITE_SITE_URL` 환경변수로 치환(끝 슬래시 자동 제거). 미설정 시 빈 문자열로 치환해 **상대경로로 안전 degrade**(깨진 `%SITE_URL%` 문자열이 산출물에 남지 않음) + 빌드 로그 경고. client/.env.example에 문서화
- [x] 검증(빌드 2회): ① `VITE_SITE_URL=https://example-dah.vercel.app/` → og:url·og:image·canonical 전부 `https://example-dah.vercel.app/videos/hero-poster.jpg` 형태 절대 URL(중복 슬래시 없음) ② 미설정 → 경고 출력 + `%SITE_URL%` 잔존 0건 + 상대경로. poster가 `dist/videos/hero-poster.jpg`로 복사되는 것까지 확인
- [!] **og:image 이미지 선택(사용자 결정)**: 기존 `public/og.png`(1600x840)는 **리브랜딩 이전 디자인**(거의 검정 배경 + 폐기된 Anton 폰트, 보라 CI·슬로건 없음)이라 이것이 "옛 미리보기"의 직접 원인이었다. 사용자 선택에 따라 og:image를 **히어로 poster**로 지정. 단 이 이미지는 영상 프레임이라 (a)로고·학과명·슬로건 텍스트가 없고 (b)CI가 금지한 청록·핑크가 그대로 드러난다 — 온브랜드 공유 카드가 필요해지면 1200x630(또는 1600x840)로 교체 권장. og.png는 삭제하지 않고 그대로 둠(참조만 해제)
- [!] **페이지별 동적 OG(검토 결과, 미구현)**: 이 사이트는 SSR·프리렌더가 없는 SPA이고 vercel.json이 모든 경로를 index.html로 리라이트한다. 카카오·트위터 크롤러는 **JS를 실행하지 않으므로** React에서 라우트별로 메타를 바꿔도 미리보기에 반영되지 않는다(브라우저 탭 제목은 기존 useTitle로 이미 동작). 전시회·공지별 개별 미리보기를 원하면 프리렌더링(vite-plugin-ssg 등) 또는 Vercel 서버리스 함수로 크롤러 요청에만 메타를 주입하는 구조가 필요 — 별도 과제로 남김. 현재는 정적 태그가 전 라우트 공통 미리보기를 담당
- [!] **카카오톡 캐시 초기화(중요, 배포 후 필수)**: 카카오톡은 한 번 읽은 og 정보를 서버에 캐시해서, 배포를 해도 옛 미리보기가 계속 뜬다. 해결법 2가지 —
  ① **카카오 공유 디버거로 캐시 초기화(정공법)**: https://developers.kakao.com/tool/debugger/sharing 접속(카카오 계정 로그인) → 사이트 URL 입력 → **[초기화]/[디버그]** 실행하면 og 정보를 다시 크롤링한다. 갱신한 URL마다 각각 실행해야 한다.
  ② **쿼리스트링 우회(즉시 확인용)**: 링크 뒤에 `?v=2` 같은 값을 붙이면(`https://…/?v=2`) 카카오가 다른 URL로 인식해 새로 크롤링한다. 캐시 초기화 없이 새 미리보기를 바로 확인할 때 쓰고, 공식 배포 링크는 ①로 초기화하는 것이 맞다.
  ※ 초기화 전에 **VITE_SITE_URL 설정 + 재배포**가 먼저 끝나 있어야 한다(그전에 초기화하면 옛 정보가 다시 캐시된다)
- [!] 사용자 액션: (1) **Vercel에 `VITE_SITE_URL` 환경변수 설정 후 재배포** — 미설정이면 og:image가 상대경로로 남아 카카오가 이미지를 못 읽는다 (2) 배포 완료 후 위 카카오 캐시 초기화 (3) 온브랜드 공유 카드가 필요하면 `client/public/og.png`를 새 CI로 교체하고 index.html의 og:image 경로를 되돌리면 됨

## PHASE 26 · Google Search Console 소유 확인 (38_GSC_VERIFY)
- [x] index.html `<head>`에 `<meta name="google-site-verification" content="VIO0lYGOjpkD3YDkBO2hWUwztQ21_9zK3DMgqM7OJwo" />` 추가. 검증용 고정 코드라 사용자 지시대로 VITE_SITE_URL과 달리 정적 하드코딩 유지(환경변수 분리 대상 아님)
- [x] 검증: npm run build 성공, dist/index.html에 태그 값 그대로(변경 없이) 방출 확인. 수정 파일 1개(index.html)

## PHASE 27 · Google Analytics 4 연동 (39_GA4)
정적 스니펫 금지 원칙 준수: React Router v6 SPA라 config의 자동 page_view는 최초 로드 1회뿐이라, 스크립트는 로드만 하고(`send_page_view:false`) 라우트가 바뀔 때마다 수동으로 `gtag('event','page_view',…)`를 전송하는 구조로 구현.
- [x] **신규 파일**: `src/utils/analytics.js`(비-React, `format.js`와 동일한 유틸 컨벤션) — `GA_ID = import.meta.env.VITE_GA_ID`, `loadGtag()`(GA_ID 없으면 즉시 return·스크립트 미주입, 있으면 gtag.js 삽입 + `gtag('config', GA_ID, {send_page_view:false})`), `sendPageview(path)`(GA_ID·`window.gtag` 존재 확인 후 `page_view` 이벤트 전송, page_path·page_location·page_title 포함)
- [x] **신규 파일**: `src/components/Analytics.jsx` — `useLocation()`으로 라우트(pathname+search) 감지, 마운트 시 1회 `loadGtag()`, 이후 라우트가 바뀔 때마다 `sendPageview()`. **관리자 세션 제외**: `useAuth()`의 `user`(로그인 상태)·`loading`(인증 확인 중) 중 하나라도 참이면 전송을 건너뜀 — 최초 로드도 인증 확인이 끝난 뒤에만 pageview가 나가므로 새로고침 시점에 어드민이어도 새지 않음. App.jsx에 `<Analytics />` 1줄 추가(AuthProvider·BrowserRouter 하위)
- [x] **환경변수화**: 측정 ID 하드코딩 없음(코드에는 `VITE_GA_ID` 참조만). `client/.env.example`에 문서화 — **로컬 `.env`에는 절대 채우지 말 것**(로컬 개발 오염 방지) 명시, Vercel 배포 환경변수에만 설정
- [x] **개인정보처리방침 갱신**: Privacy.jsx "쿠키와 접속 분석 도구" 절의 "향후 GA 도입 시…" 문구를 실제 사용 사실 2문장으로 교체 — "Google Analytics(GA4)를 사용하며 페이지 조회 등 비식별 이용 통계를 수집" + "관리자로 로그인한 상태의 접속은 방문 통계에서 제외". 파일 상단 데이터 수집 항목 주석도 동기화
- [x] 검증(빌드 2회, 산출물 grep으로 확인): ① `VITE_GA_ID` 미설정 → 번들에 gtag·googletagmanager·dataLayer 문자열 **0건**(빌더가 `import.meta.env.VITE_GA_ID`를 `undefined`로 정적 치환 → 죽은 코드로 완전 제거, 로컬 개발 환경에 GA 코드 자체가 안 실림) ② `VITE_GA_ID=G-6EQFGM5SMX` → `googletagmanager.com/gtag/js?id=${변수}` 템플릿·`send_page_view`·`page_view`·측정 ID 문자열 그대로 방출 확인. npm run build 성공, 신규 파일 lint 경고 0건
- [!] **Vercel 환경변수 설정 필요(배포 후 GA 작동을 위한 필수 사용자 액션)**: Vercel 프로젝트 > Settings > Environment Variables에 `VITE_GA_ID` = `G-6EQFGM5SMX` 추가 후 **재배포**(Vite는 빌드 시점에 값을 인라인하므로 값 추가만으로는 반영 안 되고 재빌드가 필요). 로컬 `client/.env`에는 설정하지 말 것(로컬 개발 트래픽이 실제 통계에 섞이는 것을 방지)
- [!] 사용자 액션: (1) 위 Vercel 환경변수 설정+재배포 (2) 배포 후 GA4 실시간 보고서에서 페이지 이동 시 pageview가 잡히는지, 관리자 로그인 상태에서는 안 잡히는지 확인

## PHASE 28 · sitemap.xml·robots.txt 생성 (40_SITEMAP)
- [x] **신규 파일**: `client/scripts/sitemap.mjs` — `npm run build` 실행 시 `vite build` 직전에 자동 호출(package.json `"build": "node scripts/sitemap.mjs && vite build"`). `public/` 파일은 Vite가 dist/로 그대로 복사만 하므로(HTML 템플릿 치환 미적용) 별도 스크립트로 빌드 직전에 실제 파일을 써서 public/에 둔다
- [x] **도메인**: `VITE_SITE_URL`(37_OG와 동일 키, vite.config.js와 동일 폴백 로직) 기반. 미설정 시 **실제 배포 도메인 `https://dah-hallym.vercel.app`**(사용자 확정값)로 폴백 — 하드코딩이 아니라 "env 우선, 없으면 정확한 실제 도메인" 구조. 검증: env 설정 시 그 값이, 미설정 시 폴백 도메인이 `<loc>`·`Sitemap:`에 정확히 반영되는 것 빌드 2회로 확인
- [x] **sitemap.xml 19개 URL**: App.jsx `PUBLIC_ROUTES` 기준 정적 주요 페이지만(동적 상세 `:id` 라우트·어드민·접수/상담 폼 제외, 지시 5번). 홈·About·교수진멘토·CI·교육과정·코드쉐어링·나노디그리·전시회·공모전·특강·운영위원회·동아리·학생성과·취업현황·쇼케이스·공지사항·자료실·개인정보처리방침·이용약관. 표준 `<urlset><url><loc>` 포맷 + changefreq·priority(SEO 관례상 참고값)
- [x] **robots.txt**: `User-agent: * / Allow: / / Disallow: /admin`(비공개 관리 영역 크롤링 차단 — 지시엔 없었지만 관리 화면이 검색엔진에 노출되지 않도록 표준 관례로 추가) + `Sitemap: {SITE_URL}/sitemap.xml`
- [x] 검증: `python3 -m xml.etree.ElementTree`로 sitemap.xml 파싱 성공(19개 url 노드 확인), `dist/sitemap.xml`·`dist/robots.txt` 정상 복사 확인, npm run build 성공, lint 경고 0건
- [!] **PHASE 25(OG)와 연결**: `VITE_SITE_URL`은 이제 OG 메타 태그와 sitemap.xml·robots.txt **양쪽에 쓰이는 공용 환경변수**다. PHASE 25에서 실제 배포 도메인을 몰라 미해결이었는데, 이번에 사용자가 확정한 **`https://dah-hallym.vercel.app`**을 두 용도의 폴백 기본값으로 반영했다. 다만 폴백은 로컬 스크립트 실행 시점 값이고, **Vercel 환경변수로 `VITE_SITE_URL=https://dah-hallym.vercel.app`를 명시적으로 설정하는 것이 더 안전**하다(도메인이 커스텀 도메인으로 바뀌는 등 변경 시 코드 수정 없이 값만 바꾸면 됨)
- [!] 사용자 액션: (1) Vercel에 `VITE_SITE_URL=https://dah-hallym.vercel.app` 환경변수 설정 권장(이미 PHASE 25·27에서 안내한 것과 동일 변수 — 한 번만 설정하면 OG·GA 안내와 무관하게 sitemap도 함께 정확해짐) (2) 배포 후 `https://dah-hallym.vercel.app/sitemap.xml`·`/robots.txt` 접속 확인 (3) Google Search Console(38_GSC, 소유 확인 완료됨)에 사이트맵 제출: Search Console > Sitemaps > `sitemap.xml` 입력 후 제출

## PHASE 29 · 보라 포인트 세부 규칙 + 카드 글로우 (36_ACCENT_POLISH A1~A5)
색상은 CI.md HEX만 사용(#815FD7 Primary·#C8B9F2 Light). 사용자 원문(data/) 변경 0건.
- [x] **A1 파비콘·로고 기본값**: 점검 결과 `public/favicon.svg`·`src/assets/logo.svg` 모두 이미 Light 단색 `#F7F5FC`이고 금지색(#C8B9F2·#A286E9) 0건 — 자산 수정 불필요(PHASE 19 W1에서 처리됨). **COMPONENTS.md에 규칙 명문화**: 기본 로고는 전역 항상 Light 단색, 위치별 표(파비콘·헤더·GlassDock/푸터·CI 페이지), 연보라·Mid는 공식 로고 사용 금지(CI 3.3·7.3), Purple 로고는 명도 대비 충분한 특정 위치에서만 예외, 단색 원칙(그라디언트·외곽선·투명도 조정 금지)
- [x] **A2 운영위 타이틀 정밀화**(Council.jsx `TitleWithAccents`): 기존엔 연도·제N대·기수명을 전부 purple.light로 칠했던 것을 3단으로 분리 — 연도(2026)=**text.ter 톤다운(보라 아님)** / "제1대"의 **숫자만 purple.mid**("제"·"대"·"운영위원회"는 text.pri) / 기수명(LUCID)=**purple.light**. split 정규식은 유지하고 분류 로직만 3분기로 확장(YEAR_RE·ORDINAL_RE·PROPER_RE). 원문 문자열은 자르거나 바꾸지 않고 표시만 분리 — 전 기수 타이틀에 동일 적용
- [x] **A3 학생 성과 이름**(Achievements.jsx `highlightNames`): 수상자 이름 강조를 `text-text-pri`(화이트+볼드) → **`text-purple-primary`(#815FD7)+볼드**. 국문·영문 동일 경로(awardees/awardeesEn)라 자동 동일 적용. 본문 나머지는 text.sec 유지(CI 4.4 보라 본문 금지 — 이름 단위 포인트만)
- [x] **A4 카드 공용 글로우**[핵심]: `tokens.shadow.glowCard`·`glowCardHover` 신설 → tailwind `shadow-glow-card`·`shadow-glow-card-hover`. 히어로 Primary 버튼(btnPrimary)의 질감(상단 화이트 하이라이트 inset + 퍼플 글로우)을 카드로 확장. **절제 규칙**: 기본은 상시 발광이 아니라 거의 안 보이는 잔광(0.14), hover에서만 상승(0.40) — 버튼(0.35→0.50)보다 한 단계 낮게 잡아 카드가 CTA보다 강해지지 않게 했다. **배경 미변경**(딥 퍼플 블랙 유지), 표면 질감만. 공용 스위치는 `GlassCard`의 `glow` prop으로 제공
- [x] A4 적용 5종: 홈 트랙 카드·쇼케이스 카드·전시회 그리드 카드·동아리 카드(전부 `<GlassCard hover glow>`) + 홈 프로그램 섹션 패널(GlassCard 미사용 자체 표면이라 `shadow-glow-card` 클래스 직접 부착, 마스터-디테일이라 hover 상승은 생략)
- [x] **A5 트랙 카드 강화**: A4 글로우 + 보더를 hairline.purple로 — base `#C8B9F2 15%`(CI 4.2 Hairline Purple 그대로) → hover `border.purpleStrong` 신설 `#C8B9F2 34%`(같은 CI HEX의 불투명도만 상승, CI 4.2 "색+불투명도" 방식)
- [x] **검증 중 발견·수정한 실제 버그**: 컴파일된 CSS에서 `.border-glass-line`이 `.border-border-purple`보다 **뒤에** 방출돼(동일 특정성 → 파일 순서로 결정) A5의 base 보라 보더가 GlassCard 기본 보더에 밀려 **적용 안 되고 있었다**. `!border-border-purple`로 교정(hover 쪽은 처음부터 `!` 적용). 재빌드 후 base `#c8b9f226`(≈0.15)·hover `#c8b9f257`(≈0.34) 둘 다 `!important`로 방출되는 것 확인
- [x] 검증: npm run build 성공, 컴파일 CSS에서 글로우 실제 값 확인(base `#815fd724`≈0.14 / hover `#815fd766`≈0.40, 화이트 하이라이트 `#ffffff1a`·`#ffffff29`), 신규 클래스 5종 전부 방출, 변경 파일 lint 경고 0건. diff 내 색상값 전수 대조 결과 **CI HEX(#815FD7·#C8B9F2) + 화이트 하이라이트만** 사용(비-CI 색 0건), `client/src/data/` 변경 0건(사용자 원문 불변)
- [!] 배포 후 육안 확인(사용자): **홈 트랙 카드 3개**(보라 헤어라인 + hover 시 보더 진해짐·글로우 상승) / **홈 프로그램 패널·쇼케이스·전시회·동아리 카드**(hover 시 은은한 퍼플 글로우, 상시 발광 아님) / **/students/council** 타이틀("2026"은 회색 톤다운, "제**1**대"의 1만 보라, "LUCID"는 연보라) / **/students/achievements** 수상자 이름이 보라(#815FD7) 볼드 — 국문·영문 both

## PHASE 30 · 접수 시트·접수폼·로드맵 (37_SHEET_ROADMAP, 단독 STEP1 → 병렬 H1·H2·H3 → 단독 STEP3)
### STEP 1 (단독 공용 — 나머지의 전제)
- [x] **G1 ColumnFilter**(`components/common/ColumnFilter.jsx`): 구글 시트식 헤더 필터. 고유값 체크박스 + 전체선택/해제 + 검색(값 8개 초과 시) + 오름/내림 정렬을 한 드롭다운에서. **body 포털 + fixed**라 표 문서 흐름에 공간을 차지하지 않아 열고 닫아도 컬럼 폭·표 위치 불변. `selected===null`이 "전체" 계약
- [x] **G2 Toast**(`components/common/Toast.jsx`): 논-시프트 알림. 포털+fixed(우하단, z-[120]) → **레이아웃 시프트 0**. `role="status"`+`aria-live="polite"`. `ToastProvider`를 App.jsx에 배선해 어드민 시트 포함 전 라우트에서 `useToast()` 사용
- [x] **G3 SegmentControl**(`components/common/SegmentControl.jsx`): `mode="segment"`(전부 노출·하나 활성, 어드민) / `mode="single"`(현재 값만 알약 노출 후 목록 선택, 접수폼). 네이티브 select 미사용, 키보드 ↑↓/Enter/ESC
- [x] **G4 밝은 읽기 표면**: `tokens.reading.*` 신설 → tailwind `bg-reading-*`·`text-reading-*`·`border-reading-hairline`. CI 3.3 승인 배경군(#FFFFFF·#F7F5FC·#F2F0F6) + 본문 #211A31 + 강조 #6844C4. **대비 실측**: text 15.45:1 · textStrong 17.77:1 · meta 6.04:1 · accent 6.05:1 (전부 AA 통과). 스펙의 "밝은 배경 연보라 금지" 근거도 실측 확인(#C8B9F2 1.66:1 · #A286E9 2.73:1 FAIL). COMPONENTS.md에 "다크 사이트 내 밝은 읽기 표면" 규칙 + z위계(헤더50<모달100<드롭다운110<토스트120) 문서화
- [x] 충돌 예방(통합자 선조치): i18n 소유를 H2 단독으로 두기 위해 H3가 쓸 `common.noOfferings`·`common.currentSemester` 2키를 미리 반영. schema.sql은 아무도 못 건드리게 하고 각자 migrate mjs만 작성(DB 직접 실행 금지)
### STEP 2 (병렬 3, 소유 계약 무충돌 — git status로 확인)
- [x] **H1 접수 시트**: 마진 이탈 교정(`max-w-container-wide`+gutter, 페이지 가로스크롤 0·넘침은 표 래퍼 내부 격리) / `table-fixed`+`colgroup` 명시 폭으로 컬럼 폭 고정 + 행 확장 아코디언 / 자동새로고침 토글 제거·20초 폴링 상시화 / 과목 탭 → 컬럼 헤더 필터 / 이미지 컬럼 삭제·작품명을 작품 설명보다 왼쪽 / 복사 알림 토스트화(선택 셀은 outline만, 크기 불변) / 하단 시트 탭 2개(접수 현황·접수자 정보, 팀 접수는 `fields.members[]`에서 인적사항 합성) / **비밀번호 초기화**: `POST /admin/exhibition/entries/:id/reset-password`에 `requireAuth`+`requireRole('admin')` **서버 재검증**, bcrypt(10)로 1234 저장, `pw_reset_at`·`pw_reset_by` 이력, 글래스 확인 모달(window.confirm 미사용), admin 미만 미렌더
- [x] **H2 접수폼·안내·상담**: 안내 상단 패딩 `py-section`→`pt-32 lg:pt-48`·타이틀 displayL→h1·시작 버튼을 유의사항 위로 이동(첫 화면 노출) / 회차를 `site_settings.exhibitionOrdinal`로 설정화 + 어드민 입력 UI(조합 결과 실시간 힌트) + `exhibitionFullTitle(ordinal)` 조합, 미지정 시 피처드 전시 회차 폴백 / 과목 선택을 G3 single로 학기 하나만 노출·전환 시 해당 학기 과목만(RadioCards 유지) / 어드민 학기 지정(G3 segment) → `exhibition.current_semester` 공개 / 상담 이메일 단독 필수(클라·서버 동일 정규식) + `consultations.email` 저장·알림·어드민 조회 반영 + 수집 항목 안내 갱신 + 페이지 34키 영문화(에러도 키로 보관해 언어 전환 즉시 반영)
- [x] **H3 교과목·로드맵·공지**: 대시보드 `lg:grid-cols-2` 재설계(좌 과목 목록·과목명 옆 아이콘 밀착 / 우 학기 박스) / 드래그 배치(복사 개념·원본 유지·중복 시 서버 409+토스트·**`matchMedia('(pointer: coarse)')` 터치 감지 시 draggable 미부여 + "+" 버튼 대안**, iOS Safari 탭 삼킴 회피) / `semester_offerings` 모델 + `GET /offerings/semesters`·`GET /offerings` 공개, `POST·DELETE /admin/offerings`는 `requireRole('admin')` / 공개 로드맵 학기 선택 + 현재 학기 `shadow-glow-card` 글로우 + 데이터 없으면 `noOfferings` 1줄(빈 화면 없음) / 공지·자료실 상세를 G4 밝은 표면으로(본문만, 크롬은 다크 유지, `RichBody tone="light"` prop 추가)
### STEP 3 (단독 통합)
- [x] **schema.sql 병합**: `exhibition_entries.pw_reset_at·pw_reset_by`, `consultations.email` + **이전 단계(migrate-phase16)에서 schema.sql에 누락돼 있던 `grade`·`main_major`·`double_major`도 함께 정리**, `semester_offerings` 테이블 + 유니크·정렬 인덱스
- [x] **마이그레이션 3종 배포 Neon 실행·검증**: h1-pwreset / h2-consult-email / h3-offerings 전부 성공. `information_schema` 조회로 컬럼 2·4개와 테이블·인덱스 3종 실재 확인
- [x] **/consult 라우팅 정상화**: H2가 App.jsx를 못 건드려 페이지 내 KR/EN 토글로 우회했던 것을, `/consult`를 `PUBLIC_ROUTES`로 옮겨 `/en/consult` 미러를 만들고 `localizeTo` 제외 목록에서도 해제 → 헤더 언어 토글이 다른 공개 페이지와 동일하게 동작. 중복된 페이지 내 토글과 그로 인해 고아가 된 import·상수 제거
- [x] ConsultationsAdmin에 이메일 표시(연락처와 `·`로 병기), 우리 변경이 고아로 만든 `index.css`의 `.rich-bright` 제거
- [x] **검증**: 라이브 네이티브 `<select>`·date 입력 **0건**(잔존 grep 히트는 전부 "폐기했다"는 주석) / 변경·신규 9개 파일 하드코딩 HEX **0건** / 표 레이아웃 불변 계약(colgroup+table-fixed, 오버레이 3종 전부 포털) / 가로 스크롤 격리(`overflow-auto`는 표 래퍼에만, 페이지는 `min-w-0`) / i18n **ko 205 / en 205 누락 0** / server test **9/9** / client build 성공(2030 modules) / lint 경고 **0**
- [x] 커밋·푸시 `d3cfe3b`. **Vercel(클라) 배포 확인 완료** — 어드민 청크에서 G1 필터·G2 토스트·H1 시트 탭·비번 초기화 모달·H3 학기 박스 문자열, CSS에서 reading 표면 클래스 전부 확인
- [!] **Render(서버) 배포 미반영 — 사용자 조치 필요(최우선)**: `/health` uptime 129,115초(약 36시간)로 푸시 이후 재시작된 적이 없고 `/settings/public`에 H2 신규 필드(ordinal·current_semester)가 없다. `/offerings/semesters`도 404. **Render 대시보드에서 수동 배포(Manual Deploy)** 하거나 GitHub 자동 배포 연결을 확인해야 한다. 서버 배포 전까지 비밀번호 초기화·회차/학기 설정·개설 과목 API가 동작하지 않는다(클라이언트는 폴백 처리라 화면이 깨지지는 않는다). **DB 마이그레이션은 이미 적용돼 있어 서버를 올리는 순간 바로 정상 동작한다**(안전한 순서)
- [!] 서버 배포 후 사용자 1회 설정: 어드민 → 전시회 설정에서 **회차(예: 18)와 접수 대상 학기**를 저장해야 접수 안내 제목이 「제18회 …」로 바뀌고 접수폼 기본 학기가 잡힌다(미저장 시 폴백 동작)
- [!] **제품 결정 대기**: 상담 연락처가 여전히 `010-XXXX-XXXX` 필수라 **해외 지원자는 실제 제출이 불가능**하다(영문화의 실효를 막는다). "이메일 있으면 연락처 선택" 또는 국제번호 허용 결정 필요 — 지시 범위(이메일 필수 추가) 밖이라 임의 변경하지 않았다. 변경 시 클라 `isValidPhone`·서버 `if (!name || !contact)` 두 곳
- [!] 스펙 이탈 1건(합리적 판단으로 수용): H1-1의 "행 클릭 시 확장"을 **좌측 고정열 화살표 버튼**으로 구현. 셀 클릭이 이미 복사 동작(H1-5)이라 같은 클릭에 두 동작을 겹치면 예측 불가능해지기 때문
- [!] 잔여(소유 밖·별도 과제): `GET /admin/exhibition/entries`는 여전히 `images`를 반환(시트에서만 컬럼 제거) / ExhibitionAdmin 접수 목록의 이미지 개수 표시 / 서버 `curriculum.track`(common|design|ai|culture)과 정적 `data/curriculum.js`(common|track-1~3) 두 소스 분리 상태 / 비밀번호 초기화 이력은 DB에만 기록하고 화면 미표시
- [!] 육안 확인(사용자, 서버 배포 후): 시트 마진·필터·행확장·탭·비번 초기화 / 접수폼 학기 전환·회차 / 상담 이메일·영문(헤더 토글로 /en/consult) / 로드맵 학기별·현재 학기 글로우 / 공지·자료실 상세 밝은 표면

## PHASE 31 · Render 자동 배포 복구 + 공개/비공개 실제 반영 (38_VISIBILITY)
### 1) Render 자동 배포 복구 (GitHub Actions Deploy Hook)
- [x] 원인: 레포 소유자 계정과 Render GitHub App 설치 계정이 달라 Render 쪽 webhook이 생성되지 않았다 → main에 push해도 서버가 자동 배포되지 않았다(클라이언트는 Vercel이 별도 배포라 정상이었고, 그래서 "클라만 최신, 서버는 구버전" 상태가 반복됐다)
- [x] `.github/workflows/deploy-render.yml` 신설: main push + 수동 실행(workflow_dispatch) 시 `secrets.RENDER_DEPLOY_HOOK`으로 POST해 배포 트리거. `curl -fsS`라 훅 URL이 만료·오타면 워크플로가 빨갛게 실패한다
- [x] 시크릿이 없으면 `exit 0`으로 **조용히 스킵**(포크·PR에서 매번 실패하지 않게) + `if: github.repository == 'hyunho2378/dah-website'` 포크 가드
- [!] **사용자 등록 필요 — 이거 하기 전까지는 자동 배포가 동작하지 않는다**:
  1. **Render Deploy Hook URL 찾기**: Render 대시보드 → 해당 Web Service(dah-website) 선택 → 좌측 **Settings** → 아래로 스크롤해 **Deploy Hook** 항목 → `https://api.render.com/deploy/srv-XXXXX?key=YYYYY` 형태 URL 복사(비밀값이라 공개 금지)
  2. **GitHub 시크릿 등록**: 레포 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret** → Name `RENDER_DEPLOY_HOOK`, Value에 위 URL 붙여넣기
  3. 등록 후 main에 아무 커밋이나 push하면 Actions 탭에서 "Deploy server to Render"가 돌고 Render Events에 배포가 뜬다. 즉시 걸고 싶으면 Actions 탭 → 해당 워크플로 → **Run workflow**
### 2) 대시보드 공개/비공개 토글 실제 반영
- [x] **근본 원인**: 토글은 `site_settings.contentVisibility`에 정상 저장되고 있었지만, 실제로 반영되는 곳이 **헤더 하위 메뉴의 포트폴리오 한 곳뿐**이었다(nav.js에 `visibilityKey`가 portfolios에만 붙어 있었다). 그래서 다른 유형을 비공개로 바꿔도 화면이 그대로였다 — 저장이 안 된 게 아니라 소비처가 없던 것
- [x] `client/src/data/visibility.js` 신설 — 유형 → 라우트/홈 섹션 대응의 **단일 진실 소스**. 헤더·홈·라우트 가드·사이트맵이 전부 이 표만 참조한다. 유형 키는 서버 `DEFAULT_VISIBILITY` 14종과 1:1
- [x] **저장 버튼**(요구 1): 토글은 초안만 바꾸고 즉시 저장하지 않는다. 하단 "저장"을 눌러야 PUT `/admin/settings`. **변경이 있을 때만 활성화**, 변경 건수 표시, "되돌리기", 저장 완료·실패 문구. 저장 성공 시 서버 값을 기준(savedVisibility)으로 갱신해 dirty 판정이 정확하다
- [x] **헤더**(요구 2): 하위 항목뿐 아니라 **최상위 단일 링크(공지사항·자료실)**도 숨기고, 원래 하위가 있던 그룹의 하위가 전부 숨겨지면 **그룹 자체를 제거**한다(그룹 대표 to가 첫 하위 경로라 놔두면 막힌 페이지로 보낸다). 데스크탑 드롭다운과 모바일 시트가 같은 `visibleNav`를 쓰므로 한 번의 수정으로 둘 다 반영
- [x] **홈 섹션**(요구 2): 섹션이 다루는 유형이 전부 비공개면 섹션 자체를 렌더하지 않는다(P6 빈 상태 규칙). ProgramShowcase는 카테고리 단위로 숨기고, 첫 카테고리가 숨겨졌을 때 `active`가 사라진 항목을 가리켜 우측 패널이 비는 문제까지 폴백 처리
- [x] **직접 URL 차단**(요구 2): `VisibilityGate` 신설 후 App의 공개 라우트(/en 미러 포함) 전체에 적용. 목록·상세(`/news/12` 등 접두사 매칭) 모두 차단. **로그인 관리자는 통과**(요구 4), 비로그인은 존재를 드러내지 않도록 403이 아니라 **404**. 설정·인증 로딩 중에는 렌더하지 않아 "잠깐 보였다 404" 깜빡임 없음
- [x] **사이트맵**(요구 2): 빌드 시 `/settings/public`을 조회해 비공개 유형 경로를 제외. 조회 실패(서버 슬립 등) 시 전부 포함으로 폴백해 빌드를 깨뜨리지 않는다. 실서버 조회 성공 확인
- [x] **포트폴리오 연동**(요구 3) 검증: 공개로 전환 시 "학생 활동" 하위에 포트폴리오가 나타나는 것을 로직 하네스로 확인
- [x] 검증(소스 파싱 하네스로 시나리오 전수): 포트폴리오 공개 전환 → 메뉴 등장 ✅ / 공지사항·자료실 비공개 → 최상위 제거 ✅ / 학과 행사 3종 전부 비공개 → 그룹째 제거 ✅ / 전시회만 비공개 → 그룹은 남고 항목만 제거 ✅ / 라우트 매핑(`/news/12`→notice, `/en/students/clubs`→club, `/about`→제어 대상 아님) ✅ / 홈 섹션 숨김 ✅ / 사이트맵 제외(단, `/students/careers`는 careers가 공개면 유지) ✅. build 성공, lint 경고 0
- [!] 해석 note: 요구의 "사이드바"는 **공개 사이트의 모바일 내비 시트**로 해석해 헤더와 함께 처리했다. **어드민 사이드바는 일부러 필터하지 않았다** — 관리자는 비공개 콘텐츠를 관리할 수 있어야 하고(요구 4), 사이드바에서까지 지우면 비공개로 돌린 콘텐츠에 아예 못 들어간다
- [!] 이번 턴 작업 중 작업 트리가 외부에서 hard reset·clean 돼 편집분과 신규 파일이 전부 소실되는 일이 있었다. 전량 재적용 후 **즉시 커밋**으로 보호했다(4cf2423 · 8637364)

## PHASE 32 · UI 수정 배치 (38_UI_FIX_BATCH)
### PHASE A — 정찰·기반 (단독)
- [x] **A-1 라이브 실측**(https://dah-hallym.vercel.app, 추측 아님 — 전부 getBoundingClientRect/getComputedStyle 실측)
  - **사이트 표준 마진**: `Container.jsx` = `max-w-[1200px] · px-gutter-m(16)/md:gutter-t(24)/lg:gutter-d(32) · 2xl:max-w-container(1280)`. vw1280에서 컨테이너 박스 left 32.5px + padding 32 → **콘텐츠 좌측선 64.5px**. vw1425에서 콘텐츠 좌 104.5 / 우측 끝 1320.5. 전 페이지가 이 한 컴포넌트만 쓴다(예외: 접수 시트)
  - **섹션 수직 패딩**: 실측 `padding-top/bottom = 150.25px`(vw1280). 토큰 `spacing.section` 96→160 유동 보간값. 섹션 사이 실효 간격은 그 2배인 **≈300px**
  - **섹션 헤드라인 아래**: 홈 섹션 헤드라인→다음 블록 24~40px(과다 아님). 과다 지점은 **PageBanner**(`pb-40 pt-48 md:pb-64 md:pt-80`) 뒤에 곧바로 py-section(150px)이 붙어 **제목 아래 실효 214px**가 되는 서브페이지 상단이다
  - **전시회 featured 타이틀**: `text-display-xl-m md:text-display-xl-d` → vw1440에서 **64px**. 같은 화면 페이지 H1은 36px — 카드 제목이 페이지 제목의 1.78배로 위계 역전
  - **헤더 우측 클러스터**: `flex shrink-0 items-center gap-16` 단일 gap. 자료실 right=836 / 전시회 접수 CTA left=1024 → **자료실↔CTA 188px**, **CTA↔KR·EN 16px**. 즉 CTA가 토글에 붙어 있고 자료실과는 멀다
  - **접수 시트**: `max-w-container-wide`(1440) — 사이트 표준(1200/1280)과 다른 상한. 툴바 순서가 `[새로고침][CSV][엑셀][검색어]`로 **검색어가 우측 끝**이라 요구(검색 좌·버튼 우)와 정반대
  - **필터 소멸 버그 원인 특정**(재현·코드 1:1): `EntriesSheet.jsx:496`의 `{visibleRows.length > 0 && (…표 전체…)}`. 컬럼 필터에서 "전체 해제"(`ColumnFilter.jsx:184` → `onChange(new Set())`)를 하면 visibleRows가 0이 되어 **표·thead·ColumnFilter가 통째로 언마운트** → 필터 드롭다운 자체가 사라져 되돌릴 방법이 없다. ColumnFilter는 무결(포털·fixed) — 수정 대상 아님
- [x] **A-2 기반 확정**(공용 파일은 이 페이즈에서만 수정)
  - 표준 마진 = 위 Container 값으로 확정. 단 접수 시트는 RESPONSIVE.md "작업 중심(대시보드·관리 화면)은 전체 너비를 쓰되 데이터 테이블은 화면을 채운다" + 4K 요구 1(좌우 여백이 콘텐츠 너비보다 크면 안 됨)에 따라 **폭 상한이 아니라 gutter 값(16/24/32)을 표준으로 준수**한다. 툴바·표가 그 gutter 선에 1px 오차 없이 정렬되는 것이 합격 기준
  - 섹션 간격 표준: `spacing.section` **96→80(mobile) / 160→128(desktop)** 로 소폭 축소(-17%·-20%). 37개 호출부가 전부 `py-section-m lg:py-section-d`라 **토큰 1곳 수정이 곧 전 페이지 적용** — 실제 적용은 PHASE C 단독
  - 헤드라인 아래 표준: PageBanner `pb-40 pt-48 md:pb-64 md:pt-80` → `pb-32 pt-40 md:pb-40 md:pt-64`. 적용은 PHASE C
  - **신규 토큰 1개**: `colors.state.semesterActive = rgba(129,95,215,0.16)`. #815FD7 단일 색 + 불투명도(CI 4.2). depth0 위 합성 ≈#221A37 = bg.panel과 같은 밝기대라 "한 단계 밝아짐"은 보이되 과하지 않다. tailwind는 `...colors` 스프레드라 `bg-state-semesterActive`로 자동 노출 — config 수정 불필요
  - 학생회 타이틀은 기존 토큰(`text-text-pri`, `text-purple-primary`) 재사용 — 신규 토큰·accents.js 수정 불필요
- [x] **A-3 파일 소유 계약**(교차 0건 확인). AGENT-1 `pages/admin/EntriesSheet.jsx` / AGENT-2 `pages/admin/ExhibitionAdmin.jsx`·`components/admin/AdminLayout.jsx` / AGENT-3 `pages/Curriculum.jsx`·`pages/admin/CurriculumAdmin.jsx` / AGENT-4 `pages/Home.jsx`·`pages/programs/Exhibitions.jsx`·`components/layout/Header.jsx`·`pages/submit/ExhibitSubmit.jsx`·`pages/students/Council.jsx`
  - 확인 사항: 대시보드 카드(접수 버튼 노출·회차/대상 학기·접수 현황)는 SettingsAdmin이 아니라 **ExhibitionAdmin.jsx 한 파일**에 모여 있어 AGENT-2 단독 소유로 성립(병합 불필요). 비번 초기화 서버 라우트는 `server/src/routes/adminExtra.js:132`에 **이미 존재** — 신규 추가 없이 재사용. `ColumnFilter.jsx`·`Divider.jsx`는 공용이나 수정 불필요(Divider는 People·Careers가 계속 사용하므로 컴포넌트 삭제 금지, 홈에서 호출만 제거)

### PHASE B — 병렬 (AGENT-1~4, 파일 소유 교차 0건)
- [x] **[A1] 접수 시트·접수자 정보 탭 재설계**(`EntriesSheet.jsx` 단독) — 폭 상한 제거 후 gutter 정렬 / 탭·버튼·입력 보더 제거 / 필러 행 빈 그리드 + 얼룩말 배경 제거 / 셀 클릭 선택만(자동 복사 삭제, `select-text`) / 좌측 행 열·도움말 제거 / 표 상시 렌더로 필터 소멸 해결 / 접수자 정보 탭 사람 단위 집계. 서버 라우트는 `adminExtra.js:132` 기존 것 재사용(신규 0)
  - `border-collapse` → `border-separate border-spacing-0` + sticky를 `<thead>`가 아니라 각 `<th>`에 건 이유: collapse에서는 sticky 헤더의 보더가 스크롤 시 사라진다
- [x] **[A2] 대시보드 설정·순서**(`ExhibitionAdmin.jsx`·`AdminLayout.jsx`) — 카드 스왑 / 현황 요약화 / 위치·학기 세그먼트 / 어드민 그룹을 `nav.js` 헤더 IA 순서로 재정렬
  - 재정렬의 함정: IA 그룹이 권한을 섞는다(운영위원회 admin vs 동아리 manager). `role`을 그룹에서 항목으로 내리고 **path+role 집합 동일**을 대조해 권한 변경 0건 확인
- [x] **[A3] 교육과정 학기 틴트·편집기 sticky**(`Curriculum.jsx`·`CurriculumAdmin.jsx`) — 나열식 제거 후 SemesterPicker, 로드맵 SVG `rect` fill을 `state.semesterActive`로. 비활성은 `none`이 아니라 `transparent`(none은 색 보간이 안 돼 전환이 튄다). md 미만은 로드맵이 hidden이라 학기 표 행에도 동일 틴트
- [x] **[A4] 공개 페이지 스팟**(`Home.jsx`·`Exhibitions.jsx`·`Header.jsx`·`ExhibitSubmit.jsx`·`Council.jsx`) — 구분선 2개 제거(컴포넌트는 People·Careers가 써서 보존) / featured 타이틀 display-xl→h1 + weight 800→700·leading 1.05→1.25 / CTA `lg:mr-8` / 접수 버튼 최하단 / 타이틀 3색
- [!] 린터는 eslint가 아니라 **oxlint**(`package.json`의 `"lint": "oxlint"`)다. 에이전트 2명이 eslint 부재로 검증을 못 했다고 보고해 전량 oxlint로 재검증했다 — 수정 파일 경고 0

### PHASE C — 단독 (크로스커팅 + 통합 검증)
- [x] 섹션 간격 축소: `spacing.section` 96→80 / 160→128. 호출부 37곳이 전부 `py-section-m lg:py-section-d`라 토큰 1줄이 전 페이지 적용
- [x] 헤드라인 여백: `PageBanner` `pb-40 pt-48 md:pb-64 md:pt-80` → `pb-32 pt-40 md:pb-40 md:pt-64`
- [x] **[AR 추가 수정] 필러 행 고정값 20 → 실측 기반**. 3840x1200에서 그리드 773px / 허용 840px로 **아래 67px이 빈 채로 남는 것을 재현**했다. 첫 시도(래퍼 `clientHeight` 측정)는 래퍼가 콘텐츠에 맞춰 줄어들어 "현재 행 수가 곧 답"이 되는 고정점에 갇혀 실패했고, 기준을 상한(`max-h-[70dvh]`의 computed maxHeight)으로 바꿔 해결. 하한 20 / 상한 200(렌더 폭주 안전판)
- [x] 통합 빌드 성공(2032 modules), oxlint 경고 0(잔여 7건은 전부 기존 `only-export-components`, 이번 수정 파일 아님)
- [x] **실측 재검증**(로컬 dev + scratchpad 스텁 API. 실 DB 미접속 — 프로덕션 쓰기 위험 회피)
  - 접수 시트: 검색 left 32 / 표 left 32 / 표 right 32 / 버튼 right 32 **완전 정렬** · 탭 border 0px · 20→22행 필러(잔여 여백 0) · 셀 클릭 시 클립보드 호출 **0회** · 셀 다중 드래그 선택 텍스트 정상 추출 · 선택 셀만 `#6844C4` 2px 아웃라인 · 첫 헤더 "번호"(행 열 제거) · 도움말 문구 부재
  - **필터 소멸 재현·해결 확인**: 전체 해제 → 데이터행 0이지만 thead 15·필터 15·패널 열린 상태 유지 → 값 재선택 → 3행 복귀
  - 접수자 정보 탭: 접수 3건 → **2명 집계**, 김하늘 "UX디자인, 디지털 디자인2" 2과목 / 팀 접수자는 `members`에서 학번·이름 추출 / 초기화가 그 사람의 접수 2건(id 1·3) **모두에 POST** + 토스트
  - 대시보드: 카드 순서 접수 일정→접수 현황→회차·학기→과목→접수 버튼 노출 · 현황 카드 "바로가기 + 현재 접수 3건"(리스트 0) · 위치 세그먼트 **헤더 73px = 플로팅 73px 동일 폭** · 사이드바 DASHBOARD/ABOUT/ACADEMICS/EVENTS/STUDENT LIFE/NOTICES/RESOURCES/SYSTEM/OWNER
  - 교육과정: 2학기 선택 시 UX디자인·디지털 디자인2만 틴트 → **1학기로 전환하면 디지털인문예술입문·디자인 씽킹으로 이동**, 전 과목은 표에 잔존, "현재 학기" 배지 정상 해제
  - 공개 페이지: 홈 `<hr>` 0개 · featured 타이틀 64px→**36px**(페이지 H1과 동일) weight 700 leading 1.25 · CTA↔KR/EN **16→24px**, 자료실↔CTA 191px 유지 · 접수 버튼 2개가 마지막 안내(top 674) 아래 top 1019 · 학생회 2026=#F7F5FC / 1·LUCID=#815FD7
  - 간격: 제목 아래 249→**193px**, 섹션 패딩 160→128 / 96→80
  - 반응형 320·768·1440·3840 전부 **페이지 가로 스크롤 0**, 표 초과폭은 래퍼 내부 스크롤로 격리
- [!] **미검증(실서버 필요)**: 비번 초기화의 실제 bcrypt 저장 결과, 실 데이터에서 `curriculum.name_ko`와 정적 `data/curriculum.js` 과목명 일치 여부(불일치 시 그 과목만 틴트 안 됨), Safari에서 `<th>` sticky + `border-separate` 동작
- [!] **범위 밖 관찰(고치지 않음)**: 3840px에서 콘텐츠 1280 / 좌우 여백 각 1273px로 RESPONSIVE.md 4K 요구("여백이 콘텐츠보다 크면 안 됨")에 7px 차로 겨우 걸린다. 컨테이너 상한은 이번 배치가 건드린 값이 아니라 기존 설계이며, 4K 전략 변경은 별도 과제다
- [!] 학생회 타이틀 `#815FD7`는 `#100D18` 위 **4.17:1** — h2(20/28) 700이라 WCAG AA 큰 텍스트(3:1)는 통과하나 일반 텍스트(4.5:1) 미달. 요청한 규칙의 직접 결과라 그대로 뒀다. 되돌린다면 `purple.mid`(#A286E9)가 절충안
- [!] 어드민 그룹 라벨은 영문 유지(기존 OWNER·SYSTEM과 동일 스타일). 국문 원하면 후속 처리

## 39_FIX_EXHIBITION_REVEAL — 전시 CTA·본문 reveal 정지 버그
- [x] **FIX 1 (결정적)**: `hooks/useReveal.js` — 노출 판정을 mount + IntersectionObserver로만 수렴시켰다. (1) 마운트 다음 프레임에 `getBoundingClientRect`로 직접 교차를 판정해 above-the-fold 요소는 IO 첫 배달을 기다리지 않고 즉시 노출, (2) observe 등록 후 1200ms 안에 IO 배달이 **한 번도** 오지 않으면 관찰 파이프라인이 죽은 것으로 보고 무조건 노출하는 안전망. 정상 환경에서는 첫 배달이 즉시 도착해 안전망이 발동하지 않으므로 스크롤 리빌 동작은 그대로다. reduced-motion 즉시 노출 경로는 기존 유지
- [x] **FIX 2**: `pages/programs/Exhibitions.jsx` — featured CTA 패널에서 유리를 **완전히** 제거했다. liquidGL(`useLiquidGlass` 호출·import·`.dah-liquid-cta` 선택자 클래스)은 물론 CSS 글래스도 쓰지 않는다. 새 `CTA_SURFACE`(`rounded-glass border border-glass-line bg-bg-elev shadow-glass`) — 불투명 카드 표면 `bg.elev`(#171321, 사이트 카드와 동일 계열) + 헤어라인 토큰, `backdrop-filter`·반투명·굴절 0. 접수 링크가 든 표면이라 장식보다 가독성·결정성을 택했고, 배경 네뷸라가 비쳐 대비가 로드마다 흔들리던 것도 함께 사라진다. 포스터 프레임은 기존 `GLASS_SURFACE` 유지(요청 범위 밖)
- [x] **FIX 3 (방어)**: `public/vendor/liquidgl/liquidGL.js` — `captureSnapshot`의 scale이 유한 양수가 아니면 dpr(상한 2)로 폴백(`Canvas renderer initialized ... with scale NaN`의 직접 원인). `hooks/useLiquidGlass.js` — 스크립트 로드 후 `document.fonts.ready` + rAF 1프레임을 더 기다려 치수 확정 후 초기화. 중복 벤더 사본 `client/vendor/liquidgl/` 삭제(서빙본은 `client/public/vendor/`, 중복본은 어떤 코드·빌드 설정에서도 참조되지 않았음)
- [!] **`useLiquidGlass` 호출부 0개**: FIX 2로 마지막 사용처가 사라졌다. 헤더는 d4a78e6에서, 모바일 시트는 그 이전에 이미 CSS 글래스로 전환돼 있었다. 훅·벤더(265KB, public/ 서빙이라 번들 미포함)는 "전역에서 뜯어내지 말 것" 지시에 따라 남겼다 — 순수 장식 표면에 재도입할 계획이 없다면 훅·벤더·FIX 3 가드를 통째로 지우는 후속 정리가 가능하다
- [!] **미검증(브라우저 도구 부재)**: 이번 세션에 브라우저 자동화 도구가 없어 요구된 `/programs/exhibitions` 하드 리로드 10회 실측, computed opacity 확인, CTA 패널 `backdrop-filter` 미적용 확인, 320/430/1440/3840px 렌더 확인, reduced-motion 확인을 수행하지 못했다. `npm run build` 통과만 확인했다. 배포 후 육안 검증 필요

## 41_GOOGLE_AUTH_PUBLIC — 공개 제출자 구글 로그인 + 비밀번호 제거 + 자동 메일
- [x] **[A0] 계약**: `41_AUTH_CONTRACT.md`(리포 루트)에 저장 모델·API·파일 소유를 고정하고 병렬 착수. 공용 골격 3종 완료 — `server/src/middleware/publicAuth.js`, `client/src/hooks/usePublicAuth.js`, `client/src/components/auth/GoogleLoginButton.jsx`
- [x] **신원 클래스 분리(핵심)**: 스태프와 공개 제출자는 쿠키(`dah_access` vs `dah_pub_access`)와 JWT 클레임(`role` vs `kind:'public'`)을 모두 분리했다. 같은 쿠키를 쓰면 공개 로그인이 관리자 세션을 덮어쓴다. 시크릿과 cross-site 쿠키 속성(SameSite=None+Secure)은 `auth.js`에서 export해 공유 — 속성이 갈라지면 과거 cross-site 쿠키 미저장 버그가 재발한다
- [x] **[BE]**: `routes/googleAuth.js` 신설 — `/auth/google/login`·`/auth/google/callback`·`/auth/public/me`·`/auth/public/logout`. 신규 의존성 없이 code 플로우 직접 구현(fetch), id_token은 `aud`·`iss`·`email_verified` 검증. state는 단기 JWT를 `dah_oauth_state` 쿠키에 넣어 CSRF 방어, `next`는 단일 `/`로 시작하는 경로만 허용(오픈 리다이렉트 차단). `submit.js`에서 bcrypt 전면 제거 후 4개 쓰기 라우트에 `requirePublicAuth` + 소유 검증. `lib/mailer.js` 신설(접수 완료 확인 메일, SMTP 미설정 시 조용히 스킵, 발송 실패가 접수 응답을 깨지 않음)
- [x] **[FE]**: 제출 진입점 3곳(`/submit`·`/submit/edit`·`/showcase/submit`)에 로그인 게이트. 비번 필드·확인·수정용 비번·조회 폼 전부 제거, 이메일은 로그인 계정에서 읽기 전용 표시. `/submit/edit`은 `GET /submit/exhibition/mine`으로 본인 접수만 조회·수정. 로그인 상태 전환은 셸 유지 + `.page-fade` 크로스페이드(리마운트 없음). 로그인이 전체 페이지 이동이라 게이트가 `next=/submit?step=form`을 넘겨 복귀 시 폼 단계로 진입
- [x] **[ADMIN]**: 접수자 정보 탭의 비밀번호 초기화(1234) 버튼·모달·핸들러 제거, 서버 `POST /admin/exhibition/entries/:id/reset-password` 라우트 삭제. 신원은 구글 계정 이메일(기존 `email` 컬럼이 그대로 담음). 38 스펙의 나머지(학번·전공·이름·이메일·전화번호·접수 과목, 필터·정렬·sticky·셀 선택·내보내기)는 유지. `pw_reset_at`·`pw_reset_by` 컬럼은 스키마에 남김(DROP 금지)
- [x] **[AR] 통합 검증**: 클라 빌드 통과, 서버 스모크 9/9 통과. 별도 통합 스모크 9건 신규 작성·통과 — OAuth env 미설정 시 503(사이트 정상), 공개↔스태프 쿠키 상호 차단 양방향, 비로그인 제출·조회 401 + `loginPath`, 구 비번 엔드포인트(`/lookup`·`/list`)·비번 초기화 라우트 404, **본문으로 들어온 위조 이메일 무시하고 계정 이메일로 저장**
- [!] **큐레이션은 범위에서 빠졌다**: 프롬프트는 제출 엔티티 3종을 전제했으나 `curation|큐레이션` grep이 server·client 전부에서 0건이다. 40_EXHIBITION_CURATION_DASHBOARD는 문서도 커밋도 없다(미구현). 실재하는 공개 제출은 전시회 접수와 웹앱 쇼케이스 2종뿐이라 그 2종만 전환했다. 40이 구현되면 같은 계약을 그대로 붙이면 된다
- [!] **`/auth/me` 경로는 스태프가 선점**: 프롬프트의 "GET /auth/me(공개)"를 그대로 따르면 스태프 인증에 회귀가 생긴다. 공개용은 `/auth/public/me`·`/auth/public/logout`으로 분리했다(의도된 이탈)
- [!] **기존 접수 건 승계**: 기존 행에는 `public_user_id`가 없다. 로그인 계정 이메일과 행의 `email`이 같으면 본인으로 인정하고 조회·수정 시 `public_user_id`를 backfill한다. 이 규칙이 없으면 비번 제거와 동시에 기존 접수자가 자기 접수를 잃는다
- [!] **레거시 쇼케이스는 자가 승계 불가**: `showcase`에는 email 컬럼이 없어 구글 계정과 대조할 값이 없다. 구글 전환 이전 제출 건은 본인 수정 시 403이며 관리자 경로로만 처리 가능하다
- [!] **배포 전 필수**: `node scripts/migrate-phase41.mjs`를 **서버 배포보다 먼저** 실행해야 한다. 신규 접수는 `pw_hash` 없이 INSERT하는데 현 운영 스키마는 `pw_hash NOT NULL`이라 마이그레이션 전에는 접수가 전부 실패한다
- [!] **미검증(브라우저·실계정 부재)**: 실제 구글 왕복(동의 화면→콜백), 실제 SMTP 수신, 320~3840px 렌더, 크로스페이드 육안 확인을 하지 못했다. OAuth는 fetch 스텁으로만, 메일은 실패 경로로만 검증했다. 마이그레이션 SQL도 `DATABASE_URL`이 없어 실행하지 못했다

## 38_EXHIBITION_POLISH — 전시회 상세·대시보드·접수 시트·접수폼 정리 (단독 STEP1 → 병렬 K1·K2·K3 → 단독 STEP3)
### STEP 1 (단독 공용 선결)
- [x] **J1 커스텀 DatePicker 연/월 점프**(`components/common/DatePicker.jsx`): 월 헤더의 정적 텍스트를 클릭 버튼으로 바꿔 연·월 직접 선택 모드를 추가. 연도는 숫자 입력으로 점프(1900~2200) + 앞6·뒤5년 목록에서 바로 고르기(가로 스크롤 칩), 월은 3열 그리드. 모드 시 좌우 화살표는 해에 연동(±1년). 패널 닫으면 모드 리셋. 네이티브 date 미사용 유지 — 전 어드민 날짜 필드가 `DateInput` 경유로 이 컴포넌트를 쓰므로 자동 전파
- [x] **J2 AI식 상태 문구 정비**(`pages/admin/EntriesSheet.jsx`): "총 N건 · 표시 M건 · 20초마다 자동 새로고침 · 마지막 갱신 …" 가운데점 나열을 위계 분리로 교체 — 주요(건수)는 body 크기 "총 N건 중 M건 표시", 갱신 정보는 작은 보조줄 "20초마다 자동 갱신, 마지막 갱신 …". 가운데점·마침표 나열 제거
- [x] 빌드·oxlint 통과 확인 후 병렬 착수
### STEP 2 (병렬 3, 소유 계약 무충돌 — 파일 교차 0건)
- [x] **K1 전시회 공개**(`pages/programs/Exhibitions.jsx`·`ExhibitionDetail.jsx`): 피처드 블록에서 접수·수정 버튼 제거(전시 기간·날짜·전시명만, 박스 정렬 교정, 고아 prop/변수 정리) / 상세 레이아웃 재배치(헤드라인→학기·기간→본문(intro/body)→사이트·공유 버튼, 본문을 우측 컬럼 안 dl 아래로 상향) / 편집 버튼 2개→1개 통합(목록으로 가던 InlineEditBar 제거, 그 전시 수정 페이지로 가는 EditPencil만 유지, 미사용 import 정리)
- [x] **K2 공모전·어드민 편집**(`pages/programs/ContestDetail.jsx`·`pages/admin/PostForm.jsx`): 공모전 상세의 접수 버튼(applyExternal, primary)을 전시 사이트 외부 버튼(exhibitionSite, secondary)으로 교체 — `external_url` 재사용(공모전은 이메일 접수라 사이트 접수 없음, 새 컬럼·서버 변경 없음) / PostForm t2에서 `type==='contest'`일 때 URL 필드 라벨 "전시 사이트 URL"·hint "새 탭으로 전시 사이트를 엽니다"로 분기(lecture는 기존 "외부 접수 URL" 유지) / 전시회 폼(template exhibition)의 site_url·ordinal·semester_label·start_date/end_date(DateInput=J1) 필드 정상 확인, 수정 없음
- [x] **K3 접수 시트·폼·사이드바**(`pages/admin/EntriesSheet.jsx`·`pages/submit/ExhibitSubmit.jsx`·`exhibitFormKit.jsx`·`components/admin/AdminLayout.jsx`): 시트 컨테이너 `h-[100dvh] flex-col` + 표 래퍼 `flex-1 min-h-0` 내부 스크롤 → 하단 탭 바 뷰포트 하단 고정(sticky footer) / 다중 셀 드래그 선택(range=anchor·focus 인덱스, mousedown+mouseenter, window mouseup) + 하이라이트(reading.accent /10 틴트·아웃라인) + Cmd/Ctrl+C·복사 버튼으로 TSV 클립보드 복사(토스트, 시프트 0, 표 폭 불변) / 접수폼 PageBanner(브레드크럼·헤더) 제거 / SubjectField의 학기 SegmentControl 제거 → 관리자 지정 현재 학기 과목만 RadioCards 노출(죽은 코드·import 정리) / 작품 설명 placeholder "작품 설명은 전시회 사이트에 사용됩니다."로 교체 / 사이드바 owner·system 그룹을 Dashboard 위로(권한 path+role 매핑 불변)
### STEP 3 (단독 통합)
- [x] **검증**: 네이티브 `<select>`·date 입력 0건(잔존 grep은 전부 주석) / 변경 9개 파일 신규 하드코딩 HEX 0건(색은 tokens 경유·reading.accent /10) / 표 레이아웃 불변 계약 유지(table-fixed+colgroup, 선택은 인덱스·CSS만 변경, 토스트 포털) / 하단 탭 고정 구조 확인 / 가운데점 나열: 이번 변경이 새로 만든 사용자 문구 0건(J2 상태줄 정비 완료). 잔존 `날짜·시간 선택`(관용 복합 라벨)·온보딩 스텝 desc는 기존 문구라 범위 밖 유지 / `npm run build` 성공(2033 modules), oxlint 변경 파일 경고 0(잔여는 vendor·기존 파일)
- [ ] 잔여(육안·서버): 접수 시트 하단 탭 고정·다중 셀 드래그 복사·필터 시프트 0 실기기 확인 / DatePicker 연·월 점프 육안 / 접수폼 학기 UI 제거·과목 필터 / 어드민 전시회·공모전 편집 진입이 실제 수정 페이지로 이동 확인(로그인 필요) / 320~3840 가로 스크롤 0
- [!] 관찰(범위 밖): 공모전 리스트(`Contests.jsx`)의 "카드에서 바로 외부 이동" 링크가 이제 의미상 접수가 아니라 전시 사이트다. 라벨·aria 점검은 그 파일 소유 별도 과제

## 42_ADMIN_FIX — 어드민 4건 (목록 페이지 유지·연도 그리드·리치 숨김·매니저 권한)
- [x] **목록 페이지 유지**: `PostList.jsx`의 `page`를 `useState`에서 URL 쿼리(`?page=2`)로 옮겼다. 상세 편집 후 뒤로 나오면 브라우저가 URL을 되돌려주므로 컴포넌트가 재마운트돼도 보던 페이지가 복원된다. localStorage 미사용. 1페이지면 쿼리를 붙이지 않아 기존 URL 형태 유지
- [x] **연도 그리드**: `DatePicker.jsx`에서 연도 좌우 화살표(`shiftYear`)와 가로 스크롤 연도 스트립을 삭제했다. 헤더를 "연도 / 월" 두 버튼으로 나눠 각각 3x4 그리드를 연다(월 그리드 패턴 그대로). 그리드 12년 밖으로는 기존 연도 입력(1900~2200)으로 이동. 일 그리드의 월 이동 화살표는 통상 달력 동작이라 유지
- [x] **전시회 리치 필드 숨김**: `PostForm.jsx`의 "소개(리치)"·"본문 (영문)" RichEditor 블록 2개를 렌더에서 제거. `body`·`body_en` 컬럼, 프리필, 저장 payload는 그대로라 기존 값이 보존되고 다시 노출만 하면 복구된다
- [x] **매니저 전시회 권한**: 12_BACKEND 2절이 manager를 "관리 학생(전시회 담당 등)"으로 정의하는데 실제로는 admin 게이트였다. 클라 4곳(`admin/index.js`의 `exhibition`·`exhibition-entries/sheet` 라우트, `AdminLayout` 사이드바 전시회 설정, `Dashboard` 접수 현황 패널·링크)과 서버 2곳(`GET /admin/exhibition/entries`, `PUT /admin/settings`)을 manager+로 열었다
- [x] **권한 확장 경계 고정**: `PUT /admin/settings`는 사이트 전역 설정과 전시회 설정을 한 라우트에서 처리한다. 통째로 열면 매니저가 사이트 설정까지 쓰게 되므로 `MANAGER_SETTING_KEYS`(exhibitionSubjects·exhibitionOrdinal·exhibitionSemester) 밖의 키는 admin+ 403으로 막았다. `exhibition_settings` 테이블 갱신은 manager 허용
- [x] **검증**: 클라 빌드 통과, 서버 테스트 12/12 통과(신규 3건 — manager 접수 목록 200, manager 전시회 일정·회차 저장 200, manager `contentVisibility` 저장 403)
- [!] **미검증(브라우저 도구 부재)**: (a) 2페이지 편집 후 뒤로가기 (b) 연도 그리드 클릭 (c) 리치 필드 비노출 (d) 실제 매니저 계정 로그인 접근을 육안으로 확인하지 못했다. 빌드와 서버 테스트만 확인했다

## 43_SORT_UX_UNIFY — 정렬 UX 전역 통일 (6점 핸들 상시 노출 제거)
- [x] **전수 진단** — 순서 변경이 구현된 곳 5개. 이미 통일 규격이던 곳 3개, 위반 2개
  - `pages/admin/PostList.jsx` (동아리·학생 성과 어드민 목록): PageHead "정렬" 토글 + 모드 중에만 핸들 — 기준 규격
  - `pages/students/Clubs.jsx` (공개 동아리): InlineEditBar `sortable` 토글 + 모드 중에만 핸들 — 기준 규격
  - `pages/students/Achievements.jsx` (공개 학생 성과, 연도별): InlineEditBar `sortable` 토글 + 모드 중에만 핸들 — 기준 규격
  - `components/admin/EntityCrud.jsx` (교수진·멘토·취업 현황): **위반** — `orderable`이면 핸들 상시 노출, 정렬 토글 없음
  - `pages/admin/CurriculumAdmin.jsx` (교과목): **위반** — `!coarsePointer`면 핸들 상시 노출
- [x] **EntityCrud 정렬 모드화**: `sorting` 상태 추가, PageHead actions에 "정렬 / 정렬 완료" 토글(ArrowUpDown, 추가 버튼 왼쪽)을 `orderable`일 때만 노출. 드래그와 핸들 모두 `sorting`에 게이트. 모드 중 안내 문구 1줄. 저장은 드롭 즉시 PUT(기존 동작 유지, PostList·Clubs·Achievements와 동일)
- [x] **CurriculumAdmin 핸들 제거**: 이 페이지의 좌→우 드래그는 순서 변경이 아니라 **복사**(과목을 학기 박스에 개설)다. 정렬이 아니므로 정렬 버튼을 붙이지 않고 6점 핸들만 걷어냈다. 행은 그대로 draggable이고, 같은 동작을 하는 행별 "추가" 버튼과 안내 문구가 이미 있어 진입 경로 손실 0
- [x] **버튼 위치 통일**: 어드민은 PageHead actions(추가 옆), 공개 페이지는 InlineEditBar 안. 라벨·아이콘도 ArrowUpDown + "정렬"/"정렬 완료"로 전 페이지 동일
- [x] **정렬 버튼 미노출 대상 확인**: 공지·자료실·특강·공모전·전시회·포트폴리오는 `POST_TYPES.sortable` 미지정이라 버튼이 뜨지 않는다(날짜순 자동). 운영위원회는 `orderable={false}`라 그대로 미노출
- [x] **검증**: `<DragHandle` 렌더 지점 4곳 전부 정렬 모드 게이트(`draggable &&` 또는 `sorting &&`) 확인, 상시 노출 0건. 클라 빌드 통과
- [!] **미검증(브라우저 도구 부재)**: 정렬 모드 토글·드래그 재정렬·저장 반영을 육안으로 확인하지 못했다. 빌드만 확인했다
- [!] **범위 밖 관찰(고치지 않음)**: `postTypes.js`의 club 주석이 "어드민 목록에서 6점 핸들 드래그 정렬"이라고 적혀 있으나 PostList는 이전부터 정렬 모드에서만 핸들을 띄웠다. 이번 변경 이전부터 어긋난 주석이라 손대지 않았다
