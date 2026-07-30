// format.js — 33_PHASE18 공용 입력 포맷·검증 유틸 (Y1 상담·Y2 접수 공용)
//
// 연락처는 010-XXXX-XXXX 고정이다. 숫자 외 문자는 입력 자체가 되지 않게 하고(비숫자 제거),
// 4자·8자 경계에서 하이픈을 자동 삽입하며 11자리를 넘겨 입력되지 않는다.

/**
 * 입력값을 010-XXXX-XXXX 형태로 강제한다.
 * 숫자만 남기고 최대 11자리로 자른 뒤 3-4-4로 하이픈을 넣는다.
 * @param {string} raw 사용자가 친 원문
 * @returns {string} 하이픈이 적용된 문자열
 */
export function formatPhone(raw) {
  const digits = String(raw ?? '').replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

/** 010으로 시작하는 완전한 11자리인지 */
export function isValidPhone(v) {
  return /^010-\d{4}-\d{4}$/.test(String(v ?? ''))
}

/** 이메일 @ 포함 형식 검증 — 로컬@도메인.TLD */
export function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v ?? '').trim())
}
