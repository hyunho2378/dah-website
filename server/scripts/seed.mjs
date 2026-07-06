// scripts/seed.mjs — client/src/data/*.js 원문 → DB 주입 (12_BACKEND.md 7절 1단계: 파일→DB 시드)
// 실행: server/ 안에서 `node scripts/seed.mjs` (server/.env의 DATABASE_URL 사용)
//
// 멱등 방식 (명시): "truncate 후 삽입"
//   - professors, mentors, curriculum, careers, portfolios: TRUNCATE 후 전량 삽입
//   - posts: type IN ('notice','achievement')만 DELETE 후 삽입 (다른 type의 CMS 작성분 보존.
//     재실행 시 어드민에서 수정한 notice·achievement는 초기화됨 — 시드는 최초 1회 용도)
//   - site_settings, codesharing, users(owner): upsert
//
// 매핑 규칙 (담당 지시문):
//   curriculum track: track-1→design, track-2→ai, track-3→culture, common→common
//   notices→posts(type notice, tag=org, external_url=url, created_at=date)
//   achievements→posts(type achievement, body jsonb {awardee, host, desc, year}, tag=연도,
//     created_at=연도-01-01(성좌·목록 정렬용 합성값 — 표시용 날짜 아님))
//   history/site 등→site_settings 키: site, hero, newsbar, finalCta, about, history
//   owner 계정: OWNER_EMAIL env (must_set_pw true → 최초 로그인 시 비밀번호 설정 온보딩)
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../../client/src/data')

