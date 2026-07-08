// scripts/migrate-phase12.mjs — Phase 12 마이그레이션 (Q2 전시회 CTA 컬럼)
// 실행: server/ 안에서 `node scripts/migrate-phase12.mjs` (server/.env DATABASE_URL). 멱등.
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[migrate-phase12] DATABASE_URL이 없습니다.')
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
    await client.query('ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS cta_show BOOLEAN DEFAULT TRUE')
    await client.query('ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS cta_label TEXT')
    await client.query('ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS cta_url TEXT')
    await client.query('COMMIT')
    console.log('[migrate-phase12] exhibitions cta_show·cta_label·cta_url 컬럼 추가 완료')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[migrate-phase12] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}
main()
