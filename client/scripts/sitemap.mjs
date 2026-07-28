// sitemap.mjs — sitemap.xml·robots.txt 빌드 시 생성 (40_SITEMAP)
// public/ 파일은 Vite가 dist/로 그대로 복사만 하므로(HTML 템플릿 치환 미적용) —
// 이 스크립트가 vite build 직전에 실제 도메인으로 두 파일을 직접 써서 public/에 둔다.
// 실행: package.json "build" 스크립트가 vite build 전에 자동 호출한다(수동 실행도 가능).
//
// 도메인: VITE_SITE_URL 환경변수(37_OG와 동일 키, vite.config.js와 동일 폴백 규칙)로
// 관리한다. 미설정 시 실제 배포 도메인(https://dah-hallym.vercel.app, 사용자 확정값)으로
// 폴백해 최소한 정확한 URL이 나가도록 한다.
//
// 동적 콘텐츠(개별 공지·전시회 상세 등 :id 라우트)는 이번 스코프에서 제외 — 정적 주요
// 페이지만(App.jsx PUBLIC_ROUTES 기준, 어드민·접수·상담 폼 등 비콘텐츠 라우트도 제외).
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CLIENT_DIR = resolve(__dirname, '..')
const FALLBACK_SITE_URL = 'https://dah-hallym.vercel.app'

const env = loadEnv(process.env.NODE_ENV || 'production', CLIENT_DIR, '')
const SITE_URL = (env.VITE_SITE_URL || FALLBACK_SITE_URL).trim().replace(/\/+$/, '')

if (!env.VITE_SITE_URL) {
  console.warn(
    `[sitemap] VITE_SITE_URL 미설정 — 폴백 도메인(${FALLBACK_SITE_URL})으로 생성합니다. ` +
      '실제 배포 도메인이 다르면 Vercel 환경변수에 VITE_SITE_URL을 설정하세요.'
  )
}

// changefreq·priority는 SEO 관례상 참고값(검색엔진이 강제로 따르진 않음) — 갱신 빈도
// 체감에 맞춰 대략적으로만 구분한다.
const PAGES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/about/people', changefreq: 'monthly', priority: '0.6' },
  { path: '/about/ci', changefreq: 'yearly', priority: '0.4' },
  { path: '/curriculum', changefreq: 'monthly', priority: '0.8' },
  { path: '/curriculum/codesharing', changefreq: 'monthly', priority: '0.6' },
  { path: '/curriculum/nanodegree', changefreq: 'monthly', priority: '0.6' },
  { path: '/programs/exhibitions', changefreq: 'weekly', priority: '0.8' },
  { path: '/programs/contests', changefreq: 'weekly', priority: '0.7' },
  { path: '/programs/lectures', changefreq: 'weekly', priority: '0.7' },
  { path: '/students/council', changefreq: 'yearly', priority: '0.5' },
  { path: '/students/clubs', changefreq: 'monthly', priority: '0.6' },
  { path: '/students/achievements', changefreq: 'monthly', priority: '0.6' },
  { path: '/students/careers', changefreq: 'monthly', priority: '0.6' },
  { path: '/showcase', changefreq: 'weekly', priority: '0.6' },
  { path: '/news', changefreq: 'daily', priority: '0.8' },
  { path: '/resources', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
]

const urls = PAGES.map(
  (p) =>
    `  <url>\n` +
    `    <loc>${SITE_URL}${p.path}</loc>\n` +
    `    <changefreq>${p.changefreq}</changefreq>\n` +
    `    <priority>${p.priority}</priority>\n` +
    `  </url>`
).join('\n')

const sitemapXml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  `${urls}\n` +
  '</urlset>\n'

const robotsTxt =
  'User-agent: *\n' +
  'Allow: /\n' +
  'Disallow: /admin\n' +
  '\n' +
  `Sitemap: ${SITE_URL}/sitemap.xml\n`

writeFileSync(resolve(CLIENT_DIR, 'public/sitemap.xml'), sitemapXml)
writeFileSync(resolve(CLIENT_DIR, 'public/robots.txt'), robotsTxt)

console.log(`[sitemap] public/sitemap.xml 생성 완료 (${PAGES.length}개 URL, SITE_URL=${SITE_URL})`)
console.log('[sitemap] public/robots.txt 생성 완료')
