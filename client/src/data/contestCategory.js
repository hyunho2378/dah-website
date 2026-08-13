// contestCategory.js — 공모전 종류 (52_CONTEST_CATEGORY)
//
// 값은 server/scripts/contest-data.mjs의 CONTEST_CATEGORY와 같은 문자열이다.
// DB에 이 문자열이 그대로 들어가므로 한쪽만 바꾸면 섹션이 갈라진다.

export const CONTEST_CATEGORY = {
  POSTER: '디지털인문예술 프로젝트 전시회 포스터 공모전',
  BOOKPLATE: '도서관 장서표 디자인 공모전',
  ETC: '기타',
}

/** 공개 페이지 섹션 순서 — 포스터 → 장서표 → 기타 */
export const CONTEST_CATEGORY_ORDER = [
  CONTEST_CATEGORY.POSTER,
  CONTEST_CATEGORY.BOOKPLATE,
  CONTEST_CATEGORY.ETC,
]

/** 어드민 드롭다운 옵션 */
export const CONTEST_CATEGORY_OPTIONS = CONTEST_CATEGORY_ORDER.map((value) => ({
  value,
  label: value,
}))
