// src/routes/content.js — 공개 콘텐츠 조회 (12_BACKEND.md 8절)
// GET /content/:type?tag=&page=&q=  → published만, KPC식 페이지네이션 {items, total, page, pageSize}
// GET /content/:type/:id            → 단건 (미공개는 404)
import { Router } from 'express'
import { query } from '../db.js'
import { getTypeConfig } from '../content-config.js'

const router = Router()

export function wrap(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 100

// 공개·어드민 공용 리스트 빌더. admin=true면 미공개 포함 + status 필터 지원(쇼케이스 큐)
export async function runList(cfg, { tag, q, page, pageSize, admin = false, status } = {}) {
  const where = []
  const params = []

  if (cfg.postType) {
    params.push(cfg.postType)
    where.push(`type = $${params.length}`)
  }
  if (!admin && cfg.publicWhere) where.push(cfg.publicWhere)
  if (admin && status && cfg.table === 'showcase') {
    params.push(status)
    where.push(`status = $${params.length}`)
  }
  if (tag && cfg.tagCol) {
    params.push(tag)
    where.push(`${cfg.tagCol} = $${params.length}`)
  }
  if (q && cfg.searchCols.length > 0) {
    params.push(`%${q}%`)
    const i = params.length
    where.push(`(${cfg.searchCols.map((c) => `${c} ILIKE $${i}`).join(' OR ')})`)
  }

  const whereSql = where.length > 0 ? ` WHERE ${where.join(' AND ')}` : ''
  const p = Math.max(1, parseInt(page, 10) || 1)
  const ps = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE))
  const select = admin ? '*' : cfg.select || '*'

  const countRes = await query(`SELECT COUNT(*)::int AS total FROM ${cfg.table}${whereSql}`, params)
  const total = countRes.rows[0]?.total ?? 0
  const listRes = await query(
    `SELECT ${select} FROM ${cfg.table}${whereSql} ORDER BY ${cfg.orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, ps, (p - 1) * ps]
  )
  return { items: listRes.rows, total, page: p, pageSize: ps }
}

export async function runGetOne(cfg, id, { admin = false } = {}) {
  const where = ['id = $1']
  const params = [id]
  if (cfg.postType) {
    params.push(cfg.postType)
    where.push(`type = $${params.length}`)
  }
  if (!admin && cfg.publicWhere) where.push(cfg.publicWhere)
  const select = admin ? '*' : cfg.select || '*'
  const { rows } = await query(
    `SELECT ${select} FROM ${cfg.table} WHERE ${where.join(' AND ')}`,
    params
  )
  return rows[0] || null
}

router.get(
  '/:type',
  wrap(async (req, res) => {
    const cfg = getTypeConfig(req.params.type)
    if (!cfg) return res.status(404).json({ error: 'unknown content type' })
    const { tag, q, page, pageSize } = req.query
    const result = await runList(cfg, { tag, q, page, pageSize })
    res.json(result)
  })
)

router.get(
  '/:type/:id',
  wrap(async (req, res) => {
    const cfg = getTypeConfig(req.params.type)
    if (!cfg) return res.status(404).json({ error: 'unknown content type' })
    const id = parseInt(req.params.id, 10)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' })
    const item = await runGetOne(cfg, id)
    if (!item) return res.status(404).json({ error: 'not found' })
    res.json({ item })
  })
)

export default router
