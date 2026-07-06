// COMPONENTS.md §1 SectionLabel — mono 라벨, index(pri) + 헤어라인 24px + text(meta)
function SectionLabel({ index, text, as: Tag = 'p' }) {
  return (
    <Tag className="flex items-center gap-12 font-mono text-label-m uppercase tracking-label md:text-label-d">
      <span className="text-text-pri">{index}</span>
      <span aria-hidden="true" className="h-px w-24 bg-border-subtle" />
      <span className="text-text-meta">{text}</span>
    </Tag>
  )
}

export default SectionLabel
