// scripts/migrate-phase18.mjs — Phase 18 (33_PHASE18 AGENT-Y3). 멱등.
// 실행: 통합 담당자가 배포 Neon DB에 `node scripts/migrate-phase18.mjs`.
//
// 1) Y3-5  posts.site_url 컬럼 추가 + 동아리 기존 external_url 백필(사이트 링크 이관)
// 2) Y3-4  성과(achievement) sort 정규화 — 연도(tag)별 현재 표시 순서를 0..N으로 확정한다.
//          진단: 어드민 신규 등록이 sort를 보내지 않아 NULL로 저장됐고 목록 정렬이
//          'tag DESC, sort ASC NULLS LAST'라 신규 글이 항상 그 연도 맨 아래로 밀렸다.
//          서버가 이제 (연도 최소 sort - 1)을 배정하므로, 기존 NULL 행만 여기서 정리한다.
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[migrate-phase18] DATABASE_URL이 없습니다.')
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

    // 1) 동아리 사이트 URL
    await client.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS site_url TEXT')
    const backfill = await client.query(
      `UPDATE posts SET site_url = external_url
       WHERE type = 'club' AND site_url IS NULL AND external_url IS NOT NULL`
    )
    console.log(`[migrate-phase18] posts.site_url 추가 · 동아리 백필 ${backfill.rowCount}건`)

    // 2) 성과 sort 정규화 — 연도별 현재 정렬 순서 그대로 0..N 재부여
    const normalized = await client.query(`
      WITH ranked AS (
        SELECT id,
               ROW_NUMBER() OVER (
                 PARTITION BY tag
                 ORDER BY sort ASC NULLS LAST, id ASC
               ) - 1 AS pos
        FROM posts
        WHERE type = 'achievement'
      )
      UPDATE posts p SET sort = r.pos
      FROM ranked r
      WHERE p.id = r.id AND (p.sort IS DISTINCT FROM r.pos)
    `)
    console.log(`[migrate-phase18] achievement.sort 정규화 ${normalized.rowCount}건`)

    await client.query('COMMIT')
    console.log('[migrate-phase18] 완료')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[migrate-phase18] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}
main()
