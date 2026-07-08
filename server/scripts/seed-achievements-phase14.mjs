// scripts/seed-achievements-phase14.mjs — 학생 성과 전면 재시드 (28_PHASE14 S1-1)
// 절대 원칙: achievements_SOURCE.md의 한국어 원문을 토씨 하나 바꾸지 않는다.
// 방법: .md를 직접 파싱해 title_ko·body(원문 그대로)를 만들고, achievementsEn.js에서 영문만 매칭.
//   - 기존 achievement 전부 삭제 후 이 파일 기준으로만 재생성 (배포 Neon 대상).
//   - client/src/data/achievements.js(정적 폴백)도 동일 파싱 결과로 재생성 → DB·폴백 일치.
//   - 시드 후 3건을 파싱 원문과 문자 단위 대조.
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../..')
const SOURCE = path.join(ROOT, 'client/docs/achievements_SOURCE.md')
const EN_FILE = path.join(ROOT, 'client/src/data/achievementsEn.js')
const STATIC_OUT = path.join(ROOT, 'client/src/data/achievements.js')

if (!process.env.DATABASE_URL) {
  console.error('[seed-achievements] DATABASE_URL이 없습니다.')
  process.exit(1)
}
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL) ? false : { rejectUnauthorized: false },
})

// ── 파싱: ## YYYY = 연도, ### 제목 = title(원문, trim 안 함 = 트레일링 스페이스 보존),
//    그 아래 다음 ###/## 전까지 = body(원문, 앞뒤 빈 줄만 정리) ─────────────
function parseSource(text) {
  const lines = text.split(/\r?\n/)
  const items = []
  let year = null
  let cur = null
  const flush = () => {
    if (cur) {
      cur.body = cur.bodyLines.join('\n').trim()
      delete cur.bodyLines
      items.push(cur)
    }
  }
  for (const raw of lines) {
    const tm = /^###\s(.*)$/.exec(raw)
    if (tm) {
      flush()
      cur = { title: tm[1], year, bodyLines: [] } // tm[1] = 원문 그대로(트레일링 스페이스 포함)
      continue
    }
    const ym = /^##\s+(\d{4})\s*$/.exec(raw)
    if (ym) {
      flush()
      cur = null
      year = Number(ym[1])
      continue
    }
    if (cur) cur.bodyLines.push(raw)
  }
  flush()
  return items
}

async function main() {
  const { achievementsEn } = await import(pathToFileURL(EN_FILE).href)
  const text = fs.readFileSync(SOURCE, 'utf8')
  const items = parseSource(text)

  // 영문 매칭 — 중복 제목(값이 배열)은 등장 순서로 배정
  const enCounters = {}
  for (const it of items) {
    const en = achievementsEn[it.title]
    let val = null
    if (Array.isArray(en)) {
      const idx = enCounters[it.title] || 0
      val = en[idx] || null
      enCounters[it.title] = idx + 1
    } else if (en) {
      val = en
    }
    it.titleEn = val?.titleEn || null
    it.descEn = val?.descEn || null
  }

  const missing = items.filter((it) => !it.titleEn)
  console.log(`[seed-achievements] 파싱 ${items.length}건, 영문 미매칭 ${missing.length}건`)
  if (missing.length) missing.forEach((m) => console.log('  ✗ EN 없음:', JSON.stringify(m.title)))

  const client = await pool.connect()
  try {
    await client.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS sort INTEGER')
    await client.query('BEGIN')
    await client.query("DELETE FROM posts WHERE type = 'achievement'")
    for (let i = 0; i < items.length; i += 1) {
      const it = items[i]
      await client.query(
        `INSERT INTO posts (type, title_ko, title_en, body, tag, sort, published)
         VALUES ('achievement', $1, $2, $3::jsonb, $4, $5, TRUE)`,
        [
          it.title,
          it.titleEn,
          JSON.stringify({ desc: it.body, descEn: it.descEn, year: it.year }),
          String(it.year),
          i,
        ]
      )
    }
    await client.query('COMMIT')
    console.log(`[seed-achievements] DB 재시드 완료 (${items.length}건)`)

    // 정적 폴백 재생성 (동일 파싱 결과)
    const header = `/**
 * achievements.js — 학생 성과 (client/docs/achievements_SOURCE.md 원문 그대로, 자동 생성)
 * seed-achievements-phase14.mjs가 소스를 파싱해 재생성한다. 손으로 편집하지 말 것.
 * 필드: id · year · title(원문) · titleEn · desc(원문 본문 전체) · descEn
 */
export const achievements = [
`
    const rows = items
      .map((it, i) =>
        '  ' +
        JSON.stringify({
          id: `ach-${i + 1}`,
          year: it.year,
          title: it.title,
          titleEn: it.titleEn,
          desc: it.body,
          descEn: it.descEn,
        }) +
        ',',
      )
      .join('\n')
    fs.writeFileSync(STATIC_OUT, header + rows + '\n]\n', 'utf8')
    console.log('[seed-achievements] 정적 폴백 재생성:', path.relative(ROOT, STATIC_OUT))

    // 문자 단위 대조 3건 (첫·중간·끝)
    const picks = [0, Math.floor(items.length / 2), items.length - 1]
    const check = await client.query(
      "SELECT title_ko, body FROM posts WHERE type = 'achievement' ORDER BY sort"
    )
    let ok = true
    for (const p of picks) {
      const src = items[p]
      const db = check.rows[p]
      const titleMatch = db.title_ko === src.title
      const bodyMatch = db.body.desc === src.body
      ok = ok && titleMatch && bodyMatch
      console.log(
        `[대조 #${p}] title ${titleMatch ? '✓' : '✗'} / body ${bodyMatch ? '✓' : '✗'} — ${JSON.stringify(src.title.slice(0, 30))}`
      )
    }
    console.log(ok ? '[seed-achievements] 문자 대조 3건 전부 일치 ✓' : '[seed-achievements] 대조 불일치 ✗')
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[seed-achievements] 실패:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}
main()
