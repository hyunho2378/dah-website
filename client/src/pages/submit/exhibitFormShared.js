// 전시회 접수 공용 상수·헬퍼 (12_BACKEND 5절) — JSX 없는 모듈(fast refresh 분리)
// 이메일·비밀번호는 컴포넌트 state(메모리)만 사용 — 브라우저 스토리지 저장 금지.
// 기간 판정의 최종 권한은 서버(403) — settings/public 플래그는 UX 안내용.

export const DESC_MAX = 100

export const ENTRY_TYPE_LABEL = { solo: '개인', team: '팀' }

// Y2-4-6: 작품명 안내 문구(원문 고정 — 임의 수정 금지)
export const WORK_TITLE_HINT =
  "작품명에 '-'를 사용하는 경우, 구글 클래스룸 업로드 시 '_'로 사용해 주시기 바랍니다."

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
    ? parts.join(' / ')
    : '요청에 실패했습니다. 잠시 후 다시 시도해 주세요.'
}

/**
 * Y2-4-8 과목 목록 — 어드민(Y3-1)이 전시회 설정에 등록한 과목을 공개 설정 응답에서 읽는다.
 *
 * Y3와 병렬 작업이라 저장 위치·모양이 아직 확정되지 않았다. 후보 경로를 모두 훑고
 * 문자열/객체 어느 형태든 { value, label, semester }로 정규화한다. 아무것도 없으면
 * 빈 배열을 돌려주고, 호출부는 자유 입력으로 폴백해 접수가 막히지 않게 한다.
 * @param {object} settingsRes GET /settings/public 응답 전체
 * @returns {{value: string, label: string, semester: (string|null)}[]}
 */
export function resolveSubjects(settingsRes) {
  const exhibition = settingsRes?.exhibition ?? {}
  const settings = settingsRes?.settings ?? {}
  const raw =
    exhibition.subjects ??
    exhibition.courses ??
    settings.exhibition_subjects ??
    settings.exhibitionSubjects ??
    []

  // { '1': [...], '2': [...] } 형태(학기별 분리 저장)도 하나의 목록으로 합친다
  const list = Array.isArray(raw)
    ? raw.map((item) => [null, item])
    : typeof raw === 'object' && raw !== null
      ? Object.entries(raw).flatMap(([semester, items]) =>
          (Array.isArray(items) ? items : []).map((item) => [semester, item])
        )
      : []

  const seen = new Set()
  const out = []
  for (const [groupSemester, item] of list) {
    const label =
      typeof item === 'string'
        ? item
        : (item?.name ?? item?.label ?? item?.title ?? item?.subject ?? '')
    const name = String(label).trim()
    if (!name || seen.has(name)) continue
    seen.add(name)
    const semester = item?.semester ?? item?.semester_label ?? groupSemester ?? null
    out.push({
      value: name,
      label: name,
      semester: semester === null || semester === undefined ? null : String(semester),
    })
  }
  return out
}

/** 과목 카드 부제 — '1' → '1학기'. 이미 '학기'가 들어간 라벨은 그대로 둔다. */
export function semesterDesc(semester) {
  if (!semester) return undefined
  const s = String(semester)
  return /학기/.test(s) ? s : `${s}학기`
}
