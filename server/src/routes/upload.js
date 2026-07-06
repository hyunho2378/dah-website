// src/routes/upload.js — 이미지·문서 업로드 (12_BACKEND.md 0·1·6절)
// 이미지: multer 메모리 → sharp WebP 변환(원본 폐기) → Vercel Blob.
// 문서(PDF·HWP): sharp 파이프라인 우회 → 원본 그대로 Blob/로컬 저장 (공지·자료실 첨부용).
// 리사이즈(이미지): 기본 최장변 1600 / usage=poster 2400 / usage=showcase 1920x1080(16:9 강제).
// 역할·용도별 제한: 비로그인은 showcase·exhibition 용도만 허용 + rate limit. 문서(usage=document)는 로그인 필요.
// BLOB_READ_WRITE_TOKEN 미설정 시 로컬 폴백: server/uploads/ 저장 (개발용 — 프로덕션에서는 반드시 Blob).
import { Router } from 'express'
import multer from 'multer'
import sharp from 'sharp'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { optionalAuth } from '../middleware/auth.js'
import { anonUploadLimiter } from '../middleware/rateLimit.js'
import { wrap } from './content.js'

const router = Router()

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024
const PUBLIC_USAGES = ['showcase', 'exhibition'] // 비로그인 허용 용도 (쇼케이스 제출·전시회 접수)
const WEBP_QUALITY = 82

// 문서 첨부 허용 MIME (PDF·HWP). sharp 우회, 원본 그대로 저장.
const DOCUMENT_MIMES = new Set([
  'application/pdf',
  'application/x-hwp',
  'application/haansofthwp',
])
// MIME → 저장 확장자 (원본 확장자 유지)
const DOCUMENT_EXT = {
  'application/pdf': 'pdf',
  'application/x-hwp': 'hwp',
  'application/haansofthwp': 'hwp',
}

export const UPLOADS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith('image/')) return cb(null, true)
    if (DOCUMENT_MIMES.has(file.mimetype)) return cb(null, true)
    const err = new Error('only image or PDF/HWP document uploads are allowed')
    err.status = 400
    cb(err)
  },
})

// 비로그인 요청에만 업로드 rate limit 적용
function anonLimit(req, res, next) {
  if (req.user) return next()
  return anonUploadLimiter(req, res, next)
}

router.post(
  '/',
  optionalAuth,
  anonLimit,
  upload.single('file'),
  wrap(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'file field required (multipart/form-data)' })
    const usage = String(req.body?.usage || req.query.usage || 'general')
    if (!req.user && !PUBLIC_USAGES.includes(usage)) {
      return res.status(403).json({ error: 'login required for this upload usage', allowed: PUBLIC_USAGES })
    }

    // ── 문서(PDF·HWP) 분기: sharp 우회, 원본 그대로 저장 ──
    // usage=document 또는 MIME이 문서면 문서 처리. 문서는 비로그인 금지(위 PUBLIC_USAGES 검사에서 이미 차단).
    const isDocument = usage === 'document' || DOCUMENT_MIMES.has(req.file.mimetype)
    if (isDocument) {
      if (!DOCUMENT_MIMES.has(req.file.mimetype)) {
        return res.status(400).json({ error: 'document upload requires a PDF or HWP file', mimetype: req.file.mimetype })
      }
      const ext = DOCUMENT_EXT[req.file.mimetype]
      const buf = req.file.buffer
      const name = `document/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`
      const originalName = req.file.originalname || `document.${ext}`

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const { put } = await import('@vercel/blob')
        const blob = await put(`dah/${name}`, buf, {
          access: 'public',
          contentType: req.file.mimetype,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })
        return res.status(201).json({
          url: blob.url, name: originalName, type: req.file.mimetype, bytes: buf.length, format: ext, storage: 'blob',
        })
      }

      const filePath = path.join(UPLOADS_DIR, name)
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.writeFileSync(filePath, buf)
      const url = `${req.protocol}://${req.get('host')}/uploads/${name}`
      return res.status(201).json({
        url, name: originalName, type: req.file.mimetype, bytes: buf.length, format: ext, storage: 'local',
      })
    }

    // WebP 변환 + 리사이즈 (원본 버퍼는 저장하지 않음 = 원본 폐기)
    let pipeline = sharp(req.file.buffer).rotate()
    if (usage === 'showcase') {
      pipeline = pipeline.resize(1920, 1080, { fit: 'cover', position: 'centre' }) // 16:9 통일
    } else {
      const maxDim = usage === 'poster' ? 2400 : 1600
      pipeline = pipeline.resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true })
    }
    const buf = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer()

    const name = `${usage}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.webp`

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob')
      const blob = await put(`dah/${name}`, buf, {
        access: 'public',
        contentType: 'image/webp',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      return res.status(201).json({ url: blob.url, bytes: buf.length, format: 'webp', storage: 'blob' })
    }

    // ── 로컬 폴백 (개발용) ──
    // BLOB_READ_WRITE_TOKEN이 없으면 server/uploads/에 저장하고 정적 URL 반환.
    // Render 등 임시 파일시스템에서는 재배포 시 사라지므로 프로덕션 사용 금지.
    const filePath = path.join(UPLOADS_DIR, name)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, buf)
    const url = `${req.protocol}://${req.get('host')}/uploads/${name}`
    res.status(201).json({ url, bytes: buf.length, format: 'webp', storage: 'local' })
  })
)

export default router
