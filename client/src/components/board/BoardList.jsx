import { Link } from 'react-router-dom'
import { ArrowUpRight, Download, Pin } from 'lucide-react'
import Tag from '../common/Tag'
import SearchBar from './SearchBar'
import Pagination from './Pagination'

// KPC 게시판 문법(11_DESIGN_V2 1절): 총 N건 + 검색 + 리스트 행 + 페이지네이션.
// 테이블 금지 — 글래스 리스트 행으로 재해석. 행: [번호|공지] [태그 Tag] [제목] … [작성자] [날짜]
// item: { id, no, tag, title, author, date, pinned, to(내부) | href(외부), attachments[{name,url}] }
// attachments는 비링크 행(자료실)에서만 렌더한다(중첩 앵커 금지).

function RowBody({ item, isLink }) {
  const { no, tag, title, author, date, pinned, href, attachments } = item

  return (
    <>
      <span className="flex shrink-0 items-center gap-12">
        {pinned ? (
          <span className="flex w-40 shrink-0 items-center gap-4 font-mono text-caption-m text-text-pri">
            <Pin size={16} aria-hidden="true" />
            <span className="sr-only">고정 공지</span>
          </span>
        ) : (
          <span className="w-40 shrink-0 font-mono text-caption-m text-text-meta">
            {no}
          </span>
        )}
        {tag && <Tag>{tag}</Tag>}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-8">
        <span className="flex min-w-0 items-center gap-8">
          <span
            className={`min-w-0 text-body-m text-text-pri underline-offset-4 md:text-body-d ${
              isLink ? 'group-hover:underline' : ''
            }`}
          >
            {title}
          </span>
          {href && (
            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="shrink-0 text-text-meta transition-colors duration-fast ease-out group-hover:text-text-pri"
            />
          )}
        </span>
        {!isLink && attachments?.length > 0 && (
          <span className="flex flex-wrap items-center gap-8">
            {attachments.map((file) => (
              <a
                key={file.url}
                href={file.url}
                download
                className="inline-flex items-center gap-4 rounded-full border border-border-subtle px-12 py-4 font-mono text-caption-m text-text-sec transition-colors duration-fast ease-out hover:border-border-strong hover:text-text-pri"
              >
                <Download size={16} aria-hidden="true" />
                {file.name}
              </a>
            ))}
          </span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-16 font-mono text-caption-m text-text-meta">
        {author && <span>{author}</span>}
        {date && <time dateTime={date}>{date}</time>}
      </span>
    </>
  )
}

function Row({ item }) {
  const base =
    'flex min-w-0 flex-col gap-8 px-16 py-16 transition-colors duration-fast ease-out md:flex-row md:items-center md:gap-24 md:px-24 md:py-20'

  if (item.to) {
    return (
      <Link to={item.to} className={`group ${base} hover:bg-glass-strong`}>
        <RowBody item={item} isLink />
      </Link>
    )
  }
  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group ${base} hover:bg-glass-strong`}
      >
        <RowBody item={item} isLink />
      </a>
    )
  }
  return (
    <div className={base}>
      <RowBody item={item} isLink={false} />
    </div>
  )
}

function BoardList({
  total = 0,
  items = [],
  page = 1,
  pageSize = 10,
  onPageChange,
  onSearch,
  searchValue = '',
  searchPlaceholder,
  statusText = null,
  actions = null,
}) {
  return (
    <div className="flex min-w-0 flex-col gap-16">
      <div className="flex flex-wrap items-center justify-between gap-16">
        <p className="font-mono text-caption-m text-text-sec">
          총 <span className="text-text-pri">{total}</span>건
        </p>
        <div className="flex min-w-0 flex-wrap items-center gap-12">
          {actions}
          {onSearch && (
            <SearchBar
              value={searchValue}
              onSearch={onSearch}
              placeholder={searchPlaceholder}
            />
          )}
        </div>
      </div>
      <div className="min-w-0 overflow-hidden rounded-glass border border-glass-line bg-glass-bg">
        {statusText ? (
          <p className="px-24 py-64 font-mono text-caption-m text-text-meta">
            {statusText}
          </p>
        ) : (
          <div className="divide-y divide-border-subtle">
            {items.map((item) => (
              <Row key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
      {onPageChange && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
        />
      )}
    </div>
  )
}

export default BoardList
