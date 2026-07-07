// scripts/seed-curriculum.mjs — 교과목 전면 재시드 (J10, 20_PHASE8)
// 사용자 제공 원문으로 curriculum 테이블 한정 전량 교체(학기·학점·영문명 포함).
// ⚠ 삭제 범위는 curriculum 한정 — 다른 테이블 절대 미변경.
// 실행: server/ 안에서 `node scripts/seed-curriculum.mjs`
import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../../client/src/data')
const TRACK_MAP = { 'track-1': 'design', 'track-2': 'ai', 'track-3': 'culture', common: 'common' }

if (!process.env.DATABASE_URL) {
  console.error('[seed-cur] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

async function main() {
  const client = await pool.connect()
  try {
    const { curriculum } = await import(pathToFileURL(path.join(DATA_DIR, 'curriculum.js')).href)

    await client.query('BEGIN')
    await client.query('ALTER TABLE curriculum ADD COLUMN IF NOT EXISTS credit TEXT')
    const del = await client.query('DELETE FROM curriculum')
    console.log(`[seed-cur] 기존 ${del.rowCount}건 삭제 (curriculum 한정)`)

    for (const [i, c] of curriculum.entries()) {
      await client.query(
        `INSERT INTO curriculum (grade, semester, track, name_ko, name_en, credit, sort)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [c.year, c.semester, TRACK_MAP[c.track], c.name, c.nameEn ?? null, c.credit ?? null, i]
      )
    }

    const after = await client.query('SELECT COUNT(*)::int AS c FROM curriculum')
    await client.query('COMMIT')
    console.log(`[seed-cur] 완료 — ${after.rows[0].c}건 (파일 ${curriculum.length}건)`)
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[seed-cur] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
