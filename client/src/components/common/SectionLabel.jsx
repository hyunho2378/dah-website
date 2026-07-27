import { ACCENT } from '../../styles/accents'

// COMPONENTS.md §1 SectionLabel — mono 라벨.
// X4(33_PHASE18): eyebrow 사이 장식용 짧은 가로선(h-px w-24) 제거 — 간격만으로 구분한다.
// X1: 인덱스 숫자는 purple.mid 포인트, 라벨 텍스트는 eyebrow(text.ter) 유지.
function SectionLabel({ index, text, as: Tag = 'p' }) {
  return (
    <Tag className="flex items-center gap-12 font-mono text-label-m uppercase tracking-label md:text-label-d">
      <span className={ACCENT.index}>{index}</span>
      <span className={ACCENT.eyebrow}>{text}</span>
    </Tag>
  )
}

export default SectionLabel
