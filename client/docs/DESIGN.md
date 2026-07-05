# DESIGN.md — 한림대 디지털인문예술전공(DAH) 웹사이트

플랫폼: B형 반응형 웹. 320px~2560px 전 구간 대응. Mobile First.
컨셉 한 줄: Wpromote의 선언형 구조 위에 Linear의 근흑 표면을 입힌 모노크롬 학과 사이트.
시그니처: 히어로 OrbitCanvas(노드 궤도 캔버스) 단 하나. 나머지 전부 절제.

## 1. 컬러 팔레트 (tokens.js가 원본, 여기는 역할 정의)

| 토큰 | HEX | 역할 |
|---|---|---|
| bg.base | #08090A | 페이지 전체 배경. 순수 #000 사용 금지 |
| bg.elev | #101113 | 카드, 패널 |
| bg.panel | #16171A | 다이어그램 내부, 코드블록 |
| bg.invert | #F7F8F8 | 반전 블록. 홈 최종 CTA 1곳만 허용 |
| text.pri | #F7F8F8 | 헤드라인, 강조 본문 |
| text.sec | #8A8F98 | 본문, 설명 |
| text.meta | #5C6066 | 날짜, 캡션, 비활성 라벨 |
| border.subtle | rgba(255,255,255,0.08) | 기본 헤어라인, 카드 보더 |
| border.strong | rgba(255,255,255,0.16) | hover, 활성 |
| state.error / success | #FF6369 / #4CC38A | 폼 상태 전용. 장식 사용 금지 |

액센트 컬러 없음. 위계는 컬러가 아니라 타이포 스케일, 그레이 3단, 여백, 헤어라인으로만 만든다. 임의 색상 추가 즉시 반려.

## 2. 타이포그래피

| 역할 | 폰트 | 규칙 |
|---|---|---|
| Display (EN 캡스) | Anton | 히어로, 페이지 타이틀, 최종 CTA의 영문 대문자 전용. 한글 조합 금지 |
| 전체 기본 | Pretendard Variable | KR 헤드라인은 800, 본문 400 |
| 유틸리티 | IBM Plex Mono | 섹션 넘버("01"), eyebrow, 날짜, 스탯 숫자 |

로드: index.html에서 CDN. Pretendard(jsdelivr), Anton+IBM Plex Mono(Google Fonts). generic sans-serif, system-ui 단독 지정 금지.

스케일(모바일→데스크탑): displayXL 48→128 / displayL 40→96 / h1 32→56 / h2 24→40 / h3 20→28 / bodyL 16→18 / body 15→16 / small 13→14 / caption 12 / label 11→12(uppercase, tracking 0.12em).

3단 위계 규칙(전 섹션 공통, Wpromote 이식): mono eyebrow → 대형 헤드라인 → sec 본문. 이 순서를 모든 섹션 도입부에서 반복한다.

## 3. 간격·그리드

- 4pt 배수만 사용: 4/8/12/16/20/24/32/40/48/64/80/96/128/160
- 섹션 수직 패딩: 모바일 96, 데스크탑 160
- 컨테이너: 데스크탑 max 1280, 1920px 이상 max 1440, 중앙 정렬
- 그리드: 모바일 4컬럼 마진16 거터8 / 태블릿 8컬럼 마진24 거터16 / 데스크탑 12컬럼
- 섹션 구분: 배경색 전환 금지. border.subtle 1px 헤어라인 또는 여백으로만 (Linear 규칙)

## 4. 컴포넌트 스타일 규칙

- 카드: bg.elev, radius 10, border.subtle 1px. hover 시 border.strong + 배경 미세 상승. scale 변형 금지
- 버튼 Primary: bg #F7F8F8, 텍스트 #08090A, radius 6, hover 시 배경 살짝 감광. 버튼 Secondary: 투명 배경 + border.subtle, hover 시 border.strong
- 링크: 텍스트 + 화살표(→), hover 시 언더라인이 좌→우로 그려지는 애니메이션(250ms)
- 모달: 모바일 바텀시트, 데스크탑 중앙 다이얼로그 max 560
- 포커스: 모든 인터랙티브 요소에 focus-visible 2px #F7F8F8 아웃라인(offset 2px) 필수
- cursor: pointer 명시, transition 150~300ms ease

## 5. 모션 규칙

- 스크롤 리빌: opacity 0→1 + translateY 24→0, 600ms, cubic-bezier(0.22,1,0.36,1). IntersectionObserver 자체 훅(useReveal). 외부 애니메이션 라이브러리 도입 금지
- 그리드 스태거: 아이템당 80ms 지연, 최대 6개까지만 지연 적용
- 헤더: 스크롤 80px 이후 높이 72→56 축소 + bg.base/80 blur 배경
- prefers-reduced-motion: 모든 모션 제거, OrbitCanvas는 정적 SVG로 교체. 필수 구현
- OrbitCanvas: 순수 Canvas 2D + rAF. 마우스 위치에 미세 반응(패럴랙스 최대 16px). 파티클 수는 뷰포트 폭 비례(모바일 최대 40개). 라이브러리 금지

## 6. 아이콘 라이브러리

기본 사용 (필수)
- lucide-react — https://lucide.dev — 모든 인터페이스 아이콘은 여기서만 가져온다.

보조 허용 (사용 시 사용자 사전 승인 필요)
- Bootstrap Icons, react-icons, Heroicons

규칙
- 한 페이지 내 아이콘 라이브러리 혼용 금지. 보조 도입 시 해당 페이지 전체 통일
- AGENT 임의 보조 라이브러리 도입 금지. 사용자 승인 후에만
- 사이즈 16/20/24/32/48 다섯 단계만. 임의 사이즈 금지
- 색상은 text.pri / text.sec / text.meta / text.invert 토큰만

## 7. 일러스트·에셋

- 아이소메트릭 오브젝트(정체성 3열 카드): 03_ASSET_PROMPTS.md로 제작한 이미지 또는 SVG 와이어프레임. 모노크롬만. 다색 금지
- 다이어그램(커리큘럼 로드맵): 인라인 SVG로 직접 그린다. 이미지 금지. 색은 border/text 토큰만
- 사진(교수, 전시): 흑백 처리(grayscale) 통일, 로드 전 bg.elev 플레이스홀더, aspect-ratio 고정
- unDraw류 다색 일러스트 전면 금지

## 8. 접근성 (WCAG 2.1 AA)

- text.pri on bg.base 대비 약 17:1, text.sec 약 6:1, text.meta는 대형 텍스트/캡션 한정
- 모든 이미지 alt, 아이콘 버튼 aria-label 필수
- 키보드 내비게이션 전 구간, 캔버스 영역 aria-hidden 처리
- 히어로 EN 캡스는 장식이 아니라 실제 헤딩. h1은 페이지당 1개

## 9. 절대 금지

localStorage/sessionStorage, TypeScript, 색상·간격·폰트 하드코딩, 이모지, scale() transform, 임의 색상 추가, 배경 비디오, 외부 애니메이션 라이브러리, 가짜 데이터 생성(스탯·인용 포함)