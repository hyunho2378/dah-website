// src/routes/googleAuth.js: 공개 제출자 구글 로그인 (41_AUTH_CONTRACT)
//
// 스태프 인증(routes/auth.js)과 경로, 쿠키, 테이블이 모두 분리된 신원 클래스다.
//   GET  /auth/google/login?next=  state 쿠키 발급 후 구글 동의 화면으로 302
//   GET  /auth/google/callback     state 대조, code 교환, id_token 검증, public_users upsert,
//                                  공개 쿠키 발급 후 CLIENT_ORIGIN + next 로 복귀
//   GET  /auth/public/me           로그인된 구글 계정 (비로그인 401)
//   POST /auth/public/logout       공개 쿠키 삭제
//
// 신규 의존성 없이 authorization code 플로우를 직접 구현한다. id_token은 TLS 위 서버 대 서버
// 응답이라 중간자가 끼어들 수 없으므로 서명 검증 대신 aud, iss, email_verified만 확인한다.
import { Router } from 'express'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { query } from '../db.js'
import { jwtSecret, baseCookieOpts, cookieOpts } from '../middleware/auth.js'
import {
  requirePublicAuth,
  setPublicAuthCookies,
  clearPublicAuthCookies,
} from '../middleware/publicAuth.js'
import { wrap } from './content.js'

const router = Router()

const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const VALID_ISS = ['accounts.google.com', 'https://accounts.google.com']

// CSRF용 1회성 state. 랜덤 nonce와 복귀 경로를 담은 단기 JWT를 쿠키로 들고 있다가 콜백에서 대조한다.
const STATE_COOKIE = 'dah_oauth_state'
const STATE_TTL_SEC = 10 * 60

const NOT_CONFIGURED = {
  error: 'google oauth not configured',
  hint: '서버 환경변수 GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI를 설정한 뒤 재기동하세요. 구글 클라우드 콘솔의 승인된 리디렉션 URI가 GOOGLE_REDIRECT_URI와 완전히 같아야 합니다.',
}

function oauthConfig() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) return null
  return {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_REDIRECT_URI,
  }
}

// CLIENT_ORIGIN은 CORS 화이트리스트라 쉼표 목록일 수 있다. 복귀는 첫 오리진 기준.
function clientOrigin() {
  const first = process.env.CLIENT_ORIGIN?.split(',')[0]?.trim()
  return (first || 'http://localhost:5173').replace(/\/+$/, '')
}

// 오픈 리다이렉트 차단: CLIENT_ORIGIN 기준 경로만 허용한다.
// 외부 URL, 프로토콜 상대 경로(//evil.com), 역슬래시 우회(/\evil.com), 헤더 개행 주입은 '/'로 폴백.
function safeNext(raw) {
  const v = typeof raw === 'string' ? raw.trim() : ''
  if (!/^\/($|[^/\\])/.test(v)) return '/'
  if (/[\u0000-\u001f\u007f]/.test(v)) return '/' // Location 헤더 개행 주입 차단
  return v
}

// id_token은 서명 검증 없이 페이로드만 읽는다(위 파일 주석의 근거). base64url 디코드 실패는 null.
function decodeIdToken(idToken) {
  const parts = String(idToken || '').split('.')
  if (parts.length !== 3) return null
  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
  } catch {
    return null
  }
}

router.get('/google/login', (req, res) => {
  const cfg = oauthConfig()
  if (!cfg) return res.status(503).json(NOT_CONFIGURED)

  const nonce = crypto.randomBytes(16).toString('hex')
  const state = jwt.sign({ nonce, next: safeNext(req.query.next) }, jwtSecret(), {
    expiresIn: STATE_TTL_SEC,
  })
  res.cookie(STATE_COOKIE, state, cookieOpts(STATE_TTL_SEC))

  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state: nonce,
    access_type: 'online',
    prompt: 'select_account',
  })
  res.redirect(`${AUTH_ENDPOINT}?${params.toString()}`)
})

router.get(
  '/google/callback',
  wrap(async (req, res) => {
    const cfg = oauthConfig()
    if (!cfg) return res.status(503).json(NOT_CONFIGURED)

    const stateCookie = req.cookies?.[STATE_COOKIE]
    res.clearCookie(STATE_COOKIE, baseCookieOpts()) // 1회용이므로 성패와 무관하게 즉시 폐기

    if (req.query.error) {
      return res.status(400).json({
        error: 'google login not completed',
        hint: '구글 동의 화면에서 취소되었습니다. 다시 시도하세요.',
      })
    }

    let statePayload = null
    try {
      statePayload = jwt.verify(String(stateCookie || ''), jwtSecret())
    } catch {
      statePayload = null
    }
    if (!statePayload || !req.query.state || statePayload.nonce !== String(req.query.state)) {
      return res.status(400).json({
        error: 'invalid oauth state',
        hint: '로그인 요청이 만료되었거나 다른 창에서 시작되었습니다. 처음부터 다시 시도하세요.',
      })
    }

    const code = String(req.query.code || '')
    if (!code) return res.status(400).json({ error: 'authorization code required' })

    const tokenRes = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        redirect_uri: cfg.redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    })
    if (!tokenRes.ok) {
      console.error('[auth/google] 토큰 교환 실패:', tokenRes.status, await tokenRes.text())
      return res.status(502).json({ error: 'google token exchange failed' })
    }

    const claims = decodeIdToken((await tokenRes.json()).id_token)
    if (!claims) return res.status(502).json({ error: 'invalid id_token' })
    if (claims.aud !== cfg.clientId) return res.status(401).json({ error: 'id_token audience mismatch' })
    if (!VALID_ISS.includes(claims.iss)) return res.status(401).json({ error: 'id_token issuer mismatch' })
    if (!claims.sub || !claims.email || claims.email_verified !== true) {
      return res.status(401).json({
        error: 'google email not verified',
        hint: '이메일 인증이 완료된 구글 계정으로 로그인하세요.',
      })
    }

    const { rows } = await query(
      `INSERT INTO public_users (google_sub, email, name, last_login_at)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (google_sub) DO UPDATE
         SET email = EXCLUDED.email, name = EXCLUDED.name, last_login_at = now()
       RETURNING id, email, name`,
      [String(claims.sub), String(claims.email).trim().toLowerCase(), claims.name || null]
    )
    setPublicAuthCookies(res, rows[0])
    res.redirect(`${clientOrigin()}${safeNext(statePayload.next)}`)
  })
)

router.get('/public/me', requirePublicAuth, (req, res) => {
  res.json({ user: req.publicUser })
})

router.post('/public/logout', (req, res) => {
  clearPublicAuthCookies(res)
  res.json({ ok: true })
})

export default router
