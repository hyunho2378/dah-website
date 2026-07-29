// scripts/migrate-h2-consult-email.mjs — H2-5(37_SHEET_ROADMAP). 멱등.
// 실행: 통합 담당자가 배포 Neon DB에 `node scripts/migrate-h2-consult-email.mjs`.
//
// 상담 신청에 이메일 필수 입력이 추가됐다(해외 지원자 회신 경로).
// consultations.email 컬럼을 추가한다. 기존 행은 NULL로 남는다 —
// NOT NULL 제약은 걸지 않는다(과거 신청분에는 이메일이 없다).
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[migrate-h2-consult-email] DATABASE_URL이 없습니다.')
  process.exit(1)
}
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL)
    ? false
    : { rejectUnauthorized: false },
})

async function main() {
  const client = await pool.connect()
  try {
    await client.query('ALTER TABLE consultations ADD COLUMN IF NOT EXISTS email TEXT')
    console.log('[migrate-h2-consult-email] consultations.email 컬럼 추가 완료')
  } catch (err) {
    console.error('[migrate-h2-consult-email] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
