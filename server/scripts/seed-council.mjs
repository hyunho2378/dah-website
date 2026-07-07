// scripts/seed-council.mjs — 운영위원회 전면 재시드 (H3, 19_PHASE7)
//
// H3 지시: 구성원 데이터 유실 → 사용자 제공 원문(client/src/data/council.js councils)으로
//   council 테이블 한정 전량 삭제 후 재시드. 2026(현 LUCID) sort 0 선두, 이후 연도 내림차순.
//   ⚠ 삭제 범위는 council 테이블 한정 — 다른 테이블 절대 미변경.
// 실행: server/ 안에서 `node scripts/seed-council.mjs` (server/.env DATABASE_URL = 배포 Neon)
import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../../client/src/data')

if (!process.env.DATABASE_URL) {
  console.error('[seed-council] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

async function main() {
  const client = await pool.connect()
  try {
    const { councils } = await import(pathToFileURL(path.join(DATA_DIR, 'council.js')).href)

    await client.query('BEGIN')
    const del = await client.query('DELETE FROM council')
    console.log(`[seed-council] 기존 ${del.rowCount}건 삭제 (council 한정)`)

    for (const [i, c] of councils.entries()) {
      const ord = /제\s?(\d+)대/.exec(c.ordinalLabel)?.[1]
      await client.query(
        `INSERT INTO council (ordinal, name, intro, members, year_label, sort)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [ord ? Number(ord) : null, c.title, c.intro, JSON.stringify(c.members), String(c.year), i]
      )
    }

    const after = await client.query('SELECT COUNT(*)::int AS c FROM council')
    await client.query('COMMIT')
    console.log(`[seed-council] 완료 — ${after.rows[0].c}건 (2026 선두, 구성원 원문 전량)`)
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[seed-council] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
