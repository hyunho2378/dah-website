// src/content-config.js — /content/:type, /admin/content/:type 허용 목록 (임의 테이블명 차단)
// 권한 매트릭스: 13_CMS_SPEC.md 1절. posts 계열(type 컬럼)과 독립 테이블 계열을 하나의 맵으로 통합.
// minRole: 작성·수정 최소 롤. 삭제는 admin+ (manager는 posts 계열 자기 글만 — routes/admin.js).

const POST_COLUMNS = [
  'title_ko', 'title_en', 'body', 'body_en', 'tag', 'poster_url', 'gallery',
  'external_url', 'event_start', 'event_end', 'published', 'pinned', 'has_bg',
]
// R1(27_I18N): body_en = 영문 리치 본문(수동 입력). body와 동일 jsonb.
const POST_JSONB = ['body', 'body_en', 'gallery']
const POST_ORDER = 'pinned DESC, created_at DESC, id DESC'

function postType(type, minRole, opts = {}) {
  // attachments: PDF·HWP 첨부 배열([{name,url,type,bytes}]). 공지·자료실 type만 화이트리스트에 포함.
  let columns = opts.attachments ? [...POST_COLUMNS, 'attachments'] : POST_COLUMNS
  const jsonb = opts.attachments ? [...POST_JSONB, 'attachments'] : POST_JSONB
  // G1: 원문 등장 순서(sort) 지원 — 성과 등 순서가 의미인 type만
  if (opts.sortable) columns = [...columns, 'sort']
  return {
    table: 'posts',
    postType: type,
    minRole,
    columns,
    jsonb,
    required: ['title_ko'],
    orderBy: opts.orderBy || POST_ORDER,
    publicWhere: 'published = TRUE',
    searchCols: ['title_ko', 'title_en'],
    tagCol: 'tag',
  }
}

