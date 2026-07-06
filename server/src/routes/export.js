// src/routes/export.js — 스냅샷 export (12_BACKEND.md 7절 3층 구조의 3단계)
// GET /export/all (owner): 전 콘텐츠 JSON 응답 + EXPORT_DIR(기본 ../client/src/data/snapshot)에
// 테이블별 *.json 기록 → 프론트 useApi 3초 타임아웃 폴백 데이터 + 백업 용도.
// 민감 필드(pw_hash, edit_pw_hash, users 전체)는 export에서 제외.
import { Router } from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { query } from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { wrap } from './content.js'

const router = Router()

const SERVER_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

// 테이블 → 제외 컬럼. users는 계정 정보라 콘텐츠 export 대상이 아님
const EXPORT_TABLES = {
  site_settings: [],
  posts: [],
  professors: [],
  mentors: [],
  curriculum: [],
  codesharing: [],
  council: [],
  exhibitions: [],
  showcase: ['edit_pw_hash'],
  exhibition_settings: [],
  exhibition_entries: ['pw_hash'],
  careers: [],
  portfolios: [],
}

router.get(
  '/export/all',
  requireAuth,
  requireRole('owner'),
  wrap(async (req, res) => {
    const data = {}
    for (const [table, omit] of Object.entries(EXPORT_TABLES)) {
      const { rows } = await query(`SELECT * FROM ${table}`, [])
      data[table] = omit.length > 0
        ? rows.map((row) => {
            const copy = { ...row }
            for (const col of omit) delete copy[col]
            return copy
          })
        : rows
    }

    const exportedAt = new Date().toISOString()
    const dir = process.env.EXPORT_DIR
      ? path.resolve(SERVER_ROOT, process.env.EXPORT_DIR)
      : path.resolve(SERVER_ROOT, '../client/src/data/snapshot')

    let written = null
    try {
      fs.mkdirSync(dir, { recursive: true })
      for (const [table, rows] of Object.entries(data)) {
        fs.writeFileSync(path.join(dir, `${table}.json`), JSON.stringify(rows, null, 2))
      }
      fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ exported_at: exportedAt }, null, 2))
      written = dir
    } catch (err) {
      // 파일 기록 실패(권한·경로)는 응답 JSON은 그대로 주고 사유만 알림
      console.warn('[export] snapshot 파일 기록 실패:', err.message)
    }

    res.json({ exported_at: exportedAt, dir: written, data })
  })
)

export default router
