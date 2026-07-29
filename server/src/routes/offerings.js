// src/routes/offerings.js — 학기별 개설 교과목 (H3-3·H3-4, 37_SHEET_ROADMAP)
// 공개: GET /offerings/semesters, GET /offerings?year=&term=  (비로그인 허용 — 공개 로드맵)
// 관리: POST /admin/offerings, DELETE /admin/offerings/:id    (requireAuth + admin)
// 테이블은 scripts/migrate-h3-offerings.mjs가 만든 semester_offerings.
import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { wrap } from './content.js'

const router = Router()

// 과목 카드 렌더에 필요한 원본 컬럼을 조인해 내려준다(클라이언트가 교과목을 다시 조회하지 않게).
const OFFERING_SELECT = `
  SELECT o.id, o.year, o.term, o.curriculum_id,
         c.name_ko, c.name_en, c.grade, c.semester, c.track, c.credit, c.sort
    FROM semester_offerings o
    JOIN curriculum c ON c.id = o.curriculum_id`

// 로드맵과 동일 순서: 공통기초 최상단 → 학년 → 정렬
const OFFERING_ORDER = `
  ORDER BY (c.track = 'common') DESC, c.grade ASC, c.sort ASC, c.id ASC`

function parseSemester(src) {
  const year = parseInt(src?.year, 10)
  const term = parseInt(src?.term, 10)
  if (!Number.isInteger(year) || year < 2000 || year > 2100) return null
  if (term !== 1 && term !== 2) return null
  return { year, term }
}

// 개설 정보가 있는 학기 목록(최신순). 공개 로드맵의 학기 전환 컨트롤이 읽는다.
router.get(
  '/offerings/semesters',
  wrap(async (req, res) => {
    const { rows } = await query(
      `SELECT year, term, COUNT(*)::int AS count
         FROM semester_offerings
        GROUP BY year, term
        ORDER BY year DESC, term DESC`,
      []
    )
    res.json({ items: rows })
  })
)

router.get(
  '/offerings',
  wrap(async (req, res) => {
    const sem = parseSemester(req.query)
    if (!sem) {
      return res.status(400).json({ error: 'year(2000-2100)와 term(1|2) 쿼리가 필요합니다' })
    }
    const { rows } = await query(
      `${OFFERING_SELECT} WHERE o.year = $1 AND o.term = $2 ${OFFERING_ORDER}`,
      [sem.year, sem.term]
    )
    res.json({ items: rows, year: sem.year, term: sem.term })
  })
)

router.post(
  '/admin/offerings',
  requireAuth,
  requireRole('admin'),
  wrap(async (req, res) => {
    const sem = parseSemester(req.body)
    if (!sem) return res.status(400).json({ error: 'year(2000-2100)와 term(1|2)이 필요합니다' })
    const curriculumId = parseInt(req.body?.curriculum_id, 10)
    if (!Number.isInteger(curriculumId)) {
      return res.status(400).json({ error: 'curriculum_id가 필요합니다' })
    }

    const exists = await query('SELECT id FROM curriculum WHERE id = $1', [curriculumId])
    if (!exists.rows.length) return res.status(404).json({ error: '교과목을 찾을 수 없습니다' })

    // 유니크 인덱스(year, term, curriculum_id) 의존 — 중복은 409로 구분해 알린다.
    const inserted = await query(
      `INSERT INTO semester_offerings (year, term, curriculum_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (year, term, curriculum_id) DO NOTHING
       RETURNING id`,
      [sem.year, sem.term, curriculumId]
    )
    if (!inserted.rows.length) {
      return res.status(409).json({ error: '같은 학기에 이미 등록된 과목입니다' })
    }

    const { rows } = await query(`${OFFERING_SELECT} WHERE o.id = $1`, [inserted.rows[0].id])
    res.status(201).json({ item: rows[0] })
  })
)

router.delete(
  '/admin/offerings/:id',
  requireAuth,
  requireRole('admin'),
  wrap(async (req, res) => {
    const id = parseInt(req.params.id, 10)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' })
    const { rows } = await query('DELETE FROM semester_offerings WHERE id = $1 RETURNING id', [id])
    if (!rows.length) return res.status(404).json({ error: 'not found' })
    res.json({ ok: true, id: rows[0].id })
  })
)

export default router
