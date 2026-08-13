// scripts/migrate-phase39.mjs — 자체 폼 시스템 테이블 생성 (39_FORM_BUILDER F1)
// CREATE TABLE IF NOT EXISTS만 쓴다. 기존 테이블 DROP 없음.
// 실행: server/ 안에서 `node scripts/migrate-phase39.mjs`
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[migrate-39] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

const SQL = [
  `CREATE TABLE IF NOT EXISTS custom_forms (
     id SERIAL PRIMARY KEY,
     slug TEXT UNIQUE NOT NULL,
     title_ko TEXT NOT NULL,
     title_en TEXT,
     description_ko TEXT,
     description_en TEXT,
     category TEXT NOT NULL DEFAULT 'other',
     fields JSONB NOT NULL DEFAULT '[]'::jsonb,
     settings JSONB NOT NULL DEFAULT '{}'::jsonb,
     published BOOLEAN NOT NULL DEFAULT FALSE,
     seed_key TEXT,
     created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS uq_custom_forms_seed_key ON custom_forms (seed_key)`,
  `CREATE TABLE IF NOT EXISTS custom_form_responses (
     id SERIAL PRIMARY KEY,
     form_id INTEGER NOT NULL REFERENCES custom_forms(id) ON DELETE CASCADE,
     data JSONB NOT NULL DEFAULT '{}'::jsonb,
     public_user_id INTEGER,
     google_email TEXT,
     submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_form_responses_form ON custom_form_responses (form_id, submitted_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_form_responses_user ON custom_form_responses (form_id, public_user_id)`,
]

const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const sql of SQL) await client.query(sql)
  await client.query('COMMIT')
  const { rows } = await client.query(
    "SELECT table_name FROM information_schema.tables WHERE table_name IN ('custom_forms','custom_form_responses') ORDER BY table_name"
  )
  console.log('[migrate-39] 테이블 확인:', rows.map((r) => r.table_name).join(', '))
  console.log('[migrate-39] 완료')
} catch (err) {
  await client.query('ROLLBACK')
  console.error('[migrate-39] 실패:', err.message)
  process.exitCode = 1
} finally {
  client.release()
  await pool.end()
}
