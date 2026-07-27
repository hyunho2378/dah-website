import { useId } from 'react'

// RadioCards.jsx — X5(33_PHASE18) 네이티브 라디오 대체 카드형 선택.
// 구글 폼처럼 선택지가 잘 보이는 카드 그리드. 선택 시 보라 링(ring)으로 상태를 표시한다
// (업로드된 PayMethodGrid의 선택 링 패턴 참고, 색·토큰은 우리 것).
//
// 실제 <input type="radio">는 sr-only로 유지 — 키보드 방향키 이동·폼 시맨틱 보존.
// options: [{ value, label, desc? }]
function RadioCards({ name, options = [], value, onChange, columns = 2, className = '' }) {
  const auto = useId()
  const group = name || auto

  return (
    <div
      role="radiogroup"
      className={`grid gap-12 ${columns === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} ${className}`.trim()}
    >
      {options.map((opt) => {
        const checked = value === opt.value
        return (
          <label
            key={opt.value}
            className={`flex cursor-pointer flex-col gap-4 rounded-md border p-16 transition duration-fast ease-out ${
              checked
                ? 'border-purple-primary bg-glass-strong ring-1 ring-purple-primary'
                : 'border-border-subtle bg-bg-panel hover:border-border-purple'
            }`}
          >
            <input
              type="radio"
              name={group}
              value={opt.value}
              checked={checked}
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
