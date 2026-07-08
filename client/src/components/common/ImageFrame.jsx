// ImageFrame.jsx — 비율 고정 이미지 프레임 (C1, 22_PHASE10)
// 교수 사진·전시 포스터·동아리 로고·위원회 로고·쇼케이스 이미지 공용 래퍼.
//
// - ratio: CSS aspect-ratio 문자열('306/427' 세로형, '2/3', '1/1', '16/9')로 프레임 비율 고정
// - bg=false(기본): 사진·포스터 → object-cover로 프레임을 여백 없이 꽉 채움
// - bg=true: 투명 PNG 로고 → object-contain + bg-bg-frame(중성 배경) 위에 로고 전체 노출
// - src 없으면 placeholder(노드) 또는 기본 캡션. 색·간격은 토큰 클래스만 사용.
function ImageFrame({
  src,
  alt = '',
  ratio = '2/3',
  bg = false,
  loading = 'lazy',
  className = '',
  imgClassName = '',
  placeholder = null,
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-md ${
        bg ? 'bg-bg-frame' : 'bg-bg-elev'
      } ${className}`.trim()}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={`absolute inset-0 h-full w-full ${
            bg ? 'object-contain p-12' : 'object-cover'
          } ${imgClassName}`.trim()}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center px-12 text-center font-mono text-caption-m text-text-meta">
          {placeholder}
        </span>
      )}
    </div>
  )
}

export default ImageFrame
