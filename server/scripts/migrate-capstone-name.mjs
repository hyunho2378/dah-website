// 기존 교과목 행을 보존한 채, 사용자가 확정한 과목명으로만 갱신한다.
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

try {
  const result = await pool.query(
    `UPDATE curriculum
     SET name_ko = $1
     WHERE name_ko = $2`,
    ['캡스톤디자인:디인예프로젝트', '캡스톤디자인: DAH프로젝트']
  )
  console.log(`[migrate-capstone-name] ${result.rowCount}건 갱신`)
} finally {
  await pool.end()
}
