// exhibitionTitle.js — 전시회 풀네임 조합 (N1-2, 23_PHASE11)
// "디지털인문예술전공 프로젝트 전시회"는 고정 문구. ordinal(정수)로 "제{n}회 ..." 자동 생성.
// 어드민은 ordinal + 전시명(title)만 입력하고, full_title은 이 헬퍼로 파생한다(DB 저장 불필요).
export const EXHIBITION_SUFFIX = '디지털인문예술전공 프로젝트 전시회'

export function exhibitionFullTitle(ordinal) {
  const n = Number(ordinal)
  return Number.isFinite(n) && n > 0 ? `제${n}회 ${EXHIBITION_SUFFIX}` : null
}
