// 성좌 글래스 팝오버 (11_DESIGN_V2 10절) — 수상명·수상자·주최·연도.
// 위치는 부모가 노드 좌표의 퍼센트로 계산해 내려준다. 표시 전용(pointer-events 없음).
function StarPopover({ node, left, top }) {
  if (!node) return null

  const meta = [node.awardee, node.host, node.year].filter(Boolean).join(' · ')

  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
      style={{ left, top }}
    >
      <div className="mb-8 w-max max-w-xs rounded-glass border border-glass-line bg-glass-strong px-16 py-12 backdrop-blur-glass-mobile">
        <p className="text-small-m font-bold leading-snug text-text-pri md:text-small-d">
          {node.title}
        </p>
        {meta && (
          <p className="mt-4 font-mono text-caption-m text-text-sec">{meta}</p>
        )}
      </div>
    </div>
  )
}

export default StarPopover
