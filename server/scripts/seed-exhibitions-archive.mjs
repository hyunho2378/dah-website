// scripts/seed-exhibitions-archive.mjs — 전시회 아카이브 18건 메타 채우기 (일회성 정합화)
// 실행: server/ 안에서 `node scripts/seed-exhibitions-archive.mjs` (server/.env의 DATABASE_URL 사용)
//
// 배경: 이전 seed.mjs 실행으로 exhibitions 18행이 이미 존재하나 semester_label('2026-1' 형식)과
//   poster_url이 비어있고 제목이 「」로 감싸져 있었다. 사용자 지시(요약·변경 없이 아래 목록 그대로):
//   기존 18행을 "제자리 UPDATE"로 정합화한다. 중복 생성·삭제 없음.
//
// 규칙:
//   - semester_label = 아래 label (최신 학기부터 내림차순)
//   - poster_url = /images/exhibitions/{label}.webp (client/public/images/exhibitions/ 실제 파일)
//     단 기존 poster_url이 이미 있으면 보존(COALESCE) — 사용자 입력 덮어쓰기 금지
//   - title = 아래 title (평문, 「」 제거 — 사용자 결정)
//   - intro/body/site_url/gallery/held_at 은 절대 건드리지 않음 (2026-1 intro 등 보존)
//   - published = TRUE
//   - 재실행 안전(멱등): 같은 값 재설정. 행 수가 18이 아니면 중단(사람 재검토 강제).
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[archive] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

// 최신 학기부터 내림차순 (index 0 = 가장 최근). 제목은 사용자 제공 목록 원문 그대로.
const ARCHIVE = [
  { label: '2026-1', title: 'Against the Flow' },
  { label: '2025-2', title: '흐르는 경계: DAH' },
  { label: '2025-1', title: 'Pulse' },
  { label: '2024-2', title: 'NEXUS: 연결의 시작' },
  { label: '2024-1', title: 'Free-child' },
  { label: '2023-2', title: '무한' },
  { label: '2023-1', title: '흐름' },
  { label: '2022-2', title: 'Display 공존' },
  { label: '2022-1', title: '팔레트' },
  { label: '2021-2', title: '샛별' },
  { label: '2021-1', title: '모두 DAH 함께' },
  { label: '2020-2', title: '전시회, 우리들의 축제' },
  { label: '2020-1', title: '내 손 안의 작은 전시회' },
  { label: '2019-2', title: '그래서 우리는 DAH다' },
  { label: '2019-1', title: 'DAH:다' },
  { label: '2018-2', title: 'DAH EXHIBITION' },
  { label: '2018-1', title: 'DAH EXHIBITION' },
  { label: '2017-2', title: 'DAH EXHIBITION' },
]

async function main() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // 기존 행을 id 오름차순(=최신→과거)으로 확보
    const { rows } = await client.query(
      'SELECT id, semester_label, title, poster_url FROM exhibitions ORDER BY id'
    )
    if (rows.length !== ARCHIVE.length) {
      throw new Error(
        `exhibitions 행 수(${rows.length}) != 기대(${ARCHIVE.length}). ` +
          '표가 예상 상태가 아님 — 수동 재검토 필요(중단, 롤백).'
      )
    }

    for (let i = 0; i < ARCHIVE.length; i++) {
      const { id, title: oldTitle } = rows[i]
      const { label, title } = ARCHIVE[i]
      const poster = `/images/exhibitions/${label}.webp`
      await client.query(
        `UPDATE exhibitions
         SET semester_label = $1,
             title = $2,
             poster_url = COALESCE(poster_url, $3),
             published = TRUE
         WHERE id = $4`,
        [label, title, poster, id]
      )
      console.log(`[archive] id=${id}  ${label}  "${oldTitle}" → "${title}"`)
    }

    // 검증: 학기 역순 정렬로 되읽기
    const check = await client.query(
      'SELECT id, semester_label, title, poster_url FROM exhibitions ORDER BY semester_label DESC'
    )
    console.log('\n[archive] 최종 상태 (semester_label DESC):')
    check.rows.forEach((r) =>
      console.log(`  ${r.semester_label}  ${r.title}  ${r.poster_url}`)
    )
    console.log(`\n[archive] 총 ${check.rows.length}건`)

    await client.query('COMMIT')
    console.log('[archive] 완료 (커밋)')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[archive] 실패(롤백):', err.message)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
