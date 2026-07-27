// accents.js — X1(33_PHASE18) 텍스트 위계 보라 포인트 규약 (단일 진실 소스)
//
// 진단: 전 텍스트가 #F7F5FC 단일이라 위계가 실종됐다. 문제는 보라 과다가 아니라 부재다.
// CI.md 4.4·4.5 안에서 "보라는 내용이 아니라 중요도·인터랙션을 표시한다"를 지키며
// 아래 6가지 용처에만 보라를 쓴다. 본문은 계속 text.sec, 보라 문장 3줄 연속 금지.
//
// 사용법(클래스 규약): import { ACCENT } from '../../styles/accents'
//   <span className={ACCENT.proper}>2026</span>
// 또는 컴포넌트: <Accent kind="role">위원장</Accent>  (components/common/Accent.jsx)
//
// CI 대응: purple.mid #A286E9(보조 강조·인터랙션) / purple.light #C8B9F2(하이라이트·선택)

export const ACCENT = {
  /** 섹션 라벨의 인덱스 숫자("01" 등). 라벨 텍스트 자체는 eyebrow(text.ter) 유지 */
  index: 'text-purple-mid',
  /** eyebrow·섹션 라벨 본문 — 보라 아님(text.ter). 대비 기준 유지 */
  eyebrow: 'text-text-meta',
  /** 연도·기수·고유명 (2026, LUCID, 제1대 등) */
  proper: 'text-purple-light',
  /** 직책 라벨 (위원장·부위원장·회장·부회장·학회장·부학회장·부서 라벨) */
  role: 'text-purple-mid',
  /** 상태·키워드 배지성 텍스트 */
  status: 'text-purple-mid',
  /** 링크 — 기존 링크 토큰(CI 4.5: 기본 #A286E9 → hover #C8B9F2) */
  link: 'text-link transition-colors duration-fast ease-out hover:text-link-hover',
};

export default ACCENT;
