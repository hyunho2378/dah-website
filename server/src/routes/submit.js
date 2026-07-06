// src/routes/submit.js — 비로그인 제출 (12_BACKEND.md 5·6절)
// 전시회 접수: POST/PUT /submit/exhibition — 기간 서버 검증(클라 시계 불신), readonly 필드 보호
// 쇼케이스: POST /submit/showcase, PUT /submit/showcase/:id — status pending, 비번 수정
// 보조: POST /submit/exhibition/list — /submit/edit 화면의 본인 접수 목록 (8절 계약 외 확장)
import { Router } from 'express'
import bcrypt from 'bcrypt'
import { query } from '../db.js'
import { submitLimiter } from '../middleware/rateLimit.js'
import { wrap } from './content.js'

const router = Router()

const MAX_ENTRY_IMAGES = 5 // 접수 1건당 이미지 개수 상한 (용량은 /upload에서 제한)
const MAX_SHOWCASE_SUB_IMGS = 2
const MIN_SUBMIT_PW = 6 // 제출용 비밀번호 최소 길이 (스태프 계정 8자와 별개)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 전시회 접수 readonly 보호 대상 (12_BACKEND 5절: 참가 유형·과목·이메일은 수정 불가)
const READONLY_TOP = ['entry_type', 'email']
const READONLY_FIELD_KEYS = ['entry_type', 'entryType', 'email', 'subject', 'course']

async function getExhibitionSettings() {
  const { rows } = await query('SELECT * FROM exhibition_settings WHERE id = 1')
  return rows[0] || null
}

function within(now, from, to) {
  if (!from || !to) return false
  return now >= new Date(from) && now <= new Date(to)
}

// submit_open 기준 학기 라벨 산출 (예: 2026-11 → '2026-2')
function semesterLabelFrom(settings) {
  if (!settings?.submit_open) return null
  const d = new Date(settings.submit_open)
  return `${d.getFullYear()}-${d.getMonth() + 1 >= 7 ? 2 : 1}`
}

function stripSensitive(row) {
  if (!row) return row
  const { pw_hash, edit_pw_hash, ...rest } = row
  return rest
}

function validImages(images) {
  return (
    images === undefined ||
    (Array.isArray(images) && images.length <= MAX_ENTRY_IMAGES && images.every((u) => typeof u === 'string'))
  )
}

// ── 전시회 접수 ──────────────────────────────────────────────

router.post(
  '/exhibition',
  submitLimiter,
  wrap(async (req, res) => {
    const settings = await getExhibitionSettings()
    const now = new Date()
    if (!settings || !within(now, settings.submit_open, settings.submit_close)) {
      return res.status(403).json({
        error: 'submission period closed',
        schedule: settings
          ? { submit_open: settings.submit_open, submit_close: settings.submit_close }
          : null,
      })
    }

    const { entry_type, email, password, fields, images } = req.body || {}
    if (!['solo', 'team'].includes(entry_type)) return res.status(400).json({ error: 'entry_type must be solo or team' })
    if (!EMAIL_RE.test(String(email || ''))) return res.status(400).json({ error: 'valid email required' })
    if (!password || String(password).length < MIN_SUBMIT_PW) {
      return res.status(400).json({ error: `password must be at least ${MIN_SUBMIT_PW} characters` })
    }
    if (fields !== undefined && (typeof fields !== 'object' || fields === null || Array.isArray(fields))) {
      return res.status(400).json({ error: 'fields must be an object' })
    }
    if (!validImages(images)) {
      return res.status(400).json({ error: `images must be an array of at most ${MAX_ENTRY_IMAGES} urls` })
    }

    const pwHash = await bcrypt.hash(String(password), 10)
    const { rows } = await query(
      `INSERT INTO exhibition_entries (semester_label, entry_type, fields, email, pw_hash, images)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, semester_label, entry_type, fields, email, images, created_at, updated_at`,
      [
        semesterLabelFrom(settings),
        entry_type,
        fields ? JSON.stringify(fields) : null,
        String(email).trim().toLowerCase(),
        pwHash,
        images ? JSON.stringify(images) : JSON.stringify([]),
      ]
    )
    res.status(201).json({ entry: rows[0] })
  })
)

router.put(
  '/exhibition',
  submitLimiter,
  wrap(async (req, res) => {
    const settings = await getExhibitionSettings()
    const now = new Date()
    // 수정은 edit_close까지 허용 (submit_close 이후~edit_close 사이에도 가능)
    if (!settings || !within(now, settings.submit_open, settings.edit_close)) {
      return res.status(403).json({
        error: 'edit period closed',
        schedule: settings
          ? { submit_open: settings.submit_open, edit_close: settings.edit_close }
          : null,
      })
    }

    const { id, email, password, fields, images } = req.body || {}
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'entry id required' })
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })
    if (!validImages(images)) {
      return res.status(400).json({ error: `images must be an array of at most ${MAX_ENTRY_IMAGES} urls` })
    }

    const { rows } = await query(
      'SELECT * FROM exhibition_entries WHERE id = $1 AND email = $2',
      [id, String(email).trim().toLowerCase()]
    )
    const entry = rows[0]
    if (!entry) return res.status(404).json({ error: 'entry not found' })
    const ok = await bcrypt.compare(String(password), entry.pw_hash)
    if (!ok) return res.status(401).json({ error: 'invalid credentials' })

    // readonly 필드 보호: 참가 유형·과목·이메일은 PUT에서 무시하고 로그 (12_BACKEND 5절)
    const ignoredTop = READONLY_TOP.filter((k) => req.body[k] !== undefined && req.body[k] !== entry[k])
    let mergedFields = entry.fields || {}
    if (fields && typeof fields === 'object' && !Array.isArray(fields)) {
      const incoming = { ...fields }
      const ignoredFieldKeys = []
      for (const key of READONLY_FIELD_KEYS) {
        if (key in incoming) {
          ignoredFieldKeys.push(key)
          delete incoming[key]
        }
      }
      if (ignoredTop.length > 0 || ignoredFieldKeys.length > 0) {
        console.warn(
          `[submit/exhibition] entry ${entry.id}: readonly 필드 수정 시도 무시 —`,
          [...ignoredTop, ...ignoredFieldKeys.map((k) => `fields.${k}`)].join(', ')
        )
      }
      // readonly 키는 기존 값 유지
      mergedFields = { ...mergedFields, ...incoming }
      for (const key of READONLY_FIELD_KEYS) {
        if (entry.fields && key in entry.fields) mergedFields[key] = entry.fields[key]
      }
    }

    const updated = await query(
      `UPDATE exhibition_entries
       SET fields = $1, images = COALESCE($2, images), updated_at = now()
       WHERE id = $3
       RETURNING id, semester_label, entry_type, fields, email, images, created_at, updated_at`,
      [JSON.stringify(mergedFields), images ? JSON.stringify(images) : null, entry.id]
    )
    res.json({ entry: updated.rows[0] })
  })
)

