// scripts/migrate-phase15.mjs — Phase 15 마이그레이션 (27_I18N: 수동 영문 본문/제목 컬럼)
// 실행: 통합 담당자가 배포 Neon DB에 대해 server/ 안에서 `node scripts/migrate-phase15.mjs`. 멱등.
// - posts.body_en (영문 리치 본문, jsonb)
// - exhibitions.title_en·intro_en (text), exhibitions.body_en (jsonb)
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[migrate-phase15] DATABASE_URL이 없습니다.')
  process.exit(1)
}
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

async function main() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS body_en JSONB')
    await client.query('ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS title_en TEXT')
    await client.query('ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS intro_en TEXT')
    await client.query('ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS body_en JSONB')
    await client.query('COMMIT')
    console.log('[migrate-phase15] posts.body_en · exhibitions.title_en·intro_en·body_en 컬럼 추가 완료')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[migrate-phase15] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}
main()
