// scripts/migrate-phase9.mjs — Phase 9 마이그레이션 (K1-1 태그 / K1-3 이미지·첨부 분리 / K1-9 상담 / K1-10 나노디그리)
// 실행: server/ 안에서 `node scripts/migrate-phase9.mjs` (server/.env의 DATABASE_URL 사용)
//
// 하는 일 (전부 멱등 — 재실행 안전):
//   1. DDL: consultations·nanodegree 테이블 생성 (IF NOT EXISTS) + nanodegree 자리행(id=1, body NULL)
//   2. 태그 저장소 초기화: site_settings key 'tags' = [] (없는 키만 삽입 — 기존 태그 보존)
//   3. 기존 공지 태그 초기화: UPDATE posts SET tag = NULL WHERE type = 'notice' (사용자 명시 지시)
//   4. 첨부 저장 위치 정리: 과거 PostForm이 gallery에 넣던 [{name,url}] 문서 첨부를
//      attachments로 이동 (notice·resource, gallery 첫 요소가 객체인 행만 — 이미지 URL 배열은 불변)
//   5. 나노디그리 시드: client/src/data/nanodegree.js 원문 → body가 NULL일 때만 채움 (codesharing 패턴)
//
// ⚠ TRUNCATE/DELETE 금지 원칙 준수. 3번 UPDATE만 사용자 명시 지시로 예외.
import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.resolve(__dirname, '../../client/src/data')

if (!process.env.DATABASE_URL) {
  console.error('[migrate-phase9] DATABASE_URL이 없습니다. server/.env를 확인하세요.')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

async function main() {
  const client = await pool.connect()
  try {
    // 원문 import (K2 산출물 — 통합 시점에 존재. export명: nanodegree {intro, cert, programs})
    const { nanodegree } = await import(pathToFileURL(path.join(DATA_DIR, 'nanodegree.js')).href)

    await client.query('BEGIN')

    // 1) DDL — schema.sql과 동일 정의 (멱등)
    await client.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id         SERIAL PRIMARY KEY,
        company    TEXT,
        name       TEXT NOT NULL,
        contact    TEXT NOT NULL,
        message    TEXT,
        agreed     BOOLEAN NOT NULL,
        is_read    BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS nanodegree (
        id   INTEGER PRIMARY KEY CHECK (id = 1),
        body JSONB
      )
    `)
    await client.query(
      `INSERT INTO nanodegree (id, body) VALUES (1, NULL) ON CONFLICT (id) DO NOTHING`
    )
    console.log('[migrate-phase9] DDL 적용 (consultations, nanodegree)')

    // 2) 태그 저장소 초기값 — 빈 배열 (기존 키가 있으면 보존)
    await client.query(
      `INSERT INTO site_settings (key, value) VALUES ('tags', '[]'::jsonb)
       ON CONFLICT (key) DO NOTHING`
    )
    console.log("[migrate-phase9] site_settings 'tags' 초기화 (없는 키만)")

    // 3) 기존 공지 태그 초기화 (사용자 명시 지시)
    const tagRes = await client.query(`UPDATE posts SET tag = NULL WHERE type = 'notice'`)
    console.log(`[migrate-phase9] 공지 태그 초기화 ${tagRes.rowCount}건`)

    // 4) gallery 겸용 저장 정리 — 문서 첨부([{name,url}])만 attachments로 이동.
    //    이미지 URL 문자열 배열(gallery 본래 용도)은 건드리지 않는다.
    const attRes = await client.query(`
      UPDATE posts SET attachments = gallery, gallery = NULL
      WHERE type IN ('notice', 'resource')
        AND attachments IS NULL
        AND jsonb_typeof(gallery) = 'array'
        AND jsonb_typeof(gallery -> 0) = 'object'
    `)
    console.log(`[migrate-phase9] gallery → attachments 이동 ${attRes.rowCount}건`)

    // 5) 나노디그리 시드 — body가 NULL일 때만 채움 (어드민 편집분 보존, codesharing 패턴)
    await client.query(
      `INSERT INTO nanodegree (id, body) VALUES (1, $1)
       ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body
       WHERE nanodegree.body IS NULL`,
      [
        JSON.stringify({
          intro: nanodegree.intro,
          cert: nanodegree.cert,
          programs: nanodegree.programs,
        }),
      ]
    )
    console.log('[migrate-phase9] nanodegree 문서 시드 (body NULL일 때만)')

    await client.query('COMMIT')
    console.log('[migrate-phase9] 완료')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[migrate-phase9] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

main()
