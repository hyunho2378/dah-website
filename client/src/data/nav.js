/**
 * nav.js — 헤더·GlassDock가 공유하는 단일 진실 소스
 * 헤더 IA(진흥원 방식) — 1차 메뉴 6개, 각 그룹 클릭 시 첫 하위 페이지로 이동:
 * About / 학사 안내 / 학과 행사 / 학생 활동 / 공지사항 / 자료실
 * - 각 그룹 대표 경로(to) = 첫 하위 항목 경로
 * - About 하위: 전공 소개 · 연혁 · 교수진 · 멘토 · CI
 * - 학사 안내 하위: 교육과정 · 코드쉐어링 · 나노디그리
 * - 학과 행사 하위: 프로젝트 전시회 · 공모전 · 특강
 * - 학생 활동 하위: 운영위원회 · 동아리 · 학생 성과 · 웹&앱 쇼케이스 · 취업 현황
 * - 공지사항·자료실은 하위 없는 단일 링크
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
    to: '/about',
    children: [
      { label: '전공 소개', labelEn: 'Overview', to: '/about' },
      { label: '연혁', labelEn: 'History', to: '/about#history' },
      { label: '교수진', labelEn: 'Faculty', to: '/about/people' },
      { label: '멘토', labelEn: 'Mentors', to: '/about/people#mentors' },
      { label: 'CI', labelEn: 'CI', to: '/about/ci' },
    ],
  },
  {
    label: '학사 안내',
    labelEn: 'Academics',
    to: '/curriculum',
    children: [
      { label: '교육과정', labelEn: 'Curriculum', to: '/curriculum' },
      { label: '코드쉐어링', labelEn: 'Code Sharing', to: '/curriculum/codesharing' },
      { label: '나노디그리', labelEn: 'Nanodegree', to: '/curriculum/nanodegree' },
    ],
  },
  {
    label: '학과 행사',
    labelEn: 'Events',
    to: '/programs/exhibitions',
    children: [
      { label: '프로젝트 전시회', labelEn: 'Exhibitions', to: '/programs/exhibitions' },
      { label: '공모전', labelEn: 'Contests', to: '/programs/contests' },
      { label: '특강', labelEn: 'Lectures', to: '/programs/lectures' },
    ],
  },
  {
    label: '학생 활동',
    labelEn: 'Student Life',
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
