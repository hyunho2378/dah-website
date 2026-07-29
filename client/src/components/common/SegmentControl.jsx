import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'

// SegmentControl.jsx — G3(37_SHEET_ROADMAP) 값 전환 컨트롤. 네이티브 select 미사용.
//
// 두 형태:
//   mode="segment" — 옵션이 전부 보이고 하나가 활성(어드민용). 값이 2~3개일 때.
//   mode="single"  — 현재 값 하나만 알약으로 보여주고, 누르면 목록에서 고른다(접수폼용).
//
// single 패널은 body 포털 + fixed라 부모 overflow·스택 컨텍스트에 잘리지 않고
// 문서 흐름도 밀지 않는다(레이아웃 시프트 0).
// 접근성: segment는 각 버튼 aria-pressed, single은 listbox 패턴 + 키보드 ↑↓/Enter/ESC.

function SegmentControl({
  mode = 'segment',
  options = [],
  value,
  onChange,
  'aria-label': ariaLabel,
  className = '',
}) {
  const btnRef = useRef(null)
  const listRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [rect, setRect] = useState(null)
  const selectedIndex = options.findIndex((o) => o.value === value)
  const [activeIndex, setActiveIndex] = useState(selectedIndex < 0 ? 0 : selectedIndex)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null

  const place = useCallback(() => {
    const el = btnRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setRect({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 160) })
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onDocPointer = (e) => {
      if (btnRef.current?.contains(e.target)) return
      if (listRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onDocPointer)
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      document.removeEventListener('pointerdown', onDocPointer)
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open, place])

  const commit = (index) => {
    const opt = options[index]
    if (!opt) return
    onChange?.(opt.value)
    setOpen(false)
    btnRef.current?.focus()
  }

  if (mode === 'segment') {
    return (
      <div
        role="group"
        aria-label={ariaLabel}
        className={`inline-flex items-center gap-4 rounded-sm border border-glass-line bg-glass-bg p-4 ${className}`.trim()}
      >
        {options.map((opt) => {
          const on = opt.value === value
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange?.(opt.value)}
              className={`cursor-pointer whitespace-nowrap rounded-sm px-16 py-8 text-small-m font-semibold transition-colors duration-fast ease-out md:text-small-d ${
                on
                  ? 'bg-button-primary text-button-primaryText'
                  : 'text-text-sec hover:bg-glass-strong hover:text-text-pri'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    )
  }

  // mode === 'single'
  return (
    <>
      <button
        type="button"
        ref={btnRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => {
          if (!open) {
            place()
            setActiveIndex(selectedIndex < 0 ? 0 : selectedIndex)
          }
          setOpen((v) => !v)
        }}
        onKeyDown={(e) => {
          if (!open) return
          if (e.key === 'Escape') {
            e.preventDefault()
            setOpen(false)
          } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex((i) => (i + 1) % options.length)
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((i) => (i - 1 + options.length) % options.length)
          } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            commit(activeIndex)
          }
        }}
        className={`inline-flex cursor-pointer items-center gap-8 rounded-sm border border-border-purple bg-glass-bg px-16 py-8 text-body-m font-semibold text-text-pri transition-colors duration-fast ease-out hover:border-border-purpleStrong hover:bg-glass-strong ${className}`.trim()}
      >
        {selected ? selected.label : '선택'}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 text-icon transition-transform duration-fast ease-out ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open &&
        rect &&
        createPortal(
          <ul
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            style={{ top: rect.top, left: rect.left, width: rect.width }}
            className="fixed z-[110] max-h-[280px] overflow-y-auto rounded-md border border-glass-line bg-cosmos-depth1/[0.98] p-4 shadow-glass backdrop-blur-glass"
          >
            {options.map((opt, i) => {
              const on = opt.value === value
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={on}
                  onPointerEnter={() => setActiveIndex(i)}
                  onClick={() => commit(i)}
                  className={`flex cursor-pointer items-center justify-between gap-8 rounded-sm px-12 py-8 text-body-m transition-colors duration-fast ease-out ${
                    i === activeIndex ? 'bg-glass-strong text-text-pri' : 'text-text-sec'
                  }`}
                >
                  <span className="min-w-0 truncate">{opt.label}</span>
                  {on && <Check size={16} aria-hidden="true" className="shrink-0 text-icon-active" />}
                </li>
              )
            })}
          </ul>,
          document.body
        )}
    </>
  )
}

export default SegmentControl
