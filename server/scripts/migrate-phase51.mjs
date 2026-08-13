// scripts/migrate-phase51.mjs — 공모전 회차 분리용 컬럼 추가 (51_CONTEST_SPLIT)
//
// 회차 하나가 곧 post 하나가 되면서, 이전에 body.editions 안에 있던 값 중 셋이
// posts 컬럼으로 올라와야 한다. 나머지(poster_url·title_en·external_url·site_url)는 이미 있다.
// 추가만 한다 — DROP 없음. 실행: server/ 안에서 `node scripts/migrate-phase51.mjs`
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[migrate-51] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

const COLUMNS = [
  ['semester_label', 'TEXT'],
  ['period', 'TEXT'],
  ['host', 'TEXT'],
]

async function main() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    for (const [name, type] of COLUMNS) {
      await client.query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS ${name} ${type}`)
      console.log(`[migrate-51] posts.${name} 확인`)
    }
    await client.query('COMMIT')
    console.log('[migrate-51] 완료')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error('[migrate-51] 실패:', err)
  process.exit(1)
})
