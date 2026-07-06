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

## 데이터 갭 (사용자 확인 필요)
- [!] 교수 개별 사진: 미보유 → 이니셜 플레이스홀더로 v1 출시, 사진 확보 시 교체
- [!] 수상 실적 원문 중 2021~2025 구간: source_content.md에서 확인 후 이관 (원문에 있는 것만)
- [!] 재학생·전체 수치(재학생 수 등): 공식 수치 미보유 → Stats에 미포함 유지
- [ ] OG 이미지 1600x840: 03_ASSET_PROMPTS.md B4로 제작 후 public/og.png

## 배포
- [ ] Vercel 연결, 도메인, vercel.json 리라이트
- [ ] Lighthouse: 모바일 Performance 90+, A11y 100 목표