// src/content-config.js — /content/:type, /admin/content/:type 허용 목록 (임의 테이블명 차단)
// 권한 매트릭스: 13_CMS_SPEC.md 1절. posts 계열(type 컬럼)과 독립 테이블 계열을 하나의 맵으로 통합.
// minRole: 작성·수정 최소 롤. 삭제는 admin+ (manager는 posts 계열 자기 글만 — routes/admin.js).

const POST_COLUMNS = [
  'title_ko', 'title_en', 'body', 'tag', 'poster_url', 'gallery',
  'external_url', 'event_start', 'event_end', 'published', 'pinned',
]
const POST_JSONB = ['body', 'gallery']
const POST_ORDER = 'pinned DESC, created_at DESC, id DESC'

function postType(type, minRole, opts = {}) {
  // attachments: PDF·HWP 첨부 배열([{name,url,type,bytes}]). 공지·자료실 type만 화이트리스트에 포함.
  const columns = opts.attachments ? [...POST_COLUMNS, 'attachments'] : POST_COLUMNS
  const jsonb = opts.attachments ? [...POST_JSONB, 'attachments'] : POST_JSONB
  return {
    table: 'posts',
    postType: type,
    minRole,
    columns,
    jsonb,
    required: ['title_ko'],
    orderBy: POST_ORDER,
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
  achievement: postType('achievement', 'manager'),
  resource: postType('resource', 'manager', { attachments: true }),
  club: postType('club', 'manager'),

  // ── 독립 테이블 계열 ──
  professors: {
    table: 'professors',
    minRole: 'admin',
    columns: ['name_ko', 'name_en', 'title_ko', 'title_en', 'email', 'photo_url', 'links', 'sort', 'active'],
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
    columns: ['grade', 'semester', 'track', 'name_ko', 'name_en', 'sort'],
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
  council: {
    table: 'council',
    minRole: 'admin',
    columns: ['ordinal', 'name', 'logo_url', 'intro', 'members', 'year_label', 'sort'],
    jsonb: ['members'],
    required: ['name'],
    orderBy: 'ordinal DESC, sort ASC, id ASC',
    searchCols: ['name', 'year_label'],
  },
  exhibitions: {
    table: 'exhibitions',
    minRole: 'manager', // 13_CMS: 전시회 manager+
    columns: ['semester_label', 'title', 'poster_url', 'site_url', 'intro', 'body', 'gallery', 'held_at', 'published'],
    jsonb: ['body', 'gallery'],
    required: ['title'],
    // held_at은 아카이브 대부분 null → semester_label('YYYY-S' 문자열 역순=학기 역순)로 정렬
    orderBy: 'held_at DESC NULLS LAST, semester_label DESC NULLS LAST, id DESC',
    publicWhere: 'published = TRUE',
    searchCols: ['title', 'semester_label'],
  },
  showcase: {
    table: 'showcase',
    minRole: 'manager', // 승인 큐 (status pending → published)
    columns: ['title', 'topic', 'creator', 'description', 'tools', 'link', 'main_img', 'sub_imgs', 'semester_label', 'status'],
    jsonb: ['tools', 'sub_imgs'],
    required: ['title'],
    orderBy: 'created_at DESC, id DESC',
    publicWhere: "status = 'published'",
    searchCols: ['title', 'creator', 'topic'],
    // 공개 응답에서 수정용 비밀번호 해시 제외
    select: 'id, title, topic, creator, description, tools, link, main_img, sub_imgs, semester_label, status, created_at',
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
