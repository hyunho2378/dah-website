// scripts/seed.mjs — client/src/data/*.js 원문 → DB 주입 (12_BACKEND.md 7절 1단계: 파일→DB 시드)
// 실행: server/ 안에서 `node scripts/seed.mjs` (server/.env의 DATABASE_URL 사용)
//
// 멱등 방식 (P5-2 개편): "덮어쓰기 금지, 없는 것만 추가" — 재시드가 사용자 입력을 절대 지우지 않는다.
//   - professors, mentors, curriculum, careers, portfolios, council, exhibitions: 비어있을 때만 전량 삽입(empty-guard)
//   - posts: seed_key(안정 키)로 INSERT ... ON CONFLICT (seed_key) DO NOTHING. CMS 작성분(seed_key NULL) 불변
//   - showcase: 비로그인 제출 테이블 → 비어있을 때만 데모 1건 삽입(사용자 제출 보존)
//   - site_settings: 없는 키만 삽입(DO NOTHING). codesharing: body가 NULL일 때만 채움. users(owner): role upsert
//   ⚠ TRUNCATE/DELETE 사용 금지. 개별 성과만 재주입: scripts/seed-achievements.mjs
//
// F7·F8 추가 시드: council(운영위 LUCID + 역대), clubs(4종 → posts type=club),
//   각 유형 최소 1건(notice·lecture·contest·exhibition·resource·club·showcase·careers·portfolio) 빈 화면 방지
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
      { councils },
      { clubs },
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
      importData('council.js'),
      importData('clubs.js'),
    ])

    await client.query('BEGIN')

    // P5-2 원칙(사용자 지시): 재시드가 사용자 입력을 지우지 않도록 어떤 테이블도 TRUNCATE/DELETE하지 않는다.
    //   참조 테이블(파일이 진실)은 "비어있을 때만" 전량 삽입(empty-guard). 이미 데이터가 있으면 건너뛴다.
    const isEmpty = async (t) =>
      (await client.query(`SELECT COUNT(*)::int AS c FROM ${t}`)).rows[0].c === 0
    const skip = (t) => console.log(`[seed] ${t} 기존 데이터 존재 — 건너뜀(덮어쓰기 방지)`)

    // 1) 독립 참조 테이블: 비어있을 때만 삽입 (파일이 진실. council 포함)
    if (await isEmpty('professors')) {
      for (const [i, p] of professors.entries()) {
        // title_ko=role(원문 직함), links jsonb에 원문 부가정보(website·겸무 소속·주임 여부) 보존
        await client.query(
          `INSERT INTO professors (name_ko, name_en, title_ko, title_en, email, photo_url, links, sort, active)
           VALUES ($1, $2, $3, NULL, $4, NULL, $5, $6, TRUE)`,
          [p.nameKr, p.nameEn, p.role, p.email, JSON.stringify({ website: p.link, affiliation: p.affiliation, lead: p.lead }), i]
        )
      }
      console.log(`[seed] professors ${professors.length}건`)
    } else skip('professors')

    if (await isEmpty('mentors')) {
      for (const [i, m] of mentors.entries()) {
        await client.query(
          `INSERT INTO mentors (name, company, title, link, sort, active) VALUES ($1, $2, $3, $4, $5, TRUE)`,
          [m.name, m.company, m.role, m.companyUrl, i]
        )
      }
      console.log(`[seed] mentors ${mentors.length}건`)
    } else skip('mentors')

    if (await isEmpty('curriculum')) {
      // J10: 학기(semester)·학점 표기(credit)·영문명(name_en) 포함
      for (const [i, c] of curriculum.entries()) {
        await client.query(
          `INSERT INTO curriculum (grade, semester, track, name_ko, name_en, credit, sort) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [c.year, c.semester ?? null, TRACK_MAP[c.track], c.name, c.nameEn ?? null, c.credit ?? null, i]
        )
      }
      console.log(`[seed] curriculum ${curriculum.length}건 (학기·학점 포함)`)
    } else skip('curriculum')

    if (await isEmpty('careers')) {
      for (const [i, c] of careers.entries()) {
        await client.query(
          `INSERT INTO careers (grad_name, majors, company, company_url, position, year, sort)
           VALUES ($1, $2, $3, $4, $5, NULL, $6)`,
          [c.name, c.majors, c.company, c.companyUrl, c.role, i]
        )
      }
      console.log(`[seed] careers ${careers.length}건`)
    } else skip('careers')

    if (await isEmpty('portfolios')) {
      for (const [i, p] of portfolios.entries()) {
        await client.query(
          `INSERT INTO portfolios (student_no, name, majors, link, sort) VALUES ($1, $2, $3, $4, $5)`,
          [p.studentNo, p.name, p.majors, p.url, i]
        )
      }
      console.log(`[seed] portfolios ${portfolios.length}건`)
    } else skip('portfolios')

    // 2) posts: 삭제 없이 seed_key(안정 키)로 멱등 삽입. ON CONFLICT (seed_key) DO NOTHING.
    //    이미 있는 시드 행과 무관한 CMS 작성분(seed_key NULL)은 절대 건드리지 않는다.

    // F8.1: 첫 게시물(notice-01) 본문 — 사용자 제공 원문 그대로(요약·변경 금지).
    //   메달 이모지만 "1등/2등/3등" 텍스트로 치환. RichBody(Tiptap doc JSON) 계약에 맞춰 문단화.
    const p = (text) => ({ type: 'paragraph', content: [{ type: 'text', text }] })
    const featuredBody = {
      type: 'doc',
      content: [
        p('안녕하세요, 디지털인문예술전공 제1대 운영위원회 LUCID입니다.'),
        p('2026 디지털인문예술전공 신규 캐릭터 공모전 결과를 안내드립니다.'),
        p('소중한 투표에 참여해 주신 모든 분들께 진심으로 감사드립니다.'),
        p('1등 디숭이 (12표) 김지연 / 20232319 / 디지털인문예술전공'),
        p('2등 디푸 (11표) 이지현 / 20236632 / 디지털인문예술전공'),
        p('3등 도도 (9표) 조영은 / 20242577 / 미디어커뮤니케이션전공'),
        p('수상을 진심으로 축하드리며, 추후 수상자 분들께 개별 연락 드릴 예정입니다.'),
        p('출품자 전원 정보 공개와 함께 전시 페이지에서 수상작을 확인하실 수 있습니다.'),
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'https://dah-new-character-contest.vercel.app',
              marks: [{ type: 'link', attrs: { href: 'https://dah-new-character-contest.vercel.app' } }],
            },
          ],
        },
      ],
    }

    for (const n of notices) {
      // F8.1: 첫 게시물(notice-01, 2026 신규 캐릭터 공모전 결과 공지)은 대내 태그 + 상단 고정 + 원문 본문
      const isFeatured = n.id === 'notice-01'
      const tag = isFeatured ? '대내' : n.org
      const body = isFeatured ? featuredBody : null
      await client.query(
        `INSERT INTO posts (type, title_ko, body, tag, external_url, pinned, seed_key, published, created_at, updated_at)
         VALUES ('notice', $1, $2, $3, $4, $5, $6, TRUE, $7, $7)
         ON CONFLICT (seed_key) DO NOTHING`,
        [n.title, body ? JSON.stringify(body) : null, tag, n.url, isFeatured, n.id, `${n.date}T09:00:00+09:00`]
      )
    }
    console.log(`[seed] notices → posts ${notices.length}건 (첫 게시물 대내·고정)`)

    // 2-1) 특강(lecture) — source '특강' 절엔 "(연도별 사진)"만 있어 독립 원문 없음.
    //      빈 화면 방지용 1건: '특강 안내' 공지(notice-09) 원문에서 파생 (제목·URL 원문 그대로).
    const lectureSrc = notices.find((n) => n.id === 'notice-09')
    if (lectureSrc) {
      await client.query(
        `INSERT INTO posts (type, title_ko, tag, external_url, seed_key, published, created_at, updated_at)
         VALUES ('lecture', $1, NULL, $2, $3, TRUE, $4, $4)
         ON CONFLICT (seed_key) DO NOTHING`,
        [lectureSrc.title, lectureSrc.url, `lecture-${lectureSrc.id}`, `${lectureSrc.date}T09:00:00+09:00`]
      )
      console.log('[seed] lecture → posts 1건 (특강 안내 공지 원문 파생)')
    }

    // 2-2) 공모전(contest) — source '공모전' 절 341~363행 원문 3건 (주최 원문 그대로)
    const contests = [
      {
        title: '디지털인문예술 프로젝트 전시회 포스터 공모전',
        host: ['한림대학교 인문사회 융합인재양성사업단 (L-HUSS)', '디지털인문예술전공'],
      },
      {
        title: '도서관 장서표 디자인 공모전',
        host: ['한림대학교 인문사회 융합인재양성사업단 (L-HUSS)', '디지털인문예술전공'],
      },
      {
        title: '디지털인문예술전공 신규 캐릭터 공모전',
        host: ['디지털인문예술전공 제1대 운영위원회 LUCID'],
      },
    ]
    for (const [i, c] of contests.entries()) {
      await client.query(
        `INSERT INTO posts (type, title_ko, body, tag, seed_key, published, created_at, updated_at)
         VALUES ('contest', $1, $2, NULL, $3, TRUE, $4, $4)
         ON CONFLICT (seed_key) DO NOTHING`,
        [c.title, JSON.stringify({ host: c.host }), `contest-${i + 1}`, `2026-01-01T09:00:00+09:00`]
      )
    }
    console.log(`[seed] contests → posts ${contests.length}건`)

    // 2-3) 자료실(resource) — source '자료실' 항목엔 독립 원문 없음(892행 언급뿐).
    //      빈 화면 방지용 1건: 코드쉐어링 인정원(89행 승인과정 원문). 첨부(HWP) 파일은 원문 미제공 → attachments NULL.
    await client.query(
      `INSERT INTO posts (type, title_ko, body, tag, attachments, seed_key, published, created_at, updated_at)
       VALUES ('resource', $1, $2, NULL, NULL, $3, TRUE, $4, $4)
       ON CONFLICT (seed_key) DO NOTHING`,
      [
        '코드쉐어링 인정원',
        JSON.stringify({
          paragraphs: ['승인과정 : 타과 교과목 이수 → 학점 취득 → 코드쉐어링 인정원 작성 → 학과행정실 제출(통합스쿨 교학팀)'],
        }),
        'resource-codesharing',
        `2026-01-01T09:00:00+09:00`,
      ]
    )
    console.log('[seed] resource → posts 1건 (코드쉐어링 인정원 원문)')

    // 2-4) 동아리(club) — clubs.js 4종 전부 posts(type=club). body에 분야·소개·활동·추천대상 원문 보존
    for (const c of clubs) {
      await client.query(
        `INSERT INTO posts (type, title_ko, body, tag, seed_key, published, created_at, updated_at)
         VALUES ('club', $1, $2, $3, $4, TRUE, now(), now())
         ON CONFLICT (seed_key) DO NOTHING`,
        [
          c.name,
          JSON.stringify({ field: c.field, intro: c.intro, activities: c.activities, targets: c.targets }),
          c.field,
          `club-${c.name}`,
        ]
      )
    }
    console.log(`[seed] clubs → posts ${clubs.length}건`)

    // G1: sort = 원문 등장 순서(파일 배열 순서 그대로 1..N). 목록 정렬 tag DESC, sort ASC.
    for (const [i, a] of achievements.entries()) {
      await client.query(
        `INSERT INTO posts (type, title_ko, body, tag, seed_key, sort, published, created_at, updated_at)
         VALUES ('achievement', $1, $2, $3, $4, $5, TRUE, $6, $6)
         ON CONFLICT (seed_key) DO NOTHING`,
        [
          a.title,
          JSON.stringify({ awardee: a.awardee, host: a.host, desc: a.desc, year: a.year }),
          String(a.year),
          a.id, // seed_key(안정 키)
          i + 1, // 원문 등장 순서
          `${a.year}-01-01T09:00:00+09:00`, // 연도 정렬용 합성 타임스탬프
        ]
      )
    }
    console.log(`[seed] achievements → posts ${achievements.length}건`)

    // 3) site_settings: 없는 키만 삽입(DO NOTHING). 어드민이 편집한 hero 버튼·문구 등을 덮어쓰지 않는다.
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
         ON CONFLICT (key) DO NOTHING`,
        [key, JSON.stringify(value)]
      )
    }
    console.log(`[seed] site_settings ${Object.keys(settings).length}키 (없는 키만 삽입)`)

    // 4) codesharing 단일 문서: 비어있을 때만 채운다(schema.sql이 NULL 자리행을 선삽입하므로
    //    DO NOTHING이면 영영 안 채워짐 → body가 NULL일 때만 UPDATE. 이미 채워진 어드민 편집분은 보존).
    await client.query(
      `INSERT INTO codesharing (id, body, depts, hwp_url) VALUES (1, $1, $2, NULL)
       ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body, depts = EXCLUDED.depts
       WHERE codesharing.body IS NULL`,
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

    // 4-1) 운영위원회(council) — H3 원문(councils, 2026 선두 연도 내림차순). 비어있을 때만 삽입.
    //   members jsonb: [{role, name, majors?}] 배열 원문 그대로(페이지 렌더 계약). sort = 배열 순서(0=현역 LUCID).
    if (await isEmpty('council')) {
      for (const [i, c] of councils.entries()) {
        const ord = /제\s?(\d+)대/.exec(c.ordinalLabel)?.[1]
        await client.query(
          `INSERT INTO council (ordinal, name, intro, members, year_label, sort)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            ord ? Number(ord) : null,
            c.title,
            c.intro,
            JSON.stringify(c.members),
            String(c.year),
            i,
          ]
        )
      }
      console.log(`[seed] council ${councils.length}건 (2026 선두, 원문)`)
    } else skip('council')

    // 4-2) 전시회(exhibitions) — source '프로젝트 전시회' 절 원문 아카이브.
    // P5-2: 삭제 금지. 비어있을 때만 전량 삽입(empty-guard) → CMS 편집(poster_url·body·site_url) 보존.
    //   과거 아카이브 포스터는 client/public/images/exhibitions/에 파일로 두고 poster 경로로 참조 가능.
    const exhibitions = [
      {
        semester_label: '제18회 디지털인문예술전공 프로젝트 전시회',
        title: '「 Against the Flow 」',
        intro:
          '디지털 시대의 도시에서 모두는 어떤 디바이스를 통해 세상과 연결되어 있다. 휴대폰의 화면, 헤드폰 속의 소리.\n' +
          '그러나 단 두 사람 "부모와 아이" 만은 어떤 디지털 매개도 거치지 않고, 군중과 반대 방향으로 서로의 손을 잡고 함께 걷는다.\n' +
          '휴먼 터치는 시스템이 합성하지 못하는 인간과 인간 사이의 직접 연결이며, 글로벌 디지털 시스템과 로컬 신체 접촉이 한 횡단보도 위에서 교차하는 연결의 자리다.',
      },
      // [ 역대 전시회 ] 305~339행 — 제목 원문 그대로 (「그래서 우리는  DAH다」의 이중 공백 등 원문 유지)
      { title: '「흐르는 경계: DAH」' },
      { title: '「Pulse」' },
      { title: '「NEXUS : 연결의 시작」' },
      { title: '「Free-Child」' },
      { title: '「무한」' },
      { title: '「흐름」' },
      { title: '「DAH Display : 공존」' },
      { title: '「팔레트」' },
      { title: '「샛별」' },
      { title: '「모두 DAH와 함께」' },
      { title: '「전시회, 우리들의 축제」' },
      { title: '「내 손안에 작은 전시회」' },
      { title: '「그래서 우리는  DAH다」' },
      { title: '「DAH:다」' },
      { title: '「2018-2 프로젝트 전시회」' },
      { title: '「2018-1 프로젝트 전시회」' },
      { title: '「2017-2 프로젝트 전시회」' },
    ]
    // 역대 전시회 포스터(과거 아카이브) — client/public/images/exhibitions/<학기>.webp.
    // 위 exhibitions 배열은 최신→과거 순서라 학기 역순과 1:1 대응(마지막 3건이 2018-2·2018-1·2017-2로 정합 확인).
    const EX_POSTERS = [
      '2026-1', '2025-2', '2025-1', '2024-2', '2024-1', '2023-2', '2023-1', '2022-2', '2022-1',
      '2021-2', '2021-1', '2020-2', '2020-1', '2019-2', '2019-1', '2018-2', '2018-1', '2017-2',
    ].map((s) => `/images/exhibitions/${s}.webp`)
    if (await isEmpty('exhibitions')) {
      for (const [i, e] of exhibitions.entries()) {
        await client.query(
          `INSERT INTO exhibitions (semester_label, title, poster_url, intro, published)
           VALUES ($1, $2, $3, $4, TRUE)`,
          // poster: 명시값(파일 경로/Blob URL) 우선, 없으면 학기 아카이브 포스터 경로.
          [e.semester_label ?? null, e.title, e.poster ?? EX_POSTERS[i] ?? null, e.intro ?? null]
        )
      }
      console.log(`[seed] exhibitions ${exhibitions.length}건 (포스터 경로 포함)`)
    } else skip('exhibitions')

    // 4-3) 쇼케이스(showcase) — 비로그인 제출 테이블. 사용자 제출분 보존을 위해 비어있을 때만 데모 1건 삽입.
    //   원문 미제공 → 학생 성과 원문(2025 AI 에듀테크 소프트랩 해커톤 대상작) 파생. [판단 필요]
    const scCount = await client.query('SELECT COUNT(*)::int AS c FROM showcase')
    if (scCount.rows[0].c === 0) {
      await client.query(
        `INSERT INTO showcase (title, topic, creator, description, semester_label, status)
         VALUES ($1, $2, $3, $4, $5, 'published')`,
        [
          '「AI 저수율 알리미 : 실시간 저수율 데이터로 하는 강릉 가뭄 대비」',
          '2025 AI 에듀테크 소프트랩 해커톤 대상',
          '김도희, 감주희, 박근영, 홍지윤',
          '김도희, 감주희, 박근영, 홍지윤 학생이 2025년 개최된 AI 에듀테크 소프트랩 해커톤에서 대상을 수상했습니다.',
          '2025',
        ]
      )
      console.log('[seed] showcase 데모 1건 (학생 성과 원문 파생)')
    } else {
      console.log(`[seed] showcase 기존 ${scCount.rows[0].c}건 존재 — 데모 삽입 생략`)
    }

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
