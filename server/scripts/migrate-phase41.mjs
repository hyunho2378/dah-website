// scripts/migrate-phase41.mjs: 41_AUTH_CONTRACT 저장 모델. 멱등.
// 실행: 통합 담당자가 배포 Neon DB에 `node scripts/migrate-phase41.mjs`.
// 서버 배포보다 먼저 실행해야 한다. 신규 접수가 아래 세 가지에 의존한다.
//
// 1) public_users                       구글 로그인 제출자 계정 (스태프 users와 별개 테이블)
// 2) exhibition_entries.public_user_id  접수 소유자
//    showcase.public_user_id            쇼케이스 소유자
// 3) exhibition_entries.pw_hash         NOT NULL 제약 해제
//    비밀번호 입력이 사라져 신규 접수가 pw_hash 없이 들어온다. 컬럼과 기존 값은 그대로 둔다
//    (기존 접수 건의 이력이므로 삭제하지 않는다).
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[migrate-phase41] DATABASE_URL이 없습니다.')
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
      CREATE TABLE IF NOT EXISTS public_users (
        id            SERIAL PRIMARY KEY,
        google_sub    TEXT UNIQUE NOT NULL,
        email         TEXT NOT NULL,
        name          TEXT,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
        last_login_at TIMESTAMPTZ
      )
    `)

    await client.query(
      'ALTER TABLE exhibition_entries ADD COLUMN IF NOT EXISTS public_user_id INTEGER'
    )
    await client.query('ALTER TABLE showcase ADD COLUMN IF NOT EXISTS public_user_id INTEGER')

    await client.query('ALTER TABLE exhibition_entries ALTER COLUMN pw_hash DROP NOT NULL')

    await client.query('COMMIT')
    console.log('[migrate-phase41] public_users, public_user_id, pw_hash 제약 해제 완료')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[migrate-phase41] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}
main()
