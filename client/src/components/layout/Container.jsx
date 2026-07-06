// Container — F2: 전역 단일 컨테이너. 헤더·섹션·푸터가 이 컴포넌트만 사용해
// 모든 브레이크포인트에서 좌우 정렬선(콘텐츠 좌측선)을 픽셀 일치시킨다.
// max-w 1200 기본 → 2xl 1280(max-w-container). 좌우 패딩은 gutter 토큰.
function Container({ as: As = 'div', className = '', children, ...rest }) {
  return (
    <As
      className={`mx-auto w-full max-w-[1200px] px-gutter-m md:px-gutter-t lg:px-gutter-d 2xl:max-w-container ${className}`}
      {...rest}
    >
      {children}
    </As>
  )
}

export default Container
