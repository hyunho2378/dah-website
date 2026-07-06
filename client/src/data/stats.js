/**
 * stats.js — 홈 Stats 섹션 실측 수치 (IA.md 2절 #6 — 정확히 이 6개만. 그 외 수치 추가 금지)
 * 근거: 설립 2017(연혁) / 트랙 3(트랙 소개) / 전임·참여 교수 11(교수진 명단) /
 * 산업 멘토 12(스펙 고정값) / 코드쉐어링 인정 학과 19(코드쉐어링 절) / 학기당 전시 1(매 학기 전시회)
 *
 * @typedef {Object} Stat
 * @property {string} label - 수치 라벨
 * @property {number} value - 실측값
 * @property {string} suffix - 단위 접미사 (없으면 빈 문자열)
 */
export const stats = [
  { label: '설립', value: 2017, suffix: '' },
  { label: '트랙', value: 3, suffix: '' },
  { label: '전임·참여 교수', value: 11, suffix: '' },
  { label: '산업 멘토', value: 12, suffix: '' },
  { label: '코드쉐어링 인정 학과', value: 19, suffix: '' },
  { label: '학기당 전시', value: 1, suffix: '회' },
];
