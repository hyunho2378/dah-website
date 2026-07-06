import GlassCard from './GlassCard'

// COMPONENTS.md §1 Card / P3 — v2 글래스 스킨 마이그레이션(11_DESIGN_V2 5절)
// 내부를 GlassCard 기반으로 교체. 기존 props 계약(className, children)과
// group 클래스 제공은 그대로 유지 — 기존 사용처(home/, pages/, B4·B5) 호환.
// hover: bg-glass-strong + border 강화 + highlight 스윕 1회. 그림자·scale 금지.
function Card({ className = '', children }) {
  return (
    <GlassCard hover className={`group p-24 md:p-32 ${className}`}>
      {children}
    </GlassCard>
  )
}

export default Card
