// scripts/migrate-phase10.mjs — Phase 10 마이그레이션 (M1-1 이미지 배경 옵션 / M1-2 전시회 기간·상단 고정)
// 실행: server/ 안에서 `node scripts/migrate-phase10.mjs` (server/.env의 DATABASE_URL 사용)
//
// 하는 일 (전부 멱등 — 재실행 안전, 순수 DDL. TRUNCATE/DELETE 없음):
//   1. M1-1 has_bg: professors·council·showcase·posts에 BOOLEAN DEFAULT FALSE 컬럼 추가.
//      (ImageFrame bg 렌더 — 투명 로고를 중성 배경 프레임 위에 표시할지. posts는 동아리 로고용.)
//   2. M1-2 전시회: exhibitions에 start_date DATE, end_date DATE, is_featured BOOLEAN DEFAULT FALSE 추가.
//      held_at은 레거시 유지(삭제하지 않음).
//
// schema.sql의 Phase 10 블록과 동일 정의 — 신규·기존 배포 어느 쪽이든 같은 결과.
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[migrate-phase10] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
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

    // 1) M1-1 has_bg — 이미지 배경 옵션
    await client.query('ALTER TABLE professors ADD COLUMN IF NOT EXISTS has_bg BOOLEAN DEFAULT FALSE')
    await client.query('ALTER TABLE council    ADD COLUMN IF NOT EXISTS has_bg BOOLEAN DEFAULT FALSE')
    await client.query('ALTER TABLE showcase   ADD COLUMN IF NOT EXISTS has_bg BOOLEAN DEFAULT FALSE')
    await client.query('ALTER TABLE posts      ADD COLUMN IF NOT EXISTS has_bg BOOLEAN DEFAULT FALSE')
    console.log('[migrate-phase10] has_bg 컬럼 추가 (professors, council, showcase, posts)')

    // 2) M1-2 전시회 기간·상단 고정
    await client.query('ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS start_date  DATE')
    await client.query('ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS end_date    DATE')
    await client.query('ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE')
    console.log('[migrate-phase10] exhibitions start_date·end_date·is_featured 컬럼 추가')

    await client.query('COMMIT')
    console.log('[migrate-phase10] 완료')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[migrate-phase10] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
