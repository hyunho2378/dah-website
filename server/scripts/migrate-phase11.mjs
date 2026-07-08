// scripts/migrate-phase11.mjs — Phase 11 마이그레이션 (N1-2 전시회 회차 / N1-3 날짜 단일화 / N1-5 CI)
// 실행: server/ 안에서 `node scripts/migrate-phase11.mjs` (server/.env의 DATABASE_URL 사용)
//
// 하는 일 (전부 멱등 — 재실행 안전. TRUNCATE/DELETE 없음. 4번 UPDATE는 NULL 백필만):
//   1. N1-2 exhibitions.ordinal INTEGER 추가 (full_title은 exhibitionFullTitle로 파생 — DB 미저장).
//   2. N1-5 ci 단일 문서 테이블 생성 (id=1 CHECK) + 자리행 INSERT ON CONFLICT DO NOTHING.
//   3. N1-5 ci 시드 — data/ci.js 원문 → body가 NULL일 때만 채움 (codesharing·nanodegree 패턴).
//   4. N1-3 날짜 단일화 백필 — start_date IS NULL AND held_at IS NOT NULL 인 레거시 행만
//      start_date = held_at 로 채움 (개최일=start_date로 통일. 정렬 키가 start_date로 바뀐 것 보정).
//
// schema.sql의 Phase 11 블록과 동일 정의 — 신규·기존 배포 어느 쪽이든 같은 결과.
import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../../client/src/data')

if (!process.env.DATABASE_URL) {
  console.error('[migrate-phase11] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

async function main() {
  const client = await pool.connect()
  try {
    // 원문 import (통합 시점에 존재. export명: ci {intro, elements, logoGuide, colors, downloads})
    const { ci } = await import(pathToFileURL(path.join(DATA_DIR, 'ci.js')).href)

    await client.query('BEGIN')

    // 1) N1-2 전시회 회차
    await client.query('ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS ordinal INTEGER')
    console.log('[migrate-phase11] exhibitions.ordinal 컬럼 추가')

    // 2) N1-5 CI 단일 문서 테이블 + 자리행 (schema.sql과 동일 정의, 멱등)
    await client.query(`
      CREATE TABLE IF NOT EXISTS ci (
        id   INTEGER PRIMARY KEY CHECK (id = 1),
        body JSONB
      )
    `)
    await client.query(`INSERT INTO ci (id, body) VALUES (1, NULL) ON CONFLICT (id) DO NOTHING`)
    console.log('[migrate-phase11] ci 테이블·자리행 확보')

    // 3) N1-5 CI 시드 — body가 NULL일 때만 채움 (어드민 편집분 보존)
    await client.query(
      `INSERT INTO ci (id, body) VALUES (1, $1)
       ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body
       WHERE ci.body IS NULL`,
      [
        JSON.stringify({
          intro: ci.intro,
          elements: ci.elements,
          logoGuide: ci.logoGuide,
          colors: ci.colors,
          downloads: ci.downloads,
        }),
      ]
    )
    console.log('[migrate-phase11] ci 문서 시드 (body NULL일 때만)')

    // 4) N1-3 날짜 단일화 — 레거시 held_at을 start_date로 백필 (start_date 미설정 행만)
    const backfill = await client.query(
      `UPDATE exhibitions SET start_date = held_at
       WHERE start_date IS NULL AND held_at IS NOT NULL`
    )
    console.log(`[migrate-phase11] start_date ← held_at 백필 ${backfill.rowCount}건`)

    await client.query('COMMIT')
    console.log('[migrate-phase11] 완료')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[migrate-phase11] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
