import {
  colors,
  font,
  size,
  letterSpacing,
  scale,
  spacing,
  radius,
  layout,
  motion,
} from './src/styles/tokens.js'

const px = (n) => `${n}px`

// scale 배열 → { 4: '4px', 8: '8px', … }
const spacingScale = Object.fromEntries(scale.map((n) => [n, px(n)]))

// size 객체 평탄화: displayXL.m → 'display-xl-m': '48px'
const kebab = (k) => k.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const fontSize = {}
for (const [name, steps] of Object.entries(size)) {
  for (const [step, v] of Object.entries(steps)) {
    fontSize[`${kebab(name)}-${step}`] = px(v)
  }
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: layout.breakpoints,
    extend: {
      colors,
      fontFamily: font,
      fontSize,
      letterSpacing,
      spacing: {
        ...spacingScale,
        'section-m': px(spacing.section.mobile),
        'section-d': px(spacing.section.desktop),
      },
      maxWidth: {
        container: px(layout.container.base),
        'container-wide': px(layout.container.wide),
      },
      borderRadius: {
        btn: px(radius.btn),
        card: px(radius.card),
      },
      transitionTimingFunction: {
        out: motion.ease.out,
      },
      transitionDuration: Object.fromEntries(
        Object.entries(motion.duration).map(([k, v]) => [k, `${v}ms`])
      ),
    },
  },
  plugins: [],
}
