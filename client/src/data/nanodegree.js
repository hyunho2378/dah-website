/**
 * nanodegree.js — 나노디그리 과정 (K2-13 사용자 제공 원문 이관)
 *
 * 대원칙: intro·cert·programs 국문 값은 사용자 제공 원문 한 글자 그대로. 수정 금지.
 * introEn·certEn·programsEn: 정보 증감 없는 영문 대역. 과목명은 curriculum.js nameEn과 일치.
 *
 * @typedef {Object} NanodegreeProgram
 * @property {string} name - 과정명
 * @property {string} courses - 인정 교과목(원문 그대로, 쉼표 나열 문자열)
 * @property {string} partner - 유관 기관
 * @property {string} rule - 이수 기준
 * @property {string} [note] - 부가 설명(각주)
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
      name: 'UX디자인 과정',
      courses: 'UX디자인, 서비스디자인, 경험디자인의 고급과정1, 경험디자인의 고급과정2',
      partner: '*H9',
      rule: '인정 교과목 중 3과목 선택 이수',
      note: '*100명 규모의 UX 디자인 및 개발 기업',
    },
    {
      name: 'AI디자인 과정',
      courses: '디지털디자인1, 서비스디자인, AI디자인',
      partner: '루아흐 스튜디오',
      rule: '인정 교과목 모두 이수',
    },
    {
      name: '디지털디자인 과정',
      courses: '디지털 디자인1, 디지털 디자인2, 디지털 디자인3, UI 디자인',
      partner: '루아흐 스튜디오',
      rule: '인정 교과목 중 3과목 선택 이수',
    },
    {
      name: 'AI와 길 정보 구축 과정 (HUSS 사업)',
      courses:
        '도시의 탄생과 인간 삶의 이해(사학전공), AI 활용 데이터 리터러시, 생성형 AI와 지역 문화 데이터',
      partner: '파이미디어',
      rule: '인정 교과목 모두 이수',
    },
  ],
  introEn:
    'Digital Arts and Humanities runs four nanodegree programs, intensive curricula designed to deepen major competencies and build field-oriented practical skills for each track.',
  certEn: 'A certificate is issued upon earning 9 credits from the recognized courses of each program.',
  programsEn: [
    {
      name: 'UX Design Program',
      courses:
        'UX Design, Service Design, Advanced Experience Design 1, Advanced Experience Design 2',
      partner: '*H9',
      rule: 'Complete any three of the recognized courses',
      note: '*A UX design and development company with about 100 employees',
    },
    {
      name: 'AI Design Program',
      courses: 'Digital Design 1, Service Design, AI Design',
      partner: 'Ruach Studio',
      rule: 'Complete all recognized courses',
    },
    {
      name: 'Digital Design Program',
      courses: 'Digital Design 1, Digital Design 2, Digital Design 3, UI Design',
      partner: 'Ruach Studio',
      rule: 'Complete any three of the recognized courses',
    },
    {
      name: 'AI and Route Information Building Program (HUSS Project)',
      courses:
        'The Birth of Cities and Understanding Human Life (History Major), Data Literacy with AI, Generative AI and Local Culture Data',
      partner: 'Pi Media',
      rule: 'Complete all recognized courses',
    },
  ],
};
