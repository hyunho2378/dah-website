// FormControls.jsx — 어드민 공용 폼·리스트 프리미티브 (13_CMS_SPEC 6절)
// 어드민도 동일 디자인 시스템(우주+글래스). 별도 관리자 테마 금지.

const INPUT =
  'w-full rounded-md border border-border-subtle bg-bg-panel px-16 py-12 text-body-m text-text-pri outline-none transition duration-fast ease-out placeholder:text-text-meta focus:border-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

const BUTTON_BASE =
  'inline-flex h-11 cursor-pointer items-center justify-center gap-8 whitespace-nowrap rounded-sm px-24 text-body-m font-semibold transition duration-fast ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus disabled:cursor-default disabled:opacity-40'

/** 페이지 상단 — 제목(명사형) + 액션 + 오프라인 배지 */
export function PageHead({ title, desc, actions, offline = false }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-16 border-b border-border-subtle pb-24">
      <div className="flex min-w-0 flex-col gap-8">
        <div className="flex flex-wrap items-center gap-12">
          <h2 className="text-h2-m font-bold text-text-pri md:text-h2-d">{title}</h2>
          <OfflineBadge show={offline} />
        </div>
        {desc && <p className="text-body-m text-text-sec md:text-body-d">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-8">{actions}</div>}
    </div>
  )
}

/** 폴백 렌더 표시 — "실시간 동기화 대기 중" 미세 배지 (12_BACKEND 7절) */
export function OfflineBadge({ show = false }) {
  if (!show) return null
  return (
    <span className="inline-flex items-center rounded-sm border border-glass-line bg-glass-bg px-12 py-4 font-mono text-caption-m text-text-meta">
      실시간 동기화 대기 중
    </span>
  )
}

export function Field({ label, hint, children }) {
  return (
    <label className="flex min-w-0 flex-col gap-8">
      <span className="font-mono text-label-m uppercase tracking-label text-text-meta">
        {label}
      </span>
      {children}
      {hint && <span className="text-small-m text-text-meta">{hint}</span>}
    </label>
  )
}

export function Input(props) {
  return <input {...props} className={`${INPUT} ${props.className || ''}`.trim()} />
}

export function TextArea({ rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      {...props}
      className={`${INPUT} resize-y ${props.className || ''}`.trim()}
    />
  )
}

export function Select({ options = [], ...props }) {
  return (
    <select {...props} className={`${INPUT} appearance-none ${props.className || ''}`.trim()}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-bg-panel text-text-pri">
          {opt.label}
        </option>
      ))}
    </select>
  )
}

/** 스위치 — published 토글 등 */
export function Toggle({ checked = false, onChange, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange && onChange(!checked)}
      className={`inline-flex h-24 w-40 shrink-0 cursor-pointer items-center rounded-sm border px-4 transition duration-fast ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus disabled:cursor-default disabled:opacity-40 ${
        checked
          ? 'justify-end border-border-strong bg-glass-strong'
          : 'justify-start border-border-subtle bg-bg-panel'
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-16 w-16 rounded-sm transition duration-fast ease-out ${
          checked ? 'bg-text-pri' : 'bg-text-meta'
        }`}
      />
    </button>
  )
}

export function PrimaryButton({ children, type = 'button', ...rest }) {
  return (
    <button
      type={type}
      {...rest}
      className={`${BUTTON_BASE} bg-bg-invert text-text-invert hover:opacity-90 ${rest.className || ''}`.trim()}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, type = 'button', ...rest }) {
  return (
    <button
      type={type}
      {...rest}
      className={`${BUTTON_BASE} border border-border-subtle bg-transparent text-text-pri hover:border-border-strong ${rest.className || ''}`.trim()}
    >
      {children}
    </button>
  )
}

export function ErrorText({ children }) {
  if (!children) return null
  return <p className="text-small-m text-state-error">{children}</p>
}

/** 빈 상태 — P6: mono caption 1줄 + 여백 */
export function EmptyNote({ children = '등록된 항목이 없습니다' }) {
  return <p className="py-32 font-mono text-caption-m text-text-meta">{children}</p>
}

/** KPC 게시판 문법 페이지네이션 — mono 숫자 */
export function Pagination({ page = 1, pageSize = 10, total = 0, onPage }) {
  const totalPages = Math.max(1, Math.ceil(total / (pageSize || 10)))
  if (totalPages <= 1) return null
  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
  const nums = []
  for (let n = start; n <= Math.min(totalPages, start + 4); n += 1) nums.push(n)

  const btn = (active) =>
    `flex h-32 w-32 cursor-pointer items-center justify-center rounded-sm font-mono text-small-m transition duration-fast ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus disabled:cursor-default disabled:opacity-40 ${
      active ? 'bg-glass-strong text-text-pri' : 'text-text-sec hover:text-text-pri'
    }`

  return (
    <nav aria-label="페이지" className="flex items-center justify-center gap-4 pt-24">
      <button
        type="button"
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        aria-label="이전 페이지"
        className={btn(false)}
      >
        {'<'}
      </button>
      {nums.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPage(n)}
          aria-current={n === page ? 'page' : undefined}
          className={btn(n === page)}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        aria-label="다음 페이지"
        className={btn(false)}
      >
        {'>'}
      </button>
    </nav>
  )
}
