// ImageUpload.jsx — 파일 업로드 필드 (POST /upload → URL). 이미지·HWP 공용.

import { useRef, useState } from 'react'
import { Paperclip, Trash2, Upload } from 'lucide-react'
import { api } from '../../hooks/useApi'
import { ErrorText, GhostButton } from './FormControls'

/**
 * @param {{
 *   value: string, onChange: Function, accept?: string,
 *   preview?: boolean, buttonLabel?: string, usage?: string
 * }} props - preview false면 이미지 미리보기 대신 파일 링크 표시(HWP 등).
 *   usage: 서버 리사이즈 정책(general 1600 | poster 2400 | showcase 1920x1080 | exhibition)
 */
function ImageUpload({
  value = '',
  onChange,
  accept = 'image/*',
  preview = true,
  buttonLabel = '파일 선택',
  usage = 'general',
}) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = async (event) => {
    const file = event.target.files && event.target.files[0]
    event.target.value = ''
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const res = await api.upload(file, { usage })
      if (!res?.url) throw new Error('업로드 응답에 url이 없습니다.')
      onChange(res.url)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-8">
      {value && preview && (
        <img
          src={value}
          alt="업로드 미리보기"
          className="aspect-video w-full max-w-sm rounded-md border border-border-subtle bg-bg-elev object-cover"
        />
      )}
      {value && !preview && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-8 font-mono text-small-m text-text-sec underline underline-offset-4 hover:text-text-pri"
        >
          <Paperclip size={16} aria-hidden="true" />
          {value.split('/').pop()}
        </a>
      )}
      <div className="flex flex-wrap items-center gap-8">
        <GhostButton onClick={() => inputRef.current && inputRef.current.click()} disabled={busy}>
          <Upload size={16} aria-hidden="true" />
          {busy ? '업로드 중' : buttonLabel}
        </GhostButton>
        {value && (
          <GhostButton onClick={() => onChange('')} aria-label="파일 제거">
            <Trash2 size={16} aria-hidden="true" />
            제거
          </GhostButton>
        )}
      </div>
      <ErrorText>{error}</ErrorText>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  )
}

export default ImageUpload
