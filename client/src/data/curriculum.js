/**
 * curriculum.js — 교과목 (J10, 20_PHASE8 사용자 제공 원문 전면 교체)
 *
 * 원문 계약: 학년(year)=수준, credit="학점-강의-실습". 과목명 원문 한 글자 그대로.
 * track: common(공통기초) | track-1(디자인) | track-2(AI) | track-3(엔터컬쳐)
 * semester: 1 | 2
 * nameEn: J5 영문 대역(정보 증감 없는 번역)
 *
 * @typedef {Object} Course
 * @property {('common'|'track-1'|'track-2'|'track-3')} track
 * @property {number} semester
 * @property {number} year
 * @property {string} name
 * @property {string} nameEn
 * @property {string} credit
 */
export const curriculum = [
  // 공통기초 1학기
  { track: 'common', semester: 1, year: 1, name: '디지털인문예술입문', nameEn: 'Introduction to Digital Arts and Humanities', credit: '3-3-0' },
  { track: 'common', semester: 1, year: 1, name: '문화콘텐츠 기초', nameEn: 'Foundations of Cultural Content', credit: '3-3-0' },
  // 공통기초 2학기
  { track: 'common', semester: 2, year: 1, name: '디자인 씽킹', nameEn: 'Design Thinking', credit: '3-3-0' },
  { track: 'common', semester: 2, year: 1, name: 'AI 활용 데이터 리터러시', nameEn: 'Data Literacy with AI', credit: '3-3-0' },
  { track: 'common', semester: 2, year: 1, name: '서브컬처 가이드', nameEn: 'Guide to Subculture', credit: '3-3-0' },

  // 디자인 트랙 1학기
  { track: 'track-1', semester: 1, year: 2, name: 'UX디자인', nameEn: 'UX Design', credit: '3-2-2' },
  { track: 'track-1', semester: 1, year: 2, name: '디지털 디자인1', nameEn: 'Digital Design 1', credit: '3-2-2' },
  { track: 'track-1', semester: 1, year: 3, name: 'AI디자인', nameEn: 'AI Design', credit: '3-3-0' },
  { track: 'track-1', semester: 1, year: 3, name: '경험 디자인의 고급과정1', nameEn: 'Advanced Experience Design 1', credit: '3-2-2' },
  { track: 'track-1', semester: 1, year: 3, name: '디지털 디자인3', nameEn: 'Digital Design 3', credit: '3-2-2' },
  { track: 'track-1', semester: 1, year: 4, name: '캡스톤디자인: DAH프로젝트', nameEn: 'Capstone Design: DAH Project', credit: '3-3-0' },
  // 디자인 트랙 2학기
  { track: 'track-1', semester: 2, year: 2, name: '디지털 디자인2', nameEn: 'Digital Design 2', credit: '3-2-2' },
  { track: 'track-1', semester: 2, year: 2, name: '서비스 디자인', nameEn: 'Service Design', credit: '3-3-0' },
  { track: 'track-1', semester: 2, year: 2, name: '사회혁신디자인', nameEn: 'Social Innovation Design', credit: '3-3-0' },
  { track: 'track-1', semester: 2, year: 3, name: 'AI 중심의 경험 디자인', nameEn: 'AI-Driven Experience Design', credit: '3-3-0' },
  { track: 'track-1', semester: 2, year: 3, name: 'UI 디자인', nameEn: 'UI Design', credit: '3-2-2' },
  { track: 'track-1', semester: 2, year: 3, name: '경험디자인특강', nameEn: 'Special Topics in Experience Design', credit: '3-3-0' },
  { track: 'track-1', semester: 2, year: 4, name: '캡스톤디자인: DAH프로젝트', nameEn: 'Capstone Design: DAH Project', credit: '3-3-0' },

  // AI 트랙 1학기
  { track: 'track-2', semester: 1, year: 2, name: '빅데이터인문학', nameEn: 'Big Data Humanities', credit: '3-3-0' },
  { track: 'track-2', semester: 1, year: 3, name: '공간 인문학', nameEn: 'Spatial Humanities', credit: '3-3-0' },
  { track: 'track-2', semester: 1, year: 3, name: '인문데이터마이닝', nameEn: 'Humanities Data Mining', credit: '3-3-0' },
  { track: 'track-2', semester: 1, year: 3, name: '지역혁신연구방법론', nameEn: 'Research Methods for Regional Innovation', credit: '3-3-0' },
  { track: 'track-2', semester: 1, year: 4, name: '캡스톤디자인: DAH프로젝트', nameEn: 'Capstone Design: DAH Project', credit: '3-3-0' },
  // AI 트랙 2학기
  { track: 'track-2', semester: 2, year: 2, name: 'AI 서비스와 DB', nameEn: 'AI Services and Databases', credit: '3-3-0' },
  { track: 'track-2', semester: 2, year: 3, name: 'AI 활용 리서치 2', nameEn: 'Research with AI 2', credit: '3-3-0' },
  { track: 'track-2', semester: 2, year: 3, name: 'AI 서비스 기획과 프로토타이핑', nameEn: 'AI Service Planning and Prototyping', credit: '3-3-0' },
  { track: 'track-2', semester: 2, year: 3, name: '생성형AI와 지역문화데이터', nameEn: 'Generative AI and Local Culture Data', credit: '3-3-0' },
  { track: 'track-2', semester: 2, year: 4, name: '캡스톤디자인: DAH프로젝트', nameEn: 'Capstone Design: DAH Project', credit: '3-3-0' },

  // 엔터컬쳐 트랙 1학기
  { track: 'track-3', semester: 1, year: 2, name: '디지털문화콘텐츠마케팅', nameEn: 'Digital Cultural Content Marketing', credit: '3-3-0' },
  { track: 'track-3', semester: 1, year: 2, name: '문화원형과 고전콘텐츠', nameEn: 'Cultural Archetypes and Classical Content', credit: '3-3-0' },
  { track: 'track-3', semester: 1, year: 3, name: '스토리텔링 창작실습', nameEn: 'Storytelling Writing Practice', credit: '3-3-0' },
  { track: 'track-3', semester: 1, year: 3, name: '한국문화와 콘텐츠개발', nameEn: 'Korean Culture and Content Development', credit: '3-3-0' },
  { track: 'track-3', semester: 1, year: 4, name: '캡스톤디자인: DAH프로젝트', nameEn: 'Capstone Design: DAH Project', credit: '3-3-0' },
  // 엔터컬쳐 트랙 2학기
  { track: 'track-3', semester: 2, year: 2, name: '플랫폼 콘텐츠 기획과 전략', nameEn: 'Platform Content Planning and Strategy', credit: '3-3-0' },
  { track: 'track-3', semester: 2, year: 3, name: 'AI 크리에이터 스튜디오 2', nameEn: 'AI Creator Studio 2', credit: '3-3-0' },
  { track: 'track-3', semester: 2, year: 3, name: '게임과 스포테인먼트 콘텐츠', nameEn: 'Game and Sportainment Content', credit: '3-3-0' },
  { track: 'track-3', semester: 2, year: 3, name: '엔터컬처와 K-콘텐츠', nameEn: 'Enter-Culture and K-Content', credit: '3-3-0' },
  { track: 'track-3', semester: 2, year: 4, name: '캡스톤디자인: DAH프로젝트', nameEn: 'Capstone Design: DAH Project', credit: '3-3-0' },
];
