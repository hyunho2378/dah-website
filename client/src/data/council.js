/**
 * council.js — 운영위원회 (source_content.md '운영위원회' 절 359~419행 원문 전량 이관)
 *
 * 대원칙: 원문 한 글자도 요약·윤문·재작성·오타수정 없음. 이모지만 예외.
 *
 * export 계약 (T4 아카이브 렌더 · 페이지 에이전트 소비용, 필드명 고정):
 *
 *   lucid = {
 *     title,                         // 제1대 운영위원회 표제
 *     intro,                         // 소개문 3문단 원문 (373~378행)
 *     activity: { description, events }, // 382행 소개 + 384행 괄호 활동 목록
 *     committee: [{ role, name?, dept?, members? }],  // 388~396행 위원회 구성
 *     links: { instagram, youtube }, // 418~419행
 *   }
 *
 *   councilHistory = [{ year, ordinal, name, president, vicePresident }]
 *     // 400~416행. 최신(2025 제7대) → 과거(2017 임시학생회) 순.
 *     // 2018·2017 임시학생회는 ordinal='임시학생회', name=null.
 */

export const lucid = {
  title: '제1대 운영위원회 「LUCID」',
  intro:
    '물감은 섞일수록 어두워지지만, 빛은 섞일수록 밝고 투명해집니다.\n\n' +
    'LUCID는 인문과 기술, 다양한 전공이 모인 이곳에서 나다움을 잃지 않으면서도 서로를 빛내주는 시너지를 만들고자 합니다.\n\n' +
    '다양한 색이 모여 만드는 가장 눈부신 가능성을 마음껏 펼칠 수 있도록 2026년 한 해 동안 여러분의 길잡이가 되겠습니다.',
  activity: {
    description: '디지털인문예술전공 자치기구로서 학우들의 참여를 통해 전공 내외의 다양한 행사를 운영합니다.',
    events: ['개강총회', '공모전 전시회', '전공박람회', '전공 프로젝트 전시회', '동아리 전시회', '종강총회', '전공 교류 행사'],
  },
  committee: [
    { role: '위원장', name: '주현호', dept: '디지털인문예술 22' },
    { role: '부위원장', name: '윤현아', dept: '디지털인문예술 23' },
    { role: '기획부', members: ['한수빈', '김소연'] },
    { role: '홍보부', members: ['여동규', '김지연', '송은채', '정민서'] },
    { role: '웹전시부', members: ['임지우', '임세연'] },
  ],
  links: {
    instagram: 'https://www.instagram.com/hallym_lucid/',
    youtube: 'https://www.youtube.com/channel/UCS6MHVy-n8OTgN2WRgNafXw',
  },
};

export const councilHistory = [
  { year: 2025, ordinal: '제7대', name: 'CUBE', president: '권서영', vicePresident: '최서연' },
  { year: 2024, ordinal: '제6대', name: '채움', president: '송유경', vicePresident: '심재연' },
  { year: 2023, ordinal: '제5대', name: 'DX', president: '윤호용', vicePresident: '원수정' },
  { year: 2022, ordinal: '제4대', name: 'OPEN', president: '곽선재', vicePresident: '윤숙영' },
  { year: 2021, ordinal: '제3대', name: 'DEAR', president: '안유미', vicePresident: '오소민' },
  { year: 2020, ordinal: '제2대', name: 'Harmonies', president: '김도경', vicePresident: '정예찬' },
  { year: 2019, ordinal: '제1대', name: 'Curtain Up', president: '송채원', vicePresident: '박재정' },
  { year: 2018, ordinal: '임시학생회', name: null, president: '주영훈', vicePresident: '김도경' },
  { year: 2017, ordinal: '임시학생회', name: null, president: '신소령', vicePresident: '이해솔' },
];
