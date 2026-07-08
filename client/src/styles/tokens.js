// tokens.js — DAH 웹사이트 디자인 토큰 (단일 진실 소스)
// 모든 색상·타이포·간격은 이 파일만 참조한다. 하드코딩 금지.

export const colors = {
  // 배경 (Linear 근흑 계열, 순수 #000 금지)
  bg: {
    base: '#08090A',      // 페이지 기본 배경
    elev: '#101113',      // 카드/패널 승격 배경
    panel: '#16171A',     // 다이어그램 내부, 인풋
    frame: '#202227',     // C1(P10): 투명 PNG 로고 뒤 중성 배경 (elev보다 밝음, 순백 금지)
    invert: '#F7F8F8',    // 반전 블록 (사용 최소화)
  },
  // 텍스트 (그레이 3단 위계)
  text: {
    pri: '#F7F8F8',       // 헤드라인, 본문 강조
    sec: '#8A8F98',       // 본문 보조, 설명
    meta: '#7C8088',      // 캡션, 날짜, eyebrow 비활성 (WCAG AA 4.5:1+)
    invert: '#08090A',    // 화이트 필 버튼 위 텍스트
  },
  // 보더 (헤어라인 시스템)
  border: {
    subtle: 'rgba(255,255,255,0.08)',  // 기본 카드/구분선
    strong: 'rgba(255,255,255,0.16)',  // hover, 활성 상태
    focus: '#F7F8F8',                   // 키보드 포커스 링
    invert: 'rgba(8,9,10,0.12)',        // H6: 밝은 카드 내부 구분선(다크 텍스트 톤)
  },
  // 액센트 없음. 모노크롬 원칙. 상태 컬러만 최소 보유.
  state: {
    error: '#FF6369',
    success: '#4CC38A',
  },
};

export const typography = {
  family: {
    // F1(16_PHASE4): 폰트 전면 통일 — Pretendard 단일화 (Space Grotesk·IBM Plex Mono·Anton 폐기)
    // display/sans/mono 전부 동일 패밀리. mono 사용처는 웨이트+letter-spacing으로 구분.
    display: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
    sans: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
    mono: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
  },
  // 사이즈 [모바일, 데스크탑] px — F1.3 정보 사이트 기준 전면 하향
  // K2-14 유동 타이포 원리: tailwind.config.js가 각 사이즈의 -d 클래스를
  // clamp(모바일px, calc(모바일px + (데스크탑-모바일) * ((100vw - 390px) / (1440 - 390))), 데스크탑px)
  // 로 재정의한다. 390~1440px 구간에서 뷰포트 선형 보간되어 브레이크포인트 점프가 없고,
  // 아래 배열값 [m, d]가 보간의 양 끝점이 된다. 호출부(-m/-d 클래스)는 변경 불필요.
  size: {
    displayXL: [40, 64],
    displayL: [32, 48],
    h1: [26, 36],
    h2: [20, 28],
    h3: [17, 22],
    bodyL: [16, 17],
    body: [15, 16],
    small: [13, 14],
    caption: [12, 12],
    label: [11, 12],       // eyebrow, 라벨 (letter-spacing 0.06em)
  },
  weight: { black: 900, extrabold: 800, bold: 700, semibold: 600, medium: 500, regular: 400 },
  // F1.3 행간: 헤드라인 1.25, 본문 1.7, 리스트 1.6 (+ 기존 키 호환 유지)
  leading: { heading: 1.25, body: 1.7, list: 1.6, tight: 1.05, snug: 1.25, normal: 1.5, relaxed: 1.7 },
  // F1.3 자간: 헤드라인 -0.02em(display), 본문 0(normal). label F1.2 → 0.06em
  tracking: { display: '-0.02em', normal: '0', label: '0.06em' },
};

export const spacing = {
  // 4pt 배수 (K2-4: 운영위 로고 1.5배 스케일용 144 추가)
  scale: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 144, 160],
  section: { mobile: 96, desktop: 160 },   // 섹션 수직 패딩
  container: { desktop: 1280, wide: 1440 }, // 콘텐츠 최대폭
  gutter: { mobile: 16, tablet: 24, desktop: 32 },
};

export const layout = {
  // v2(11_DESIGN_V2 7절): 5xl 3840 추가 (4K·32인치 대응)
  breakpoints: { xs: 320, sm: 390, md: 768, lg: 1024, xl: 1280, '2xl': 1440, '3xl': 1920, '4xl': 2560, '5xl': 3840 },
  // G4(18_PHASE6): 라디우스 전면 4px 통일. full은 알약형(언어 토글·GlassDock)만 허용.
  radius: { sm: 4, md: 4, lg: 4, full: 9999 },
  headerHeight: { default: 72, shrunk: 56 },
};

// v2(11_DESIGN_V2 2절): 유리 패널 표면 언어 (Apple HIG 글래스모피즘)
export const glass = {
  bg: 'rgba(255,255,255,0.06)',
  bgStrong: 'rgba(255,255,255,0.10)',
  border: 'rgba(255,255,255,0.14)',
  highlight: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 40%)',
  blur: '20px',        // backdrop-filter: blur(20px) saturate(160%)
  blurMobile: '12px',
  radius: 4,           // G4: 글래스 카드도 4px 통일
};

// v2: 무한한 우주 배경 시스템
export const cosmos = {
  depth0: '#050607',   // 심우주 (페이지 최하층)
  depth1: '#08090A',   // 기존 base 유지
  nebula: 'radial-gradient(ellipse at var(--x) var(--y), rgba(255,255,255,0.04), transparent 60%)',
  // COSMOS-TONE 5절: 순백 대신 아주 살짝 보라 섞인 오프화이트(구분 안 될 정도)
  star: 'rgba(242,242,252,0.9)',
  // COSMOS-TONE 2절: 히어로 무드 이색조 글로우 — 배경 성운(radial glow)에만 사용.
  // 텍스트·보더·아이콘 사용 금지(모노크롬 유지). 채도는 거의 안 보일 수준(상한 0.06).
  accentViolet: 'rgba(139,127,232,0.05)',
  accentTeal: 'rgba(64,180,160,0.05)',
};

export const shadow = {
  // 다크 배경에서 그림자 대신 보더+글로우
  cardGlow: '0 0 0 1px rgba(255,255,255,0.08)',
  cardGlowHover: '0 0 0 1px rgba(255,255,255,0.16)',
};

export const motion = {
  duration: { fast: '150ms', base: '250ms', slow: '400ms', reveal: '600ms' },
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
  revealDistance: 24, // px, 스크롤 리빌 translateY
  stagger: 80,        // ms, 그리드 아이템 간 지연
};