// 본인 접수 목록 (이메일+비밀번호 검증 후 반환) — /submit/edit 화면용 보조 엔드포인트
router.post(
  '/exhibition/list',
  submitLimiter,
  wrap(async (req, res) => {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })
    const { rows } = await query(
      'SELECT * FROM exhibition_entries WHERE email = $1 ORDER BY created_at DESC',
      [String(email).trim().toLowerCase()]
    )
    const entries = []
    for (const row of rows) {
      if (await bcrypt.compare(String(password), row.pw_hash)) entries.push(stripSensitive(row))
    }
    if (entries.length === 0) return res.status(401).json({ error: 'invalid credentials' })
    res.json({ entries })
  })
)

// ── 쇼케이스 제출 ──────────────────────────────────────────────

const SHOWCASE_FIELDS = ['title', 'topic', 'creator', 'description', 'tools', 'link', 'main_img', 'sub_imgs', 'semester_label']

function validateShowcaseBody(body, { creating }) {
  if (creating) {
    if (!body.title) return 'title required'
    if (!body.creator) return 'creator required'
    if (!body.main_img) return 'main_img required'
  }
  if (body.tools !== undefined && !Array.isArray(body.tools)) return 'tools must be an array'
  if (body.sub_imgs !== undefined) {
    if (!Array.isArray(body.sub_imgs) || body.sub_imgs.length > MAX_SHOWCASE_SUB_IMGS) {
      return `sub_imgs must be an array of at most ${MAX_SHOWCASE_SUB_IMGS} urls`
    }
  }
  return null
}

router.post(
  '/showcase',
  submitLimiter,
  wrap(async (req, res) => {
    const body = req.body || {}
    const invalid = validateShowcaseBody(body, { creating: true })
    if (invalid) return res.status(400).json({ error: invalid })
    if (!body.password || String(body.password).length < MIN_SUBMIT_PW) {
      return res.status(400).json({ error: `password must be at least ${MIN_SUBMIT_PW} characters` })
    }

    const pwHash = await bcrypt.hash(String(body.password), 10)
    const { rows } = await query(
      `INSERT INTO showcase (title, topic, creator, description, tools, link, main_img, sub_imgs, semester_label, edit_pw_hash, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
       RETURNING id, title, topic, creator, description, tools, link, main_img, sub_imgs, semester_label, status, created_at`,
      [
        body.title,
        body.topic ?? null,
        body.creator,
        body.description ?? null,
        JSON.stringify(body.tools ?? []),
        body.link ?? null,
        body.main_img,
        JSON.stringify(body.sub_imgs ?? []),
        body.semester_label ?? null,
        pwHash,
      ]
    )
    res.status(201).json({ item: rows[0] })
  })
)

router.put(
  '/showcase/:id',
  submitLimiter,
  wrap(async (req, res) => {
    const id = parseInt(req.params.id, 10)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' })
    const body = req.body || {}
    if (!body.password) return res.status(400).json({ error: 'password required' })
    const invalid = validateShowcaseBody(body, { creating: false })
    if (invalid) return res.status(400).json({ error: invalid })

    const { rows } = await query('SELECT * FROM showcase WHERE id = $1', [id])
    const item = rows[0]
    if (!item) return res.status(404).json({ error: 'not found' })
    const ok = await bcrypt.compare(String(body.password), item.edit_pw_hash || '')
    if (!ok) return res.status(401).json({ error: 'invalid password' })

    const sets = []
    const params = []
    for (const col of SHOWCASE_FIELDS) {
      if (body[col] === undefined) continue
      params.push(['tools', 'sub_imgs'].includes(col) ? JSON.stringify(body[col]) : body[col])
      sets.push(`${col} = $${params.length}`)
    }
    if (sets.length === 0) return res.status(400).json({ error: 'empty body' })
    // published 상태에서 수정하면 재승인 큐로 회수 (반달 방지)
    if (item.status === 'published') sets.push(`status = 'pending'`)

    params.push(id)
    const updated = await query(
      `UPDATE showcase SET ${sets.join(', ')} WHERE id = $${params.length}
       RETURNING id, title, topic, creator, description, tools, link, main_img, sub_imgs, semester_label, status, created_at`,
      params
    )
    res.json({ item: updated.rows[0], requeued: item.status === 'published' })
  })
)

export default router
