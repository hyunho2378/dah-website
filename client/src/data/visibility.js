// visibility.js — 콘텐츠 유형별 공개/비공개가 "어디에" 적용되는지의 단일 진실 소스.
//
// 배경(38_VISIBILITY): 대시보드 토글은 site_settings.contentVisibility에 저장되고 있었지만
// 실제로 반영되는 곳은 헤더 하위 메뉴의 포트폴리오 한 곳뿐이었다(nav.js에 visibilityKey가
// portfolios에만 있었다). 그래서 다른 유형을 비공개로 바꿔도 화면이 그대로였다.
//
// 이 파일이 유형 → (라우트 / 홈 섹션) 대응을 한곳에 모으고, 헤더·홈·라우트 가드·사이트맵이
// 전부 이 표를 참조한다. 유형 키는 서버 settings.js DEFAULT_VISIBILITY와 1:1로 맞춘다.

/**
 * 라우트 경로 → 이 경로를 여는 데 필요한 콘텐츠 유형들.
 * 배열인 이유: 한 페이지가 여러 유형을 담는 경우가 있다.
 *   /about/people = 교수진(professors) + 멘토(mentors)
 *   /students/careers = 취업 현황(careers) + 포트폴리오(portfolios)
 * 규칙: 배열 중 "하나라도" 공개면 페이지는 열린다(안에서 비공개 섹션만 빠진다).
 * 여기 없는 경로는 가시성 제어 대상이 아니다(항상 공개).
 */
export const ROUTE_VISIBILITY = {
  '/about/people': ['professors', 'mentors'],
  '/curriculum': ['curriculum'],
  '/programs/exhibitions': ['exhibitions'],
  '/programs/contests': ['contest'],
  '/programs/lectures': ['lecture'],
  '/students/council': ['council'],
  '/students/clubs': ['club'],
  '/students/achievements': ['achievement'],
  '/students/careers': ['careers', 'portfolios'],
  '/showcase': ['showcase'],
  '/news': ['notice'],
  '/resources': ['resource'],
};

/**
 * 상세 라우트는 목록 유형을 따른다(목록이 비공개면 상세도 막는다).
 * 접두사 매칭이라 /news/12 → notice, /programs/exhibitions/3 → exhibitions.
 */
export const ROUTE_PREFIX_VISIBILITY = [
  ['/programs/exhibitions/', ['exhibitions']],
  ['/programs/contests/', ['contest']],
  ['/programs/lectures/', ['lecture']],
  ['/students/clubs/', ['club']],
  ['/showcase/', ['showcase']],
  ['/news/', ['notice']],
  ['/resources/', ['resource']],
];

/** 홈 섹션 → 그 섹션이 다루는 유형들. 전부 비공개면 섹션 자체를 렌더하지 않는다. */
export const HOME_SECTION_VISIBILITY = {
  programs: ['exhibitions', 'contest', 'lecture', 'showcase'],
  achievements: ['achievement'],
  news: ['notice'],
};

/**
 * 경로에 필요한 유형 목록을 돌려준다(없으면 null = 제어 대상 아님).
 * /en 프리픽스와 해시·쿼리는 떼고 판단한다.
 */
export function visibilityTypesForPath(pathname) {
  if (typeof pathname !== 'string') return null;
  let p = pathname.split('#')[0].split('?')[0];
  if (p === '/en') p = '/';
  else if (p.startsWith('/en/')) p = p.slice(3);
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);

  if (ROUTE_VISIBILITY[p]) return ROUTE_VISIBILITY[p];
  for (const [prefix, types] of ROUTE_PREFIX_VISIBILITY) {
    if (p.startsWith(prefix)) return types;
  }
  return null;
}
