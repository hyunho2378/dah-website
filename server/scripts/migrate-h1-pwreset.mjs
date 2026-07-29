// scripts/migrate-h1-pwreset.mjs — H1-7 (37_SHEET_ROADMAP AGENT-H1). 멱등.
// 실행: 통합 담당자가 배포 Neon DB에 `node scripts/migrate-h1-pwreset.mjs`.
// 서버 배포보다 먼저 실행해야 한다 — POST /admin/exhibition/entries/:id/reset-password가
// 아래 두 컬럼에 초기화 이력(누가·언제)을 기록한다.
//
// exhibition_entries.pw_reset_at  TIMESTAMPTZ — 마지막 초기화 시각
// exhibition_entries.pw_reset_by  TEXT        — 초기화를 실행한 관리자 이메일
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[migrate-h1-pwreset] DATABASE_URL이 없습니다.')
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

    await client.query(
      'ALTER TABLE exhibition_entries ADD COLUMN IF NOT EXISTS pw_reset_at TIMESTAMPTZ'
    )
    await client.query('ALTER TABLE exhibition_entries ADD COLUMN IF NOT EXISTS pw_reset_by TEXT')

    await client.query('COMMIT')
    console.log('[migrate-h1-pwreset] exhibition_entries.pw_reset_at·pw_reset_by 준비 완료')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[migrate-h1-pwreset] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}
main()
