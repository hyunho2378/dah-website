// scripts/split-contest-editions.mjs — 묶음 공모전(body.editions)을 회차별 post로 분리 (51_CONTEST_SPLIT)
//
// 순서: 백업 → 회차 post 삽입(seed_key 멱등) → 검증 → 원본 묶음 post 삭제 → 최종 검증.
// 전 과정이 한 트랜잭션이라 중간에 어긋나면 아무것도 반영되지 않는다.
//
// 멱등: 두 번 돌려도 삽입은 ON CONFLICT DO NOTHING으로 넘어가고, 원본은 이미 없어 삭제 0건이다.
// 백업은 실행할 때마다 scripts/backups/contests-<타임스탬프>.json 으로 남긴다.
//
// 실행: server/ 안에서 `node scripts/split-contest-editions.mjs`
//       미리보기만 하려면 `node scripts/split-contest-editions.mjs --dry-run`
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { CONTEST_POSTS } from './contest-data.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BACKUP_DIR = path.join(__dirname, 'backups')
const DRY_RUN = process.argv.includes('--dry-run')

if (!process.env.DATABASE_URL) {
  console.error('[split] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

// 분리 대상 = editions 배열을 가진 묶음 post
const isBundle = (row) => Array.isArray(row.body?.editions) && row.body.editions.length > 0

async function main() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    for (const col of ['semester_label', 'period', 'host']) {
      await client.query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS ${col} TEXT`)
    }
    await client.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS seed_key TEXT')
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS uq_posts_seed_key ON posts (seed_key)')

    // 1) 백업 — 분리 전 공모전 전량
    const { rows: before } = await client.query(
      `SELECT * FROM posts WHERE type = 'contest' ORDER BY id`
    )
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
    const stamp = (await client.query('SELECT to_char(now(), \'YYYYMMDD-HH24MISS\') AS s')).rows[0].s
    const backupPath = path.join(BACKUP_DIR, `contests-${stamp}.json`)
    fs.writeFileSync(backupPath, JSON.stringify(before, null, 2))
    console.log(`[split] 백업 ${before.length}건 → ${path.relative(process.cwd(), backupPath)}`)

    const bundles = before.filter(isBundle)
    const editionCount = bundles.reduce((n, b) => n + b.body.editions.length, 0)
    console.log(`[split] 묶음 post ${bundles.length}건 / 회차 ${editionCount}개`)

    // 2) 회차 post 삽입 — 원문은 contest-data.mjs가 기준(시드와 동일 정의)
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
    }
    console.log(`[split] 회차 post 신규 삽입 ${inserted}건`)

    // 3) 검증 — 회차 post가 전부 자리를 잡았는지 확인한 뒤에만 원본을 지운다
    const { rows: check } = await client.query(
      `SELECT seed_key FROM posts WHERE type='contest' AND seed_key = ANY($1)`,
      [CONTEST_POSTS.map((c) => c.seed_key)]
    )
    if (check.length !== CONTEST_POSTS.length) {
      throw new Error(`회차 post가 ${check.length}/${CONTEST_POSTS.length}건뿐이라 중단`)
    }

    // 4) 원본 묶음 post 삭제 — editions를 가진 행만
    let deleted = 0
    for (const b of bundles) {
      const res = await client.query(`DELETE FROM posts WHERE id = $1`, [b.id])
      deleted += res.rowCount
      console.log(`[split] 원본 삭제 id=${b.id} (${b.title_ko})`)
    }

    // 5) 최종 상태
    const { rows: after } = await client.query(
      `SELECT id, semester_label, title_ko FROM posts WHERE type='contest'
       ORDER BY semester_label DESC NULLS LAST, id DESC`
    )
    console.log(`[split] 최종 공모전 ${after.length}건 (삭제 ${deleted}건)`)
    for (const r of after) {
      console.log(`   id=${r.id} | ${r.semester_label ?? '-'} | ${r.title_ko}`)
    }

    if (DRY_RUN) {
      await client.query('ROLLBACK')
      console.log('[split] --dry-run: 롤백했습니다. 실제 반영은 옵션 없이 다시 실행하세요.')
      return
    }
    await client.query('COMMIT')
    console.log('[split] 완료')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error('[split] 실패(롤백됨):', err.message)
  process.exit(1)
})
