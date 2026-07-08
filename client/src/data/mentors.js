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
 * @property {string} nameEn - 이름 (영문)
 * @property {string} company - 소속 기업·기관 (원문 링크 텍스트 그대로)
 * @property {string} companyEn - 소속 기업·기관 (영문)
 * @property {string|null} role - 직함 (원문에 없으면 null)
 * @property {string|null} roleEn - 직함 (영문, 원문에 없으면 null)
 * @property {string|null} companyUrl - 기업 홈페이지 (원문 그대로, 없으면 null)
 */
export const mentors = [
  {
    id: 'mentor-01',
    name: '강남구',
    nameEn: 'Nam Gu Kang',
    company: '광고회사 (주)나스미디어',
    companyEn: 'Nasmedia',
    role: '본부장/상무',
    roleEn: 'Executive Director',
    companyUrl: 'https://www.nasmedia.co.kr/',
  },
  {
    id: 'mentor-02',
    name: '김태경',
    nameEn: 'Tae Kyung Kim',
    company: '한화그룹 한화 S&C',
    companyEn: 'Hanwha S&C',
    role: '부장',
    roleEn: 'General Manager',
    companyUrl: 'https://www.hanwhasystems.com/kr/index.do',
  },
  {
    id: 'mentor-03',
    name: '송경수',
    nameEn: 'Kyung Soo Song',
    company: '주식회사 퓨어랜드',
    companyEn: 'Pureland',
    role: '대표이사',
    roleEn: 'CEO',
    companyUrl: null, // 원문에 링크 없음
  },
  {
    id: 'mentor-04',
    name: '심상진',
    nameEn: 'Sang Jin Sim',
    company: '네이버 CLOVA',
    companyEn: 'NAVER CLOVA',
    role: '연구원',
    roleEn: 'Researcher',
    companyUrl: 'https://clova.ai/',
  },
  {
    id: 'mentor-05',
    name: '여병상',
    nameEn: 'Byung Sang Yeo',
    company: '파이미디어랩',
    companyEn: 'Pi Media Lab',
    role: 'CEO',
    roleEn: 'CEO',
    companyUrl: 'https://www.paimedialab.com/',
  },
  {
    id: 'mentor-06',
    name: '이득영',
    nameEn: 'Deuk Young Lee',
    company: 'wework Korea',
    companyEn: 'WeWork Korea',
    role: null, // 원문에 직함 표기 없음
    roleEn: null,
    companyUrl: 'https://www.wework.com/ko-KR?_gl=1*1qm05ax*_up*MQ..*_gs*MQ..', // 원문 URL 그대로 (트래킹 파라미터 포함)
  },
  {
    id: 'mentor-07',
    name: '최우식',
    nameEn: 'Woo Sik Choi',
    company: 'H9 (UX 디자인 에이전시)',
    companyEn: 'H9 (UX Design Agency)',
    role: '대표',
    roleEn: 'CEO',
    companyUrl: 'https://www.hnine.com/',
  },
  {
    id: 'mentor-08',
    name: '김건식',
    nameEn: 'Gun Sik Kim',
    company: 'Scanline VFX, Vancouver',
    companyEn: 'Scanline VFX, Vancouver',
    role: '컴퓨터 그래픽 아티스트',
    roleEn: 'CG Artist',
    companyUrl: 'https://scanlinevfx.com/',
  },
  {
    id: 'mentor-09',
    name: '박성준',
    nameEn: 'Sung Jun Park',
    company: '상명대 감성공학과/감성 콘텐츠 기술 연구소',
    companyEn: 'Sangmyung University, Emotion Engineering',
    role: '교수',
    roleEn: 'Professor',
    // 원문에 링크 2개: 감성공학과(아래), 감성 콘텐츠 기술 연구소(https://ct.smu.ac.kr/Home)
    companyUrl: 'https://www.smu.ac.kr/ee/index.do',
  },
  {
    id: 'mentor-10',
    name: '송치성',
    nameEn: 'Chi Sung Song',
    company: '엔씨소프트',
    companyEn: 'NCSOFT',
    role: '연구원',
    roleEn: 'Researcher',
    companyUrl: 'https://www.nc.com/',
  },
  {
    id: 'mentor-11',
    name: '양혜원',
    nameEn: 'Hye Won Yang',
    company: '글로벌 비지니스 오랑앤오랑', // 원문 표기 그대로
    companyEn: 'Orang & Orang',
    role: '대표',
    roleEn: 'CEO',
    companyUrl: 'https://orang.co.kr/',
  },
  {
    id: 'mentor-12',
    name: '오은욱',
    nameEn: 'Eun Wook Oh',
    company: 'University of Colorado at Denver',
    companyEn: 'University of Colorado at Denver',
    role: '경영학과 교수',
    roleEn: 'Professor of Business',
    companyUrl: 'https://www.ucdenver.edu/institutes/international-business',
  },
  {
    id: 'mentor-13',
    name: '천수경',
    nameEn: 'Su Kyung Cheon',
    company: 'studio x.it (UX 컨설팅)',
    companyEn: 'studio x.it (UX Consulting)',
    role: '대표',
    roleEn: 'CEO',
    companyUrl: 'https://studio-x.it/',
  },
  {
    id: 'mentor-14',
    name: '황미진',
    nameEn: 'Mi Jin Hwang',
    company: '(주)엘리스',
    companyEn: 'Elice',
    role: '마케팅 팀장',
    roleEn: 'Marketing Team Lead',
    companyUrl: 'https://elice.io/ko',
  },
];
