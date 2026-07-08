// scripts/migrate-phase14.mjs — Phase 14 마이그레이션 (26_CI_PAGE: CI body 새 구조 반영)
// 실행: 통합 담당자가 배포 Neon DB에 대해 server/ 안에서 `node scripts/migrate-phase14.mjs`. 멱등.
//
// 배경: Phase 11이 시드한 ci.body는 구 구조({intro,elements,logoGuide,colors,downloads})라
// 공개 페이지의 {...ci, ...body} 병합에서 새 시드(symbol·signatures·motif·정적 /ci/ 경로)를 덮어쓴다.
// 여기서 ci.body를 data/ci.js 새 구조로 재설정한다. 콘텐츠는 플레이스홀더(텍스트 빈값·색상 hex 빈값·
// 이미지 null/정적 슬롯)라 안전. 단, 어드민이 입력했을 수 있는 intro·색상값은 보존한다.
import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../../client/src/data')

if (!process.env.DATABASE_URL) {
  console.error('[migrate-phase14] DATABASE_URL이 없습니다.')
  process.exit(1)
}
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

async function main() {
  const { ci } = await import(pathToFileURL(path.join(DATA_DIR, 'ci.js')).href)
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `CREATE TABLE IF NOT EXISTS ci ( id INTEGER PRIMARY KEY CHECK (id = 1), body JSONB )`
    )
    const cur = await client.query('SELECT body FROM ci WHERE id = 1')
    const old = cur.rows[0]?.body || {}
    // 어드민 편집분 보존: intro(비어있지 않으면), colors(hex가 채워진 슬롯이 하나라도 있으면)
    const oldColorsFilled =
      Array.isArray(old.colors) && old.colors.some((c) => (c?.hex || '').trim() !== '')
    const body = {
      ...ci,
      intro: (old.intro || '').trim() !== '' ? old.intro : ci.intro,
      colors: oldColorsFilled ? old.colors : ci.colors,
    }
    await client.query(
      `INSERT INTO ci (id, body) VALUES (1, $1::jsonb)
       ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body`,
      [JSON.stringify(body)]
    )
    await client.query('COMMIT')
    console.log(
      '[migrate-phase14] ci body 새 구조 반영 완료 (symbol·downloads·elements·logoGuide·signatures·colors·motif). intro·색상 편집분 보존'
    )
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[migrate-phase14] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}
main()
