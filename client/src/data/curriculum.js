/**
 * curriculum.js — 4년 교과목 로드맵 (source_content.md 교과목 표 원문 이관)
 *
 * 원문 표 해석 (6컬럼 x 6행):
 * - 컬럼 1~2 = 미래융합디자인(track-1), 컬럼 3~4 = AI디지털인문학(track-2), 컬럼 5~6 = 문화예술콘텐츠(track-3)
 * - 행(위→아래): 디인예 실무 워크숍 / 캡스톤디자인(트랙 공통 3회 표기) / 심화 과목 / 기초 심화 과목 /
 *   1학년 과목(1학기·2학기 명시) / 오디세이세미나3
 * - 학년 매핑: 표 행 순서 기준 위 = 고학년. 캡스톤·실무 워크숍 = 4학년, 심화 = 3학년,
 *   기초 심화 = 2학년, 1학기·2학기 명시 행 + 오디세이세미나3 = 1학년.
 *   (원문 표에 학년 숫자 명시가 없어 행 순서로 해석. 오디세이세미나3·디인예 실무 워크숍의 학년은 표 위치 기준 추정)
 * - 트랙 매칭이 불명확한 과목(전 컬럼 스팬 행)은 track: 'common'
 * - 원문 표의 '1학기·2학기' 구분은 스키마에 없어 주석으로만 유지
 *
 * @typedef {Object} Course
 * @property {string} code - PATTERNS.md P2 'n.m' (n=학년, m=순번)
 * @property {string} name - 과목명 (원문 그대로)
 * @property {number} year - 학년 1~4
 * @property {('track-1'|'track-2'|'track-3'|'common')} track - 소속 트랙
 */
export const curriculum = [
  // 1학년 — 원문: "1학기 · 문화콘텐츠 기초, 디지털인문예술입문 / 2학기 · 디자인 씽킹, AI 활용 데이터 리터러시, 서브컬처 가이드"
  { code: '1.1', name: '문화콘텐츠 기초', year: 1, track: 'common' }, // 1학기
  { code: '1.2', name: '디지털인문예술입문', year: 1, track: 'common' }, // 1학기
  { code: '1.3', name: '디자인 씽킹', year: 1, track: 'common' }, // 2학기
  { code: '1.4', name: 'AI 활용 데이터 리터러시', year: 1, track: 'common' }, // 2학기
  { code: '1.5', name: '서브컬처 가이드', year: 1, track: 'common' }, // 2학기
  { code: '1.6', name: '오디세이세미나3', year: 1, track: 'common' }, // 표 최하단 행. 학년 명시 없음

  // 2학년
  { code: '2.1', name: 'UX 디자인', year: 2, track: 'track-1' },
  { code: '2.2', name: '디지털 디자인 1', year: 2, track: 'track-1' },
  { code: '2.3', name: '사회혁신디자인', year: 2, track: 'track-1' },
  { code: '2.4', name: '서비스 디자인', year: 2, track: 'track-1' },
  { code: '2.5', name: '디지털 디자인 2', year: 2, track: 'track-1' },
  { code: '2.6', name: '빅데이터인문학', year: 2, track: 'track-2' },
  { code: '2.7', name: 'AI 서비스와 DB', year: 2, track: 'track-2' },
  { code: '2.8', name: '디지털문화콘텐츠마케팅', year: 2, track: 'track-3' },
  { code: '2.9', name: '문화원형과 고전콘텐츠', year: 2, track: 'track-3' },
  { code: '2.10', name: '플랫폼 콘텐츠 기획과 전략', year: 2, track: 'track-3' },

  // 3학년
  { code: '3.1', name: '경험 디자인의 고급 과정 1', year: 3, track: 'track-1' },
  { code: '3.2', name: 'AI 디자인', year: 3, track: 'track-1' },
  { code: '3.3', name: '디지털 디자인 3', year: 3, track: 'track-1' },
  { code: '3.4', name: '경험 디자인 특강', year: 3, track: 'track-1' },
  { code: '3.5', name: 'UI 디자인', year: 3, track: 'track-1' },
  { code: '3.6', name: 'AI 중심의 경험 디자인', year: 3, track: 'track-1' },
  { code: '3.7', name: '지역혁신연구방법론', year: 3, track: 'track-2' },
  { code: '3.8', name: '공간 인문학', year: 3, track: 'track-2' },
  { code: '3.9', name: '인문데이터마이닝', year: 3, track: 'track-2' },
  { code: '3.10', name: 'AI 활용 리서치 2', year: 3, track: 'track-2' },
  { code: '3.11', name: 'AI 서비스 기획과 프로토타이핑', year: 3, track: 'track-2' },
  { code: '3.12', name: '생성형AI와 지역문화데이터', year: 3, track: 'track-2' },
  { code: '3.13', name: '한국문화와 콘텐츠개발', year: 3, track: 'track-3' },
  { code: '3.14', name: '스토리텔링 창작실습', year: 3, track: 'track-3' },
  { code: '3.15', name: 'AI 크리에이터 스튜디오 2', year: 3, track: 'track-3' },
  { code: '3.16', name: '게임과 스포테인먼트 콘텐츠', year: 3, track: 'track-3' },
  { code: '3.17', name: '엔터컬처와 K-콘텐츠', year: 3, track: 'track-3' },

  // 4학년 — 캡스톤은 원문 표에서 트랙 컬럼마다 반복 표기(3회)된 공통 과목이라 1건으로 이관
  { code: '4.1', name: '캡스톤디자인: 디인예 프로젝트', year: 4, track: 'common' },
  { code: '4.2', name: '디인예 실무 워크숍', year: 4, track: 'common' }, // 표 최상단 행. 학년 명시 없음
];
