/**
 * mentors.js — 산업 멘토단 (source_content.md '멘토' 절 원문 이관)
 *
 * [스펙-원문 불일치 주의] 스펙·stats.js는 '산업 멘토 12'이지만 원문 명단은 14명.
 * 이 중 박성준(상명대), 오은욱(UC Denver) 2명은 대학 교수 신분 — '산업 멘토 12'는
 * 이 2명을 제외한 집계로 추정. 원문 전량 이관 원칙에 따라 14명 모두 보존한다.
 * 최종 표기 방침은 사용자 확인 필요 (PROGRESS.md 데이터 갭 참고).
 *
 * @typedef {Object} Mentor
 * @property {string} id - 고유 id
 * @property {string} name - 이름 (원문 그대로)
 * @property {string} company - 소속 기업·기관 (원문 링크 텍스트 그대로)
 * @property {string|null} role - 직함 (원문에 없으면 null)
 * @property {string|null} companyUrl - 기업 홈페이지 (원문 그대로, 없으면 null)
 */
export const mentors = [
  {
    id: 'mentor-01',
    name: '강남구',
    company: '광고회사 (주)나스미디어',
    role: '본부장/상무',
    companyUrl: 'https://www.nasmedia.co.kr/',
  },
  {
    id: 'mentor-02',
    name: '김태경',
    company: '한화그룹 한화 S&C',
    role: '부장',
    companyUrl: 'https://www.hanwhasystems.com/kr/index.do',
  },
  {
    id: 'mentor-03',
    name: '송경수',
    company: '주식회사 퓨어랜드',
    role: '대표이사',
    companyUrl: null, // 원문에 링크 없음
  },
  {
    id: 'mentor-04',
    name: '심상진',
    company: '네이버 CLOVA',
    role: '연구원',
    companyUrl: 'https://clova.ai/',
  },
  {
    id: 'mentor-05',
    name: '여병상',
    company: '파이미디어랩',
    role: 'CEO',
    companyUrl: 'https://www.paimedialab.com/',
  },
  {
    id: 'mentor-06',
    name: '이득영',
    company: 'wework Korea',
    role: null, // 원문에 직함 표기 없음
    companyUrl: 'https://www.wework.com/ko-KR?_gl=1*1qm05ax*_up*MQ..*_gs*MQ..', // 원문 URL 그대로 (트래킹 파라미터 포함)
  },
  {
    id: 'mentor-07',
    name: '최우식',
    company: 'H9 (UX 디자인 에이전시)',
    role: '대표',
    companyUrl: 'https://www.hnine.com/',
  },
  {
    id: 'mentor-08',
    name: '김건식',
    company: 'Scanline VFX, Vancouver',
    role: '컴퓨터 그래픽 아티스트',
    companyUrl: 'https://scanlinevfx.com/',
  },
  {
    id: 'mentor-09',
    name: '박성준',
    company: '상명대 감성공학과/감성 콘텐츠 기술 연구소',
    role: '교수',
    // 원문에 링크 2개: 감성공학과(아래), 감성 콘텐츠 기술 연구소(https://ct.smu.ac.kr/Home)
    companyUrl: 'https://www.smu.ac.kr/ee/index.do',
  },
  {
    id: 'mentor-10',
    name: '송치성',
    company: '엔씨소프트',
    role: '연구원',
    companyUrl: 'https://www.nc.com/',
  },
  {
    id: 'mentor-11',
    name: '양혜원',
    company: '글로벌 비지니스 오랑앤오랑', // 원문 표기 그대로
    role: '대표',
    companyUrl: 'https://orang.co.kr/',
  },
  {
    id: 'mentor-12',
    name: '오은욱',
    company: 'University of Colorado at Denver',
    role: '경영학과 교수',
    companyUrl: 'https://www.ucdenver.edu/institutes/international-business',
  },
  {
    id: 'mentor-13',
    name: '천수경',
    company: 'studio x.it (UX 컨설팅)',
    role: '대표',
    companyUrl: 'https://studio-x.it/',
  },
  {
    id: 'mentor-14',
    name: '황미진',
    company: '(주)엘리스',
    role: '마케팅 팀장',
    companyUrl: 'https://elice.io/ko',
  },
];
