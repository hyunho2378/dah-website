# 15_PHASE3_PROMPTS — 세션 헤더 + 병렬 실행

## SESSION_HEADER (모든 프롬프트 맨 앞에 복붙, 사용자 요청 고정문)

```
아래 작업을 순서대로 실행해라.
세션 시작. 작업 전 아래 파일을 순서대로 전부 읽어라.
1. CLAUDE.md
2. docs/DESIGN.md 와 docs/11_DESIGN_V2.md (충돌 시 V2 우선)
3. src/styles/tokens.js
4. docs/10_IA_V2.md
5. docs/14_ROUTES_V2.md
6. docs/COMPONENTS.md
7. docs/PATTERNS.md
8. docs/PROGRESS.md
9. AGENTS.md
추가 규칙: docs/12_BACKEND.md, docs/13_CMS_SPEC.md는 담당 영역이 백엔드·CMS일 때 필수.
JSX만, TypeScript 금지, localStorage 금지(인증은 httpOnly 쿠키), 이모지 금지,
하드코딩 금지(tokens 경유), 명사형 제목, 비로그인 화면에 편집 UI 미렌더.
완료 시 PROGRESS.md 자기 항목만 갱신.
```

## 사전 1회 작업 (병렬 전, 단독 실행)

SESSION_HEADER +
```
PHASE 3 준비 작업.
1. dah-web-kit-v2의 md 5개(10~14)를 client/docs/로 복사 배치
2. tokens.js에 glass·cosmos 토큰 추가, typography.family.display를
   Space Grotesk로 교체(index.html 폰트 로드 교체: Anton 제거,
   Space Grotesk 500·700 추가), displayXL 상한 104로 조정
3. tailwind.config.js에 glass·cosmos·5xl(3840) 매핑 추가
4. 전역 가로스크롤 박멸: index.css에 overflow-x clip, break-keep,
   min-w-0 유틸 규칙 반영(11_DESIGN_V2 8절)
5. 루트에 server/ 디렉토리 스캐폴드: Express + pg + bcrypt + jsonwebtoken
   + multer, /health 라우트, .env.example(DATABASE_URL, JWT_SECRET,
   BLOB_READ_WRITE_TOKEN, CLIENT_ORIGIN). 아직 비즈니스 로직 금지
6. src/assets/logo.svg 자리 생성(임시 단순 도형, 주석 "사용자 SVG로 교체")
7. npm run dev 회귀 확인 후 PROGRESS.md에 PHASE 3-0 완료 기록
```

## PHASE 3 병렬 (6 에이전트, Task 도구 동시 실행)

각 에이전트 지시문 맨 앞에 SESSION_HEADER를 그대로 포함시켜라.

### AGENT-B1 — 백엔드 전체
```
담당: server/ 전부. 12_BACKEND.md가 명세다.
스키마 마이그레이션 SQL(scripts/schema.sql), 시드(scripts/seed.mjs가
src/data를 읽어 주입), 인증(쿠키 JWT, 온보딩 비번 설정), 콘텐츠 CRUD
권한 매트릭스, 업로드(WebP 변환·리사이즈), 전시회 접수·수정(기간 서버
검증, readonly 필드 보호), 쇼케이스 제출·승인, settings, export.
완료 조건: 로컬 postgres 없이도 기동 시 명확한 env 에러 안내,
supertest 스모크(auth, 권한 거부, 기간 차단) 통과.
```

### AGENT-B2 — 디자인 시스템 v2 코어
```
담당: 글래스·우주 파운데이션. 11_DESIGN_V2가 명세다.
StarField(App 레벨 1개), GlassCard·GlassPill·PageBanner(성운 좌표 변주),
Header 메가메뉴(KPC 문법), GlassDock(모바일, 다이나믹 아일랜드 확장,
포커스 트랩), ShareButton(확장 필), LangToggle, 로고 슬롯 통합,
기존 common 컴포넌트의 글래스 스킨 마이그레이션.
Anton 잔재 전수 제거. 성능 규칙(blur 레이어 3개 상한) 준수.
```

### AGENT-B3 — 어드민·에디터
```
담당: /admin 전부 + Tiptap 에디터 + 렌더러. 13_CMS_SPEC이 명세다.
로그인·비번 설정 플로우, 대시보드, 유형별 CRUD 폼(편집 매트릭스 그대로),
Tiptap(볼드류·리스트·임베드 3종·이미지·표) + JSON 렌더러,
인라인 연필·추가 버튼(비로그인 미렌더), 내보내기 버튼.
API는 B1 계약(12_BACKEND 8절) 기준으로 fetch 훅(useApi: credentials
include, 3초 타임아웃 → snapshot 폴백) 작성.
```

### AGENT-B4 — 공개 페이지 재작업 A
```
담당: 홈 v2(KPC 마스터-디테일 프로그램 섹션, 퀵링크, 성과 하이라이트,
히어로 유지+버튼 settings 연동), About 통합(연혁 흡수), 교육과정
(트랙명 변경: 디자인/AI/엔터컬쳐, 로드맵 압축: 세로 밀도 상향·공통기초
최상단 고정·한눈 뷰), 코드쉐어링(HWP 다운로드: public/files/ 정적 배치
+ a download), /en 미러 골격과 i18n 사전 초안.
```

### AGENT-B5 — 공개 페이지 재작업 B
```
담당: 프로그램 3종(전시회·공모전·특강: 포스터 그리드 → T2 상세, 외부
링크 분기), 운영위원회 기수 아카이브(T4), 동아리, 학생 성과 성좌
(SVG 노드+연결+팝오버+접근성 리스트 병행), 진로 통합 페이지,
쇼케이스(그리드·상세 T3·비로그인 제출 폼 16:9 크롭), 전시회 접수
/submit·/submit/edit(기존 Apps Script 필드·readonly 분류 로직 이관),
공지·자료실 KPC 게시판 문법(검색+태그+페이지네이션).
```

### AGENT-BR — 리뷰 (PHASE 3 전체 완료 후 단독)
```
1. App 조립: StarField·Header·GlassDock·Footer·라우트 v2 전체
2. 검증: (a) 비로그인 화면 편집 UI 픽셀 0 (b) 320px 전 페이지 가로
스크롤 0 (c) 3840px 컨테이너 상한 동작 (d) reduced-motion에서 StarField
정지 (e) 접수 기간 로직 서버·클라 이중 검증 (f) blur 레이어 상한
(g) en 미러 폴백 뱃지 (h) Lighthouse 모바일 Perf 85+ A11y 100
3. 발견 사항 [BR] fix 커밋 분리, PROGRESS 갱신, 데이터 갭 보고
```

## 붙이는 순서

사전 1회 작업 → B1~B5 병렬 → BR. 전시회 아카이브 소급 입력과 영문
감수 원고는 코드 완료 후 사용자가 어드민으로 직접 입력(코딩 불필요,
이것이 이 시스템의 존재 이유다).