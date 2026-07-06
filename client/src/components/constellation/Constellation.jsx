// 학생 성과 성좌 (11_DESIGN_V2 10절) — SVG 자체 좌표 배치, 라이브러리 금지.
// - 연도 밴드 내 결정론적 배치: Math.random 금지, id 기반 의사난수(FNV-1a + xorshift)
//   → 리렌더에도 좌표 안정
// - 같은 대회(host)·같은 팀(awardee) 수상은 헤어라인 연결(그룹 내 체인, 중복 제거)
// - 노드 100 이하 전제. md 미만에서는 페이지가 숨기고 접근성 리스트만 노출.
import { useMemo, useState } from 'react'
import StarNode from './StarNode'
import StarPopover from './StarPopover'

const W = 1000
const PAD_X = 96
const PAD_Y = 48
const BAND_H = 110

// FNV-1a 32bit 문자열 해시
function hash32(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// xorshift 1회 — 시드 → [0,1) 결정론 의사난수
function unitFrom(seed) {
  let x = seed || 1
  x ^= x << 13
  x >>>= 0
  x ^= x >>> 17
  x ^= x << 5
  x >>>= 0
  return x / 4294967296
}

const u = (id, salt) => unitFrom(hash32(`${id}:${salt}`))

// 연도 밴드 내 결정론적 배치 계산
function buildLayout(items) {
  const years = [...new Set(items.map((a) => a.year))].sort((a, b) => b - a)
  const height = PAD_Y * 2 + BAND_H * years.length
  const innerW = W - PAD_X * 2

  const nodes = []
  years.forEach((year, bandIndex) => {
    const band = items.filter((a) => a.year === year)
    const slot = innerW / band.length
    const centerY = PAD_Y + bandIndex * BAND_H + BAND_H / 2
    band.forEach((item, i) => {
      nodes.push({
        ...item,
        x: PAD_X + slot * (i + 0.5) + (u(item.id, 'x') - 0.5) * slot * 0.6,
        y: centerY + (u(item.id, 'y') - 0.5) * BAND_H * 0.55,
        r: 2.4 + u(item.id, 'r') * 1.8,
        glow: 0.55 + u(item.id, 'o') * 0.45,
      })
    })
  })

  // 같은 대회(host)·같은 팀(awardee) 그룹 → 그룹 내 인접 체인 연결
  const groups = new Map()
  nodes.forEach((node) => {
    const keys = []
    if (node.host) keys.push(`h:${node.host.trim()}`)
    if (node.awardee) keys.push(`t:${node.awardee.trim()}`)
    keys.forEach((key) => {
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(node)
    })
  })

  const edges = []
  const seen = new Set()
  groups.forEach((group) => {
    if (group.length < 2) return
    const sorted = [...group].sort(
      (a, b) => b.year - a.year || a.id.localeCompare(b.id)
    )
    for (let i = 0; i < sorted.length - 1; i += 1) {
      const [a, b] = [sorted[i], sorted[i + 1]]
      const key = a.id < b.id ? `${a.id}|${b.id}` : `${b.id}|${a.id}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push({ key, x1: a.x, y1: a.y, x2: b.x, y2: b.y })
    }
  })

  return { years, height, nodes, edges }
}

function Constellation({ items, onSelect }) {
  const [activeId, setActiveId] = useState(null)
  const { years, height, nodes, edges } = useMemo(() => buildLayout(items), [items])
  const activeNode = nodes.find((n) => n.id === activeId) ?? null

  if (nodes.length === 0) return null

  return (
    <div className="relative w-full overflow-hidden rounded-glass border border-glass-line bg-cosmos-depth0">
      <svg
        viewBox={`0 0 ${W} ${height}`}
        role="group"
        aria-label="수상 실적 성좌 시각화. 각 별을 선택하면 아래 목록의 해당 항목으로 이동합니다."
        className="block h-auto w-full"
      >
        {/* 연도 라벨 */}
        {years.map((year, i) => (
          <text
            key={year}
            x={24}
            y={PAD_Y + i * BAND_H + BAND_H / 2}
            dominantBaseline="middle"
            aria-hidden="true"
            className="fill-text-meta font-mono text-caption-m"
          >
            {year}
          </text>
        ))}
        {/* 헤어라인 연결 — 같은 대회·같은 팀 */}
        {edges.map((edge) => (
          <line
            key={edge.key}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            className="stroke-border-subtle"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {/* 별 노드 */}
        {nodes.map((node) => (
          <StarNode
            key={node.id}
            node={node}
            active={node.id === activeId}
            onActivate={setActiveId}
            onDeactivate={() => setActiveId(null)}
            onSelect={onSelect}
          />
        ))}
      </svg>
      <StarPopover
        node={activeNode}
        left={activeNode ? `${Math.min(85, Math.max(15, (activeNode.x / W) * 100))}%` : 0}
        top={activeNode ? `${(activeNode.y / height) * 100}%` : 0}
      />
    </div>
  )
}

export default Constellation
