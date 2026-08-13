// scripts/migrate-phase52.mjs — 공모전 종류(category) 컬럼 추가 + 기존 데이터 백필 (52_CONTEST_CATEGORY)
//
// 추가만 한다(DROP 없음). 백필은 이미 값이 있는 행을 덮어쓰지 않는다(category IS NULL만 채운다).
// 실행: server/ 안에서 `node scripts/migrate-phase52.mjs`
import 'dotenv/config'
import pg from 'pg'
import { CONTEST_CATEGORY } from './contest-data.mjs'

if (!process.env.DATABASE_URL) {
  console.error('[migrate-52] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
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
    await client.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT')
    await client.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS category_etc TEXT')
    console.log('[migrate-52] posts.category / posts.category_etc 확인')

    // 백필 — 제목으로 종류를 판정한다. 이미 category가 있는 행은 건드리지 않는다.
    const bookplate = await client.query(
      `UPDATE posts SET category = $1
       WHERE type = 'contest' AND category IS NULL AND title_ko LIKE '%장서표%'`,
      [CONTEST_CATEGORY.BOOKPLATE]
    )
    const poster = await client.query(
      `UPDATE posts SET category = $1
       WHERE type = 'contest' AND category IS NULL AND title_ko LIKE '%포스터 공모전%'`,
      [CONTEST_CATEGORY.POSTER]
    )
    // 남은 공모전은 기타. 직접 입력값은 제목에서 전공명을 뗀 형태로 둔다.
    const etc = await client.query(
      `UPDATE posts SET category = $1,
              category_etc = COALESCE(category_etc, trim(replace(title_ko, '디지털인문예술전공', '')))
       WHERE type = 'contest' AND category IS NULL`,
      [CONTEST_CATEGORY.ETC]
    )
    console.log(
      `[migrate-52] 백필 — 장서표 ${bookplate.rowCount}건 / 포스터 ${poster.rowCount}건 / 기타 ${etc.rowCount}건`
    )

    const { rows } = await client.query(
      `SELECT category, category_etc, COUNT(*)::int AS n FROM posts WHERE type='contest'
       GROUP BY category, category_etc ORDER BY n DESC`
    )
    await client.query('COMMIT')
    for (const r of rows) {
      console.log(`[migrate-52] ${r.category ?? '(없음)'}${r.category_etc ? ` · ${r.category_etc}` : ''}: ${r.n}건`)
    }
    console.log('[migrate-52] 완료')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error('[migrate-52] 실패:', err)
  process.exit(1)
})
