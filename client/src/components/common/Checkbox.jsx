import { Check } from 'lucide-react'

// Checkbox.jsx — X5(33_PHASE18) 네이티브 체크박스 대체.
// 실제 <input type="checkbox">는 sr-only로 남겨 폼 시맨틱·키보드·라벨 연결을 유지하고,
// 시각 표현만 우리 토큰 박스로 그린다(peer-* 로 상태 반영).
function Checkbox({ checked = false, onChange, disabled = false, id, children, className = '', ...rest }) {
  const invalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'
  return (
    <label
      className={`flex min-h-11 cursor-pointer items-center gap-12 rounded-sm py-4 transition-colors duration-fast ease-out has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-border-focus ${
        disabled ? 'cursor-default opacity-40' : 'hover:text-text-pri'
      } ${className}`.trim()}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="peer sr-only"
        {...rest}
      />
      <span
        aria-hidden="true"
        className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-sm border bg-bg-panel text-text-invert transition duration-fast ease-out peer-checked:border-purple-primary peer-checked:bg-purple-primary peer-disabled:border-border-subtle ${
          invalid ? 'border-state-error' : 'border-border-strong'
        }`}
      >
        {checked && <Check size={14} strokeWidth={3} />}
      </span>
      <span className="min-w-0 text-body-m text-text-sec">{children}</span>
    </label>
  )
}

export default Checkbox
