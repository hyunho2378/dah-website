// scripts/seed-achievements.mjs — 학생 성과 전면 재시드 (G1, 18_PHASE6)
//
// G1 지시: 16_PHASE4 F6 원문(=client/src/data/achievements.js)을 유일 기준으로,
//   기존 achievement 전부 삭제 후 재시드. 각 레코드에 sort(원문 등장 순서 1..N) 부여.
//   ⚠ 삭제 범위는 posts WHERE type='achievement' 한정 — 다른 테이블·type 절대 미변경.
// 정렬 계약: 목록은 tag(연도) DESC, 연도 내 sort ASC → 화면 순서 = 원문 순서 1:1.
// 실행: server/ 안에서 `node scripts/seed-achievements.mjs` (server/.env DATABASE_URL = 배포 Neon)
import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../../client/src/data')

if (!process.env.DATABASE_URL) {
  console.error('[seed-ach] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

async function main() {
  const client = await pool.connect()
  try {
    const { achievements } = await import(pathToFileURL(path.join(DATA_DIR, 'achievements.js')).href)

    await client.query('BEGIN')

    // 멱등 컬럼 보장 (schema.sql 미적용 환경 대비)
    await client.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS seed_key TEXT')
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS uq_posts_seed_key ON posts (seed_key)')
    await client.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS sort INTEGER')

    // G1.1: achievement 한정 전량 삭제 후 원문 순서로 재시드 (사용자 명시 지시)
    const del = await client.query(`DELETE FROM posts WHERE type = 'achievement'`)
    console.log(`[seed-ach] 기존 achievement ${del.rowCount}건 삭제 (type 한정)`)

    for (const [i, a] of achievements.entries()) {
      await client.query(
        `INSERT INTO posts (type, title_ko, body, tag, seed_key, sort, published, created_at, updated_at)
         VALUES ('achievement', $1, $2, $3, $4, $5, TRUE, $6, $6)`,
        [
          a.title,
          JSON.stringify({ awardee: a.awardee, host: a.host, desc: a.desc, year: a.year }),
          String(a.year),
          a.id,
          i + 1, // 원문 등장 순서 (2026 대상=1 … 2019 마지막=N)
          `${a.year}-01-01T09:00:00+09:00`,
        ]
      )
    }

    const after = await client.query(
      "SELECT COUNT(*)::int AS c FROM posts WHERE type='achievement'"
    )
    await client.query('COMMIT')
    console.log(`[seed-ach] 완료 — ${after.rows[0].c}건 (파일 ${achievements.length}건, sort 1..${achievements.length})`)
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[seed-ach] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
