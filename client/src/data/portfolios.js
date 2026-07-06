/**
 * portfolios.js — 재학생·졸업생 포트폴리오 8건 (source_content.md '포트폴리오' 절 원문 이관)
 *
 * [데이터 갭] 원문에 "버튼 클릭 시 학생들의 포트폴리오를 더 자세히 볼 수 있습니다"라고만 있고
 * 실제 포트폴리오 URL이 원문 텍스트에 포함되어 있지 않음 → 전 항목 url: null.
 * URL 확보 시 교체 필요 (원문에 없는 링크 생성 금지).
 *
 * @typedef {Object} Portfolio
 * @property {string} id - 고유 id
 * @property {string} studentNo - 학번 (원문 표기 그대로)
 * @property {string} name - 이름 (원문 그대로)
 * @property {string} majors - 전공 조합 (원문 순서 그대로)
 * @property {string|null} url - 포트폴리오 링크 (원문 미포함 — null)
 */
export const portfolios = [
  {
    id: 'pf-01',
    studentNo: '19학번',
    name: '곽선재',
    majors: '디지털인문예술전공 / 디지털미디어콘텐츠전공',
    url: null,
  },
  {
    id: 'pf-02',
    studentNo: '19학번',
    name: '강도연',
    majors: '콘텐츠IT전공 / 디지털인문예술전공',
    url: null,
  },
  {
    id: 'pf-03',
    studentNo: '19학번',
    name: '김승주',
    majors: '광고홍보학과 / 디지털인문예술전공',
    url: null,
  },
  {
    id: 'pf-04',
    studentNo: '19학번',
    name: '최유진',
    majors: '디지털미디어콘텐츠전공 / 디지털인문예술전공',
    url: null,
  },
  {
    id: 'pf-05',
    studentNo: '18학번',
    name: '서은채',
    majors: '디지털미디어콘텐츠전공 / 디지털인문예술전공',
    url: null,
  },
  {
    id: 'pf-06',
    studentNo: '18학번',
    name: '안유미',
    majors: '디지털미디어콘텐츠전공 / 디지털인문예술전공',
    url: null,
  },
  {
    id: 'pf-07',
    studentNo: '18학번',
    name: '최수빈',
    majors: '영어영문학과 / 디지털인문예술전공',
    url: null,
  },
  {
    id: 'pf-08',
    studentNo: '16학번',
    name: '김진화',
    majors: '영어영문학과 / 디지털인문예술전공',
    url: null,
  },
];
