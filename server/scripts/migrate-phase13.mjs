// scripts/migrate-phase13.mjs — Phase 13 마이그레이션 (P2 나노디그리 body 정정 + 코드쉐어링 인정 학과 18개 반영)
// 실행: 통합 담당자가 배포 Neon DB에 대해 server/ 안에서 `node scripts/migrate-phase13.mjs` (server/.env DATABASE_URL). 멱등.
// - nanodegree(id=1) body를 정정된 데이터로 UPSERT (기존 잘못된 시드 교체는 태스크가 명시적으로 허용).
// - codesharing(id=1) depts를 새 18개 학과로 UPDATE (기존 19개 → 18개). body(정의·유의·절차·유형)는 건드리지 않음.
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[migrate-phase13] DATABASE_URL이 없습니다.')
  process.exit(1)
}
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

// 정정된 나노디그리 body (KR). 공개 페이지·시드와 동일 구조:
// { intro, cert, programs:[{ name, criteria, partner, completion, courses:[{code,name,credit}] }] }
const NANODEGREE_BODY = {
  intro:
    '디지털인문예술에서는 전공 심화역량 함양과 전공별 현장 실무 중심의 역량 배양을 위하여 운영하는 집중 교육과정인 4개의 나노디그리 과정이 운영되고 있습니다.',
  cert: '각 과정별 인정 교과목 9학점 취득 시 이수증 발급',
  programs: [
    {
      name: 'AI 디자인',
      criteria: '9학점',
      partner: '파이미디어',
      completion: '4과목 중 3과목 이수하면 수료',
      courses: [
        { code: '713014', name: 'UX디자인', credit: '3-3-0' },
        { code: '713037', name: 'AI디자인', credit: '3-3-0' },
        { code: '713031', name: '서비스디자인', credit: '3-3-0' },
        { code: '713035', name: 'AI 이해의 기초', credit: '3-3-0' },
      ],
    },
    {
      name: 'UX 디자인',
      criteria: '9학점',
      partner: 'H9',
      completion: '4과목 중 3과목 이수하면 수료',
      courses: [
        { code: '713014', name: 'UX디자인', credit: '3-3-0' },
        { code: '713044', name: '경험디자인의 고급과정1', credit: '3-2-2' },
        { code: '713031', name: '서비스디자인', credit: '3-3-0' },
        { code: '713033', name: '경험디자인의 고급과정2', credit: '3-1-4' },
      ],
    },
    {
      name: '디지털 디자인',
      criteria: '9학점',
      partner: '루아흐 스튜디오',
      completion: '4과목 중 3과목 이수하면 수료',
      courses: [
        { code: '713010', name: '디지털디자인1', credit: '3-2-2' },
        { code: '713007', name: '디지털디자인2', credit: '3-2-2' },
        { code: '713043', name: '디지털디자인3', credit: '3-2-2' },
        { code: '713042', name: '디지털디자인4', credit: '3-2-2' },
      ],
    },
    {
      name: 'AI와 길 정보 구축 (HUSS)',
      criteria: '9학점',
      partner: '파이미디어',
      completion: '인정교과목 모두 이수하면 수료',
      courses: [
        { code: '108522', name: '도시의 탄생과 인간 삶의 이해', credit: '4-2-2' },
        { code: '713035', name: 'AI 이해의 기초', credit: '3-3-0' },
        { code: '713045', name: '생성형AI와 지역문화데이터', credit: '3-3-0' },
      ],
    },
  ],
}

// 코드쉐어링 학점인정형 인정 학과 18개 (원문 그대로, 이 순서)
const CODESHARING_DEPTS = [
  '국어국문학전공',
  '철학전공',
  '사학전공',
  '영어영문학과',
  '중국학과',
  '일본학과',
  '러시아학과',
  '소프트웨어학부',
  '데이터사이언스학부',
  '데이터테크전공',
  '임상의학통계전공',
  '디지털금융정보전공',
  '미디어스쿨',
  '언론방송융합미디어전공',
  '디지털미디어콘텐츠전공',
  '글로벌협력전공',
  '인문콘텐츠융합전공',
  'MICE기획경영전공',
]

async function main() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // 1) 나노디그리 body 정정 — 잘못된 프로그램 시드 교체 (태스크 명시 허용)
    await client.query(
      `INSERT INTO nanodegree (id, body) VALUES (1, $1::jsonb)
       ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body`,
      [JSON.stringify(NANODEGREE_BODY)],
    )

    // 2) 코드쉐어링 인정 학과 18개 반영 — row가 있을 때만(UPDATE WHERE id=1). body는 건드리지 않음.
    const cs = await client.query(
      `UPDATE codesharing SET depts = $1::jsonb WHERE id = 1`,
      [JSON.stringify(CODESHARING_DEPTS)],
    )

    await client.query('COMMIT')
    console.log(
      `[migrate-phase13] 완료 — nanodegree body 정정, codesharing depts 갱신 ${cs.rowCount}건`,
    )
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[migrate-phase13] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}
main()
