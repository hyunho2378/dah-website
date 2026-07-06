import { ChevronLeft, ChevronRight } from 'lucide-react'

// KPC 게시판 문법 — 페이지 번호 내비게이션. 총 1페이지면 미렌더.
const WINDOW = 5

function pageWindow(page, totalPages) {
  const start = Math.max(
    1,
    Math.min(page - Math.floor(WINDOW / 2), totalPages - WINDOW + 1)
  )
  const end = Math.min(totalPages, start + WINDOW - 1)
  const pages = []
  for (let n = start; n <= end; n += 1) pages.push(n)
  return pages
}

const cellBase =
  'flex h-40 w-40 shrink-0 items-center justify-center rounded-md font-mono text-small-m transition-colors duration-fast ease-out md:text-small-d'

function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  return (
    <nav aria-label="페이지" className="flex items-center justify-center gap-4">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={`${cellBase} cursor-pointer text-text-sec hover:text-text-pri disabled:cursor-not-allowed disabled:text-text-meta`}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>
      {pageWindow(page, totalPages).map((n) => {
        const isActive = n === page
        return (
          <button
            key={n}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange(n)}
            className={`${cellBase} cursor-pointer ${
              isActive
                ? 'border border-border-strong bg-glass-strong text-text-pri'
                : 'text-text-sec hover:text-text-pri'
            }`}
          >
            {n}
          </button>
        )
      })}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className={`${cellBase} cursor-pointer text-text-sec hover:text-text-pri disabled:cursor-not-allowed disabled:text-text-meta`}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  )
}

export default Pagination
