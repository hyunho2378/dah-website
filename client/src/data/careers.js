/**
 * careers.js — 졸업생 취업 현황 26건 (source_content.md '취업 현황' 절 원문 전량 이관)
 * 이름·전공 조합·회사명·URL 원문 그대로 (트래킹 파라미터 포함 URL도 원문 유지).
 * 강도연은 원문에 전공 조합이 다른 2건 존재 — 원문 그대로 2건 모두 이관.
 *
 * @typedef {Object} Career
 * @property {string} id - 고유 id
 * @property {string} name - 졸업생 이름 (원문 그대로)
 * @property {string} majors - 전공 조합 (원문 괄호 안 표기 그대로)
 * @property {string} company - 회사·기관명 (원문 링크 텍스트 그대로)
 * @property {string|null} companyUrl - 회사 홈페이지 (원문 그대로, 없으면 null)
 * @property {string|null} role - 직무·설명 (원문 그대로, 없으면 null)
 */
export const careers = [
  {
    id: 'career-01',
    name: '강도연',
    majors: '철학 / 디지털인문예술',
    company: 'KT그룹 플레이디 (PLAY.D)',
    companyUrl: 'https://www.playd.com/w/index.html',
    role: '종합온라인 광고대행사, 디지털 마케팅',
  },
  {
    id: 'career-02',
    name: '강수민',
    majors: '의과학융합 / 디지털인문예술',
    company: 'Ecole des hautes études en santé publique(EHESP)',
    companyUrl: 'https://theconversation.com/institutions/ecole-des-hautes-etudes-en-sante-publique-ehesp-3028',
    role: '프랑스 국립공중보건대학 석사과정',
  },
  {
    id: 'career-03',
    name: '김도경',
    majors: '빅데이터 / 디지털인문예술',
    company: '포항공대 대학원',
    companyUrl: 'https://pirl.postech.ac.kr/',
    role: '박사과정, 자연어처리 연구실',
  },
  {
    id: 'career-04',
    name: '곽선재',
    majors: '디지털인문예술 / 디지털미디어콘텐츠',
    company: '상상스퀘어',
    companyUrl: 'https://www.sangsangsquare.com/',
    role: '커뮤니티매니저 (프로그램 기획 홍보, UX디자인)',
  },
  {
    id: 'career-05',
    name: '남내현',
    majors: '사학 / 디지털인문예술',
    company: '(주)일엠연구소',
    companyUrl: 'https://ilem.co.kr/',
    role: 'ML 및 GIS 담당 연구원',
  },
  {
    id: 'career-06',
    name: '박재정',
    majors: '영어영문학 / 디지털인문예술',
    company: '인터웍스 미디어',
    companyUrl: 'https://www.interworksmedia.co.kr/',
    role: '광고, 마케팅',
  },
  {
    id: 'career-07',
    name: '손정민',
    majors: '디지털미디어콘텐츠 / 디지털인문예술',
    company: 'H9',
    companyUrl: 'https://www.hnine.com/',
    role: 'UX 디자인 컨설팅, UX 디자이너',
  },
  {
    id: 'career-08',
    name: '심재연',
    majors: '디지털인문예술 / 디지털미디어콘텐츠',
    company: '국민대 테크노디자인 대학원',
    companyUrl: 'https://ted.kookmin.ac.kr/ted/index.do',
    role: 'PSSD Lab',
  },
  {
    id: 'career-09',
    name: '안소현',
    majors: '디지털미디어콘텐츠 / 디지털인문예술',
    company: '국민대 테크노디자인 대학원',
    companyUrl: 'https://ted.kookmin.ac.kr/ted/index.do',
    role: 'AI 디자인랩',
  },
  {
    id: 'career-10',
    name: '오소민',
    majors: '광고홍보학 / 디지털인문예술',
    company: '디트라이브',
    companyUrl: 'https://www.dtribe.co.kr/main.php',
    role: '퍼포먼스 마케팅',
  },
  {
    id: 'career-11',
    name: '장 달', // 원문 표기 그대로
    majors: 'AI로봇융합 / 디지털인문예술',
    company: '국민대 테크노디자인 대학원',
    companyUrl: 'https://ted.kookmin.ac.kr/ted/index.do',
    role: 'AI 디자인랩',
  },
  {
    id: 'career-12',
    name: '장은영',
    majors: '국어국문학 / 디지털미디어콘텐츠', // 원문 표기 그대로
    company: '큐로드',
    companyUrl: 'https://www.qroad.net/ko',
    role: '게임 컨설팅',
  },
  {
    id: 'career-13',
    name: '정예찬',
    majors: '국어국문학 / 디지털인문예술',
    company: '빅플러스',
    companyUrl: 'https://bigplus.kr/?NaPm=ct%3Dmg7aof0w%7Cci%3Dcheckout%7Ctr%3Dds%7Ctrx%3Dnull%7Chk%3Dfc62c07ef47e55566e53c3eaeabc075e6e01316a', // 원문 URL 그대로 (트래킹 파라미터 포함)
    role: '퍼포먼스 마케팅',
  },
  {
    id: 'career-14',
    name: '강도연',
    majors: '콘텐츠IT / 디지털인문예술',
    company: '웨일앤썬',
    companyUrl: 'https://www.whaleandsun.com/',
    role: '법률 솔루션 IT, 프론트엔드 백엔드 개발',
  },
  {
    id: 'career-15',
    name: '김기연',
    majors: '영어영문학 / 디지털인문예술',
    company: '뉴로핏',
    companyUrl: 'https://www.neurophet.com/',
    role: '인공지능 연구원',
  },
  {
    id: 'career-16',
    name: '김도희',
    majors: '영어영문학 / 디지털인문예술',
    company: '수원축산농협',
    companyUrl: null, // 원문에 링크 없음
    role: null, // 원문에 직무 표기 없음
  },
  {
    id: 'career-17',
    name: '김정호',
    majors: '영어영문학 / 디지털인문예술',
    company: '국민대 테크노디자인 대학원',
    companyUrl: 'https://ted.kookmin.ac.kr/ted/index.do',
    role: '경험 디자인 전공',
  },
  {
    id: 'career-18',
    name: '김찬민',
    majors: '디지털미디어콘텐츠 / 디지털인문예술',
    company: '씨네메이트',
    companyUrl: 'https://youtu.be/6Q_rm8gMFoo?si=w9a5d1aKTzCotzpW', // 원문 링크가 회사 홈페이지가 아닌 유튜브 영상 — 원문 그대로 유지
    role: '디지털사업본부 DI사업팀',
  },
  {
    id: 'career-19',
    name: '나지수',
    majors: '국어국문학 / 디지털인문예술',
    company: '몽땅뚝딱',
    companyUrl: 'https://www.ttukttak.kr/interior',
    role: '온라인 콘텐츠 마케팅',
  },
  {
    id: 'career-20',
    name: '류정은',
    majors: '국어국문학 / 디지털인문예술',
    company: '스틱 인터랙티브',
    companyUrl: 'https://www.stickint.co.kr/',
    role: '광고, 디지털 마케팅',
  },
  {
    id: 'career-21',
    name: '박형민',
    majors: '사회학 / 디지털인문예술',
    company: 'C&C 레볼루션',
    companyUrl: 'https://www.cncrevolution.kr/main',
    role: '웹소설 PD',
  },
  {
    id: 'career-22',
    name: '송채원',
    majors: '정치행정학 / 디지털인문예술',
    company: 'OSCART Contents',
    companyUrl: 'https://www.oscart.fr/en/',
    role: '비주얼 디자이너',
  },
  {
    id: 'career-23',
    name: '안은수',
    majors: '디지털미디어콘텐츠 / 디지털인문예술',
    company: '미림미디어랩',
    companyUrl: 'http://www.mirimmedialab.co.kr/',
    role: '이러닝 콘텐츠 개발, 영상 제작',
  },
  {
    id: 'career-24',
    name: '이상규',
    majors: '사회학 / 디지털인문예술',
    company: '더블에이플랫',
    companyUrl: 'https://youtube.com/@aap2784?si=U_gsGxB-4J_wMFwi', // 원문 링크가 유튜브 채널 — 원문 그대로 유지
    role: '유튜브 MCN 팀장',
  },
  {
    id: 'career-25',
    name: '장유리',
    majors: '광고홍보학 / 디지털인문예술',
    company: '라운드랩',
    companyUrl: 'https://roundlab.co.kr/?NaPm=ct%3Dmg7an48h%7Cci%3Dcheckout%7Ctr%3Dds%7Ctrx%3Dnull%7Chk%3D973abdeafaa154b3979e2d67e25bc89f3b0f22d1', // 원문 URL 그대로 (트래킹 파라미터 포함)
    role: '마케팅',
  },
  {
    id: 'career-26',
    name: '정주영',
    majors: '법학 / 디지털인문예술',
    company: '법무법인 YK',
    companyUrl: 'https://www.yklawfirm.co.kr/brand',
    role: null, // 원문에 직무 표기 없음
  },
];
