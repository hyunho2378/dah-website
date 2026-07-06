// src/middleware/auth.js — 쿠키 JWT 인증 (12_BACKEND.md 3절)
// access 15분 + refresh 30일, httpOnly + Secure(프로덕션) + SameSite=Lax.
// requireAuth는 access 만료 시 refresh 쿠키로 자동 재발급(회전: 두 쿠키 모두 갱신).
import jwt from 'jsonwebtoken'

export const ACCESS_COOKIE = 'dah_access'
export const REFRESH_COOKIE = 'dah_refresh'
export const ROLE_LEVEL = { manager: 1, admin: 2, owner: 3 }

const ACCESS_TTL_SEC = 15 * 60
const REFRESH_TTL_SEC = 30 * 24 * 60 * 60

let warned = false
function secret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET
  if (!warned) {
    console.warn('[auth] JWT_SECRET 미설정 — 개발용 기본 시크릿 사용 중. 프로덕션 금지.')
    warned = true
  }
  return 'dev-insecure-secret'
}

function payloadToUser(p) {
  return { id: p.sub, email: p.email, name: p.name, role: p.role }
}

function sign(user, type, ttlSec) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role, type },
    secret(),
    { expiresIn: ttlSec }
  )
}

function cookieOpts(maxAgeSec) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSec * 1000,
  }
}

export function setAuthCookies(res, user) {
  res.cookie(ACCESS_COOKIE, sign(user, 'access', ACCESS_TTL_SEC), cookieOpts(ACCESS_TTL_SEC))
  res.cookie(REFRESH_COOKIE, sign(user, 'refresh', REFRESH_TTL_SEC), cookieOpts(REFRESH_TTL_SEC))
}

export function clearAuthCookies(res) {
  res.clearCookie(ACCESS_COOKIE, { path: '/' })
  res.clearCookie(REFRESH_COOKIE, { path: '/' })
}

function resolveUser(req, res) {
  const at = req.cookies?.[ACCESS_COOKIE]
  if (at) {
    try {
      const p = jwt.verify(at, secret())
      if (p.type === 'access') return payloadToUser(p)
    } catch {
      // 만료·위조 → refresh로 폴백
    }
  }
  const rt = req.cookies?.[REFRESH_COOKIE]
  if (rt) {
    try {
      const p = jwt.verify(rt, secret())
      if (p.type === 'refresh') {
        const user = payloadToUser(p)
        setAuthCookies(res, user) // refresh 회전: access·refresh 동시 재발급
        return user
      }
    } catch {
      // 무효 refresh → 비로그인 취급
    }
  }
  return null
}

export function requireAuth(req, res, next) {
  const user = resolveUser(req, res)
  if (!user) return res.status(401).json({ error: 'authentication required' })
  req.user = user
  next()
}

// 로그인 여부만 판별 (업로드 등: 비로그인도 용도 제한부로 허용)
export function optionalAuth(req, res, next) {
  req.user = resolveUser(req, res)
  next()
}

export function hasRole(user, minRole) {
  return Boolean(user) && (ROLE_LEVEL[user.role] || 0) >= (ROLE_LEVEL[minRole] || Infinity)
}

// 최소 롤 가드 (owner > admin > manager). requireAuth 뒤에서 사용
export function requireRole(minRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'authentication required' })
    if (!hasRole(req.user, minRole)) {
      return res.status(403).json({ error: 'insufficient role', required: minRole })
    }
    next()
  }
}
