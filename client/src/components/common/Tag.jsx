// COMPONENTS.md §1 Tag — mono caption, border.subtle, radius full, px 10 py 4, text.sec
function Tag({ children }) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full border border-border-subtle px-2.5 py-4 font-mono text-caption-m text-text-sec">
      {children}
    </span>
  )
}

export default Tag
