// exhibitionTitle.js — 전시회 풀네임 조합 (N1-2, 23_PHASE11)
// "디지털인문예술전공 프로젝트 전시회"는 고정 문구. ordinal(정수)로 "제{n}회 ..." 자동 생성.
// 어드민은 ordinal + 전시명(title)만 입력하고, full_title은 이 헬퍼로 파생한다(DB 저장 불필요).
export const EXHIBITION_SUFFIX = '디지털인문예술전공 프로젝트 전시회'

export function exhibitionFullTitle(ordinal) {
  const n = Number(ordinal)
  return Number.isFinite(n) && n > 0 ? `제${n}회 ${EXHIBITION_SUFFIX}` : null
}

// 전시 사이트 버튼 라벨 — "26-1 DAH EXHIBITION".
// semester_label('2026-1')의 연도 두 자리 + 학기를 쓴다(전시 사이트 도메인 표기와 같은 형식).
// 국·영문 공통 표기라 i18n 대역이 없다. 라벨이 나올 수 없으면 null → 호출부가 기본 문구로 폴백.
export function exhibitionSiteLabel(semesterLabel) {
  const m = String(semesterLabel ?? '').match(/^(\d{4})-([12])$/)
  return m ? `${m[1].slice(2)}-${m[2]} DAH EXHIBITION` : null
}
