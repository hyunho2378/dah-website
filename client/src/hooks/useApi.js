// useApi.js — API 조회 훅 + 뮤테이션 헬퍼 (12_BACKEND 7·8절)
// 인증은 httpOnly 쿠키 — JS는 credentials 'include'만. storage 사용 금지.
// 조회는 3초 타임아웃 후 src/data/snapshot/*.json 폴백(offline 플래그 제공).

import { useCallback, useEffect, useState } from 'react'

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const TIMEOUT_MS = 3000

// 폴백 슬롯 — lazy glob (eager 금지). 파일이 없으면 data null + offline true.
const snapshotModules = import.meta.glob('../data/snapshot/*.json')

function buildQuery(params) {
  if (!params) return ''
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  )
  if (!entries.length) return ''
  const qs = new URLSearchParams()
  for (const [k, v] of entries) qs.set(k, String(v))
  return `?${qs.toString()}`
}

async function parseResponse(res) {
  let json = null
  try {
    json = await res.json()
  } catch {
    json = null
  }
  if (!res.ok) {
    // B1 에러 계약: { error, hint? } — 분기 플래그(mustSetPassword 등) 판독용 body 동봉
    const err = new Error(json?.error || `요청 실패 (${res.status})`)
    err.status = res.status
    err.hint = json?.hint
    err.body = json
    throw err
  }
  return json
}

/**
 * 스냅샷 폴백 판독.
 * 파일명 후보: 경로 전체 슬러그(content_notice) → 마지막 세그먼트(notice).
 * 상세 경로(/content/:type/:id, id 숫자)는 유형 스냅샷에서 id 매칭.
 */
async function readSnapshot(path) {
  const clean = path.replace(/^\/+/, '').split('?')[0]
  const segments = clean.split('/').filter(Boolean)
  if (!segments.length) return null
  const last = segments[segments.length - 1]
  const isDetail = segments.length >= 3 && /^\d+$/.test(last)
  const detailType = isDetail ? segments[segments.length - 2] : null
  const candidates = [...new Set([segments.join('_'), last, detailType].filter(Boolean))]

  for (const name of candidates) {
    const loader = snapshotModules[`../data/snapshot/${name}.json`]
    if (!loader) continue
    let json = null
    try {
      const mod = await loader()
      json = mod?.default ?? mod
    } catch {
      continue
    }
    if (name === detailType) {
      const items = Array.isArray(json) ? json : json?.items
      const found = Array.isArray(items)
        ? items.find((it) => String(it.id) === last)
        : null
      if (found) return found
      continue
    }
    return json
  }
  return null
}

/**
 * useApi — 조회 전용 훅.
 * @param {string|null} path - '/content/notice' 형태. null이면 조회하지 않음
 * @param {{ params?: Object }} [options] - 쿼리 파라미터
 * @returns {{ data: any, loading: boolean, error: Error|null, offline: boolean, refetch: Function }}
 *   offline true → 스냅샷 폴백 렌더 중. 상위에서 "실시간 동기화 대기 중" 배지 노출 가능
 */
export function useApi(path, { params } = {}) {
  const [state, setState] = useState({
    data: null,
    loading: Boolean(path),
    error: null,
    offline: false,
  })
  const [tick, setTick] = useState(0)
  const query = buildQuery(params)

  useEffect(() => {
    if (!path) {
      setState({ data: null, loading: false, error: null, offline: false })
      return undefined
    }
    let alive = true
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    setState((s) => ({ ...s, loading: true, error: null }))

    fetch(`${API_BASE}${path}${query}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then(parseResponse)
      .then((json) => {
        if (alive) setState({ data: json, loading: false, error: null, offline: false })
      })
      .catch(async (err) => {
        if (!alive) return
        // 인증·권한 거부는 폴백 대상이 아님 — 에러 그대로 전달
        if (err?.status === 401 || err?.status === 403) {
          setState({ data: null, loading: false, error: err, offline: false })
          return
        }
        const snap = await readSnapshot(path)
        if (!alive) return
        setState({ data: snap, loading: false, error: snap ? null : err, offline: true })
      })
      .finally(() => clearTimeout(timer))

    return () => {
      alive = false
      clearTimeout(timer)
      controller.abort()
    }
  }, [path, query, tick])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  return { ...state, refetch }
}

/**
 * api — 뮤테이션 헬퍼. JSON 본문 + credentials 'include', 실패 시 Error({message, status, hint}) throw.
 */
export const api = {
  get: (path, params) =>
    fetch(`${API_BASE}${path}${buildQuery(params)}`, { credentials: 'include' }).then(
      parseResponse
    ),
  post: (path, body) =>
    fetch(`${API_BASE}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    }).then(parseResponse),
  put: (path, body) =>
    fetch(`${API_BASE}${path}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    }).then(parseResponse),
  del: (path) =>
    fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then(parseResponse),
  /**
   * 파일 업로드 — POST /upload (multipart, 필드명 file). 응답 { url } 기대.
   * @param {File} file
   * @param {Object} [extra] - 함께 보낼 추가 필드
   */
  upload: (file, extra) => {
    const fd = new FormData()
    fd.append('file', file)
    if (extra) for (const [k, v] of Object.entries(extra)) fd.append(k, v)
    return fetch(`${API_BASE}/upload`, {
      method: 'POST',
      credentials: 'include',
      body: fd,
    }).then(parseResponse)
  },
}
