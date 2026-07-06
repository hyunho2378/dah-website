// DAH API 서버 진입점. PHASE 3-0 스캐폴드 — /health만 구현.
// 비즈니스 로직(auth, content, upload 등)은 후속 PHASE에서 추가. 12_BACKEND.md 8절 API 계약 참조.
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = process.env.PORT || 4000

// CORS: 프론트 도메인 화이트리스트 + 쿠키 자격증명 허용 (httpOnly 인증 쿠키용)
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(',').map((s) => s.trim()) || true,
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())

// 슬립 방지 헬스체크 (UptimeRobot 5분 간격 GET). 12_BACKEND.md 0·9절
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'dah-server', uptime: process.uptime() })
})

app.listen(PORT, () => {
  console.log(`[dah-server] listening on :${PORT}`)
})
