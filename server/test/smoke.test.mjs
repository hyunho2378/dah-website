// test/smoke.test.mjs — supertest 스모크 (12_BACKEND 완료 조건. DB는 mock 주입)
// 실행: server/ 안에서 `npm test` (node --test)
process.env.JWT_SECRET = 'test-secret'
process.env.NODE_ENV = 'test'
delete process.env.DATABASE_URL

import { test } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { createApp } from '../src/app.js'

// SQL 텍스트 패턴 라우팅 방식의 mock db
function mockDb(handler) {
  return { query: async (text, params) => handler(text, params) ?? { rows: [] } }
}

function accessCookie(user) {
  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role, type: 'access' },
    'test-secret',
    { expiresIn: '15m' }
  )
  return `dah_access=${token}`
}

test('(0) DATABASE_URL 없이 기동: /health 200, 그 외 명확한 env 에러', async () => {
  const app = createApp({ db: null }) // 주입 해제 = env 미설정 상태
  const health = await request(app).get('/health')
  assert.equal(health.status, 200)
  assert.equal(health.body.status, 'ok')

  const blocked = await request(app).get('/content/notice')
  assert.equal(blocked.status, 503)
  assert.equal(blocked.body.error, 'DATABASE_URL not configured')
  assert.ok(blocked.body.hint)
})

test('(a) 비로그인 POST /admin/content/notice → 401', async () => {
  const app = createApp({ db: mockDb(() => ({ rows: [] })) })
  const res = await request(app).post('/admin/content/notice').send({ title_ko: '테스트 공지' })
  assert.equal(res.status, 401)
})

test('(b) manager 토큰으로 admin 전용(professors) 작성 → 403', async () => {
  const app = createApp({ db: mockDb(() => ({ rows: [] })) })
  const res = await request(app)
    .post('/admin/content/professors')
    .set('Cookie', [accessCookie({ id: 2, email: 'manager@test.dev', name: 'M', role: 'manager' })])
    .send({ name_ko: '테스트 교수' })
  assert.equal(res.status, 403)
  assert.equal(res.body.required, 'admin')
})

test('(b-보강) manager 토큰으로 notice 작성 → 201 (권한 매트릭스 상행 확인)', async () => {
  const app = createApp({
    db: mockDb((text) => {
      if (text.startsWith('INSERT INTO posts')) {
        return { rows: [{ id: 10, type: 'notice', title_ko: '테스트 공지' }] }
      }
      return { rows: [] }
    }),
  })
  const res = await request(app)
    .post('/admin/content/notice')
    .set('Cookie', [accessCookie({ id: 2, email: 'manager@test.dev', name: 'M', role: 'manager' })])
    .send({ title_ko: '테스트 공지' })
  assert.equal(res.status, 201)
  assert.equal(res.body.item.id, 10)
})

test('(c) 접수 기간 밖 POST /submit/exhibition → 403 (서버 기간 검증)', async () => {
  const app = createApp({
    db: mockDb((text) => {
      if (text.includes('FROM exhibition_settings')) {
        return {
          rows: [
            {
              id: 1,
              submit_open: '2020-01-01T00:00:00+09:00',
              submit_close: '2020-01-02T23:59:59+09:00',
              edit_close: '2020-01-03T23:59:59+09:00',
              header_visible: true,
              button_mode: 'header',
            },
          ],
        }
      }
      return { rows: [] }
    }),
  })
  const res = await request(app)
    .post('/submit/exhibition')
    .send({ entry_type: 'solo', email: 'student@test.dev', password: 'pw123456', fields: { name: '홍길동' } })
  assert.equal(res.status, 403)
  assert.equal(res.body.error, 'submission period closed')
})

test('(d) /auth/login 성공 → 쿠키 2개 세트 + /auth/me 200', async () => {
  const hash = await bcrypt.hash('secret123', 4)
  const userRow = { id: 1, email: 'owner@test.dev', name: 'Owner', role: 'owner', password_hash: hash, must_set_pw: false }
  const app = createApp({
    db: mockDb((text) => {
      if (text.includes('FROM users WHERE email')) return { rows: [userRow] }
      if (text.includes('FROM users WHERE id')) {
        return { rows: [{ id: 1, email: 'owner@test.dev', name: 'Owner', role: 'owner', must_set_pw: false }] }
      }
      return { rows: [] }
    }),
  })

  const login = await request(app).post('/auth/login').send({ email: 'owner@test.dev', password: 'secret123' })
  assert.equal(login.status, 200)
  assert.equal(login.body.user.role, 'owner')

  const cookies = login.headers['set-cookie']
  assert.ok(cookies.some((c) => c.startsWith('dah_access=') && c.includes('HttpOnly')))
  assert.ok(cookies.some((c) => c.startsWith('dah_refresh=') && c.includes('HttpOnly')))

  const me = await request(app).get('/auth/me').set('Cookie', cookies.map((c) => c.split(';')[0]))
  assert.equal(me.status, 200)
  assert.equal(me.body.user.email, 'owner@test.dev')
})

test('(e) must_set_pw 계정 최초 로그인 → 그 자리에서 비번 등록 + 즉시 로그인 (병합 플로우)', async () => {
  const userRow = { id: 3, email: 'newowner@test.dev', name: 'New Owner', role: 'owner', password_hash: null, must_set_pw: true }
  let updateCall = null
  const app = createApp({
    db: mockDb((text, params) => {
      if (text.includes('FROM users WHERE email')) return { rows: [userRow] }
      if (text.startsWith('UPDATE users SET password_hash')) {
        updateCall = params
        return { rows: [{ id: 3, email: 'newowner@test.dev', name: 'New Owner', role: 'owner' }] }
      }
      return { rows: [] }
    }),
  })

  const login = await request(app)
    .post('/auth/login')
    .send({ email: 'newowner@test.dev', password: 'whateverPw1' })
  assert.equal(login.status, 200)
  assert.equal(login.body.user.email, 'newowner@test.dev')

  // 입력한 비밀번호가 그대로(별도 검증 없이) bcrypt 해시되어 저장 요청됐는지 확인
  assert.ok(updateCall)
  const storedHash = updateCall[0]
  assert.ok(await bcrypt.compare('whateverPw1', storedHash))

  const cookies = login.headers['set-cookie']
  assert.ok(cookies.some((c) => c.startsWith('dah_access=') && c.includes('HttpOnly')))
  assert.ok(cookies.some((c) => c.startsWith('dah_refresh=') && c.includes('HttpOnly')))
})

test('(추가) 공개 GET /content/notice — KPC식 페이지네이션 형태 {items,total,page,pageSize}', async () => {
  const app = createApp({
    db: mockDb((text) => {
      if (text.includes('COUNT(*)')) return { rows: [{ total: 1 }] }
      if (text.includes('FROM posts')) {
        return { rows: [{ id: 1, type: 'notice', title_ko: '공지', published: true }] }
      }
      return { rows: [] }
    }),
  })
  const res = await request(app).get('/content/notice?page=1')
  assert.equal(res.status, 200)
  assert.deepEqual(Object.keys(res.body).sort(), ['items', 'page', 'pageSize', 'total'])
  assert.equal(res.body.total, 1)
})

test('(추가) 허용 목록 외 :type 차단 → 404', async () => {
  const app = createApp({ db: mockDb(() => ({ rows: [] })) })
  const res = await request(app).get('/content/users')
  assert.equal(res.status, 404)
  assert.equal(res.body.error, 'unknown content type')
})
