// DAH API 서버 진입점. 앱 구성은 src/app.js(createApp), DB는 src/db.js. 12_BACKEND.md 참조.
import 'dotenv/config'
import { createApp } from './app.js'
import { isConfigured } from './db.js'

const PORT = process.env.PORT || 4000
const app = createApp()

app.listen(PORT, () => {
  console.log(`[dah-server] listening on :${PORT}`)
  if (!isConfigured()) {
    console.warn('[dah-server] DATABASE_URL 미설정 — /health만 동작합니다. server/.env를 확인하세요.')
  }
})
