/**
 * tracks.js — 3트랙 + 코드쉐어링 (source_content.md 'DAH 트랙 소개', '코드쉐어링' 절 원문 이관)
 *
 * @typedef {Object} Track
 * @property {string} id - 앵커 id ('track-1'~'track-3')
 * @property {string} no - mono 넘버 (PATTERNS.md P2: 'TRACK 01'~'TRACK 03')
 * @property {string} name - 트랙명
 * @property {string} summary - 요약 (원문 트랙 소개 첫 문장)
 * @property {string[]} keywords - 키워드 3개 (원문 본문에서 추출)
 * @property {string[]} courses - 관련 교과목 (curriculum.js 트랙 매칭과 동일. 공통 과목 제외)
 */
export const tracks = [
  {
    id: 'track-1',
    no: 'TRACK 01',
    name: '미래융합디자인',
    summary:
      '미래융합디자인 트랙은 인문사회학의 토대 위에 디지털 기술과 디자인을 결합하여 미래의 경험을 창안하는 미래 디자인을 추구합니다. 경험 디자인, 사회혁신디자인, AI디자인을 3대 미래 디자인으로 규정하여 중점적으로 다루며 디자인의 기초 역량을 다지는 차원에서 디지털 디자인 교육을 병행합니다.',
    keywords: ['경험 디자인', '사회혁신디자인', 'AI디자인'],
    // H4.3 EN 대역
    summaryEn:
      "The Future Convergence Design track pursues future design that creates tomorrow's experiences by combining digital technology and design on a humanities and social sciences foundation. It focuses on experience design, social innovation design, and AI design as the three pillars of future design, alongside digital design education that builds core design skills.",
    keywordsEn: ['Experience Design', 'Social Innovation Design', 'AI Design'],
    courses: [
      'UX 디자인',
      '디지털 디자인 1',
      '사회혁신디자인',
      '서비스 디자인',
      '디지털 디자인 2',
      '경험 디자인의 고급 과정 1',
      'AI 디자인',
      '디지털 디자인 3',
      '경험 디자인 특강',
      'UI 디자인',
      'AI 중심의 경험 디자인',
    ],
  },
  {
    id: 'track-2',
    no: 'TRACK 02',
    name: 'AI디지털인문학',
    summary:
      'AI디지털인문학 트랙은 디지털 및 인공지능 기술에 기반하여 인문학 연구에 새로운 관점과 통찰을 발굴하는 것을 추구합니다. 인문학 분야에 AI를 비롯한 디지털 도구를 적용하여 학문적 깊이와 범위를 확장하는 역량을 키우는 데 중점을 두며, 혁신적인 인문학 연구 방법론에 대한 이론적 지식과 실무적 역량을 키울 수 있습니다.',
    keywords: ['AI', '디지털 도구', '인문학 연구 방법론'],
    summaryEn:
      'The AI Digital Humanities track pursues new perspectives and insights for humanities research based on digital and AI technology. It focuses on building the capacity to expand the depth and scope of scholarship by applying AI and other digital tools to the humanities, developing both theoretical knowledge and practical skills in innovative research methods.',
    keywordsEn: ['AI', 'Digital Tools', 'Research Methods'],
    courses: [
      '빅데이터인문학',
      'AI 서비스와 DB',
      '지역혁신연구방법론',
      '공간 인문학',
      '인문데이터마이닝',
      'AI 활용 리서치 2',
      'AI 서비스 기획과 프로토타이핑',
      '생성형AI와 지역문화데이터',
    ],
  },
  {
    id: 'track-3',
    no: 'TRACK 03',
    name: '문화예술콘텐츠',
    summary:
      '문화예술콘텐츠 트랙은 디지털 기술과 문화예술의 융합을 기반으로 한 창의적인 콘텐츠의 기획과 개발을 추구합니다. 디지털 콘텐츠의 본질을 이해하고 디지털 기술을 활용한 혁신적인 문화·예술 콘텐츠를 창안하는데 중점을 두며, 콘텐츠 기획 및 분석에 있어 인문학적 기반의 견고한 이론 지식과 디지털 기술을 활용한 새로운 표현의 가능성을 탐구합니다.',
    keywords: ['콘텐츠 기획', '문화예술', '디지털 기술'],
    summaryEn:
      'The Culture and Arts Content track pursues the planning and development of creative content grounded in the convergence of digital technology and the arts. It focuses on understanding the nature of digital content and creating innovative cultural and artistic content with digital technology, exploring solid humanities-based theory and new expressive possibilities.',
    keywordsEn: ['Content Planning', 'Culture & Arts', 'Digital Technology'],
    courses: [
      '디지털문화콘텐츠마케팅',
      '문화원형과 고전콘텐츠',
      '플랫폼 콘텐츠 기획과 전략',
      '한국문화와 콘텐츠개발',
      '스토리텔링 창작실습',
      'AI 크리에이터 스튜디오 2',
      '게임과 스포테인먼트 콘텐츠',
      '엔터컬처와 K-콘텐츠',
    ],
  },
];

/**
 * 코드쉐어링 안내 (/tracks 페이지 하단 — IA.md 3절, source_content.md '코드쉐어링' 절 원문 이관)
 * @typedef {Object} CodeSharing
 * @property {string} definition - 정의 (원문 그대로)
 * @property {string} note - 유의 사항 (원문 그대로)
 * @property {string[]} steps - 승인 절차 4단계 (원문 '승인과정' 그대로)
 * @property {Array<{ name: string, detail: string }>} types - 코드쉐어링 유형 3종 (원문 그대로)
 * @property {string[]} departments - 인정 학과 19개 (원문 그대로)
 */
export const codeSharing = {
  definition:
    '타과 교과목 중 기준에 충족하는 과목에 한해서 디지털인문예술전공의 과목으로 인정하는 시스템을 말한다.',
  note: '이미 취득한 학점에 대해서만 가능하며, 졸업 전까지 코드쉐어링 인정원 작성 후 미래융합스쿨 교학팀의 승인을 받아야 인정된다.',
  steps: ['타과 교과목 이수', '학점 취득', '코드쉐어링 인정원 작성', '학과행정실 제출(통합스쿨 교학팀)'],
  types: [
    { name: '교과목 대체형 코드쉐어링 (교과목 1:1 매칭)', detail: '해당 없음' },
    { name: '타과교과목 인정형 코드쉐어링', detail: '아래 교과목을 최대 9학점 이내에서 전공으로 인정합니다.' },
    { name: '학점인정형 코드쉐어링 교과목', detail: '해당 학과의 교과목을 최대 9학점 이내에서 전공으로 인정합니다.' },
  ],
  departments: [
    '국어국문학전공',
    '철학전공',
    '사학전공',
    '영어영문학과',
    '중국학과',
    '일본학과',
    '러시아학과',
    '소프트웨어학부',
    '데이터사이언스학부',
    '데이터테크전공',
    '임상의학통계전공',
    '디지털금융정보전공',
    '미디어스쿨',
    '미디어커뮤니케이션전공',
    '디지털미디어콘텐츠전공',
    '글로벌협력전공',
    '인문콘텐츠융합전공',
    'MICE기획경영전공',
    '스타트업비즈니스전공',
  ],
};
