/**
 * nav.js — 헤더·GlassDock가 공유하는 단일 진실 소스
 * H1(19_PHASE7) 헤더 IA 확정 — 1차 메뉴 6개:
 * About(=홈, 하위 없음) / 전공 소개 / 학과 행사 / 학생 활동 / 공지사항 / 자료실
 * - About 클릭 = / (홈) 이동
 * - 전공 소개 하위: 전공소개(/about) · 교육 과정(/curriculum) · 교수진 · 멘토
 * - 학생 활동 하위: 운영위원회 · 동아리 · 학생 성과 · 웹&앱 쇼케이스 · 취업 현황
 * - "멘토단" 표기는 전부 "멘토", "진로"는 "취업 현황"
 *
 * @typedef {Object} NavChild
 * @property {string} label - 하위 메뉴 라벨(KR, 명사형)
 * @property {string} labelEn - 하위 메뉴 라벨(EN)
 * @property {string} to - 내부 라우트 경로 (14_ROUTES_V2)
 *
 * @typedef {Object} NavItem
 * @property {string} label - 1차 메뉴 라벨(KR)
 * @property {string} labelEn - 1차 메뉴 라벨(EN)
 * @property {string} to - 대표 경로
 * @property {NavChild[]} children - 메가메뉴 하위 페이지(없으면 단일 링크)
 */
export const nav = [
  {
    label: 'About',
    labelEn: 'About',
    to: '/',
    children: [],
  },
  {
    label: '전공 소개',
    labelEn: 'Major',
    to: '/about',
    children: [
      { label: '전공소개', labelEn: 'Overview', to: '/about' },
      { label: '교육 과정', labelEn: 'Curriculum', to: '/curriculum' },
      { label: '코드쉐어링', labelEn: 'Code Sharing', to: '/curriculum/codesharing' },
      { label: '나노디그리', labelEn: 'Nanodegree', to: '/curriculum/nanodegree' },
      { label: '교수진', labelEn: 'Faculty', to: '/about/people' },
      { label: '멘토', labelEn: 'Mentors', to: '/about/people#mentors' },
    ],
  },
  {
    label: '학과 행사',
    labelEn: 'Events',
    to: '/programs/exhibitions',
    children: [
      { label: '전시회', labelEn: 'Exhibitions', to: '/programs/exhibitions' },
      { label: '공모전', labelEn: 'Contests', to: '/programs/contests' },
      { label: '특강', labelEn: 'Lectures', to: '/programs/lectures' },
    ],
  },
  {
    label: '학생 활동',
    labelEn: 'Activities',
    to: '/students/council',
    children: [
      { label: '운영위원회', labelEn: 'Student Council', to: '/students/council' },
      { label: '동아리', labelEn: 'Clubs', to: '/students/clubs' },
      { label: '학생 성과', labelEn: 'Achievements', to: '/students/achievements' },
      { label: '웹&앱 쇼케이스', labelEn: 'Web & App Showcase', to: '/showcase' },
      { label: '취업 현황', labelEn: 'Employment', to: '/students/careers' },
    ],
  },
  {
    label: '공지사항',
    labelEn: 'Notices',
    to: '/news',
    children: [],
  },
  {
    label: '자료실',
    labelEn: 'Resources',
    to: '/resources',
    children: [],
  },
];
