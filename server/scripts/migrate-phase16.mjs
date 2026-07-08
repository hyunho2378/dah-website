// scripts/migrate-phase16.mjs — Phase 16 (28_PHASE14 S3-1: 상담 필드 학년·주전공·복수전공)
// 실행: 통합 담당자가 배포 Neon DB에 `node scripts/migrate-phase16.mjs`. 멱등.
// company 컬럼은 기존 데이터 보존 위해 유지(신규 접수는 미사용).
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[migrate-phase16] DATABASE_URL이 없습니다.')
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
    await client.query('ALTER TABLE consultations ADD COLUMN IF NOT EXISTS grade TEXT')
    await client.query('ALTER TABLE consultations ADD COLUMN IF NOT EXISTS main_major TEXT')
    await client.query('ALTER TABLE consultations ADD COLUMN IF NOT EXISTS double_major TEXT')
    await client.query('COMMIT')
    console.log('[migrate-phase16] consultations.grade·main_major·double_major 컬럼 추가 완료')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[migrate-phase16] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}
main()
