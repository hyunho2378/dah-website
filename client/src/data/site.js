/**
 * site.js — 사이트 전역 데이터
 * 원문: client/docs/source_content.md / 구조: client/docs/IA.md 2절
 * 모든 문구는 원문 이관. 원문에 없는 수치·인명·인용 생성 금지.
 *
 * @typedef {Object} SiteLinks
 * @property {string} exhibition - 전시회 외부 링크 (IA.md 명시)
 * @property {string} instagram - 운영위원회 인스타그램 (원문 명시)
 * @property {string} hallym - 한림대학교 홈페이지
 *
 * @typedef {Object} Site
 * @property {string} nameKr - 학과명(한글)
 * @property {string} nameEn - 학과명(영문)
 * @property {number} since - 설립 연도 (원문 연혁: 2017.03.01. 설립)
 * @property {string} address - 소속 (원문: 미래융합스쿨 소속 전공)
 * @property {SiteLinks} links
 */
export const site = {
  nameKr: '디지털인문예술전공',
  nameEn: 'Digital Arts and Humanities',
  since: 2017,
  address: '한림대학교 미래융합스쿨',
  links: {
    exhibition: 'https://26-1-dah-exhibition.vercel.app',
    instagram: 'https://www.instagram.com/hallym_lucid/',
    hallym: 'https://www.hallym.ac.kr',
  },
};

/**
 * 헤더/푸터 내비게이션 (IA.md 4절 — 메뉴 6개 고정)
 * @typedef {Object} NavItem
 * @property {string} label - 메뉴 라벨(EN)
 * @property {string} to - 내부 라우트 경로
 */
export const nav = [
  { label: 'About', to: '/about' },
  { label: 'Tracks', to: '/tracks' },
  { label: 'People', to: '/people' },
  { label: 'Achievements', to: '/achievements' },
  { label: 'Careers', to: '/careers' },
  { label: 'News', to: '/news' },
];

/**
 * 홈 히어로 (IA.md 2절 #1)
 * subKr: 원문 VISION 1항 표제 그대로. body: 원문 '전공소개' 첫 문장 그대로.
 * @typedef {Object} HeroCta
 * @property {string} label
 * @property {string} [to] - 내부 라우트 (내부 이동 시)
 * @property {string} [href] - 외부 URL (외부 링크 시)
 * @property {boolean} external
 */
export const hero = {
  eyebrow: 'HALLYM UNIVERSITY — SINCE 2017',
  titleEn: ['DIGITAL ARTS', '& HUMANITIES'],
  subKr: '미래를 디자인하는 창의적 리더 양성',
  body: '디지털인문예술전공은 글로벌 혁신을 주도하는 디지털·정보통신기술, 인간을 위한 가치를 구현하는 디자인, 그리고 사람과 사회를 이해하는 인문사회학적 소양을 융합하여 미래의 주역이 될 인재를 양성하는 새로운 융합 프로그램입니다.',
  ctas: [
    { label: '트랙 살펴보기', to: '/tracks', external: false },
    { label: '전시회 보러가기', href: 'https://26-1-dah-exhibition.vercel.app', external: true },
  ],
};

/**
 * 홈 뉴스바 (IA.md 2절 #2 — 제18회 전시회 「Against the Flow」)
 * @type {{ label: string, title: string, href: string }}
 */
export const newsbar = {
  label: 'NOW SHOWING',
  title: '26-1 전공 프로젝트 전시회 — Against the Flow',
  href: 'https://26-1-dah-exhibition.vercel.app',
};

/**
 * 홈 최종 CTA (IA.md 2절 #9)
 * subKr: 원문 MISSION 한글 문장 그대로.
 * @type {{ titleEn: string, subKr: string, ctas: Array<{ label: string, href: string, external: boolean }> }}
 */
export const finalCta = {
  titleEn: "BUILD WHAT'S NEXT.",
  subKr: '인간에 대한 깊은 이해와 창의적인 디지털 역량을 결합하여, 세상에 없던 새로운 가치를 창조한다.',
  ctas: [
    { label: '전시회', href: 'https://26-1-dah-exhibition.vercel.app', external: true },
    { label: 'Instagram', href: 'https://www.instagram.com/hallym_lucid/', external: true },
  ],
};

/**
 * /about 페이지 본문 (IA.md 3절 /about — What is DAH, Why DAH, Mission·Vision 3항)
 * 전 문구 source_content.md 원문 그대로.
 * @type {{ what: string, why: string, mission: { en: string, kr: string }, vision: Array<{ title: string, body: string }> }}
 */
export const about = {
  what: '한림대학교 디지털인문예술전공은 AI와 디지털 트랜스포메이션과 같이 글로벌 혁신을 주도하는 디지털·정보통신기술, 인간을 위한 가치를 구현하는 디자인, 그리고 사람과 사회를 이해하는 인문사회학적 소양이 융합하여 미래의 주역이 될 인재를 양성하는 새로운 융합 프로그램입니다.',
  why: '앞으로는 한 전문 영역의 경계를 넘어 다방면의 지식을 통섭할 수 있어야 합니다. 디지털인문예술에서는 개개인의 삶의 질을 높이고 사회의 발전을 이끌고자 인문사회학적 지성에 기술과 디자인을 융합하여 혁신을 창안하는 역량을 키우고자 합니다.',
  mission: {
    en: 'We combine human insight and digital creativity to build a better future.',
    kr: '인간에 대한 깊은 이해와 창의적인 디지털 역량을 결합하여, 세상에 없던 새로운 가치를 창조한다.',
  },
  vision: [
    {
      title: '미래를 디자인하는 창의적 리더 양성',
      body: '인문학적 통찰력과 예술적 상상력을 바탕으로 디지털 시대의 새로운 미래를 이끌어갈 인재를 키웁니다.',
    },
    {
      title: '가치 기반의 융합 지식 창출',
      body: '기술과 인문학, 예술이 만나는 접점에서 사회적 가치를 창출하는 혁신적인 지식과 프로젝트를 만들어갑니다.',
    },
    {
      title: '지속가능한 디지털 생태계 구축',
      body: '사람과 기술이 조화롭게 공존하는 지속가능한 디지털 환경을 조성하고, 모두에게 이로운 기술의 확산을 주도합니다.',
    },
  ],
};
