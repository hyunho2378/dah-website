import { useState } from 'react'
import { Search } from 'lucide-react'

// KPC 게시판 문법(11_DESIGN_V2 1절) — 검색 입력.
// 제출 시 onSearch(q)만 호출한다. 데이터 요청은 페이지가 소유.
function SearchBar({ value = '', onSearch, placeholder = '검색어 입력' }) {
  const [q, setQ] = useState(value)

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onSearch(q.trim())
      }}
      className="flex w-full min-w-0 items-center gap-8 rounded-full border border-border-subtle bg-bg-panel px-16 py-8 transition-colors duration-fast ease-out focus-within:border-border-strong md:w-auto"
    >
      <input
        type="search"
        value={q}
        size={18}
        onChange={(event) => setQ(event.target.value)}
        placeholder={placeholder}
        aria-label="검색어"
        className="w-full min-w-0 bg-transparent font-sans text-small-m text-text-pri placeholder:text-text-meta focus:outline-none md:w-auto md:text-small-d"
      />
      <button
        type="submit"
        aria-label="검색"
        className="shrink-0 cursor-pointer text-text-meta transition-colors duration-fast ease-out hover:text-text-pri"
      >
        <Search size={16} aria-hidden="true" />
      </button>
    </form>
  )
}

export default SearchBar
