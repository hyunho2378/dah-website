// src/db.js — pg Pool 래퍼 (12_BACKEND.md 완료 조건: DATABASE_URL 없이도 기동).
// DATABASE_URL이 없으면 풀을 만들지 않고 isConfigured()가 false — app.js의 가드가
// /health 외 요청에 명확한 JSON 에러를 반환한다.
// 테스트는 setDb(mock)으로 query 구현을 교체한다 (스모크 테스트 DB 모킹).
import pg from 'pg'

let pool = null
let injected = null // 테스트 주입용 { query(text, params) }

if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL
  pool = new pg.Pool({
    connectionString: url,
    // Neon 등 원격 Postgres는 SSL 필수. 로컬(localhost)만 평문 허용
    ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false },
    max: 5,
  })
}

export function isConfigured() {
  return Boolean(injected || pool)
}

// 테스트에서 mock 주입 (null 전달 시 해제 → env 미설정 상태 재현)
export function setDb(mock) {
  injected = mock
}

export async function query(text, params) {
  const impl = injected || pool
  if (!impl) {
    const err = new Error('DATABASE_URL not configured')
    err.code = 'DB_NOT_CONFIGURED'
    throw err
  }
  return impl.query(text, params)
}
