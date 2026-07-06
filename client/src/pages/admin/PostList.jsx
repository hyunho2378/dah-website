// PostList.jsx — /admin/posts/:type 공용 리스트 (13_CMS_SPEC 6절)
// 검색 + 페이지네이션(KPC 게시판 문법) + published 토글 + 수정·삭제.

import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useApi, api } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import {
  EmptyNote,
  ErrorText,
  GhostButton,
  Input,
  PageHead,
  Pagination,
  Toggle,
} from '../../components/admin/FormControls'
import { POST_TYPES, metaOf, titleOf } from './postTypes'

const ICON_LINK =
  'flex h-32 w-32 cursor-pointer items-center justify-center rounded-full text-text-sec transition duration-fast ease-out hover:bg-glass-strong hover:text-text-pri focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

function PostList() {
  const { type } = useParams()
  const config = POST_TYPES[type]
  useTitle(config ? `${config.label} 관리` : '콘텐츠 관리')

  const [keyword, setKeyword] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const { data, loading, error, offline, refetch } = useApi(
    config ? `/admin/content/${type}` : null,
    { params: { q, page } }
  )

  if (!config) {
    return <EmptyNote>알 수 없는 콘텐츠 유형입니다</EmptyNote>
  }

  const items = data?.items || (Array.isArray(data) ? data : [])
  const total = data?.total ?? items.length
  const pageSize = data?.pageSize || 10

  const search = (e) => {
    e.preventDefault()
    setPage(1)
    setQ(keyword.trim())
  }

  const togglePublished = async (item) => {
    try {
      await api.put(`/admin/content/${type}/${item.id}`, { published: !item.published })
      refetch()
    } catch (err) {
      window.alert(err.message)
    }
  }

  const remove = async (item) => {
    if (!window.confirm('삭제하시겠습니까? 되돌릴 수 없습니다.')) return
    try {
      await api.del(`/admin/content/${type}/${item.id}`)
      refetch()
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <section className="flex flex-col gap-24">
      <PageHead
        title={config.label}
        offline={offline}
        actions={
          <Link
            to={`/admin/posts/${type}/new`}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-8 whitespace-nowrap rounded-sm border border-border-subtle px-24 text-body-m font-semibold text-text-pri transition duration-fast ease-out hover:border-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
          >
            <Plus size={16} aria-hidden="true" />
            추가
          </Link>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-16">
        <p className="font-mono text-caption-m text-text-meta">총 {total}건</p>
        <form onSubmit={search} className="flex min-w-0 items-center gap-8">
          <Input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="검색어"
            aria-label="검색어"
            className="max-w-xs"
          />
          <GhostButton type="submit" aria-label="검색">
            <Search size={16} />
          </GhostButton>
        </form>
      </div>

      {error && <ErrorText>{error.message}</ErrorText>}
      {loading && <p className="font-mono text-caption-m text-text-meta">불러오는 중</p>}
      {!loading && !items.length && <EmptyNote />}

      {items.length > 0 && (
        <ul className="flex flex-col">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex min-w-0 items-center gap-12 border-b border-border-subtle py-12 transition duration-fast ease-out first:border-t hover:bg-bg-elev"
            >
              <span className="w-96 shrink-0 font-mono text-caption-m text-text-meta">
                {metaOf(item)}
              </span>
              <span className="min-w-0 flex-1">
                <Link
                  to={`/admin/posts/${type}/${item.id}/edit`}
                  className="block truncate text-body-m text-text-pri underline-offset-4 hover:underline md:text-body-d"
                >
                  {titleOf(item)}
                </Link>
                {item.tag && (
                  <span className="font-mono text-caption-m text-text-meta">{item.tag}</span>
                )}
              </span>
              {'published' in item && (
                <Toggle
                  checked={Boolean(item.published)}
                  onChange={() => togglePublished(item)}
                  label={`${titleOf(item)} 게시 여부`}
                />
              )}
              <Link
                to={`/admin/posts/${type}/${item.id}/edit`}
                aria-label="수정"
                className={ICON_LINK}
              >
                <Pencil size={16} />
              </Link>
              <button
                type="button"
                onClick={() => remove(item)}
                aria-label="삭제"
                className={ICON_LINK}
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} pageSize={pageSize} total={total} onPage={setPage} />
    </section>
  )
}

export default PostList