export const CONTENT_TYPES = {
  // ── posts 계열 (T1·T2·성좌·카드) ── 13_CMS 1절: 전부 manager+
  // 공지·자료실만 attachments(PDF·HWP 첨부) 허용 (13_CMS 1절: 자료실 "첨부(Blob) 허용")
  notice: postType('notice', 'manager', { attachments: true }),
  lecture: postType('lecture', 'manager'),
  contest: postType('contest', 'manager'),
  // G1: 연도(tag) 내림차순 + 연도 내 원문 등장 순서(sort) 오름차순 = 화면이 원문과 1:1
  achievement: postType('achievement', 'manager', {
    sortable: true,
    orderBy: 'tag DESC, sort ASC NULLS LAST, id ASC',
  }),
  resource: postType('resource', 'manager', { attachments: true }),
  // M3-2: 동아리 DragHandle 정렬 저장 — sort 컬럼 화이트리스트 + sort 오름차순
  club: postType('club', 'manager', { sortable: true, orderBy: 'sort ASC NULLS LAST, id ASC' }),

  // ── 독립 테이블 계열 ──
  professors: {
    table: 'professors',
    minRole: 'admin',
    columns: ['name_ko', 'name_en', 'title_ko', 'title_en', 'email', 'photo_url', 'links', 'sort', 'active', 'has_bg'],
    jsonb: ['links'],
    required: ['name_ko'],
    orderBy: 'sort ASC, id ASC',
    publicWhere: 'active = TRUE',
    searchCols: ['name_ko', 'name_en'],
  },
  mentors: {
    table: 'mentors',
    minRole: 'admin',
    columns: ['name', 'company', 'title', 'link', 'sort', 'active'],
    jsonb: [],
    required: ['name'],
    orderBy: 'sort ASC, id ASC',
    publicWhere: 'active = TRUE',
    searchCols: ['name', 'company'],
  },
  curriculum: {
    table: 'curriculum',
    minRole: 'admin',
    columns: ['grade', 'semester', 'track', 'name_ko', 'name_en', 'credit', 'sort'],
    jsonb: [],
    required: ['grade', 'track', 'name_ko'],
    orderBy: 'grade ASC, sort ASC, id ASC',
    searchCols: ['name_ko'],
  },
  codesharing: {
    table: 'codesharing',
    minRole: 'admin',
    singleton: true, // 단일 문서 (id=1 고정, POST·PUT 모두 upsert)
    columns: ['body', 'depts', 'hwp_url'],
    jsonb: ['body', 'depts'],
    required: [],
    orderBy: 'id ASC',
    searchCols: [],
  },
  nanodegree: {
    table: 'nanodegree',
    minRole: 'admin',
    singleton: true, // 단일 문서 (id=1 고정, codesharing과 동일 패턴)
    columns: ['body'],
    jsonb: ['body'],
    required: [],
    orderBy: 'id ASC',
    searchCols: [],
  },
  // N1-5: CI(브랜드 아이덴티티) 단일 문서 (codesharing·nanodegree 동일 싱글턴 패턴)
  // body jsonb: { intro, elements:[{title,text,image}], logoGuide:[{title,image}], colors:[{name,hex}], downloads:[{label,url}] }
  ci: {
    table: 'ci',
    minRole: 'admin',
    singleton: true,
    columns: ['body'],
    jsonb: ['body'],
    required: [],
    orderBy: 'id ASC',
    searchCols: [],
  },
  council: {
    table: 'council',
    minRole: 'admin',
    columns: ['ordinal', 'name', 'logo_url', 'intro', 'members', 'year_label', 'sort', 'has_bg'],
    jsonb: ['members'],
    required: ['name'],
    // H3: 연도 내림차순(2026 현 운영위 선두). ordinal은 운영위/학생회 대수가 섞여 정렬 키로 부적합
    orderBy: 'year_label DESC NULLS LAST, sort ASC, id ASC',
    searchCols: ['name', 'year_label'],
  },
  exhibitions: {
    table: 'exhibitions',
    minRole: 'manager', // 13_CMS: 전시회 manager+
    // N1-2 ordinal(회차, full_title은 exhibitionFullTitle로 파생 — DB 저장 안 함).
    // N1-3 held_at 제거(레거시 컬럼은 DB에 남기되 미사용). 개최일 = start_date.
    // Q2: 상단 고정 CTA 버튼(표시 여부·텍스트·링크)
    // R1(27_I18N): title_en·intro_en·body_en = 영문 수동 입력(발행 게이트). 전시회는 title_ko 없이 title 단일이라 title_en 신설
    columns: ['semester_label', 'title', 'title_en', 'ordinal', 'poster_url', 'site_url', 'intro', 'intro_en', 'body', 'body_en', 'gallery', 'start_date', 'end_date', 'is_featured', 'cta_show', 'cta_label', 'cta_url', 'published'],
    jsonb: ['body', 'body_en', 'gallery'],
    required: ['title'],
    // N1-3: start_date(=개최일) 역순 정렬. 레거시 held_at은 migrate-phase11이 start_date로 백필.
    // 여전히 null이면 semester_label('YYYY-S' 문자열 역순=학기 역순)로 폴백.
    orderBy: 'start_date DESC NULLS LAST, semester_label DESC NULLS LAST, id DESC',
    publicWhere: 'published = TRUE',
    searchCols: ['title', 'semester_label'],
  },
  showcase: {
    table: 'showcase',
    minRole: 'manager', // 승인 큐 (status pending → published)
    columns: ['title', 'topic', 'creator', 'description', 'tools', 'link', 'main_img', 'sub_imgs', 'semester_label', 'status', 'has_bg'],
    jsonb: ['tools', 'sub_imgs'],
    required: ['title'],
    orderBy: 'created_at DESC, id DESC',
    publicWhere: "status = 'published'",
    searchCols: ['title', 'creator', 'topic'],
    // 공개 응답에서 수정용 비밀번호 해시 제외
    select: 'id, title, topic, creator, description, tools, link, main_img, sub_imgs, semester_label, status, has_bg, created_at',
  },
  careers: {
    table: 'careers',
    minRole: 'admin', // 13_CMS: 취업 현황 admin+
    columns: ['grad_name', 'majors', 'company', 'company_url', 'position', 'year', 'sort'],
    jsonb: [],
    required: ['grad_name'],
    orderBy: 'sort ASC, id ASC',
    searchCols: ['grad_name', 'company'],
  },
  portfolios: {
    table: 'portfolios',
    minRole: 'manager', // 13_CMS: 포트폴리오 manager+
    columns: ['student_no', 'name', 'majors', 'link', 'sort'],
    jsonb: [],
    required: ['name'],
    orderBy: 'sort ASC, id ASC',
    searchCols: ['name'],
  },
}

export function getTypeConfig(type) {
  return Object.prototype.hasOwnProperty.call(CONTENT_TYPES, type) ? CONTENT_TYPES[type] : null
}

// jsonb 컬럼은 명시적으로 문자열화 (node-postgres가 JS 배열을 PG 배열로 직렬화하는 사고 방지)
export function pickColumns(cfg, body) {
  const data = {}
  for (const col of cfg.columns) {
    if (body[col] === undefined) continue
    const v = body[col]
    data[col] = cfg.jsonb.includes(col) && v !== null ? JSON.stringify(v) : v
  }
  return data
}
