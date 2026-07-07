// src/routes/tags.js — 공지 태그 시스템 (Phase 9 K1-1)
// 저장소: site_settings key 'tags' (JSONB 문자열 배열). 관리자가 생성한 태그를 전 게시물이 공용 재사용.
// GET    /tags             (공개)   → { items: ['태그명', ...] } — 공개 공지 필터(K2)와 PostForm이 소비
// POST   /admin/tags       (manager+) { name } → 목록에 추가 (중복은 멱등 통과)
// DELETE /admin/tags/:name (manager+) → 목록에서 제거 + 해당 태그 게시물 태그 해제(UPDATE posts SET tag=NULL)
import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { wrap } from './content.js'

const router = Router()

const MAX_TAG_LENGTH = 30

async function readTags() {
  const { rows } = await query(`SELECT value FROM site_settings WHERE key = 'tags'`, [])
  const value = rows[0]?.value
  return Array.isArray(value) ? value.filter((t) => typeof t === 'string') : []
}

async function writeTags(tags) {
  await query(
    `INSERT INTO site_settings (key, value) VALUES ('tags', $1)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [JSON.stringify(tags)]
  )
}

router.get(
  '/tags',
  wrap(async (req, res) => {
    res.json({ items: await readTags() })
  })
)

router.post(
  '/admin/tags',
  requireAuth,
  requireRole('manager'),
  wrap(async (req, res) => {
    const name = String(req.body?.name || '').trim()
    if (!name) return res.status(400).json({ error: 'name is required' })
    if (name.length > MAX_TAG_LENGTH) {
      return res.status(400).json({ error: `tag name must be ${MAX_TAG_LENGTH} characters or fewer` })
    }
    const tags = await readTags()
    if (!tags.includes(name)) {
      tags.push(name)
      await writeTags(tags)
    }
    res.status(201).json({ items: tags })
  })
)

router.delete(
  '/admin/tags/:name',
  requireAuth,
  requireRole('manager'),
  wrap(async (req, res) => {
    const name = String(req.params.name || '').trim()
    if (!name) return res.status(400).json({ error: 'name is required' })
    const tags = await readTags()
    if (!tags.includes(name)) return res.status(404).json({ error: 'unknown tag' })
    await writeTags(tags.filter((t) => t !== name))
    // 삭제된 태그가 지정된 게시물은 태그 해제 (사용자 지시)
    await query('UPDATE posts SET tag = NULL WHERE tag = $1', [name])
    res.json({ items: tags.filter((t) => t !== name) })
  })
)

export default router
