import { useId } from 'react'

// RadioCards.jsx — X5(33_PHASE18) 네이티브 라디오 대체 카드형 선택.
// 구글 폼처럼 선택지가 잘 보이는 카드 그리드. 선택 시 보라 링(ring)으로 상태를 표시한다
// (업로드된 PayMethodGrid의 선택 링 패턴 참고, 색·토큰은 우리 것).
//
// 실제 <input type="radio">는 sr-only로 유지 — 키보드 방향키 이동·폼 시맨틱 보존.
// options: [{ value, label, desc? }]
function RadioCards({ name, options = [], value, onChange, columns = 2, disabled = false, className = '', ...rest }) {
  const auto = useId()
  const group = name || auto

  return (
    <div
      role="radiogroup"
      {...rest}
      className={`grid gap-12 ${columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} ${className}`.trim()}
    >
      {options.map((opt) => {
        const checked = value === opt.value
        const unavailable = disabled || opt.disabled
        return (
          <label
            key={opt.value}
            className={`flex min-h-[88px] cursor-pointer flex-col justify-center gap-4 rounded-md border p-16 transition duration-fast ease-out has-[:focus-visible]:border-border-focus has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-border-focus ${
              unavailable ? 'cursor-not-allowed border-border-subtle bg-bg-elev opacity-50' : ''
            } ${
              checked
                ? 'border-purple-primary bg-glass-strong ring-1 ring-purple-primary'
                : unavailable
                  ? ''
                  : 'border-border-subtle bg-bg-panel hover:border-border-purple hover:bg-glass-strong'
            }`}
          >
            <input
              type="radio"
              name={group}
              value={opt.value}
              checked={checked}
              disabled={unavailable}
              onChange={() => onChange?.(opt.value)}
              className="peer sr-only"
            />
            <span
              className={`text-body-m font-semibold ${checked ? 'text-text-pri' : 'text-text-sec'}`}
            >
              {opt.label}
            </span>
            {opt.desc && <span className="text-small-m text-text-meta">{opt.desc}</span>}
          </label>
        )
      })}
    </div>
  )
}

export default RadioCards
