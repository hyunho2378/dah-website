// ci.js — CI(브랜드 아이덴티티) 기본 콘텐츠 + 데이터 형태 계약 (N1-5, 23_PHASE11)
// ci 단일 문서(DB body, 코드쉐어링·나노디그리와 동일 singleton 패턴) 미설정 시 폴백 겸 시드.
// 이미지 슬롯(image/url)은 지금 비움(플레이스홀더 프레임). 텍스트·색상은 어드민에서 편집 가능.
//
// body 형태 계약 (어드민 CIAdmin 저장 · 공개 /about/ci 렌더 공용):
//   intro      : string  — CI의 의미
//   elements   : [{ title, text, image }]  — 구성요소별 의미(곡선·컬러·워드마크 등). image=url|null
//   logoGuide  : [{ title, image }]        — 로고가이드(국문/영문/시그니처). image=url|null
//   colors     : [{ name, hex }]           — 전용색상(스와치+값 표기)
//   downloads  : [{ label, url }]          — 다운로드(매뉴얼·JPG·AI). url=null 예약
export const ci = {
  intro: '',
  elements: [
    { title: '심벌', text: '', image: null },
    { title: '워드마크', text: '', image: null },
    { title: '시그니처', text: '', image: null },
  ],
  logoGuide: [
    { title: '국문 로고', image: null },
    { title: '영문 로고', image: null },
    { title: '시그니처', image: null },
  ],
  colors: [],
  downloads: [
    { label: 'CI 매뉴얼', url: null },
    { label: 'JPG', url: null },
    { label: 'AI', url: null },
  ],
}
