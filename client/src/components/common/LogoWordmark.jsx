// LogoWordmark — DAH 워드마크 (볼드 캡스 글리프, 순수 SVG 아웃라인)
// 배경 없음. fill="currentColor"로 부모 text 색 상속 (Header가 text-text-pri → 흰색)
// favicon.svg와 동일 지오메트리(배경 제거 버전).

function LogoWordmark({ size = 20, className }) {
  // 원본 글리프 좌표계: 66(w) × 24(h)
  const width = (size * 66) / 24

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 66 24"
      fill="currentColor"
      role="img"
      aria-label="DAH"
      className={className}
    >
      <g transform="translate(0 0)">
        <path fillRule="evenodd" d="M0,0 H10 C15.52,0 19,5 19,12 C19,19 15.52,24 10,24 H0 Z M7,6 H10 C12.2,6 14,8.7 14,12 C14,15.3 12.2,18 10,18 H7 Z" />
      </g>
      <g transform="translate(23 0)">
        <path fillRule="evenodd" d="M0,24 L7,0 H13 L20,24 H13.2 L11.5,16.5 H8.5 L6.8,24 Z M10,3.5 L11.5,14 H8.5 Z" />
      </g>
      <g transform="translate(47 0)">
        <path d="M0,0 H7 V24 H0 Z M12,0 H19 V24 H12 Z M7,8.5 H12 V15.5 H7 Z" />
      </g>
    </svg>
  )
}

export default LogoWordmark
