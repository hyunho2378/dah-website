// src/routes/consult.js — 상담 신청 (Phase 9 K1-9)
// POST /consult (공개, rate limit): DB 저장은 항상. 알림 2계열은 env 있을 때만 —
//   (a) Nodemailer SMTP: SMTP_HOST·SMTP_USER·SMTP_PASS·CONSULT_NOTIFY_TO 전부 있으면 발송
//   (b) 텔레그램: TELEGRAM_BOT_TOKEN·TELEGRAM_CHAT_ID 있으면 sendMessage
// 알림 실패는 응답 실패로 이어지지 않는다(try/catch 후 로그).
// GET /admin/consultations (admin+) / PUT /admin/consultations/:id/read (읽음 토글)
import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { submitLimiter } from '../middleware/rateLimit.js'
import { wrap } from './content.js'

const router = Router()

function summaryText(item) {
  return [
    '[디지털인문예술전공] 새 상담 신청',
    `이름: ${item.name}`,
    `학년: ${item.grade || '-'}`,
    `주전공: ${item.main_major || '-'}`,
    `복수전공: ${item.double_major || '-'}`,
    `연락처: ${item.contact}`,
    `문의 내용: ${item.message || '-'}`,
    `일시: ${item.created_at}`,
  ].join('\n')
}

async function notifyEmail(item) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, CONSULT_NOTIFY_TO } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONSULT_NOTIFY_TO) return
  const { default: nodemailer } = await import('nodemailer')
  const port = Number(process.env.SMTP_PORT) || 587
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  await transporter.sendMail({
    from: SMTP_USER,
    to: CONSULT_NOTIFY_TO,
    subject: `[상담 신청] ${item.name}`,
    text: summaryText(item),
  })
}

async function notifyTelegram(item) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: summaryText(item) }),
  })
  if (!res.ok) throw new Error(`telegram sendMessage failed (${res.status})`)
}

router.post(
  '/consult',
  submitLimiter,
  wrap(async (req, res) => {
    const body = req.body || {}
    const name = String(body.name || '').trim()
    const contact = String(body.contact || '').trim()
    // S3-1: 회사명 제거, 학년·주전공·복수전공 추가
    const grade = String(body.grade || '').trim() || null
    const mainMajor = String(body.mainMajor || '').trim() || null
    const doubleMajor = String(body.doubleMajor || '').trim() || null
    const message = String(body.message || '').trim() || null
    if (!name || !contact) return res.status(400).json({ error: 'name and contact are required' })
    if (body.agreed !== true) return res.status(400).json({ error: 'agreement is required' })

    const { rows } = await query(
      `INSERT INTO consultations (name, grade, main_major, double_major, contact, message, agreed)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
       RETURNING id, name, grade, main_major, double_major, contact, message, agreed, is_read, created_at`,
      [name, grade, mainMajor, doubleMajor, contact, message]
    )
    const item = rows[0]

    // 알림은 저장과 독립 — 실패해도 접수 응답은 성공 (env 미설정이면 조용히 스킵)
    notifyEmail(item).catch((err) => console.error('[consult] 이메일 알림 실패:', err.message))
    notifyTelegram(item).catch((err) => console.error('[consult] 텔레그램 알림 실패:', err.message))

    res.status(201).json({ ok: true, id: item.id })
  })
)

router.get(
  '/admin/consultations',
  requireAuth,
  requireRole('admin'),
  wrap(async (req, res) => {
    const p = Math.max(1, parseInt(req.query.page, 10) || 1)
    const ps = Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 50))
    const countRes = await query('SELECT COUNT(*)::int AS total FROM consultations', [])
    const { rows } = await query(
      `SELECT id, name, grade, main_major, double_major, contact, message, agreed, is_read, created_at
       FROM consultations ORDER BY created_at DESC, id DESC LIMIT $1 OFFSET $2`,
      [ps, (p - 1) * ps]
    )
    res.json({ items: rows, total: countRes.rows[0]?.total ?? 0, page: p, pageSize: ps })
  })
)

router.put(
  '/admin/consultations/:id/read',
  requireAuth,
  requireRole('admin'),
  wrap(async (req, res) => {
    const id = parseInt(req.params.id, 10)
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' })
    const { rows } = await query(
      `UPDATE consultations SET is_read = NOT is_read WHERE id = $1
       RETURNING id, name, grade, main_major, double_major, contact, message, agreed, is_read, created_at`,
      [id]
    )
    if (!rows[0]) return res.status(404).json({ error: 'not found' })
    res.json({ item: rows[0] })
  })
)

export default router
