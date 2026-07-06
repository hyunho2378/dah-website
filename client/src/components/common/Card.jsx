// COMPONENTS.md §1 Card / P3 — bg.elev, border.subtle, radius 10, p 24/32
// hover: border.strong만(배경 그대로). scale·그림자 금지. group 클래스 제공
function Card({ className = '', children }) {
  return (
    <div
      className={`group rounded-md border border-border-subtle bg-bg-elev p-24 transition-colors duration-fast ease-out hover:border-border-strong md:p-32 ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
