// ci.js — CI(브랜드 아이덴티티) 기본 콘텐츠 + 데이터 형태 계약 (26_CI_PAGE, 32_REBRAND W1-1)
// ci 단일 문서(DB body, 코드쉐어링·나노디그리와 동일 singleton 패턴) 미설정 시 폴백 겸 시드.
// 텍스트·색상값은 전부 CI.md(브랜드 아이덴티티 최종본) 원문 기준 — 임의 창작 금지.
// 이미지·다운로드 슬롯은 /ci/ 정적 경로 — 파일 부재 시 페이지가 플레이스홀더·비활성 처리.
//
// body 형태 계약 (어드민 CIAdmin 저장 · 공개 /about/ci 렌더 공용):
//   intro         : string                       — CI의 의미 (CI.md 1.1 + 2.1)
//   symbol        : url|null                      — 대표 심벌 이미지 (의미 섹션)
//   downloads     : [{ label, url }]              — 매뉴얼(PDF)·JPG·AI. url=/ci/ 정적 경로|null
//   elements      : [{ title, text, image }]      — 구성요소별 의미(D·A·H). image=url|null
//   logoGuide     : [{ title, image, bg }]        — 단색 4버전. bg=미리보기 배경 hex(CI.md 색)
//   logoGuideNote : string                        — 로고 색상 사용 규정 요약 (CI.md 3.1·3.3)
//   signatures    : [{ title, image }]            — 시그니처(가로형·세로형·심벌 단독)
//   colors        : [{ name, hex, use }]          — 전용색상 칩(이름·HEX·용도)
//   colorsNote    : string                        — 색상 전략 (CI.md 4.1)
//   motif         : url|null                      — 그래픽모티브 이미지
//   motifNote     : string                        — 모티브/로고 구분 (CI.md 6장)
//   slogan        : string                        — 대표 슬로건 (CI.md 8.1)
//   sloganNote    : string                        — 슬로건 설명 (CI.md 8.1)
export const ci = {
  intro:
    '사람을 향해 연결되는 지성 (Connected Intelligence for Human Futures)\n\n' +
    'DAH는 기술을 배우는 전공이면서, 기술 자체를 목적화하지 않는다. AI와 디지털 기술을 이해하고, 디자인으로 경험을 만들며, 인문학으로 사람과 사회를 읽는다. 기술·디자인·인문학의 서로 다른 지성이 연결되어, 인간의 미래에 다정하게 응답하는 전공이다.\n\n' +
    'Three Forms, One Response (세 개의 형식, 하나의 응답)\n\n' +
    '로고는 D·A·H 세 개의 도형이 각기 다른 학문과 관점을 나타내면서, 하나의 응답으로 모이는 구조를 표현한다. 세 도형은 일정한 간격을 유지하면서 하나의 리듬을 형성한다. 각 조각은 독립적으로도 사용할 수 있지만, 공식 커뮤니케이션에서는 세 조각이 함께 등장하는 것을 기본으로 한다.',
  symbol: '/ci/logo-light.svg',
  downloads: [
    { label: '매뉴얼 다운로드', url: '/ci/dah-ci-manual.pdf' },
    { label: 'JPG 다운로드', url: '/ci/dah-ci.jpg' },
    { label: 'AI 다운로드', url: '/ci/dah-ci.ai' },
  ],
  elements: [
    { title: 'D — 열린 곡선', text: '디지털·디자인. 먼저 듣고 열어 두고 안으로 초대하는 구조.', image: null },
    { title: 'A — 상승하는 삼각', text: '예술·AI. 흩어진 데이터와 생각을 새로운 가능성으로 전환하는 방향과 초점.', image: null },
    { title: 'H — 연결하는 기둥과 가로선', text: '인문·인간. 서로 다른 세계 사이에 다리를 놓는 관계와 대화.', image: null },
  ],
  logoGuide: [
    { title: 'Light Logo · #F7F5FC — 어두운 배경용 기본 반전 로고. 헤더·시그니처·파비콘 1순위.', image: '/ci/logo-light.svg', bg: '#100D18' },
    { title: 'Purple Logo · #815FD7 — 대표 보라 강조 로고. 배경과 명도 대비가 충분할 때.', image: '/ci/logo-purple.svg', bg: '#100D18' },
    { title: 'Dark Logo · #211A31 — 밝은 배경용 어두운 로고.', image: '/ci/logo-dark.svg', bg: '#F7F5FC' },
    { title: 'Deep Dark Logo · #100D18 — 가장 높은 명도 대비가 필요한 밝은 배경용.', image: '/ci/logo-deepdark.svg', bg: '#FFFFFF' },
  ],
  logoGuideNote:
    'DAH 로고는 D·A·H 세 조각이 항상 동일한 하나의 색상으로 표현되는 단색 로고를 원칙으로 한다. 딥 퍼플 블랙 배경에서는 1순위 Light Logo, 2순위 Purple Logo. 헤더·시그니처·파비콘은 Light Logo 우선. #211A31 로고는 명도 차이 부족으로 사용 금지. 밝은 회색·흰색 배경에서는 흰색은 Deep Dark Logo, 매우 밝은 회색은 Dark Logo.',
  signatures: [
    { title: '가로형 — 심벌 오른쪽에 Digital Arts & Humanities. 웹 헤더·공식 문서·명함·산학·채용 자료.', image: '/ci/signature-horizontal.png' },
    { title: '세로형 — 심벌 아래 브랜드명을 두 줄로. 포스터·발표자료 표지·행사 배너·SNS.', image: '/ci/signature-vertical.png' },
    { title: '심벌 단독 — 파비콘·SNS 프로필·앱 아이콘·스티커·굿즈·작은 브랜드 표식.', image: '/ci/logo-light.svg' },
  ],
  colors: [
    { name: 'Primary Purple', hex: '#815FD7', use: '대표 로고, 버튼, 링크, 핵심 강조' },
    { name: 'Light Purple', hex: '#C8B9F2', use: '하이라이트, 그래픽, 밝은 배경' },
    { name: 'Mid Purple', hex: '#A286E9', use: '보조 강조, 인터랙션' },
    { name: 'Deep Purple', hex: '#6844C4', use: '활성 상태, 진한 그래픽' },
    { name: 'Deep Purple Dark', hex: '#4B2D99', use: '강한 강조, 깊은 그래픽' },
    { name: 'Deep Purple Black', hex: '#100D18', use: '메인 웹사이트 배경' },
    { name: 'Purple Black 2', hex: '#171321', use: '섹션 구분, 카드 배경' },
    { name: 'Glass Surface', hex: '#211A31', use: '유리 패널, 활성 영역' },
    { name: 'Text Primary', hex: '#F7F5FC', use: '제목, 핵심 문장' },
    { name: 'Text Secondary', hex: '#C9C3D5', use: '본문, 설명' },
    { name: 'Text Tertiary', hex: '#938BA5', use: '보조 정보, 메타데이터' },
    { name: 'Text Disabled', hex: '#625A70', use: '비활성' },
  ],
  colorsNote:
    '어두운 우주 공간 안에서 보라빛 지성이 부상하는 구조. 전체 색상은 보라 단일 계열로 제한한다. Deep Space Black + Intelligent Purple + Soft Lavender.',
  motif: '/ci/motif.svg',
  motifNote:
    '세 조각을 서로 다른 색으로 변주하는 방식은 공식 로고가 아니라 브랜드 그래픽 모티브로만 사용한다. 허용 색상: D 모티브 #C8B9F2, A 모티브 #A286E9, H 모티브 #815FD7. 공식 로고는 언제나 단색이다.',
  slogan: '읽고, 다정하게 답하다 / Read. Respond with Care.',
  sloganNote:
    'DAH의 철학을 가장 직접적으로 전달한다. 전공 소개·웹사이트·홍보물·포트폴리오에 모두 적용한다.',
}
