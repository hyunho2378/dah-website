// scripts/seed-contests.mjs — 공모전 시드 (비파괴)
//
// 데이터 모델(51_CONTEST_SPLIT): **회차 하나 = post 하나**다.
// 이전에는 공모전 1건이 body.editions 배열로 회차를 묶었으나, 회차마다 제목·주최·포스터가
// 달라 개별 게시글로 분리했다. 이제 posts(type='contest') 한 행이 학기·포스터·기간·주최를
// 직접 들고 있고, 공개 페이지는 이 행들을 그대로 카드로 그린다.
//
// 비파괴 계약: seed_key + ON CONFLICT (seed_key) DO NOTHING. 이미 있으면 손대지 않는다.
// CMS에서 사람이 만든 행(seed_key NULL)은 어떤 경우에도 건드리지 않는다. DELETE 없음.
//
// 포스터는 Blob이 아니라 client/public 정적 파일이라 업로드 단계가 없다(WebFP 변환본).
// 실행: server/ 안에서 `node scripts/seed-contests.mjs`
import 'dotenv/config'
import pg from 'pg'
import { CONTEST_POSTS } from './contest-data.mjs'

if (!process.env.DATABASE_URL) {
  console.error('[seed-contests] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
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

    // 멱등 보장 (schema.sql 미적용 환경 대비)
    await client.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS seed_key TEXT')
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS uq_posts_seed_key ON posts (seed_key)')
    for (const col of ['semester_label', 'period', 'host']) {
      await client.query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS ${col} TEXT`)
    }

    let inserted = 0
    for (const c of CONTEST_POSTS) {
      const res = await client.query(
        `INSERT INTO posts (type, title_ko, title_en, semester_label, poster_url, period, host, external_url, seed_key, published)
         VALUES ('contest', $1, $2, $3, $4, $5, $6, $7, $8, TRUE)
         ON CONFLICT (seed_key) DO NOTHING
         RETURNING id`,
        [
          c.title_ko,
          c.title_en ?? null,
          c.semester_label,
          c.poster_url,
          c.period ?? null,
          c.host ?? null,
          c.external_url ?? null,
          c.seed_key,
        ]
      )
      if (res.rowCount > 0) inserted++
      console.log(
        res.rowCount > 0
          ? `[seed-contests] 삽입: ${c.semester_label} ${c.title_ko}`
          : `[seed-contests] 건너뜀(존재): ${c.semester_label} ${c.title_ko}`
      )
    }

    const { rows } = await client.query(
      `SELECT COUNT(*)::int AS n FROM posts WHERE type='contest' AND seed_key = ANY($1)`,
      [CONTEST_POSTS.map((c) => c.seed_key)]
    )
    await client.query('COMMIT')

    console.log(`[seed-contests] 신규 ${inserted}건 / 시드 공모전 총 ${rows[0].n}건`)
    if (rows[0].n !== CONTEST_POSTS.length) {
      console.error(`[seed-contests] 기대치(${CONTEST_POSTS.length}건)와 다릅니다.`)
      process.exitCode = 1
    }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error('[seed-contests] 실패:', err)
  process.exit(1)
})
