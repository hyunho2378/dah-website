// 11_DESIGN_V2 5절 GlassPill — 캡슐형 글래스 표면(rounded-full)
// GlassDock·ShareButton·인라인 편집 버튼(B3)이 사용하는 기본 표면.
// 성능 규칙(11_DESIGN_V2 2절): blur 상한 3(Header/GlassDock/카드·필 1계층).
// 글래스 표면 위에 blur 필을 중첩하지 않는다.
function GlassPill({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag
      className={`inline-flex items-center rounded-full border border-glass-line bg-glass-bg backdrop-blur-glass-mobile md:backdrop-blur-glass ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export default GlassPill
