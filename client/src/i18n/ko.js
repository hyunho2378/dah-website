/**
 * ko.js — UI 라벨 사전 (13_CMS_SPEC 5절 i18n)
 *
 * - UI 라벨(네비·퀵링크·섹션 타이틀·푸터·공유·빈 상태)만 담는다.
 * - 긴 콘텐츠 문단(About 원문 등)은 여기 두지 않는다 — 페이지가 src/data 원문을 직접 렌더하고,
 *   영문 페이지에서는 KoreanOnlyBadge + 국문 렌더 패턴을 쓴다(en.js 하단 예약 키 주석 참조).
 * - en.js에 같은 키가 없으면 LangContext.t()가 이 파일 값으로 폴백한다.
 */
export const ko = {
  nav: {
    home: '홈',
    about: 'About',
    curriculum: '교육과정',
    programs: '프로그램',
    students: '학생',
    showcase: '쇼케이스',
    news: '소식',
  },
  titles: {
    about: '전공 소개',
    people: '교수진·멘토단',
    curriculum: '교육과정',
    codesharing: '코드쉐어링',
  },
  hero: {
    ctaAbout: '전공 소개',
    ctaExhibition: '전시회 보러가기',
  },
  quicklinks: {
    label: '퀵링크',
    submit: '전시회 접수',
    showcaseSubmit: '쇼케이스 제출',
    notice: '공지사항',
    codesharing: '코드쉐어링',
  },
  sections: {
    programs: '프로그램',
    tracks: '3개 트랙',
    achievements: '학생 수상 실적',
    news: '공지사항',
    overview: '개요',
    missionVision: '미션·비전',
    history: '연혁',
    graduate: '대학원 안내',
    roadmap: '4년 로드맵',
    relatedCourses: '관련 교과목',
    procedure: '승인 절차',
    departments: '인정 학과',
    faculty: '교수진',
    mentors: '산업 멘토단',
    codesharing: '코드쉐어링',
  },
  // 트랙 표시명 v2 (10_IA_V2 0절 확정) — 데이터 키(track-1~3/common)는 유지, 표시만 매핑
  tracks: {
    'track-1': '디자인 트랙',
    'track-2': 'AI 트랙',
    'track-3': '엔터컬쳐 트랙',
    common: '공통기초',
  },
  programs: {
    exhibitions: { label: '전시회', desc: '학기별 전공 프로젝트 전시회 아카이브' },
    contests: { label: '공모전', desc: '전공·교내외 공모전 모집과 결과 안내' },
    lectures: { label: '특강', desc: '산업·학계 연사 초청 특강 안내' },
    showcase: { label: '쇼케이스', desc: '재학생 웹·앱 프로젝트 쇼케이스' },
  },
  actions: {
    viewAll: '전체 보기',
    viewMore: 'VIEW MORE',
    detail: '자세히 보기',
    download: '신청서 다운로드',
    share: '공유',
    copyLink: '링크 복사',
    copied: '복사됨',
    login: '로그인',
  },
  common: {
    koreanOnly: 'Korean only',
    empty: '등록된 항목이 없습니다',
    offline: '실시간 동기화 대기 중',
  },
  footer: {
    copyright: '© 2026 Hallym University Digital Arts and Humanities',
    department: '디지털인문예술전공',
    university: '한림대학교',
  },
};
