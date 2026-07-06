// src/routes/admin.js — 어드민 콘텐츠 CRUD (12_BACKEND.md 8절 + 13_CMS_SPEC.md 1절 권한 매트릭스)
// POST/PUT/DELETE /admin/content/:type(/:id)
// GET은 8절 계약 외 확장: 어드민 대시보드(13_CMS 6절)가 미공개·pending 큐를 조회해야 해서 추가.
// 삭제: admin+ 전부, manager는 posts 계열 자기 글(created_by)만. 소유자 추적이 없는
// 독립 테이블은 manager 삭제 불가(403).
import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth, hasRole } from '../middleware/auth.js'
import { getTypeConfig, pickColumns } from '../content-config.js'
import { wrap, runList, runGetOne } from './content.js'

const router = Router()
router.use(requireAuth)

// :type 해석 + 유형별 최소 롤 검사 (허용 목록 방식 — 임의 테이블명 차단)
function resolveType(req, res) {
  const cfg = getTypeConfig(req.params.type)
  if (!cfg) {
    res.status(404).json({ error: 'unknown content type' })
    return null
  }
  if (!hasRole(req.user, cfg.minRole)) {
    res.status(403).json({ error: 'insufficient role', required: cfg.minRole })
    return null
  }
  return cfg
}

function parseId(req, res) {
  const id = parseInt(req.params.id, 10)
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'invalid id' })
    return null
  }
  return id
}

function validateBody(cfg, data, { creating }) {
  if (creating) {
    for (const col of cfg.required) {
      if (data[col] === undefined || data[col] === null || data[col] === '') {
        return `${col} is required`
      }
    }
  }
  if (cfg.table === 'curriculum' && data.track !== undefined) {
    if (!['common', 'design', 'ai', 'culture'].includes(data.track)) return 'invalid track'
  }
  if (cfg.table === 'showcase' && data.status !== undefined) {
    if (!['pending', 'published'].includes(data.status)) return 'invalid status'
  }
  return null
}

// 어드민 리스트 (미공개 포함, 쇼케이스는 ?status=pending 큐 필터)
router.get(
  '/:type',
  wrap(async (req, res) => {
    const cfg = resolveType(req, res)
    if (!cfg) return
    const { tag, q, page, pageSize, status } = req.query
    const result = await runList(cfg, { tag, q, page, pageSize, status, admin: true })
    res.json(result)
  })
)

router.get(
  '/:type/:id',
  wrap(async (req, res) => {
    const cfg = resolveType(req, res)
    if (!cfg) return
    const id = parseId(req, res)
    if (id === null) return
    const item = await runGetOne(cfg, id, { admin: true })
    if (!item) return res.status(404).json({ error: 'not found' })
    res.json({ item })
  })
)

router.post(
  '/:type',
  wrap(async (req, res) => {
    const cfg = resolveType(req, res)
    if (!cfg) return
    const data = pickColumns(cfg, req.body || {})
    const invalid = validateBody(cfg, data, { creating: true })
    if (invalid) return res.status(400).json({ error: invalid })

    // 단일 문서(코드쉐어링): id=1 upsert
    if (cfg.singleton) {
      const cols = Object.keys(data)
      if (cols.length === 0) return res.status(400).json({ error: 'empty body' })
      const values = cols.map((c) => data[c])
      const placeholders = cols.map((_, i) => `$${i + 1}`)
      const updates = cols.map((c, i) => `${c} = $${i + 1}`)
      const { rows } = await query(
        `INSERT INTO ${cfg.table} (id, ${cols.join(', ')}) VALUES (1, ${placeholders.join(', ')})
         ON CONFLICT (id) DO UPDATE SET ${updates.join(', ')} RETURNING *`,
        values
      )
      return res.status(201).json({ item: rows[0] })
    }

    if (cfg.postType) {
      data.type = cfg.postType
      data.created_by = req.user.id
    }
    const cols = Object.keys(data)
    const values = cols.map((c) => data[c])
    const placeholders = cols.map((_, i) => `$${i + 1}`)
    const { rows } = await query(
      `INSERT INTO ${cfg.table} (${cols.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
      values
    )
    res.status(201).json({ item: rows[0] })
  })
)

router.put(
  '/:type/:id',
  wrap(async (req, res) => {
    const cfg = resolveType(req, res)
    if (!cfg) return
    const id = cfg.singleton ? 1 : parseId(req, res)
    if (id === null) return
    const data = pickColumns(cfg, req.body || {})
    const invalid = validateBody(cfg, data, { creating: false })
    if (invalid) return res.status(400).json({ error: invalid })
    const cols = Object.keys(data)
    if (cols.length === 0) return res.status(400).json({ error: 'empty body' })

    const sets = cols.map((c, i) => `${c} = $${i + 1}`)
    const params = cols.map((c) => data[c])
    if (cfg.table === 'posts') sets.push('updated_at = now()')

    params.push(id)
    const where = [`id = $${params.length}`]
    if (cfg.postType) {
      params.push(cfg.postType)
      where.push(`type = $${params.length}`)
    }
    const { rows } = await query(
      `UPDATE ${cfg.table} SET ${sets.join(', ')} WHERE ${where.join(' AND ')} RETURNING *`,
      params
    )
    if (!rows[0]) return res.status(404).json({ error: 'not found' })
    res.json({ item: rows[0] })
  })
)

router.delete(
  '/:type/:id',
  wrap(async (req, res) => {
    const cfg = resolveType(req, res)
    if (!cfg) return
    if (cfg.singleton) return res.status(405).json({ error: 'singleton document cannot be deleted' })
    const id = parseId(req, res)
    if (id === null) return

    // manager는 자기 글만 삭제 (13_CMS 1절). 소유자 컬럼이 없는 테이블은 admin+ 전용
    if (!hasRole(req.user, 'admin')) {
      if (!cfg.postType) {
        return res.status(403).json({ error: 'delete requires admin role for this type' })
      }
      const { rows } = await query('SELECT created_by FROM posts WHERE id = $1 AND type = $2', [id, cfg.postType])
      if (!rows[0]) return res.status(404).json({ error: 'not found' })
      if (rows[0].created_by !== req.user.id) {
        return res.status(403).json({ error: 'managers can only delete their own posts' })
      }
    }

    const params = [id]
    const where = ['id = $1']
    if (cfg.postType) {
      params.push(cfg.postType)
      where.push(`type = $${params.length}`)
    }
    const { rows } = await query(
      `DELETE FROM ${cfg.table} WHERE ${where.join(' AND ')} RETURNING id`,
      params
    )
    if (!rows[0]) return res.status(404).json({ error: 'not found' })
    res.json({ ok: true, id: rows[0].id })
  })
)

export default router
