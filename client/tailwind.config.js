import {
  colors,
  typography,
  spacing,
  layout,
  shadow,
  motion,
  glass,
  cosmos,
} from './src/styles/tokens.js'

const px = (n) => `${n}px`

// spacing.scale 배열 → { 4: '4px', 8: '8px', … }
const spacingScale = Object.fromEntries(spacing.scale.map((n) => [n, px(n)]))

// typography.size 평탄화: displayXL: [48,128] → 'display-xl-m': '48px', 'display-xl-d': '128px'
const kebab = (k) => k.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

// K2-14 유동 타이포: -d 값을 clamp(m, 뷰포트 선형 보간, d)로 재정의.
// 390(모바일 기준)~1440(데스크탑 기준) 구간을 연속 보간해 브레이크포인트 점프 제거.
// 호출부(-m/-d 클래스)는 그대로 — 원리 주석은 tokens.js typography.size 참조.
const fluid = (m, d) =>
  m === d
    ? px(d)
    : `clamp(${m}px, calc(${m}px + ${d - m} * ((100vw - 390px) / 1050)), ${d}px)`

const fontSize = {}
for (const [name, [m, d]] of Object.entries(typography.size)) {
  fontSize[`${kebab(name)}-m`] = px(m)
  fontSize[`${kebab(name)}-d`] = fluid(m, d)
}
// Stat 수치 보강 (F1: displayXL 중간단계는 스케일 하향으로 폐기, m/d 2단계만)
Object.assign(fontSize, {
  'stat-m': px(32),
  'stat-d': fluid(32, 48),
})

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: Object.fromEntries(
      Object.entries(layout.breakpoints).map(([k, v]) => [k, px(v)])
    ),
    extend: {
      colors: {
        ...colors,
        // v2 글래스 표면: bg-glass-bg / bg-glass-strong / border-glass-line
        glass: { bg: glass.bg, strong: glass.bgStrong, line: glass.border },
        // v2 우주 배경: bg-cosmos-depth0 / bg-cosmos-depth1 / text-cosmos-star
        cosmos: { depth0: cosmos.depth0, depth1: cosmos.depth1, star: cosmos.star },
      },
      backdropBlur: {
        glass: glass.blur,
        'glass-mobile': glass.blurMobile,
      },
      backgroundImage: {
        'glass-highlight': glass.highlight,
        nebula: cosmos.nebula,
        // 섹션·전역 배경 성운 글로우(비대칭 배치용). 좌상 보라 / 우하 딥 퍼플. (청록 폐기, CI 4.1)
        'nebula-violet': `radial-gradient(ellipse 60% 50% at 15% 0%, ${cosmos.accentViolet}, transparent 70%)`,
        'nebula-deep': `radial-gradient(ellipse 55% 45% at 85% 100%, ${cosmos.accentDeep}, transparent 70%)`,
        // 별 제거 허전함 보정용 중앙 상단 초저채도 보강 글로우(#C8B9F2 Light Purple, 상한 0.03)
        'nebula-soft': 'radial-gradient(ellipse 70% 50% at 50% 22%, rgba(200,185,242,0.03), transparent 65%)',
      },
      fontFamily: {
        display: typography.family.display,
        sans: typography.family.sans,
        mono: typography.family.mono,
      },
      fontSize,
      fontWeight: typography.weight,
      lineHeight: typography.leading,
      letterSpacing: typography.tracking,
      spacing: {
        ...spacingScale,
        'section-m': px(spacing.section.mobile),
        // K2-14: 섹션 수직 패딩도 96→160 점프 대신 뷰포트 선형 보간(원리는 fluid()와 동일)
        'section-d': fluid(spacing.section.mobile, spacing.section.desktop),
        'gutter-m': px(spacing.gutter.mobile),
        'gutter-t': px(spacing.gutter.tablet),
        'gutter-d': px(spacing.gutter.desktop),
        header: px(layout.headerHeight.default),
        'header-s': px(layout.headerHeight.shrunk),
      },
      maxWidth: {
        container: px(spacing.container.desktop),
        'container-wide': px(spacing.container.wide),
      },
      borderRadius: {
        sm: px(layout.radius.sm),
        md: px(layout.radius.md),
        lg: px(layout.radius.lg),
        glass: px(glass.radius),
        full: px(layout.radius.full),
      },
      boxShadow: {
        'card-glow': shadow.cardGlow,
        'card-glow-hover': shadow.cardGlowHover,
        // X2·X3(33_PHASE18): 버튼 질감·글래스 위계 (토큰 경유, JSX 하드코딩 금지)
        btn: shadow.btnPrimary,
        'btn-hover': shadow.btnPrimaryHover,
        glass: shadow.glassPanel,
        'glass-hover': shadow.glassPanelHover,
        // A4(36_ACCENT_POLISH): 카드 공용 글로우 (기본 잔광 / hover 상승)
        'glow-card': shadow.glowCard,
        'glow-card-hover': shadow.glowCardHover,
      },
      transitionTimingFunction: {
        out: motion.ease,
      },
      transitionDuration: motion.duration,
    },
  },
  plugins: [],
}
