// 11_DESIGN_V2 2·5절 GlassCard — 유리 패널 기본 표면
// bg-glass-bg + border glass-line + rounded-glass + backdrop-blur(md 미만 12px, 이상 20px)
// hover(옵션): bg-glass-strong + border 강화 + highlight 스윕 1회. 그림자·scale 금지.
// 성능 규칙(11_DESIGN_V2 2절): backdrop-filter 동시 활성 최대 3개(Header/GlassDock/카드 1계층).
// 글래스 안에 글래스 중첩 금지, 스크롤 컨테이너 내부 글래스 남발 금지.
// A4(36_ACCENT_POLISH) glow: 히어로 Primary 버튼 질감(화이트 하이라이트 inset + 퍼플 글로우)을
//   카드로 확장하는 공용 스위치. 기본은 거의 안 보이는 잔광이고 hover에서만 글로우가 오른다
//   (상시 발광 금지 — 과하면 산만해진다). 배경은 그대로 두고 표면 질감만 바꾼다.
function GlassCard({ as: Tag = 'div', hover = false, glow = false, className = '', children, ...rest }) {
  const base = glow ? 'shadow-glow-card' : 'shadow-glass'
  const hoverShadow = glow ? 'hover:shadow-glow-card-hover' : 'hover:shadow-glass-hover'
  return (
    <Tag
      className={`relative rounded-glass border border-glass-line bg-glass-bg ${base} backdrop-blur-glass-mobile md:backdrop-blur-glass ${
        hover
          ? `group/glass overflow-hidden transition-[colors,box-shadow] duration-base ease-out hover:border-border-purple hover:bg-glass-strong ${hoverShadow}`
          : ''
      } ${className}`}
      {...rest}
    >
      {hover && (
        // highlight 스윕: hover 진입 시 1회성 transition으로 좌→우 슬라이드 인
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-glass-highlight opacity-0 transition-[transform,opacity] duration-slow ease-out group-hover/glass:translate-x-0 group-hover/glass:opacity-100"
        />
      )}
      {children}
    </Tag>
  )
}

export default GlassCard
