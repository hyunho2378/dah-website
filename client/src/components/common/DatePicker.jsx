import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

// DatePicker.jsx — X5(33_PHASE18) 네이티브 <input type="date"|"datetime-local"> 전면 대체.
//
// 값 계약(네이티브와 동일 문자열이라 기존 저장 로직 변경 불필요):
//   withTime=false → 'YYYY-MM-DD'
//   withTime=true  → 'YYYY-MM-DDTHH:mm'  (datetime-local과 동일, 로컬 시간대 기준)
//
// 캘린더는 월 그리드 + 연/월 네비 + (옵션)시간 입력. 유리 패널·우리 토큰만.
// 패널은 포털(body)로 띄워 부모 overflow에 잘리지 않는다. ESC·바깥 클릭 닫기.

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS = Array.from({ length: 12 }, (_, i) => `${i + 1}월`)

const FIELD =
  'flex w-full cursor-pointer items-center justify-between gap-8 rounded-md border border-border-subtle bg-bg-panel px-16 py-12 text-left text-body-m text-text-pri outline-none transition duration-fast ease-out hover:border-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus disabled:cursor-default disabled:opacity-40'

const pad = (n) => String(n).padStart(2, '0')
const toDateStr = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`

/** 'YYYY-MM-DD' 또는 'YYYY-MM-DDTHH:mm' → {y,m,d,hh,mm} (파싱 실패 시 null) */
function parseValue(v) {
  if (!v || typeof v !== 'string') return null
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/)
  if (!m) return null
  return {
    y: Number(m[1]),
    m: Number(m[2]) - 1,
    d: Number(m[3]),
    hh: m[4] ? Number(m[4]) : 0,
    mm: m[5] ? Number(m[5]) : 0,
  }
}

function DatePicker({
  value,
  onChange,
  withTime = false,
  placeholder = withTime ? '날짜·시간 선택' : '날짜 선택',
  disabled = false,
  id,
  'aria-label': ariaLabel,
  className = '',
}) {
  const btnRef = useRef(null)
  const panelRef = useRef(null)
  const [open, setOpen] = useState(false)
  // 패널 모드: null=일 그리드, 'year'=연 그리드, 'month'=월 그리드.
  // 연·월은 각각 자기 그리드에서 바로 고른다(한 칸씩 넘기는 화살표 없음).
  const [picker, setPicker] = useState(null)
  const [rect, setRect] = useState(null)

  const parsed = useMemo(() => parseValue(value), [value])
  const today = useMemo(() => new Date(), [])
  const [view, setView] = useState(() => ({
    y: parsed?.y ?? today.getFullYear(),
    m: parsed?.m ?? today.getMonth(),
  }))

  // 외부에서 값이 바뀌면(프리필 등) 보이는 달을 그 값의 달로 맞춘다
  useEffect(() => {
    if (parsed) setView({ y: parsed.y, m: parsed.m })
  }, [parsed?.y, parsed?.m]) // eslint-disable-line react-hooks/exhaustive-deps

  const place = useCallback(() => {
    const el = btnRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setRect({ top: r.bottom + 4, left: r.left })
  }, [])

  useEffect(() => {
    if (!open) setPicker(null)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onDocPointer = (e) => {
      if (btnRef.current?.contains(e.target)) return
      if (panelRef.current?.contains(e.target)) return
      setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDocPointer)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      document.removeEventListener('pointerdown', onDocPointer)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open, place])

  const firstWeekday = new Date(view.y, view.m, 1).getDay()
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const emit = (y, m, d, hh = parsed?.hh ?? 0, mm = parsed?.mm ?? 0) => {
    onChange?.(withTime ? `${toDateStr(y, m, d)}T${pad(hh)}:${pad(mm)}` : toDateStr(y, m, d))
  }

  const pickDay = (d) => {
    emit(view.y, view.m, d)
    if (!withTime) {
      setOpen(false)
      btnRef.current?.focus()
    }
  }

  const setTime = (hh, mm) => {
    const base = parsed || { y: view.y, m: view.m, d: today.getDate() }
    emit(base.y, base.m, base.d, hh, mm)
  }

  const shiftMonth = (delta) => {
    setView((v) => {
      const next = new Date(v.y, v.m + delta, 1)
      return { y: next.getFullYear(), m: next.getMonth() }
    })
  }
  // 연 그리드 3x4 — 보이는 연도 기준 앞 6·뒤 5년. 이 범위 밖은 아래 연도 입력으로 간다.
  const yearList = Array.from({ length: 12 }, (_, i) => view.y - 6 + i)

  const label = parsed
    ? withTime
      ? `${parsed.y}. ${pad(parsed.m + 1)}. ${pad(parsed.d)}  ${pad(parsed.hh)}:${pad(parsed.mm)}`
      : `${parsed.y}. ${pad(parsed.m + 1)}. ${pad(parsed.d)}`
    : ''

  const navBtn =
    'flex h-32 w-32 cursor-pointer items-center justify-center rounded-sm text-icon transition duration-fast ease-out hover:bg-glass-strong hover:text-text-pri focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

  const headBtn =
    'cursor-pointer rounded-sm px-8 py-4 text-body-m font-semibold text-text-pri transition duration-fast ease-out hover:bg-glass-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

  // 연·월·일 그리드 셀 공통. 선택된 칸만 보라 채움.
  const cellBtn = (active) =>
    `flex h-32 cursor-pointer items-center justify-center rounded-sm text-small-m transition duration-fast ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus ${
      active
        ? 'bg-purple-primary font-semibold text-text-invert'
        : 'text-text-sec hover:bg-glass-strong hover:text-text-pri'
    }`

  return (
    <>
      <button
        type="button"
        ref={btnRef}
        id={id}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => {
          if (disabled) return
          place()
          setOpen((o) => !o)
        }}
        className={`${FIELD} ${className}`.trim()}
      >
        <span className={`min-w-0 truncate ${label ? '' : 'text-text-meta'}`}>
          {label || placeholder}
        </span>
        <CalendarDays size={16} aria-hidden="true" className="shrink-0 text-icon" />
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label={ariaLabel || '날짜 선택'}
            style={{ top: rect.top, left: rect.left }}
            className="fixed z-[110] w-[300px] rounded-md border border-glass-line bg-cosmos-depth1/[0.98] p-16 shadow-glass backdrop-blur-glass"
          >
            <div className="flex items-center justify-between gap-8">
              {picker === null ? (
                <button type="button" onClick={() => shiftMonth(-1)} aria-label="이전 달" className={navBtn}>
                  <ChevronLeft size={16} />
                </button>
              ) : (
                <span aria-hidden="true" className="h-32 w-32 shrink-0" />
              )}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setPicker((p) => (p === 'year' ? null : 'year'))}
                  aria-label="연도 선택"
                  aria-expanded={picker === 'year'}
                  className={headBtn}
                >
                  {view.y}년
                </button>
                <button
                  type="button"
                  onClick={() => setPicker((p) => (p === 'month' ? null : 'month'))}
                  aria-label="월 선택"
                  aria-expanded={picker === 'month'}
                  className={headBtn}
                >
                  {view.m + 1}월
                </button>
              </div>
              {picker === null ? (
                <button type="button" onClick={() => shiftMonth(1)} aria-label="다음 달" className={navBtn}>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <span aria-hidden="true" className="h-32 w-32 shrink-0" />
              )}
            </div>

            {picker === 'year' ? (
              <div className="mt-12 space-y-12">
                <div className="grid grid-cols-3 gap-4">
                  {yearList.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setView((v) => ({ ...v, y }))
                        setPicker(null)
                      }}
                      aria-pressed={y === view.y || undefined}
                      className={cellBtn(y === view.y)}
                    >
                      {y}
                    </button>
                  ))}
                </div>
                {/* 그리드 12년 밖으로는 여기서 이동한다 */}
                <div className="flex items-center gap-8 border-t border-border-subtle pt-12">
                  <label
                    htmlFor={`${id || 'dp'}-year`}
                    className="font-mono text-label-m uppercase tracking-label text-text-meta"
                  >
                    연도
                  </label>
                  <input
                    id={`${id || 'dp'}-year`}
                    type="number"
                    value={view.y}
                    aria-label="연도 입력"
                    onChange={(e) => {
                      const y = Number(e.target.value)
                      if (y >= 1900 && y <= 2200) setView((v) => ({ ...v, y }))
                    }}
                    className="w-96 rounded-sm border border-border-subtle bg-bg-panel px-8 py-4 text-center font-mono text-small-m text-text-pri outline-none focus:border-border-strong"
                  />
                </div>
              </div>
            ) : picker === 'month' ? (
              <div className="mt-12 grid grid-cols-3 gap-4">
                {MONTHS.map((label, mi) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setView((v) => ({ ...v, m: mi }))
                      setPicker(null)
                    }}
                    aria-pressed={mi === view.m || undefined}
                    className={cellBtn(mi === view.m)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : (
            <div className="mt-12 grid grid-cols-7 gap-4">
              {WEEKDAYS.map((w) => (
                <span
                  key={w}
                  aria-hidden="true"
                  className="flex h-24 items-center justify-center font-mono text-caption-m text-text-meta"
                >
                  {w}
                </span>
              ))}
              {cells.map((d, i) => {
                if (d === null) return <span key={`e${i}`} aria-hidden="true" className="h-32" />
                const isSelected =
                  parsed && parsed.y === view.y && parsed.m === view.m && parsed.d === d
                const isToday =
                  today.getFullYear() === view.y &&
                  today.getMonth() === view.m &&
                  today.getDate() === d
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => pickDay(d)}
                    aria-pressed={isSelected || undefined}
                    className={`flex h-32 cursor-pointer items-center justify-center rounded-sm text-small-m transition duration-fast ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus ${
                      isSelected
                        ? 'bg-purple-primary font-semibold text-text-invert'
                        : isToday
                          ? 'text-purple-light hover:bg-glass-strong'
                          : 'text-text-sec hover:bg-glass-strong hover:text-text-pri'
                    }`}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
            )}

            {withTime && picker === null && (
              <div className="mt-16 flex items-center gap-8 border-t border-border-subtle pt-16">
                <span className="font-mono text-label-m uppercase tracking-label text-text-meta">
                  시간
                </span>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={pad(parsed?.hh ?? 0)}
                  aria-label="시"
                  onChange={(e) =>
                    setTime(Math.min(23, Math.max(0, Number(e.target.value) || 0)), parsed?.mm ?? 0)
                  }
                  className="w-56 rounded-sm border border-border-subtle bg-bg-panel px-8 py-4 text-center font-mono text-small-m text-text-pri outline-none focus:border-border-strong"
                />
                <span aria-hidden="true" className="text-text-meta">
                  :
                </span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={pad(parsed?.mm ?? 0)}
                  aria-label="분"
                  onChange={(e) =>
                    setTime(parsed?.hh ?? 0, Math.min(59, Math.max(0, Number(e.target.value) || 0)))
                  }
                  className="w-56 rounded-sm border border-border-subtle bg-bg-panel px-8 py-4 text-center font-mono text-small-m text-text-pri outline-none focus:border-border-strong"
                />
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    btnRef.current?.focus()
                  }}
                  className="ml-auto cursor-pointer rounded-sm px-12 py-4 text-small-m text-text-sec transition duration-fast ease-out hover:bg-glass-strong hover:text-text-pri"
                >
                  완료
                </button>
              </div>
            )}

            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange?.('')
                  setOpen(false)
                  btnRef.current?.focus()
                }}
                className="mt-12 w-full cursor-pointer rounded-sm py-8 text-small-m text-text-meta transition duration-fast ease-out hover:bg-glass-strong hover:text-text-pri"
              >
                지우기
              </button>
            )}
          </div>,
          document.body
        )}
    </>
  )
}

export default DatePicker
