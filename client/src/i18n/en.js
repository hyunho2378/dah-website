/**
 * en.js — 영문 UI 라벨 사전 (13_CMS_SPEC 5절 i18n)
 *
 * - 확실한 UI 라벨만 담는다. 기계번역 삽입 금지.
 * - 여기 없는 키는 LangContext.t()가 ko.js 값으로 폴백한다.
 * - Track 영문명은 13_CMS_SPEC 5절 확정값: Design Track / AI Track / Enter-Culture Track.
 */
export const en = {
  nav: {
    home: 'Home',
    about: 'About',
    curriculum: 'Curriculum',
    programs: 'Programs',
    students: 'Students',
    showcase: 'Showcase',
    news: 'News',
  },
  titles: {
    about: 'About',
    people: 'Faculty & Mentors',
    curriculum: 'Curriculum',
    codesharing: 'Code Sharing',
  },
  hero: {
    ctaAbout: 'About',
    ctaExhibition: 'Visit Exhibition',
  },
  quicklinks: {
    label: 'Quick Links',
    submit: 'Exhibition Entry',
    showcaseSubmit: 'Showcase Submission',
    notice: 'Notices',
    codesharing: 'Code Sharing',
  },
  sections: {
    programs: 'Programs',
    tracks: 'Three Tracks',
    achievements: 'Student Achievements',
    news: 'Notices',
    overview: 'Overview',
    missionVision: 'Mission & Vision',
    history: 'History',
    graduate: 'Graduate Program',
    roadmap: '4-Year Roadmap',
    relatedCourses: 'Courses',
    procedure: 'Approval Process',
    departments: 'Eligible Departments',
    faculty: 'Faculty',
    mentors: 'Industry Mentors',
    codesharing: 'Code Sharing',
  },
  tracks: {
    'track-1': 'Design Track',
    'track-2': 'AI Track',
    'track-3': 'Enter-Culture Track',
    common: 'Common Core',
  },
  programs: {
    exhibitions: { label: 'Exhibitions', desc: 'Semester project exhibition archive' },
    contests: { label: 'Contests', desc: 'Contest calls and results' },
    lectures: { label: 'Lectures', desc: 'Guest lecture announcements' },
    showcase: { label: 'Showcase', desc: 'Student web and app showcase' },
  },
  actions: {
    viewAll: 'View All',
    viewMore: 'VIEW MORE',
    detail: 'Details',
    download: 'Download Form',
    share: 'Share',
    copyLink: 'Copy Link',
    copied: 'Copied',
    login: 'Login',
  },
  common: {
    koreanOnly: 'Korean only',
    empty: 'No entries yet',
    offline: 'Awaiting live sync',
  },
  footer: {
    copyright: '© 2026 Hallym University Digital Arts and Humanities',
    department: 'Digital Arts and Humanities',
    university: 'Hallym University',
  },

  // ── 예약 키 (값 미기입 = ko 폴백) ─────────────────────────────────────
  // 고정 페이지 장문 원고는 사람이 감수한 번역 확보 후 아래 키로 추가한다(13_CMS_SPEC 5절).
  // 그 전까지 영문 페이지는 KoreanOnlyBadge + 국문 렌더.
  // content.about.what / content.about.why / content.about.history
  // content.curriculum.trackSummaries / content.codesharing.definition
  // content.codesharing.note / content.codesharing.steps
};
