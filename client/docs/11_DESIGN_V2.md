# 11_DESIGN_V2 — 디자인 시스템 v2 (DESIGN.md 위에 덮어쓰는 변경분)

컨셉 확정: "무한한 우주(Infinite Cosmos)". 모든 페이지가 우주 공간에 떠 있는 유리 패널이라는 세계관. 표면 언어는 Apple HIG 글래스모피즘 + 리퀴드 글래스. 구조·인터랙션 문법은 KPC에서 흡수하되 색·질감은 전부 우리 것.

## 1. KPC에서 흡수하는 것 (실측 기준)

| KPC 요소 | 우리 이식처 |
|---|---|
| 풀폭 메가메뉴 (호버 시 하위 그리드 펼침) | Header 데스크탑 |
| SERVICE 마스터-디테일 (좌 카테고리 hover → 우 패널 전환 + VIEW MORE) | 홈 프로그램 섹션, 교육과정 트랙 섹션 |
| 게시판 문법 (총 N건 + 검색 + 번호/제목/작성자/날짜 + 페이지네이션) | 공지사항, 자료실. 단 테이블을 글래스 리스트 행으로 재해석 |
| 서브페이지 PageBanner + 브레드크럼 + 사이드탭 | 전 서브페이지 공통 골격 |
| ENG 토글 + 유틸바 위치 | 헤더 우측 |
| 스탯 카운트업 (2,000 / 60,000 / 400,000) | 홈·About 수치 |
| 히어로 슬라이드 | 채택 안 함. 우리 OrbitCanvas 히어로 유지 (사용자 확정) |

## 2. 글래스 토큰 (tokens.js에 추가)

```js
export const glass = {
  bg: 'rgba(255,255,255,0.06)',
  bgStrong: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.14)',
  highlight: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 40%)',
  blur: '20px',        // backdrop-filter: blur(20px) saturate(160%)
  blurMobile: '12px',
  radius: 20,
};
export const cosmos = {
  depth0: '#050607',   // 심우주 (페이지 최하층)
  depth1: '#08090A',   // 기존 base 유지
  nebula: 'radial-gradient(ellipse at var(--x) var(--y), rgba(255,255,255,0.04), transparent 60%)',
  star: 'rgba(247,248,248,0.9)',
};
```

성능 규칙: backdrop-filter 활성 레이어 동시 최대 3개. 모바일은 blurMobile. 스크롤 컨테이너 내부 글래스 남발 금지. will-change 사용은 Header·GlassDock 2곳만.

## 3. 폰트 교체 (Anton 폐기)

사용자 판정: 두껍고 찌그러진 컨덴스드 불호. 교체안:

| 역할 | v1 | v2 확정 |
|---|---|---|
| EN 디스플레이 | Anton | Space Grotesk 500·700 (Google Fonts, variable). 기하학적·우주 무드, 컨덴스드 아님 |
| KR 전체 | Pretendard | 유지. 헤드라인 700(800 남발 금지) |
| 유틸리티 | IBM Plex Mono | 유지 |

대안(사용자가 Space Grotesk도 별로면): Clash Display(Fontshare CDN). tokens.js typography.family.display만 교체하면 전파되도록 유지.
displayXL 스케일 하향: 48→104(기존 128은 Space Grotesk에서 과대). letter-spacing -0.02em.

## 4. 우주 배경 시스템

- 레이어: cosmos.depth0 바탕 → StarField(Canvas, 정적 별 + 미세 트윙클, 파티클 200 이하, 스크롤 패럴랙스 0.2배) → 콘텐츠
- StarField는 전 페이지 공통 1개 인스턴스(App 레벨). 페이지별 재마운트 금지
- PageBanner마다 성운(nebula) 그라디언트 위치 변수만 다르게 → "같은 우주, 다른 좌표" 연출
- prefers-reduced-motion: 트윙클·패럴랙스 정지, 정적 렌더 유지

## 5. 인터랙션 문법

- 다이나믹 아일랜드 원리: 요소가 필요 시 부풀어 콘텐츠를 드러냄. 적용처 3곳 한정: (1) 모바일 GlassDock (2) 헤더 알림 필(전시회 접수 기간) (3) 공유 버튼 → 펼침
- 마스터-디테일 전환: 우측 패널 crossfade 200ms + 미세 translateY. KPC처럼 즉답성 우선, 화려한 전환 금지
- hover 리빌: 홈 프로그램 카드 hover 시 포스터 미리보기 부상(opacity+scale 1.0 고정, translateY만)
- 카드 글래스: 기본 glass.bg, hover 시 bgStrong + border 강화 + highlight 스윕 1회

## 6. 모바일 헤더 — GlassDock (햄버거 폐기)

- 위치: 하단 고정, safe-area 대응. 형태: 리퀴드 글래스 필(높이 56, 라운드 full)
- 접힘: 로고 + 현재 페이지명 + 메뉴 점 3개
- 탭: 필이 위로 확장(스프링 320ms)되며 6개 메뉴 + EN/로그인 세로 노출. 바깥 탭·스와이프 다운으로 수축
- 상단에는 로고+로그인만 있는 초슬림 바(투명→스크롤 시 글래스)
- 키보드 접근성: 확장 시 포커스 트랩, ESC 수축

## 7. 반응형 확장 (4K·32인치)

- 브레이크포인트 확장: 3xl 1920 / 4xl 2560 / 5xl 3840
- 컨테이너: xl 1280 → 3xl 1440 → 4xl 1680 → 5xl 1920 상한. 그 이상은 여백 확장
- 폰트 fluid: displayXL 이상만 clamp(48px, 5vw, 104px)로 4K에서 자연 확대
- StarField·이미지: dpr 2 상한 유지(4K 성능), 포스터 이미지 srcset 3단(800/1600/2400)

## 8. 가로 스크롤 박멸 규칙 (전역)

- html,body: overflow-x clip
- 전 텍스트: break-keep + overflow-wrap anywhere(국문 어절 보존, URL·영단어 강제 줄바꿈)
- flex·grid 자식 min-w-0 필수, 고정 width 금지(max-w만)
- 표·코드·긴 링크는 해당 블록만 overflow-x auto 스크롤 컨테이너
- 리뷰 단계에서 320px 전 페이지 가로 스크롤 0 검증 필수

## 9. 로고 슬롯

- 사용자 보유 SVG를 src/assets/logo.svg로 배치(자리 예약, 내용은 사용자가 교체)
- 사용처: Header 좌측(높이 28), GlassDock, favicon(별도 favicon.svg로 단순화 버전), OG 이미지, 로딩 인디케이터(로고 stroke draw 애니메이션 1.2s)
- 로고 인터랙션: Header 로고 hover 시 stroke 미세 글로우. 그 외 변형 금지

## 10. 학생 성과 전용 디자인 — "성좌(Constellation)"

일반 게시판 금지(사용자 확정). 수상 실적을 우주 컨셉의 성좌로 시각화:
- 연도별 수상들이 별(노드)로 떠 있고 같은 대회·같은 팀 수상이 헤어라인으로 연결
- 별 hover 시 글래스 팝오버(수상명·수상자·주최·연도), 클릭 시 상세
- 하단에 동일 데이터의 접근성 리스트 뷰 병행(스크린리더·모바일 기본)
- 구현: SVG + 자체 좌표 배치(라이브러리 금지), 노드 수 100 이하 전제

## 11. 유지 항목

모노크롬 원칙(액센트 0), 그레이 3단, 헤어라인, 4pt 간격, lucide-react, 접근성 AA, 이모지 금지, localStorage 금지, 명사형 제목. v1 DESIGN.md와 충돌 시 이 문서가 우선.