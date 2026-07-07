/**
 * nav.js — 헤더·GlassDock가 공유하는 단일 진실 소스
 * G8(18_PHASE6) 헤더 IA 개편 — 1차 메뉴 8개:
 * About / 전공 소개 / 교육과정 / 학과 행사 / 학생 활동 / 쇼케이스 / 공지사항 / 자료실
 * - "전공 소개"를 About에서 분리해 최상위로(교수진·멘토단 하위)
 * - About은 개요·미션·비전·연혁(/about 단일 페이지)
 * - 프로그램 → 학과 행사, 학생 → 학생 활동 (라벨만 변경, 라우트 유지)
 * - 소식 메뉴 폐지: 공지사항·자료실 각각 최상위
 *
 * @typedef {Object} NavChild
 * @property {string} label - 하위 메뉴 라벨(KR, 명사형)
 * @property {string} labelEn - 하위 메뉴 라벨(EN)
 * @property {string} to - 내부 라우트 경로 (14_ROUTES_V2)
 *
 * @typedef {Object} NavItem
 * @property {string} label - 1차 메뉴 라벨(KR)
 * @property {string} labelEn - 1차 메뉴 라벨(EN)
 * @property {string} to - 대표 경로(첫 하위 페이지)
 * @property {NavChild[]} children - 메가메뉴 하위 페이지(없으면 단일 링크)
 */
export const nav = [
  {
    label: 'About',
    labelEn: 'About',
    to: '/about',
    children: [],
  },
  {
    label: '전공 소개',
    labelEn: 'People',
    to: '/about/people',
    children: [
      { label: '교수진', labelEn: 'Faculty', to: '/about/people' },
      { label: '멘토단', labelEn: 'Mentors', to: '/about/people#mentors' },
    ],
  },
  {
    label: '교육과정',
    labelEn: 'Curriculum',
    to: '/curriculum',
    children: [
      { label: '교육과정', labelEn: 'Curriculum', to: '/curriculum' },
      { label: '코드쉐어링', labelEn: 'Code Sharing', to: '/curriculum/codesharing' },
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
      { label: '진로', labelEn: 'Careers', to: '/students/careers' },
    ],
  },
  {
    label: '쇼케이스',
    labelEn: 'Showcase',
    to: '/showcase',
    children: [],
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
