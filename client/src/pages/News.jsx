// /news — 공지사항 (10_IA_V2 2절, KPC 게시판 문법)
// 태그 필터(대내/대외/공모전모집/특강모집) + 검색 + 페이지네이션, pinned 상단.
// API: GET /content/notice?tag=&page=&q= / offline 시 src/data/notices 정적 폴백.
import { useMemo, useState } from 'react'
import PageBanner from '../components/common/PageBanner'
import BoardList from '../components/board/BoardList'
import { AddButton } from '../components/content/EditControls'
import { useApi } from '../hooks/useApi'
import { useTitle } from '../hooks/useTitle'
import { notices } from '../data/notices'

const TAGS = ['전체', '대내', '대외', '공모전모집', '특강모집']
const PAGE_SIZE = 10
const EMPTY_TEXT = '등록된 항목이 없습니다'
const LOADING_TEXT = '불러오는 중'
const ERROR_TEXT = '목록을 불러오지 못했습니다'

// API 게시글 → 게시판 행
function toRow(post, no) {
  return {
    id: post.id,
    no,
    tag: post.tag ?? post.org ?? null,
    title: post.title_ko ?? post.title,
    author: post.author ?? null,
    date: post.date ?? (post.created_at ?? '').slice(0, 10) ?? null,
    pinned: Boolean(post.pinned),
    to: post.url ? undefined : `/news/${post.id}`,
    href: post.url ?? undefined,
  }
}

function pinnedFirst(list) {
  return [...list].sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false))
}

function News() {
  useTitle('공지사항')
  const [tag, setTag] = useState('전체')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const { data, loading, error, offline } = useApi('/content/notice', {
    params: {
      page,
      q: q || undefined,
      tag: tag === '전체' ? undefined : tag,
    },
  })

  // 정적 폴백: 클라이언트 측 필터·검색·페이지네이션
  const fallback = useMemo(() => {
    let list = [...notices].sort((a, b) => b.date.localeCompare(a.date))
    if (tag !== '전체') list = list.filter((n) => (n.tag ?? n.org) === tag)
    if (q) list = list.filter((n) => n.title.includes(q))
    return list
  }, [tag, q])

  const useFallback = offline || (error && !data)
  const total = useFallback ? fallback.length : data?.total ?? 0
  const pageSize = useFallback ? PAGE_SIZE : data?.pageSize ?? PAGE_SIZE
  const source = useFallback
    ? fallback.slice((page - 1) * pageSize, page * pageSize)
    : data?.items ?? []
  const rows = pinnedFirst(source).map((post, idx) =>
    toRow(post, total - (page - 1) * pageSize - idx)
  )

  const statusText = loading
    ? LOADING_TEXT
    : rows.length === 0
      ? error && !useFallback
        ? ERROR_TEXT
        : EMPTY_TEXT
      : null

  return (
    <>
      <PageBanner
        titleKo="공지사항"
        titleEn="NEWS"
        breadcrumb={[{ label: '홈', to: '/' }, { label: '소식' }, { label: '공지사항', to: '/news' }]}
        nebulaX="72%"
        nebulaY="18%"
      />
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        <div role="group" aria-label="태그 필터" className="flex flex-wrap gap-8">
          {TAGS.map((t) => {
            const isActive = t === tag
            return (
              <button
                key={t}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setTag(t)
                  setPage(1)
                }}
                className={`cursor-pointer rounded-full border px-12 py-4 font-mono text-caption-m transition-colors duration-fast ease-out ${
                  isActive
                    ? 'border-border-strong bg-glass-strong text-text-pri'
                    : 'border-border-subtle text-text-sec hover:border-border-strong hover:text-text-pri'
                }`}
              >
                {t}
              </button>
            )
          })}
        </div>
        {offline && (
          <p className="mt-16 font-mono text-caption-m text-text-meta">
            실시간 동기화 대기 중
          </p>
        )}
        <div className="mt-32">
          <BoardList
            total={total}
            items={rows}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onSearch={(next) => {
              setQ(next)
              setPage(1)
            }}
            searchValue={q}
            searchPlaceholder="공지 검색"
            statusText={statusText}
            actions={<AddButton type="notice" to="/admin/posts/notice/new" />}
          />
        </div>
      </section>
    </>
  )
}

export default News
