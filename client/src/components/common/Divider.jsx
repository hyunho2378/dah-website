// COMPONENTS.md §1 Divider — border.subtle 1px 수평선, 컨테이너 폭
function Divider() {
  return (
    <div className="mx-auto max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d">
      <hr className="border-0 border-t border-border-subtle" />
    </div>
  )
}

export default Divider
