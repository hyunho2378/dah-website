/**
 * nav.js — v2 메뉴 트리 (10_IA_V2 1·2절 사이트맵)
 * 헤더 메가메뉴·GlassDock·Footer가 공유하는 단일 진실 소스.
 * 1차 메뉴 6개 고정: About / 교육과정 / 프로그램 / 학생 / 쇼케이스 / 소식
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
 * @property {NavChild[]} children - 메가메뉴 하위 페이지
 */
export const nav = [
  {
    label: 'About',
    labelEn: 'About',
    to: '/about',
    children: [
      { label: '전공 소개', labelEn: 'About DAH', to: '/about' },
      { label: '교수진·멘토단', labelEn: 'People', to: '/about/people' },
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
    label: '프로그램',
    labelEn: 'Programs',
    to: '/programs/exhibitions',
    children: [
      { label: '전시회', labelEn: 'Exhibitions', to: '/programs/exhibitions' },
      { label: '공모전', labelEn: 'Contests', to: '/programs/contests' },
      { label: '특강', labelEn: 'Lectures', to: '/programs/lectures' },
    ],
  },
  {
    label: '학생',
    labelEn: 'Students',
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
    children: [
      { label: '웹&앱 쇼케이스', labelEn: 'Web & App Showcase', to: '/showcase' },
    ],
  },
  {
    label: '소식',
    labelEn: 'News',
    to: '/news',
    children: [
      { label: '공지사항', labelEn: 'News', to: '/news' },
      { label: '자료실', labelEn: 'Resources', to: '/resources' },
    ],
  },
];
