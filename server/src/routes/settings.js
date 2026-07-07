// src/routes/settings.js — 설정 (12_BACKEND.md 8절)
// GET /settings/public — site_settings 전체 + 전시회 접수 노출 상태 계산 (히어로 버튼, 접수 버튼)
// PUT /admin/settings — owner·admin. site_settings upsert + exhibition_settings 갱신
import { Router } from 'express'
import { query } from '../db.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { wrap } from './content.js'

const router = Router()

const EXHIBITION_COLS = ['submit_open', 'submit_close', 'edit_close', 'form_schema', 'header_visible', 'button_mode']

function computeExhibitionState(row) {
  if (!row) return null
  const now = new Date()
  const isSubmitPeriod =
    Boolean(row.submit_open && row.submit_close) &&
    now >= new Date(row.submit_open) &&
    now <= new Date(row.submit_close)
  const isEditPeriod =
    Boolean(row.submit_open && row.edit_close) &&
    now >= new Date(row.submit_open) &&
    now <= new Date(row.edit_close)
  return {
    submit_open: row.submit_open,
    submit_close: row.submit_close,
    edit_close: row.edit_close,
    header_visible: row.header_visible,
    button_mode: row.button_mode,
    is_submit_period: isSubmitPeriod,
    is_edit_period: isEditPeriod,
    // J3: 노출 여부는 오직 설정 스위치가 결정 — 기간 검증은 제출 시점 서버(403)에서만
    show_button: row.header_visible === true,
  }
}

router.get(
  '/settings/public',
  wrap(async (req, res) => {
    const [settingsRes, exRes] = await Promise.all([
      query('SELECT key, value FROM site_settings', []),
      query('SELECT * FROM exhibition_settings WHERE id = 1', []),
    ])
    const settings = Object.fromEntries(settingsRes.rows.map((r) => [r.key, r.value]))
    res.json({ settings, exhibition: computeExhibitionState(exRes.rows[0]) })
  })
)

router.put(
  '/admin/settings',
  requireAuth,
  requireRole('admin'),
  wrap(async (req, res) => {
    const { settings, exhibition } = req.body || {}
    const result = { settings: {}, exhibition: null }

    if (settings && typeof settings === 'object' && !Array.isArray(settings)) {
      for (const [key, value] of Object.entries(settings)) {
        const { rows } = await query(
          `INSERT INTO site_settings (key, value) VALUES ($1, $2)
           ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
           RETURNING key, value`,
          [key, value === null ? null : JSON.stringify(value)]
        )
        result.settings[rows[0].key] = rows[0].value
      }
    }

    if (exhibition && typeof exhibition === 'object' && !Array.isArray(exhibition)) {
      if (exhibition.button_mode !== undefined && !['header', 'floating'].includes(exhibition.button_mode)) {
        return res.status(400).json({ error: 'button_mode must be header or floating' })
      }
      const cols = EXHIBITION_COLS.filter((c) => exhibition[c] !== undefined)
      if (cols.length > 0) {
        const sets = cols.map((c, i) => `${c} = $${i + 1}`)
        const params = cols.map((c) =>
          c === 'form_schema' && exhibition[c] !== null ? JSON.stringify(exhibition[c]) : exhibition[c]
        )
        const { rows } = await query(
          `UPDATE exhibition_settings SET ${sets.join(', ')} WHERE id = 1 RETURNING *`,
          params
        )
        result.exhibition = computeExhibitionState(rows[0])
      }
    }

    res.json(result)
  })
)

export default router
