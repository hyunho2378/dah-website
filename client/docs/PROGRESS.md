# PROGRESS.md — 진행 상태

컨텍스트 85% 도달 시 즉시 중단하고 이 파일 갱신 후 대기. 재시작 시 이 파일 먼저 읽는다.

## 상태 범례
[ ] 대기 / [~] 진행 중 / [x] 완료 / [!] 블로킹

## PHASE 0 — 셋업
- [x] 프로젝트 스캐폴드 (01_SETUP_PROMPT.md 실행)
- [x] 폰트 CDN 로드 확인 (Pretendard, Anton, IBM Plex Mono)
- [x] tokens.js → tailwind.config.js 매핑 동작 확인

## PHASE 1 — 병렬 (02_PARALLEL_PROMPTS.md)
- [ ] AGENT-1 데이터·기반: data/ 12파일 원문 이관, index.css, 훅
- [ ] AGENT-2 코어 UI: common 9종, layout 3종, OrbitCanvas
- [ ] AGENT-3 홈 섹션: home/ 9섹션 + Home.jsx
- [ ] AGENT-4 서브 A: About, Tracks
- [ ] AGENT-5 서브 B: People, Achievements, Careers, News, NotFound

## PHASE 2 — 검증
- [ ] AGENT-REVIEW: CHECKLIST 전 항목 + App.jsx 조립 + vercel.json

## 데이터 갭 (사용자 확인 필요)
- [!] 교수 개별 사진: 미보유 → 이니셜 플레이스홀더로 v1 출시, 사진 확보 시 교체
- [!] 수상 실적 원문 중 2021~2025 구간: source_content.md에서 확인 후 이관 (원문에 있는 것만)
- [!] 재학생·전체 수치(재학생 수 등): 공식 수치 미보유 → Stats에 미포함 유지
- [ ] OG 이미지 1600x840: 03_ASSET_PROMPTS.md B4로 제작 후 public/og.png

## 배포
- [ ] Vercel 연결, 도메인, vercel.json 리라이트
- [ ] Lighthouse: 모바일 Performance 90+, A11y 100 목표