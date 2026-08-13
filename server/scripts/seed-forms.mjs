// scripts/seed-forms.mjs: 자체 폼 시드 (39_FORM_BUILDER P1-4, 비파괴)
//
// 종강총회 참가 신청 + 신입 부원 모집 2건. 안내문, 라벨, 힌트, 보기 문구는 39_FORM_BUILDER.md
// 원문 그대로다. 표현을 다듬거나 띄어쓰기를 고치지 않는다.
//
// 비파괴 계약: seed_key + ON CONFLICT (seed_key) DO NOTHING. 이미 있으면 손대지 않는다.
// 어드민에서 사람이 만든 폼(seed_key NULL)은 어떤 경우에도 건드리지 않는다. DELETE 없음.
//
// 실행: server/ 안에서 `node scripts/seed-forms.mjs`
import 'dotenv/config'
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.error('[seed-forms] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

/** 필드 배열 완성. id는 f1..fN 고정(응답 data의 키이자 시트 컬럼 키라 바뀌면 안 된다) */
function fields(list) {
  return list.map((f, i) => ({
    id: `f${i + 1}`,
    label_ko: f.label_ko,
    label_en: '',
    type: f.type,
    required: Boolean(f.required),
    placeholder_ko: '',
    placeholder_en: '',
    hint_ko: f.hint_ko ?? '',
    hint_en: '',
    options: f.options ?? [],
    options_en: [],
    validation: f.validation ?? {},
    order: i + 1,
  }))
}

const CLOSING_DESCRIPTION = `안녕하십니까, 디지털인문예술전공 제1대 운영위원회 'LUCID'입니다.

2026학년도 1학기 디지털인문예술전공 종강 총회와 함께, 학기를 마무리하며 식사 자리를 마련했습니다.

디지털인문예술 전공생, 복수전공생과 이번 학기 디지털인문예술전공 강의를 수강한 학생들 모두 환영하오니 많은 관심과 참여 부탁드립니다.

일시: 2026. 6. 4 (목) 18:00
장소: C.square Blue
신청 기간: 2026.05.28(목) ~ 2026.06.01(월)
뒷풀이 장소: 별미닭갈비 / 비용 8,000원
뒷풀이 참가 희망자는 폼 제출 후 꼭 아래 계좌로 입금해 주시기 바랍니다.
(농협 351-0693-3247-73 주현호)
문의: 위원장 주현호 (010-7262-2378)`

const RECRUIT_DESCRIPTION = `"흐릿한 가능성을 선명한 확신으로."
안녕하세요, 한림대학교 디지털인문예술전공 제1대 운영위원회 LUCID(루시드)입니다.
저희와 함께 가장 투명하고 선명한 빛을 만들어갈 1기 국원을 모집합니다.

[모집 일정]
서류 접수: 2026.01.23(금) ~ 01.30(금)
면접 일정: 2026.01.31(토) ~ 02.01(일) (대면/비대면 추후 공지)

[문의]
위원장 주현호 (010-7262-2378) / 인스타그램 @hallym_lucid

원활한 국원 모집 및 면접 진행을 위해 아래와 같이 개인정보를 수집·이용하고자 합니다.
1. 수집 목적: 신입 국원 모집 서류 심사, 면접 안내, 합격자 통보
2. 수집 항목: 성명, 학번, 전공(주/복수), 전화번호, 포트폴리오
3. 보유 기간: 모집 종료 후 1개월 이내 파기 (단, 합격자는 활동 기간 동안 보유)
귀하는 개인정보 수집 거부 권리가 있으나, 거부 시 지원이 불가능할 수 있습니다.`

const FORMS = [
  {
    seed_key: 'form-closing-2026-1',
    slug: 'closing-2026-1',
    title_ko: '2026-1학기 디지털인문예술전공 종강 총회 및 회식 참가 신청',
    description_ko: CLOSING_DESCRIPTION,
    category: 'event',
    // 기간은 안내문의 "신청 기간: 2026.05.28(목) ~ 2026.06.01(월)" 기준
    settings: {
      accept_start: '2026-05-28T00:00:00+09:00',
      accept_end: '2026-06-01T23:59:00+09:00',
      edit_end: '2026-06-03T23:59:00+09:00',
      require_google_auth: true,
      max_responses: null,
      show_button_in_header: false,
      button_label_ko: '참가 신청',
      button_label_en: 'Apply',
    },
    fields: fields([
      { type: 'text', label_ko: '이름', required: true },
      { type: 'studentid', label_ko: '학번', hint_ko: '8자리 (예: 20261234)', required: true },
      {
        type: 'radio',
        label_ko: '전공 구분',
        options: [
          '주전공생',
          '복수전공생',
          '1학기 디인예 전공 과목 수강생(타과생)',
          '디인예 전공 동아리원',
          '기타',
        ],
        required: true,
      },
      { type: 'phone', label_ko: '연락처', hint_ko: '예: 010-1234-5678', required: true },
      {
        type: 'radio',
        label_ko: '종강 총회 참석 여부',
        options: ['참석', '불참(뒷풀이만 참가)'],
        required: true,
      },
      {
        type: 'radio',
        label_ko: '뒷풀이 참석 여부',
        options: ['참석 (비용 8,000원 입금 후 제출, 농협 351-0693-3247-73 주현호)', '불참'],
        required: true,
      },
    ]),
  },
  {
    seed_key: 'form-recruit-2026-1',
    slug: 'recruit-2026-1',
    title_ko: '2026 제1대 디지털인문예술전공 운영위원회 "LUCID" 신입 부원 모집',
    description_ko: RECRUIT_DESCRIPTION,
    category: 'recruit',
    // 기간은 안내문의 "서류 접수: 2026.01.23(금) ~ 01.30(금)" 기준.
    // 수정 마감은 따로 정해진 값이 없어 비운다. 서버가 접수 마감을 수정 마감으로 쓴다.
    settings: {
      accept_start: '2026-01-23T00:00:00+09:00',
      accept_end: '2026-01-30T23:59:00+09:00',
      edit_end: null,
      require_google_auth: true,
      max_responses: null,
      show_button_in_header: false,
      button_label_ko: '지원하기',
      button_label_en: 'Apply',
    },
    fields: fields([
      { type: 'text', label_ko: '이름', required: true },
      { type: 'studentid', label_ko: '학번', hint_ko: 'ex. 20260000', required: true },
      { type: 'text', label_ko: '주전공', required: true },
      { type: 'text', label_ko: '복수전공', hint_ko: "해당 없을 시 '없음' 기재", required: true },
      {
        type: 'phone',
        label_ko: '전화번호',
        hint_ko: 'ex. 010-1234-5678 형식으로 기재해주세요',
        required: true,
      },
      {
        type: 'radio',
        label_ko: '희망부서 (1순위)',
        options: ['기획부', '홍보부', '웹전시부'],
        required: true,
      },
      {
        type: 'radio',
        label_ko: '희망부서 (2순위)',
        options: ['기획부', '홍보부', '웹전시부'],
        required: true,
      },
      {
        type: 'textarea',
        label_ko: '자기소개',
        hint_ko:
          '자신을 가장 잘 표현할 수 있는 키워드나 경험을 바탕으로 작성해 주세요. (공백 포함 200자 이내)',
        validation: { maxLength: 200 },
        required: true,
      },
      {
        type: 'textarea',
        label_ko: '지원 동기 및 포부',
        hint_ko:
          '운영위원회에 지원하게 된 계기와 입부 후 해보고 싶은 활동을 구체적으로 작성해 주세요. (공백 포함 500자 이내)',
        validation: { maxLength: 500 },
        required: true,
      },
      {
        type: 'file',
        label_ko: '포트폴리오 제출',
        hint_ko:
          '홍보부 1순위 지원자 필수, 그 외 부서 선택 사항. 본인의 작업물(카드뉴스, 디자인, 프로젝트, 웹사이트 등)을 PDF 형태로 제출해 주세요.',
        required: false,
      },
      {
        type: 'checkbox',
        label_ko: '면접 가능 일자',
        hint_ko:
          '가능 일자에 따른 구체적인 시간을 개별 공지합니다. 면접은 비대면(ZOOM)으로 진행합니다.',
        options: ['2026.01.31(토)', '2026.02.01(일)', '양일 가능'],
        required: true,
      },
    ]),
  },
]

async function main() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // 멱등 보장 (schema.sql 미적용 환경 대비)
    await client.query('ALTER TABLE custom_forms ADD COLUMN IF NOT EXISTS seed_key TEXT')
    await client.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS uq_custom_forms_seed_key ON custom_forms (seed_key)'
    )

    let inserted = 0
    for (const f of FORMS) {
      const res = await client.query(
        `INSERT INTO custom_forms
           (slug, title_ko, description_ko, category, fields, settings, published, seed_key)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE, $7)
         ON CONFLICT (seed_key) DO NOTHING
         RETURNING id`,
        [
          f.slug,
          f.title_ko,
          f.description_ko,
          f.category,
          JSON.stringify(f.fields),
          JSON.stringify(f.settings),
          f.seed_key,
        ]
      )
      if (res.rowCount > 0) inserted++
      console.log(
        res.rowCount > 0
          ? `[seed-forms] 삽입: ${f.slug} (필드 ${f.fields.length}개)`
          : `[seed-forms] 건너뜀(존재): ${f.slug}`
      )
    }

    const { rows } = await client.query(
      'SELECT COUNT(*)::int AS n FROM custom_forms WHERE seed_key = ANY($1)',
      [FORMS.map((f) => f.seed_key)]
    )
    await client.query('COMMIT')

    console.log(`[seed-forms] 신규 ${inserted}건 / 시드 폼 총 ${rows[0].n}건`)
    if (rows[0].n !== FORMS.length) {
      console.error(`[seed-forms] 기대치(${FORMS.length}건)와 다릅니다.`)
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
  console.error('[seed-forms] 실패:', err)
  process.exit(1)
})
