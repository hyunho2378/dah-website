// src/app.js — Express 앱 팩토리 (테스트 주입: createApp({ db: mock }))
// 라우트 구성은 12_BACKEND.md 8절 API 계약. DATABASE_URL 미설정 시 /health(및 로컬 업로드 정적
// 서빙)만 동작하고 나머지는 명확한 JSON 에러(완료 조건).
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { isConfigured, setDb } from './db.js'
import authRoutes from './routes/auth.js'
import contentRoutes from './routes/content.js'
import adminRoutes from './routes/admin.js'
import uploadRoutes, { UPLOADS_DIR } from './routes/upload.js'
import submitRoutes from './routes/submit.js'
import settingsRoutes from './routes/settings.js'
import exportRoutes from './routes/export.js'

export function createApp(options = {}) {
  if ('db' in options) setDb(options.db)

  const app = express()
  app.set('trust proxy', 1) // Render 등 리버스 프록시 뒤 — rate limit의 IP 식별용

  // CORS: 프론트 도메인 화이트리스트 + 쿠키 자격증명 (httpOnly 인증 쿠키)
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN?.split(',').map((s) => s.trim()) || true,
      credentials: true,
    })
  )
  app.use(express.json({ limit: '2mb' }))
  app.use(cookieParser())

  // 슬립 방지 헬스체크 (UptimeRobot 5분 간격 GET). DB 없이도 200
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'dah-server', uptime: process.uptime(), db: isConfigured() })
  })

  // Blob 토큰 없는 개발 환경의 로컬 업로드 산출물 서빙
  app.use('/uploads', express.static(UPLOADS_DIR))

  // DATABASE_URL 가드: /health 외 전 엔드포인트 (12_BACKEND 완료 조건)
  app.use((req, res, next) => {
    if (isConfigured()) return next()
    res.status(503).json({
      error: 'DATABASE_URL not configured',
      hint: 'server/.env에 DATABASE_URL(Neon Postgres)을 설정하고 scripts/schema.sql 적용 후 재기동하세요. DB 없이 동작하는 경로는 /health 뿐입니다.',
    })
  })

  app.use('/auth', authRoutes)
  app.use('/content', contentRoutes)
  app.use('/admin/content', adminRoutes)
  app.use('/upload', uploadRoutes)
  app.use('/submit', submitRoutes)
  app.use(settingsRoutes) // GET /settings/public, PUT /admin/settings
  app.use(exportRoutes) // GET /export/all

  app.use((req, res) => res.status(404).json({ error: 'not found' }))

  // 공통 에러 핸들러 — 항상 JSON
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.code === 'DB_NOT_CONFIGURED') {
      return res.status(503).json({
        error: 'DATABASE_URL not configured',
        hint: 'server/.env에 DATABASE_URL을 설정하세요.',
      })
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'file too large', maxBytes: 15 * 1024 * 1024 })
    }
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'invalid JSON body' })
    }
    if (err.status && err.status < 500) {
      return res.status(err.status).json({ error: err.message })
    }
    console.error('[dah-server] unhandled error:', err)
    res.status(500).json({ error: 'internal server error' })
  })

  return app
}
