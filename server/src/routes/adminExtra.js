// src/routes/adminExtra.js — 8절 계약 외 확장 (13_CMS_SPEC.md 6절 어드민 대시보드)
// 사용자 관리(owner): GET/POST /admin/users, PUT /admin/users/:id(이름·롤 변경, 비밀번호 리셋 플래그),
//                     DELETE /admin/users/:id. 온보딩은 12_BACKEND 3절: 등록 시 must_set_pw=TRUE.
// 접수 현황(admin+): GET /admin/exhibition/entries — exhibition_entries 목록 (pw_hash 제외).
import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { wrap } from './content.js'

const router = Router()

const ROLES = ['manager', 'admin', 'owner']
const USER_COLS = 'id, email, name, role, must_set_pw, created_at'

router.get(
  '/admin/users',
  requireAuth,
  requireRole('owner'),
  wrap(async (req, res) => {
    const { rows } = await query(`SELECT ${USER_COLS} FROM users ORDER BY id ASC`, [])
    res.json({ items: rows, total: rows.length })
  })
)

router.post(
  '/admin/users',
  requireAuth,
  requireRole('owner'),
  wrap(async (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase()
    const name = String(req.body?.name || '').trim()
    const role = req.body?.role
    if (!email || !name) return res.status(400).json({ error: 'email and name required' })
    if (!ROLES.includes(role)) return res.status(400).json({ error: 'invalid role', allowed: ROLES })
    try {
      const { rows } = await query(
        `INSERT INTO users (email, name, role, must_set_pw) VALUES ($1, $2, $3, TRUE)
         RETURNING ${USER_COLS}`,
        [email, name, role]
      )
      res.status(201).json({ item: rows[0] })
    } catch (err) {
      if (err.code === '23505') return res.status(409).json({ error: 'email already registered' })
      throw err
    }
  })
)

// 이름·롤 변경 + 리셋 플래그(reset: true → must_set_pw=TRUE, password_hash=NULL)
router.put(
  '/admin/users/:id',
  requireAuth,
  requireRole('owner'),
  wrap(async (req, res) => {
    const id = parseInt(req.params.id, 10)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' })
    const { name, role, reset } = req.body || {}
    if (role !== undefined && !ROLES.includes(role)) {
      return res.status(400).json({ error: 'invalid role', allowed: ROLES })
    }
    // 자기 계정 롤 강등·리셋 방지 — owner 부재 상태 차단
    if (id === req.user.id && (role !== undefined || reset)) {
      return res.status(400).json({ error: 'cannot change own role or reset own password' })
    }

    const sets = []
    const params = []
    if (name !== undefined) {
      params.push(String(name).trim())
      sets.push(`name = $${params.length}`)
    }
    if (role !== undefined) {
      params.push(role)
      sets.push(`role = $${params.length}`)
    }
    if (reset) sets.push('must_set_pw = TRUE', 'password_hash = NULL')
    if (sets.length === 0) return res.status(400).json({ error: 'empty body' })

    params.push(id)
    const { rows } = await query(
      `UPDATE users SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING ${USER_COLS}`,
      params
    )
    if (!rows[0]) return res.status(404).json({ error: 'not found' })
    res.json({ item: rows[0] })
  })
)

router.delete(
  '/admin/users/:id',
  requireAuth,
  requireRole('owner'),
  wrap(async (req, res) => {
    const id = parseInt(req.params.id, 10)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' })
    if (id === req.user.id) return res.status(400).json({ error: 'cannot delete own account' })
    const { rows } = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id])
    if (!rows[0]) return res.status(404).json({ error: 'not found' })
    res.json({ ok: true, id: rows[0].id })
  })
)

// 전시회 접수 현황 목록 — 어드민 대시보드·/admin/exhibition (pw_hash 제외)
router.get(
  '/admin/exhibition/entries',
  requireAuth,
  requireRole('admin'),
  wrap(async (req, res) => {
    const p = Math.max(1, parseInt(req.query.page, 10) || 1)
    const ps = Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 50))
    const countRes = await query('SELECT COUNT(*)::int AS total FROM exhibition_entries', [])
    const { rows } = await query(
      `SELECT id, semester_label, entry_type, fields, email, images, created_at, updated_at
       FROM exhibition_entries ORDER BY created_at DESC, id DESC LIMIT $1 OFFSET $2`,
      [ps, (p - 1) * ps]
    )
    res.json({ items: rows, total: countRes.rows[0]?.total ?? 0, page: p, pageSize: ps })
  })
)

export default router
