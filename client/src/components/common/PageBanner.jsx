// 재노출 심 — PageBanner 실체는 layout/PageBanner.jsx (11_DESIGN_V2 4절)
// 다수 페이지가 common/PageBanner 경로로 임포트하고 있어 해석 실패(빌드 깨짐)를 막는다.
// 신규 코드는 layout 경로를 직접 사용할 것.
export { default } from '../layout/PageBanner'
