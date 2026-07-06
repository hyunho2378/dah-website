// 11_DESIGN_V2 2·5절 GlassCard — 유리 패널 기본 표면
// bg-glass-bg + border glass-line + rounded-glass + backdrop-blur(md 미만 12px, 이상 20px)
// hover(옵션): bg-glass-strong + border 강화 + highlight 스윕 1회. 그림자·scale 금지.
// 성능 규칙(11_DESIGN_V2 2절): backdrop-filter 동시 활성 최대 3개(Header/GlassDock/카드 1계층).
// 글래스 안에 글래스 중첩 금지, 스크롤 컨테이너 내부 글래스 남발 금지.
function GlassCard({ as: Tag = 'div', hover = false, className = '', children, ...rest }) {
  return (
    <Tag
      className={`relative rounded-glass border border-glass-line bg-glass-bg backdrop-blur-glass-mobile md:backdrop-blur-glass ${
        hover
          ? 'group/glass overflow-hidden transition-colors duration-base ease-out hover:border-border-strong hover:bg-glass-strong'
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
