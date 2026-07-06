// ExportButton.jsx — 스냅샷 JSON 내보내기 (13_CMS_SPEC 6절, owner 전용)
// GET /export/all → 전체 콘텐츠 JSON 다운로드. 서버도 동시에 파일 기록(12_BACKEND 7절).

import { useState } from 'react'
import { Download } from 'lucide-react'
import { API_BASE } from '../../hooks/useApi'
import { useAuth } from '../../context/AuthContext'
import { ErrorText, GhostButton } from './FormControls'

function ExportButton() {
  const { hasRole } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  if (!hasRole('owner')) return null

  const handleExport = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/export/all`, { credentials: 'include' })
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.error || `내보내기 실패 (${res.status})`)
      }
      const json = await res.json()
      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dah-snapshot-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <GhostButton onClick={handleExport} disabled={busy}>
        <Download size={16} aria-hidden="true" />
        {busy ? '내보내는 중' : '스냅샷 내보내기'}
      </GhostButton>
      <ErrorText>{error}</ErrorText>
    </div>
  )
}

export default ExportButton