if (!process.env.DATABASE_URL) {
  console.error('[seed] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

async function importData(file) {
  // 경로에 공백·한글 포함 — pathToFileURL로 안전하게 인코딩
  return import(pathToFileURL(path.join(DATA_DIR, file)).href)
}

const TRACK_MAP = { 'track-1': 'design', 'track-2': 'ai', 'track-3': 'culture', common: 'common' }

async function main() {
  const client = await pool.connect()
  try {
    // 0) 스키마 적용 (멱등 DDL)
    const schemaSql = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8')
    await client.query(schemaSql)
    console.log('[seed] schema.sql 적용 완료')

    const [
      { professors },
      { mentors },
      { curriculum },
      { careers },
      { portfolios },
      { notices },
      { achievements },
      { history },
      { site, hero, newsbar, finalCta, about },
      { codeSharing },
    ] = await Promise.all([
      importData('professors.js'),
      importData('mentors.js'),
      importData('curriculum.js'),
      importData('careers.js'),
      importData('portfolios.js'),
      importData('notices.js'),
      importData('achievements.js'),
      importData('history.js'),
      importData('site.js'),
      importData('tracks.js'),
    ])

    await client.query('BEGIN')

    // 1) 독립 테이블: truncate 후 삽입
    await client.query('TRUNCATE professors, mentors, curriculum, careers, portfolios RESTART IDENTITY')

    for (const [i, p] of professors.entries()) {
      // title_ko=role(원문 직함), links jsonb에 원문 부가정보(website·겸무 소속·주임 여부) 보존
      await client.query(
        `INSERT INTO professors (name_ko, name_en, title_ko, title_en, email, photo_url, links, sort, active)
         VALUES ($1, $2, $3, NULL, $4, NULL, $5, $6, TRUE)`,
        [p.nameKr, p.nameEn, p.role, p.email, JSON.stringify({ website: p.link, affiliation: p.affiliation, lead: p.lead }), i]
      )
    }
    console.log(`[seed] professors ${professors.length}건`)

    for (const [i, m] of mentors.entries()) {
      await client.query(
        `INSERT INTO mentors (name, company, title, link, sort, active) VALUES ($1, $2, $3, $4, $5, TRUE)`,
        [m.name, m.company, m.role, m.companyUrl, i]
      )
    }
    console.log(`[seed] mentors ${mentors.length}건`)

    for (const [i, c] of curriculum.entries()) {
      // semester: 원본 데이터 구조에 필드 없음(주석만) → NULL. code('1.1')는 스키마에 없어 미이관(정렬은 sort 보존)
      await client.query(
        `INSERT INTO curriculum (grade, semester, track, name_ko, name_en, sort) VALUES ($1, NULL, $2, $3, NULL, $4)`,
        [c.year, TRACK_MAP[c.track], c.name, i]
      )
    }
    console.log(`[seed] curriculum ${curriculum.length}건`)

    for (const [i, c] of careers.entries()) {
      await client.query(
        `INSERT INTO careers (grad_name, majors, company, company_url, position, year, sort)
         VALUES ($1, $2, $3, $4, $5, NULL, $6)`,
        [c.name, c.majors, c.company, c.companyUrl, c.role, i]
      )
    }
    console.log(`[seed] careers ${careers.length}건`)

    for (const [i, p] of portfolios.entries()) {
      await client.query(
        `INSERT INTO portfolios (student_no, name, majors, link, sort) VALUES ($1, $2, $3, $4, $5)`,
        [p.studentNo, p.name, p.majors, p.url, i]
      )
    }
    console.log(`[seed] portfolios ${portfolios.length}건`)

    // 2) posts: notice·achievement type만 리셋 후 삽입
    const del = await client.query(`DELETE FROM posts WHERE type IN ('notice', 'achievement')`)
    if (del.rowCount > 0) console.log(`[seed] 기존 posts(notice·achievement) ${del.rowCount}건 삭제 (시드 리셋)`)

    for (const n of notices) {
      await client.query(
        `INSERT INTO posts (type, title_ko, tag, external_url, published, created_at, updated_at)
         VALUES ('notice', $1, $2, $3, TRUE, $4, $4)`,
        [n.title, n.org, n.url, `${n.date}T09:00:00+09:00`]
      )
    }
    console.log(`[seed] notices → posts ${notices.length}건`)

    for (const a of achievements) {
      await client.query(
        `INSERT INTO posts (type, title_ko, body, tag, published, created_at, updated_at)
         VALUES ('achievement', $1, $2, $3, TRUE, $4, $4)`,
        [
          a.title,
          JSON.stringify({ awardee: a.awardee, host: a.host, desc: a.desc, year: a.year }),
          String(a.year),
          `${a.year}-01-01T09:00:00+09:00`, // 연도 정렬용 합성 타임스탬프
        ]
      )
    }
    console.log(`[seed] achievements → posts ${achievements.length}건`)

    // 3) site_settings upsert
    const settings = {
      site,
      hero,
      newsbar,
      finalCta,
      about,
      history,
    }
    for (const [key, value] of Object.entries(settings)) {
      await client.query(
        `INSERT INTO site_settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [key, JSON.stringify(value)]
      )
    }
    console.log(`[seed] site_settings ${Object.keys(settings).length}키 upsert`)

    // 4) codesharing 단일 문서 upsert (tracks.js codeSharing 원문)
    await client.query(
      `INSERT INTO codesharing (id, body, depts, hwp_url) VALUES (1, $1, $2, NULL)
       ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body, depts = EXCLUDED.depts`,
      [
        JSON.stringify({
          definition: codeSharing.definition,
          note: codeSharing.note,
          steps: codeSharing.steps,
          types: codeSharing.types,
        }),
        JSON.stringify(codeSharing.departments),
      ]
    )
    console.log('[seed] codesharing 문서 upsert')

    // 5) owner 계정 시드 (OWNER_EMAIL env, must_set_pw true — 최초 로그인 시 비밀번호 설정)
    const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase()
    if (ownerEmail) {
      await client.query(
        `INSERT INTO users (email, name, role, password_hash, must_set_pw)
         VALUES ($1, NULL, 'owner', NULL, TRUE)
         ON CONFLICT (email) DO UPDATE SET role = 'owner'`,
        [ownerEmail]
      )
      console.log(`[seed] owner 계정 upsert: ${ownerEmail}`)
    } else {
      console.warn('[seed] OWNER_EMAIL 미설정 — owner 계정 시드 생략')
    }

    await client.query('COMMIT')
    console.log('[seed] 완료')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[seed] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
