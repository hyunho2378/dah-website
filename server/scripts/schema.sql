-- scripts/schema.sql — DAH 웹사이트 DB 스키마 (12_BACKEND.md 4절 초안 그대로)
-- 멱등: CREATE TABLE IF NOT EXISTS + 초기 데이터 ON CONFLICT DO NOTHING.
-- 적용: psql "$DATABASE_URL" -f scripts/schema.sql 또는 node scripts/seed.mjs(내부에서 이 파일을 먼저 실행).

-- 사용자 (권한 4단계 중 로그인 3롤. public은 행 없음)
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  role          TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager')),
  password_hash TEXT,
  must_set_pw   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 사이트 설정 (hero 버튼 텍스트·링크, 접수 버튼 노출 등 key-value)
CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value JSONB
);

-- 게시글형 콘텐츠 (type: notice | lecture | contest | achievement | resource | club)
CREATE TABLE IF NOT EXISTS posts (
  id           SERIAL PRIMARY KEY,
  type         TEXT NOT NULL CHECK (type IN ('notice', 'lecture', 'contest', 'achievement', 'resource', 'club')),
  title_ko     TEXT NOT NULL,
  title_en     TEXT,
  body         JSONB,
  tag          TEXT,
  poster_url   TEXT,
  gallery      JSONB,
  external_url TEXT,
  event_start  TIMESTAMPTZ,
  event_end    TIMESTAMPTZ,
  published    BOOLEAN NOT NULL DEFAULT TRUE,
  pinned       BOOLEAN NOT NULL DEFAULT FALSE,
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_posts_type_published ON posts (type, published, pinned DESC, created_at DESC);

-- 첨부 파일 배열 (PDF·HWP 등 문서). 형태: [{name, url, type, bytes}]. 공지·자료실 type에서 사용.
-- 마이그레이션 안전: 기존 posts 테이블에도 컬럼 없으면 추가 (IF NOT EXISTS).
ALTER TABLE posts ADD COLUMN IF NOT EXISTS attachments JSONB;

-- P5-2: 시드 멱등 키. 시드가 삽입한 posts를 seed_key로 식별해 ON CONFLICT (seed_key) DO NOTHING으로
-- 중복·덮어쓰기를 막는다. CMS 작성분은 seed_key NULL(유니크 인덱스는 NULL 다수 허용).
ALTER TABLE posts ADD COLUMN IF NOT EXISTS seed_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS uq_posts_seed_key ON posts (seed_key);

-- G1(18_PHASE6): 학생 성과 원문 등장 순서. 목록 정렬 = 연도(tag) DESC, 연도 내 sort ASC.
ALTER TABLE posts ADD COLUMN IF NOT EXISTS sort INTEGER;

-- J10(20_PHASE8): 교과목 학점 표기 "학점-강의-실습" (예: 3-2-2)
ALTER TABLE curriculum ADD COLUMN IF NOT EXISTS credit TEXT;

-- 교수진
CREATE TABLE IF NOT EXISTS professors (
  id        SERIAL PRIMARY KEY,
  name_ko   TEXT NOT NULL,
  name_en   TEXT,
  title_ko  TEXT,
  title_en  TEXT,
  email     TEXT,
  photo_url TEXT,
  links     JSONB,
  sort      INTEGER NOT NULL DEFAULT 0,
  active    BOOLEAN NOT NULL DEFAULT TRUE
);

-- 산업 멘토단
CREATE TABLE IF NOT EXISTS mentors (
  id      SERIAL PRIMARY KEY,
  name    TEXT NOT NULL,
  company TEXT,
  title   TEXT,
  link    TEXT,
  sort    INTEGER NOT NULL DEFAULT 0,
  active  BOOLEAN NOT NULL DEFAULT TRUE
);

-- 교과목 로드맵 (track: common | design | ai | culture. common은 로드맵 최상단 고정)
CREATE TABLE IF NOT EXISTS curriculum (
  id       SERIAL PRIMARY KEY,
  grade    INTEGER NOT NULL,
  semester INTEGER,
  track    TEXT NOT NULL CHECK (track IN ('common', 'design', 'ai', 'culture')),
  name_ko  TEXT NOT NULL,
  name_en  TEXT,
  sort     INTEGER NOT NULL DEFAULT 0
);

-- 코드쉐어링 (단일 행 문서. id=1 고정)
CREATE TABLE IF NOT EXISTS codesharing (
  id      INTEGER PRIMARY KEY CHECK (id = 1),
  body    JSONB,
  depts   JSONB,
  hwp_url TEXT
);

-- 운영위원회 (기수별 아카이브)
CREATE TABLE IF NOT EXISTS council (
  id         SERIAL PRIMARY KEY,
  ordinal    INTEGER,
  name       TEXT NOT NULL,
  logo_url   TEXT,
  intro      TEXT,
  members    JSONB,
  year_label TEXT,
  sort       INTEGER NOT NULL DEFAULT 0
);

-- 전시회 아카이브
CREATE TABLE IF NOT EXISTS exhibitions (
  id             SERIAL PRIMARY KEY,
  semester_label TEXT,
  title          TEXT NOT NULL,
  poster_url     TEXT,
  site_url       TEXT,
  intro          TEXT,
  body           JSONB,
  gallery        JSONB,
  held_at        DATE,
  published      BOOLEAN NOT NULL DEFAULT TRUE
);

-- 쇼케이스 (비로그인 제출 → pending → manager+ 승인 시 published)
CREATE TABLE IF NOT EXISTS showcase (
  id             SERIAL PRIMARY KEY,
  title          TEXT NOT NULL,
  topic          TEXT,
  creator        TEXT,
  description    TEXT,
  tools          JSONB,
  link           TEXT,
  main_img       TEXT,
  sub_imgs       JSONB,
  semester_label TEXT,
  edit_pw_hash   TEXT,
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_showcase_status ON showcase (status, created_at DESC);

-- 전시회 접수 설정 (단일 행. id=1 고정. owner·admin이 어드민에서 변경)
CREATE TABLE IF NOT EXISTS exhibition_settings (
  id             INTEGER PRIMARY KEY CHECK (id = 1),
  submit_open    TIMESTAMPTZ,
  submit_close   TIMESTAMPTZ,
  edit_close     TIMESTAMPTZ,
  form_schema    JSONB,
  header_visible BOOLEAN NOT NULL DEFAULT TRUE,
  button_mode    TEXT NOT NULL DEFAULT 'header' CHECK (button_mode IN ('header', 'floating'))
);

-- 전시회 접수 (구글 폼 대체. 이메일+비밀번호로 본인 수정)
CREATE TABLE IF NOT EXISTS exhibition_entries (
  id             SERIAL PRIMARY KEY,
  semester_label TEXT,
  entry_type     TEXT NOT NULL CHECK (entry_type IN ('solo', 'team')),
  fields         JSONB,
  email          TEXT NOT NULL,
  pw_hash        TEXT NOT NULL,
  images         JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_exhibition_entries_email ON exhibition_entries (email);

-- 졸업생 취업 현황
CREATE TABLE IF NOT EXISTS careers (
  id          SERIAL PRIMARY KEY,
  grad_name   TEXT NOT NULL,
  majors      TEXT,
  company     TEXT,
  company_url TEXT,
  position    TEXT,
  year        INTEGER,
  sort        INTEGER NOT NULL DEFAULT 0
);

-- 재학생·졸업생 포트폴리오
CREATE TABLE IF NOT EXISTS portfolios (
  id         SERIAL PRIMARY KEY,
  student_no TEXT,
  name       TEXT NOT NULL,
  majors     TEXT,
  link       TEXT,
  sort       INTEGER NOT NULL DEFAULT 0
);

-- 상담 신청 (Phase 9. POST /consult 공개 접수 → 어드민 열람·읽음 처리)
CREATE TABLE IF NOT EXISTS consultations (
  id         SERIAL PRIMARY KEY,
  company    TEXT,
  name       TEXT NOT NULL,
  contact    TEXT NOT NULL,
  message    TEXT,
  agreed     BOOLEAN NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 나노디그리 (단일 행 문서. id=1 고정 — codesharing과 동일 싱글턴 패턴)
-- body jsonb: { intro, cert, programs: [{ name, courses, partner, rule, note? }] }
CREATE TABLE IF NOT EXISTS nanodegree (
  id   INTEGER PRIMARY KEY CHECK (id = 1),
  body JSONB
);

-- ─── Phase 10 (22_PHASE10) ─────────────────────────────────────
-- M1-1: 이미지 배경 옵션 — 투명 로고 등을 중성 배경 프레임 위에 렌더할지 여부.
ALTER TABLE professors  ADD COLUMN IF NOT EXISTS has_bg BOOLEAN DEFAULT FALSE;
ALTER TABLE council     ADD COLUMN IF NOT EXISTS has_bg BOOLEAN DEFAULT FALSE;
ALTER TABLE showcase    ADD COLUMN IF NOT EXISTS has_bg BOOLEAN DEFAULT FALSE;
ALTER TABLE posts       ADD COLUMN IF NOT EXISTS has_bg BOOLEAN DEFAULT FALSE; -- 동아리 로고용

-- M1-2: 전시회 기간·상단 고정. held_at은 레거시 유지.
ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS start_date  DATE;
ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS end_date    DATE;
ALTER TABLE exhibitions ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- ─── 초기 데이터 ───────────────────────────────────────────────

-- 전시회 접수 2026-2 일정 초기값 (12_BACKEND.md 5절. 11-24 00:00부터 신규·수정 전면 차단)
INSERT INTO exhibition_settings (id, submit_open, submit_close, edit_close, form_schema, header_visible, button_mode)
VALUES (
  1,
  '2026-11-02T00:00:00+09:00',
  '2026-11-13T23:59:59+09:00',
  '2026-11-23T23:59:59+09:00',
  NULL,
  TRUE,
  'header'
)
ON CONFLICT (id) DO NOTHING;

-- 코드쉐어링 단일 행 자리 (내용은 seed.mjs가 tracks.js 원문으로 채움)
INSERT INTO codesharing (id, body, depts, hwp_url)
VALUES (1, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 나노디그리 단일 행 자리 (내용은 migrate-phase9.mjs가 data/nanodegree.js 원문으로 채움)
INSERT INTO nanodegree (id, body)
VALUES (1, NULL)
ON CONFLICT (id) DO NOTHING;
