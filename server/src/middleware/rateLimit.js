// src/middleware/rateLimit.js — IP 기반 rate limit (12_BACKEND.md 5절: 접수 IP당 시간 10회)
import rateLimit from 'express-rate-limit'

const HOUR = 60 * 60 * 1000

// 전시회 접수·쇼케이스 제출 등 비로그인 쓰기 경로: IP당 시간 10회
export const submitLimiter = rateLimit({
  windowMs: HOUR,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: 'too many requests', retryAfter: '1h' }),
})

// 비로그인 업로드: 접수 1건에 이미지 여러 장이 필요하므로 제출보다 넉넉하게 (IP당 시간 30회)
export const anonUploadLimiter = rateLimit({
  windowMs: HOUR,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: 'too many requests', retryAfter: '1h' }),
})
