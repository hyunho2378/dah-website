// scripts/seed-achievements.mjs — 배포 사고 복구용 achievement 선별 재주입 (P5-2 후속)
//
// 원칙(사용자 지시):
//   - 다른 테이블 절대 건드리지 않는다. posts 중 type='achievement'만 삽입.
//   - truncate/delete 금지. "없는 것만 추가" — INSERT ... ON CONFLICT (seed_key) DO NOTHING.
//   - 멱등 키: achievements.js의 안정적 id(예 'ach-2026-01')를 posts.seed_key에 저장.
//
// 전제: Neon PITR로 "시드 사고 직전"(전시회 CMS 미디어 살아있고 achievement 0건) 시점으로 복구한 뒤 실행.
// 실행: server/ 안에서 `node scripts/seed-achievements.mjs` (server/.env의 DATABASE_URL = 배포 Neon)
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

    // 멱등 키 컬럼·유니크 인덱스 보장 (NULL 다수 허용 → CMS 작성분과 무충돌)
    await client.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS seed_key TEXT')
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS uq_posts_seed_key ON posts (seed_key)')

    // 안전 가드: seed_key 없는 기존 achievement가 있으면 PITR 미완료(더티 상태) 의심 → 중단.
    // (이 상태에서 삽입하면 seed_key NULL 행과 무충돌로 중복 생성됨)
    const dirty = await client.query(
      "SELECT COUNT(*)::int AS c FROM posts WHERE type='achievement' AND seed_key IS NULL"
    )
    if (dirty.rows[0].c > 0) {
      console.error(
        `[seed-ach] 중단: seed_key 없는 achievement ${dirty.rows[0].c}건 존재. ` +
        'PITR 복구(시드 직전)를 먼저 완료한 뒤 실행하세요. 중복 삽입 방지를 위해 아무것도 넣지 않았습니다.'
      )
      process.exitCode = 1
      return
    }

    const before = await client.query("SELECT COUNT(*)::int AS c FROM posts WHERE type='achievement'")

    let inserted = 0
    for (const a of achievements) {
      const r = await client.query(
        `INSERT INTO posts (type, title_ko, body, tag, seed_key, published, created_at, updated_at)
         VALUES ('achievement', $1, $2, $3, $4, TRUE, $5, $5)
         ON CONFLICT (seed_key) DO NOTHING`,
        [
          a.title,
          JSON.stringify({ awardee: a.awardee, host: a.host, desc: a.desc, year: a.year }),
          String(a.year),
          a.id, // seed_key
          `${a.year}-01-01T09:00:00+09:00`, // 연도 정렬용 합성 타임스탬프
        ]
      )
      inserted += r.rowCount
    }

    const after = await client.query("SELECT COUNT(*)::int AS c FROM posts WHERE type='achievement'")
    console.log(
      `[seed-ach] 완료 — 파일 ${achievements.length}건 중 신규 삽입 ${inserted}건 ` +
      `(이전 ${before.rows[0].c} → 현재 ${after.rows[0].c}). 다른 테이블 미변경.`
    )
  } catch (err) {
    console.error('[seed-ach] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
