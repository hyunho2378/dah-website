import {
  colors,
  typography,
  spacing,
  layout,
  shadow,
  motion,
} from './src/styles/tokens.js'

const px = (n) => `${n}px`

// spacing.scale 배열 → { 4: '4px', 8: '8px', … }
const spacingScale = Object.fromEntries(spacing.scale.map((n) => [n, px(n)]))

// typography.size 평탄화: displayXL: [48,128] → 'display-xl-m': '48px', 'display-xl-d': '128px'
const kebab = (k) => k.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const fontSize = {}
for (const [name, [m, d]] of Object.entries(typography.size)) {
  fontSize[`${kebab(name)}-m`] = px(m)
  fontSize[`${kebab(name)}-d`] = px(d)
}
// COMPONENTS.md 명시 단계 보강 — displayXL 반응형 중간값(§5), Stat 수치(§Stat.jsx)
Object.assign(fontSize, {
  'display-xl-sm': px(56),
  'display-xl-md': px(80),
  'display-xl-lg': px(104),
  'stat-m': px(40),
  'stat-d': px(72),
})

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: Object.fromEntries(
      Object.entries(layout.breakpoints).map(([k, v]) => [k, px(v)])
    ),
    extend: {
      colors,
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
        'section-d': px(spacing.section.desktop),
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
        full: px(layout.radius.full),
      },
      boxShadow: {
        'card-glow': shadow.cardGlow,
        'card-glow-hover': shadow.cardGlowHover,
      },
      transitionTimingFunction: {
        out: motion.ease,
      },
      transitionDuration: motion.duration,
    },
  },
  plugins: [],
}
