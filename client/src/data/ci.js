// ci.js — CI(브랜드 아이덴티티) 기본 콘텐츠 + 데이터 형태 계약 (26_CI_PAGE, 진흥원 구조 이식)
// ci 단일 문서(DB body, 코드쉐어링·나노디그리와 동일 singleton 패턴) 미설정 시 폴백 겸 시드.
// 이미지·다운로드 슬롯은 /ci/ 정적 경로 기본값 — 파일 부재 시 페이지가 플레이스홀더·비활성 처리.
// 텍스트(intro·elements.text)는 비움(어드민 편집). 색상값은 진흥원 값 이식 금지 — 빈 편집 슬롯.
//
// body 형태 계약 (어드민 CIAdmin 저장 · 공개 /about/ci 렌더 공용):
//   intro      : string                       — CI의 의미 설명
//   symbol     : url|null                      — 대표 심벌 이미지 (의미 섹션)
//   downloads  : [{ label, url }]              — 매뉴얼(PDF)·JPG·AI. url=/ci/ 정적 경로|null
//   elements   : [{ title, text, image }]      — 구성요소별 의미(곡선·컬러·워드마크). image=url|null
//   logoGuide  : [{ title, image }]            — 로고가이드(한글 타입·영문 타입 가로형)
//   signatures : [{ title, image }]            — 시그니처(상하조합형·좌우조합형)
//   colors     : [{ name, hex }]               — 전용색상(Main·Secondary, hex 빈 편집 슬롯)
//   motif      : url|null                      — 그래픽모티브 이미지
export const ci = {
  intro: '',
  symbol: '/ci/symbol.png',
  downloads: [
    { label: '매뉴얼 다운로드', url: '/ci/dah-ci-manual.pdf' },
    { label: 'JPG 다운로드', url: '/ci/dah-ci.jpg' },
    { label: 'AI 다운로드', url: '/ci/dah-ci.ai' },
  ],
  elements: [
    { title: '곡선', text: '', image: null },
    { title: '컬러', text: '', image: null },
    { title: '워드마크', text: '', image: null },
  ],
  logoGuide: [
    { title: '한글 타입', image: '/ci/logo-kr.png' },
    { title: '영문 타입', image: '/ci/logo-en.png' },
  ],
  signatures: [
    { title: '상하조합형', image: '/ci/signature-vertical.png' },
    { title: '좌우조합형', image: '/ci/signature-horizontal.png' },
  ],
  colors: [
    { name: 'Main Color', hex: '' },
    { name: 'Secondary Color', hex: '' },
  ],
  motif: '/ci/motif.png',
}
