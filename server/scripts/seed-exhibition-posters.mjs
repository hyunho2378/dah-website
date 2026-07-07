// scripts/seed-exhibition-posters.mjs — 역대 전시회 포스터 경로를 "비어있는 행에만" 채운다 (P5-2 req3)
//
// 원칙: UPDATE ... WHERE poster_url IS NULL — 이미 값이 있는 행(예 PITR로 복구된 'Against the Flow'의
//   CMS 포스터)은 절대 덮어쓰지 않는다. 삭제/truncate 없음.
// 포스터 파일: client/public/images/exhibitions/<학기>.png (Vercel 정적 서빙).
// 실행: server/ 안에서 `node scripts/seed-exhibition-posters.mjs`
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[ex-poster] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

// 제목(원문 그대로) → 학기 포스터. 제목의 특수 표기(이중 공백 등)도 DB 원문과 정확히 일치해야 매칭됨.
const MAP = [
  ['「 Against the Flow 」', '2026-1'],
  ['「흐르는 경계: DAH」', '2025-2'],
  ['「Pulse」', '2025-1'],
  ['「NEXUS : 연결의 시작」', '2024-2'],
  ['「Free-Child」', '2024-1'],
  ['「무한」', '2023-2'],
  ['「흐름」', '2023-1'],
  ['「DAH Display : 공존」', '2022-2'],
  ['「팔레트」', '2022-1'],
  ['「샛별」', '2021-2'],
  ['「모두 DAH와 함께」', '2021-1'],
  ['「전시회, 우리들의 축제」', '2020-2'],
  ['「내 손안에 작은 전시회」', '2020-1'],
  ['「그래서 우리는  DAH다」', '2019-2'],
  ['「DAH:다」', '2019-1'],
  ['「2018-2 프로젝트 전시회」', '2018-2'],
  ['「2018-1 프로젝트 전시회」', '2018-1'],
  ['「2017-2 프로젝트 전시회」', '2017-2'],
]

async function main() {
  const client = await pool.connect()
  try {
    let filled = 0
    const misses = []
    for (const [title, sem] of MAP) {
      const r = await client.query(
        `UPDATE exhibitions SET poster_url = $1 WHERE title = $2 AND poster_url IS NULL`,
        [`/images/exhibitions/${sem}.png`, title]
      )
      filled += r.rowCount
      if (r.rowCount === 0) misses.push(`${title} (제목 불일치 또는 이미 포스터 존재)`)
    }
    console.log(`[ex-poster] 포스터 채움 ${filled}건 (비어있던 행만). 미적용 ${misses.length}건.`)
    if (misses.length) console.log('[ex-poster] 미적용:\n  - ' + misses.join('\n  - '))
  } catch (err) {
    console.error('[ex-poster] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
