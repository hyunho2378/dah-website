/**
 * nanodegree.js — 나노디그리 과정 (K2-13 사용자 제공 원문 이관)
 *
 * 대원칙: intro·cert·programs 국문 값은 사용자 제공 원문 한 글자 그대로. 수정 금지.
 * introEn·certEn·programsEn: 정보 증감 없는 영문 대역. 과목명은 curriculum.js nameEn과 일치.
 *
 * @typedef {Object} NanodegreeCourse
 * @property {string} code - 과목번호
 * @property {string} name - 교과목명
 * @property {string} credit - 학점-강의-실습
 *
 * @typedef {Object} NanodegreeProgram
 * @property {string} name - 과정명
 * @property {string} criteria - 이수기준 (9학점)
 * @property {string} partner - 유관 기관
 * @property {string} completion - 이수 규칙(수료 조건)
 * @property {NanodegreeCourse[]} courses - 인정 교과목 표
 *
 * @typedef {Object} Nanodegree
 * @property {string} intro
 * @property {string} cert
 * @property {NanodegreeProgram[]} programs
 * @property {string} introEn
 * @property {string} certEn
 * @property {NanodegreeProgram[]} programsEn
 */
export const nanodegree = {
  intro:
    '디지털인문예술에서는 전공 심화역량 함양과 전공별 현장 실무 중심의 역량 배양을 위하여 운영하는 집중 교육과정인 4개의 나노디그리 과정이 운영되고 있습니다.',
  cert: '각 과정별 인정 교과목 9학점 취득 시 이수증 발급',
  programs: [
    {
      name: 'AI 디자인',
      criteria: '9학점',
      partner: '파이미디어',
      completion: '4과목 중 3과목 이수하면 수료',
      courses: [
        { code: '713014', name: 'UX디자인', credit: '3-3-0' },
        { code: '713037', name: 'AI디자인', credit: '3-3-0' },
        { code: '713031', name: '서비스디자인', credit: '3-3-0' },
        { code: '713035', name: 'AI 이해의 기초', credit: '3-3-0' },
      ],
    },
    {
      name: 'UX 디자인',
      criteria: '9학점',
      partner: 'H9',
      completion: '4과목 중 3과목 이수하면 수료',
      courses: [
        { code: '713014', name: 'UX디자인', credit: '3-3-0' },
        { code: '713044', name: '경험디자인의 고급과정1', credit: '3-2-2' },
        { code: '713031', name: '서비스디자인', credit: '3-3-0' },
        { code: '713033', name: '경험디자인의 고급과정2', credit: '3-1-4' },
      ],
    },
    {
      name: '디지털 디자인',
      criteria: '9학점',
      partner: '루아흐 스튜디오',
      completion: '4과목 중 3과목 이수하면 수료',
      courses: [
        { code: '713010', name: '디지털디자인1', credit: '3-2-2' },
        { code: '713007', name: '디지털디자인2', credit: '3-2-2' },
        { code: '713043', name: '디지털디자인3', credit: '3-2-2' },
        { code: '713042', name: '디지털디자인4', credit: '3-2-2' },
      ],
    },
    {
      name: 'AI와 길 정보 구축 (HUSS)',
      criteria: '9학점',
      partner: '파이미디어',
      completion: '인정교과목 모두 이수하면 수료',
      courses: [
        { code: '108522', name: '도시의 탄생과 인간 삶의 이해', credit: '4-2-2' },
        { code: '713035', name: 'AI 이해의 기초', credit: '3-3-0' },
        { code: '713045', name: '생성형AI와 지역문화데이터', credit: '3-3-0' },
      ],
    },
  ],
  introEn:
    'Digital Arts and Humanities runs four nanodegree programs, intensive curricula designed to deepen major competencies and build field-oriented practical skills for each track.',
  certEn: 'A certificate is issued upon earning 9 credits from the recognized courses of each program.',
  programsEn: [
    {
      name: 'AI Design',
      criteria: '9 credits',
      partner: 'Pi Media',
      completion: 'Complete 3 of the 4 courses to finish',
      courses: [
        { code: '713014', name: 'UX Design', credit: '3-3-0' },
        { code: '713037', name: 'AI Design', credit: '3-3-0' },
        { code: '713031', name: 'Service Design', credit: '3-3-0' },
        { code: '713035', name: 'AI Fundamentals', credit: '3-3-0' },
      ],
    },
    {
      name: 'UX Design',
      criteria: '9 credits',
      partner: 'H9',
      completion: 'Complete 3 of the 4 courses to finish',
      courses: [
        { code: '713014', name: 'UX Design', credit: '3-3-0' },
        { code: '713044', name: 'Advanced Experience Design 1', credit: '3-2-2' },
        { code: '713031', name: 'Service Design', credit: '3-3-0' },
        { code: '713033', name: 'Advanced Experience Design 2', credit: '3-1-4' },
      ],
    },
    {
      name: 'Digital Design',
      criteria: '9 credits',
      partner: 'Ruach Studio',
      completion: 'Complete 3 of the 4 courses to finish',
      courses: [
        { code: '713010', name: 'Digital Design 1', credit: '3-2-2' },
        { code: '713007', name: 'Digital Design 2', credit: '3-2-2' },
        { code: '713043', name: 'Digital Design 3', credit: '3-2-2' },
        { code: '713042', name: 'Digital Design 4', credit: '3-2-2' },
      ],
    },
    {
      name: 'AI and Route Information Building (HUSS)',
      criteria: '9 credits',
      partner: 'Pi Media',
      completion: 'Complete all recognized courses to finish',
      courses: [
        { code: '108522', name: 'The Birth of Cities and Understanding Human Life', credit: '4-2-2' },
        { code: '713035', name: 'AI Fundamentals', credit: '3-3-0' },
        { code: '713045', name: 'Generative AI and Local Culture Data', credit: '3-3-0' },
      ],
    },
  ],
};
