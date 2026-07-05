// tokens.js — DAH 웹사이트 디자인 토큰 (단일 진실 소스)
// 모든 색상·타이포·간격은 이 파일만 참조한다. 하드코딩 금지.

export const colors = {
  // 배경 (Linear 근흑 계열, 순수 #000 금지)
  bg: {
    base: '#08090A',      // 페이지 기본 배경
    elev: '#101113',      // 카드/패널 승격 배경
    panel: '#16171A',     // 다이어그램 내부, 인풋
    invert: '#F7F8F8',    // 반전 블록 (사용 최소화)
  },
  // 텍스트 (그레이 3단 위계)
  text: {
    pri: '#F7F8F8',       // 헤드라인, 본문 강조
    sec: '#8A8F98',       // 본문 보조, 설명
    meta: '#5C6066',      // 캡션, 날짜, eyebrow 비활성
    invert: '#08090A',    // 화이트 필 버튼 위 텍스트
  },
  // 보더 (헤어라인 시스템)
  border: {
    subtle: 'rgba(255,255,255,0.08)',  // 기본 카드/구분선
    strong: 'rgba(255,255,255,0.16)',  // hover, 활성 상태
    focus: '#F7F8F8',                   // 키보드 포커스 링
  },
  // 액센트 없음. 모노크롬 원칙. 상태 컬러만 최소 보유.
  state: {
    error: '#FF6369',
    success: '#4CC38A',
  },
};

export const typography = {
  family: {
    display: "'Anton', 'Pretendard Variable', sans-serif",        // EN 초대형 캡스 전용
    sans: "'Pretendard Variable', Pretendard, -apple-system, sans-serif", // KR 전체 + EN 본문
    mono: "'IBM Plex Mono', monospace",                            // 넘버링, 라벨, 날짜
  },
  // 사이즈 [모바일, 데스크탑] px — Tailwind에서 clamp 또는 md: 브레이크로 매핑
  size: {
    displayXL: [48, 128],  // 히어로 EN 캡스 (Anton)
    displayL: [40, 96],    // 최종 CTA, 페이지 타이틀 EN
    h1: [32, 56],          // 섹션 헤드 KR (Pretendard 800)
    h2: [24, 40],
    h3: [20, 28],
    bodyL: [16, 18],
    body: [15, 16],
    small: [13, 14],
    caption: [12, 12],
    label: [11, 12],       // eyebrow, mono 라벨 (letter-spacing 0.12em, uppercase)
  },
  weight: { black: 900, extrabold: 800, bold: 700, semibold: 600, regular: 400 },
  leading: { tight: 1.05, snug: 1.2, normal: 1.5, relaxed: 1.7 },
  tracking: { display: '-0.01em', normal: '0', label: '0.12em' },
};

export const spacing = {
  // 4pt 배수
  scale: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160],
  section: { mobile: 96, desktop: 160 },   // 섹션 수직 패딩
  container: { desktop: 1280, wide: 1440 }, // 콘텐츠 최대폭
  gutter: { mobile: 16, tablet: 24, desktop: 32 },
};

export const layout = {
  breakpoints: { xs: 320, sm: 390, md: 768, lg: 1024, xl: 1280, '2xl': 1440, '3xl': 1920, '4xl': 2560 },
  radius: { sm: 6, md: 10, lg: 16, full: 9999 },
  headerHeight: { default: 72, shrunk: 56 },
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