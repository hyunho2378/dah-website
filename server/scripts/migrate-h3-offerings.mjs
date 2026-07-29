// scripts/migrate-h3-offerings.mjs — H3-3(37_SHEET_ROADMAP AGENT-H3). 멱등.
// 실행: 통합 담당자가 배포 Neon DB에 `node scripts/migrate-h3-offerings.mjs`.
//
// semester_offerings — (연도, 학기, 교과목) 개설 조합.
// 기존 curriculum 테이블은 과목 원본(학년·트랙·학점)만 유지하고, "언제 열리는가"는
// 여기에만 쌓는다(curriculum 데이터 무변경). 같은 학기에 같은 과목이 두 번 들어가지
// 않도록 (year, term, curriculum_id) 유니크 인덱스로 막는다 —
// 서버 POST /admin/offerings의 ON CONFLICT DO NOTHING이 이 인덱스에 의존한다.
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[migrate-h3-offerings] DATABASE_URL이 없습니다.')
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

    await client.query(`
      CREATE TABLE IF NOT EXISTS semester_offerings (
        id            SERIAL PRIMARY KEY,
        year          INTEGER NOT NULL,
        term          INTEGER NOT NULL CHECK (term IN (1, 2)),
        curriculum_id INTEGER NOT NULL REFERENCES curriculum(id) ON DELETE CASCADE,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS semester_offerings_unique_idx
        ON semester_offerings (year, term, curriculum_id)
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS semester_offerings_semester_idx
        ON semester_offerings (year DESC, term DESC)
    `)

    await client.query('COMMIT')
    console.log('[migrate-h3-offerings] semester_offerings 테이블·인덱스 확인 완료')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[migrate-h3-offerings] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}
main()
