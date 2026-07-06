/**
 * identity.js — 홈 정체성 3열 카드 (IA.md 2절 #3 정의 그대로)
 * 01 AI 퍼스트 커리큘럼(전 수업 AI·바이브코딩 도입) / 02 3트랙 융합(디자인·인문·콘텐츠) / 03 매 학기 전시(프로젝트를 공개로 증명)
 * 트랙명·전시 사실은 source_content.md 원문 근거.
 *
 * @typedef {Object} IdentityItem
 * @property {string} id - 고유 id
 * @property {string} fig - mono 넘버 (PATTERNS.md P2: 'FIG 1.1'~'FIG 1.3')
 * @property {string} title - 카드 제목
 * @property {string} body - 카드 본문
 * @property {string} asset - 아이소메트릭 에셋 경로
 */
export const identity = [
  {
    id: 'ai-first',
    fig: 'FIG 1.1',
    title: 'AI 퍼스트 커리큘럼',
    body: '전 수업에 AI와 바이브코딩을 도입합니다.',
    asset: '/images/assets/iso-1.png',
  },
  {
    id: 'three-tracks',
    fig: 'FIG 1.2',
    title: '3트랙 융합',
    body: '디자인·인문·콘텐츠를 아우르는 미래융합디자인, AI디지털인문학, 문화예술콘텐츠 3개 트랙을 운영합니다.',
    asset: '/images/assets/iso-2.png',
  },
  {
    id: 'exhibition-every-semester',
    fig: 'FIG 1.3',
    title: '매 학기 전시',
    body: '매 학기 프로젝트 전시회를 열어 결과물을 공개로 증명합니다.',
    asset: '/images/assets/iso-3.png',
  },
];
