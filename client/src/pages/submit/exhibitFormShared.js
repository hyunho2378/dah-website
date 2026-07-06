// 전시회 접수 공용 상수·헬퍼 (12_BACKEND 5절) — JSX 없는 모듈(fast refresh 분리)
// 이메일·비밀번호는 컴포넌트 state(메모리)만 사용 — 브라우저 스토리지 저장 금지.
// 기간 판정의 최종 권한은 서버(403) — settings/public 플래그는 UX 안내용.
import { api } from '../../hooks/useApi'

export const DESC_MAX = 100
export const MAX_IMAGES = 5

export const ENTRY_TYPE_LABEL = { solo: '개인', team: '팀' }

export const inputCls =
  'w-full min-w-0 rounded-md border border-border-subtle bg-bg-panel px-16 py-12 text-body-m text-text-pri placeholder:text-text-meta transition-colors duration-fast ease-out focus:border-border-strong focus:outline-none md:text-body-d'
export const labelCls = 'text-small-m font-semibold text-text-pri md:text-small-d'

const kstFormat = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Seoul',
})

export function formatKst(iso) {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : kstFormat.format(date)
}

/** B1 에러 계약({error, hint?}) → 사용자 문구. 403은 기간 밖, 429는 rate limit. */
export function submitErrorMessage(err) {
  if (err?.status === 403) return err.message || '접수·수정 기간이 아닙니다.'
  if (err?.status === 429)
    return '요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.'
  const parts = [err?.message, err?.hint].filter(Boolean)
  return parts.length
    ? parts.join(' — ')
    : '요청에 실패했습니다. 잠시 후 다시 시도해 주세요.'
}

/** 이미지 항목 배열 → URL 배열. 신규 파일은 POST /upload(usage=exhibition)로 업로드. */
export async function resolveImageUrls(images) {
  const urls = []
  for (const image of images) {
    if (image.url) {
      urls.push(image.url)
      continue
    }
    const res = await api.upload(image.file, { usage: 'exhibition' })
    const url = res?.url ?? res?.data?.url
    if (!url) throw new Error('이미지 업로드에 실패했습니다')
    urls.push(url)
  }
  return urls
}
