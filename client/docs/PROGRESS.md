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
- [ ] AGENT-B1 백엔드: schema.sql, seed, 인증, CRUD 권한, 업로드 WebP, 접수, 쇼케이스, settings, export
- [ ] AGENT-B2 디자인 v2 코어: StarField, GlassCard·GlassPill·PageBanner, Header 메가메뉴, GlassDock, ShareButton, LangToggle, 글래스 스킨
- [ ] AGENT-B3 어드민·에디터: /admin CRUD, Tiptap+렌더러, useApi·useAuth, 인라인 편집 버튼
- [ ] AGENT-B4 공개 A: 홈 v2, About 통합, 교육과정, 코드쉐어링, /en·i18n
- [ ] AGENT-B5 공개 B: 프로그램 3종, 운영위, 성좌, 진로, 쇼케이스, 접수 폼, 공지·자료실
- [ ] AGENT-BR 리뷰: App 조립 + 검증 (h) Lighthouse 포함

## 데이터 갭 (사용자 확인 필요)
- [!] 교수 개별 사진: 미보유 → 이니셜 플레이스홀더로 v1 출시, 사진 확보 시 교체
- [!] 수상 실적 원문 중 2021~2025 구간: source_content.md에서 확인 후 이관 (원문에 있는 것만)
- [!] 재학생·전체 수치(재학생 수 등): 공식 수치 미보유 → Stats에 미포함 유지
- [ ] OG 이미지 1600x840: 03_ASSET_PROMPTS.md B4로 제작 후 public/og.png

## 배포
- [ ] Vercel 연결, 도메인, vercel.json 리라이트
- [ ] Lighthouse: 모바일 Performance 90+, A11y 100 목표