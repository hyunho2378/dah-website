// scripts/seed-contests.mjs — 공모전 2종 시드 (비파괴)
//
// 데이터 모델: 공모전 전용 테이블은 없다. posts(type='contest') 한 행이 공모전 하나이고,
// 회차는 body.editions 배열에 담긴다(공개 페이지 Contests.jsx의 계약).
//   body = { host: '주최 원문', editions: [{ semester_label, poster_url }] }
// 따라서 "2 공모전 x 4회차"는 posts 2행 + editions 8개다.
//
// 비파괴 계약: seed_key + ON CONFLICT (seed_key) DO NOTHING. 이미 있으면 손대지 않는다.
// CMS에서 사람이 만든 행(seed_key NULL)은 어떤 경우에도 건드리지 않는다. DELETE 없음.
//
// 포스터는 Blob이 아니라 client/public 정적 파일이라 업로드 단계가 없다.
// 원본 PNG는 WebP(품질 80, 최대 너비 1200)로 변환해 교체했다 — 17.1MB에서 2.2MB로 줄었다.
// 실행: server/ 안에서 `node scripts/seed-contests.mjs`
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[seed-contests] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

// 회차 제목은 학기마다 다르다(장서표는 주관 도서관이 매 학기 바뀐다) — 학기 라벨에서
// 기계적으로 파생할 수 없으므로 원문 그대로 나열한다.
const editionsOf = (prefix, rows) =>
  rows.map(([semester_label, title]) => ({
    semester_label,
    title,
    poster_url: `/images/contests/${prefix}-contest-${semester_label}.webp`,
  }))

const CONTESTS = [
  {
    seed_key: 'contest-dah-poster',
    title_ko: '디지털인문예술 프로젝트 전시회 포스터 공모전',
    title_en: 'DAH Project Exhibition Poster Contest',
    host: '디지털인문예술전공 운영위원회',
    editions: editionsOf('poster', [
      ['2024-2', '2024-2 디지털인문예술 프로젝트 전시회 포스터 공모전'],
      ['2025-1', '2025-1 디지털인문예술 프로젝트 전시회 포스터 공모전'],
      ['2025-2', '2025-2 디지털인문예술 프로젝트 전시회 포스터 공모전'],
      ['2026-1', '2026-1 디지털인문예술 프로젝트 전시회 포스터 공모전'],
    ]),
  },
  {
    seed_key: 'contest-library-bookplate',
    title_ko: '도서관 장서표 디자인 공모전',
    title_en: 'Library Bookplate Design Contest',
    host: '한림대학교 도서관',
    editions: editionsOf('bookplate', [
      ['2024-2', '일송기념도서관 장서표 디자인 공모전'],
      ['2025-1', '일송기념도서관 장서표 디자인 공모전'],
      ['2025-2', '정선군립도서관 장서표 디자인 공모전'],
      ['2026-1', '인제 기적의 도서관 장서표 디자인 공모전'],
    ]),
  },
]

async function main() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // 멱등 컬럼 보장 (schema.sql 미적용 환경 대비)
    await client.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS seed_key TEXT')
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS uq_posts_seed_key ON posts (seed_key)')

    for (const c of CONTESTS) {
      const res = await client.query(
        `INSERT INTO posts (type, title_ko, title_en, body, poster_url, seed_key, published)
         VALUES ('contest', $1, $2, $3, $4, $5, TRUE)
         ON CONFLICT (seed_key) DO NOTHING
         RETURNING id`,
        [
          c.title_ko,
          c.title_en,
          JSON.stringify({ host: c.host, editions: c.editions }),
          // 목록 폴백·미리보기용 대표 포스터 = 최신 회차
          c.editions[c.editions.length - 1].poster_url,
          c.seed_key,
        ]
      )
      console.log(
        res.rowCount > 0
          ? `[seed-contests] 삽입: ${c.title_ko} (id ${res.rows[0].id}, 회차 ${c.editions.length})`
          : `[seed-contests] 이미 존재해 건너뜀: ${c.title_ko}`
      )
    }

    const { rows } = await client.query(
      `SELECT seed_key, title_ko, jsonb_array_length(body->'editions') AS editions
       FROM posts WHERE seed_key = ANY($1) ORDER BY seed_key`,
      [CONTESTS.map((c) => c.seed_key)]
    )
    await client.query('COMMIT')

    const total = rows.reduce((n, r) => n + Number(r.editions), 0)
    for (const r of rows) console.log(`[seed-contests] ${r.title_ko}: 회차 ${r.editions}개`)
    console.log(`[seed-contests] 공모전 ${rows.length}건 / 회차 합계 ${total}건`)
    if (rows.length !== 2 || total !== 8) {
      console.error('[seed-contests] 기대치(공모전 2 / 회차 8)와 다릅니다.')
      process.exitCode = 1
    }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error('[seed-contests] 실패:', err)
  process.exit(1)
})
