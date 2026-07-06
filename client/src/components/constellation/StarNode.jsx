// 성좌 별 노드 (11_DESIGN_V2 10절) — SVG g, 키보드 tabbable.
// 밝기·크기 미세 변주는 부모(Constellation)가 id 해시로 결정론 계산해 내려준다.
function StarNode({ node, active, onActivate, onDeactivate, onSelect }) {
  const { x, y, r, glow, title, year, awardee } = node

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(node.id)
    }
  }

  return (
    <g
      tabIndex={0}
      role="button"
      aria-label={`${year} ${title} — 아래 목록의 해당 항목으로 이동`}
      className="cursor-pointer outline-none"
      onMouseEnter={() => onActivate(node.id)}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate(node.id)}
      onBlur={onDeactivate}
      onClick={() => onSelect(node.id)}
      onKeyDown={handleKeyDown}
      data-awardee={awardee ?? undefined}
    >
      {/* 히트 영역 확장(터치·포인터 정확도) */}
      <circle cx={x} cy={y} r={r + 12} fill="transparent" />
      {/* 본체 — text-cosmos-star 톤, 밝기 변주 */}
      <circle cx={x} cy={y} r={r} className="fill-cosmos-star" opacity={glow} />
      {/* hover·focus 링 — 포커스 가시성 대체(별도 아웃라인 미사용) */}
      {active && (
        <circle
          cx={x}
          cy={y}
          r={r + 6}
          fill="transparent"
          className="stroke-border-strong"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </g>
  )
}

export default StarNode
