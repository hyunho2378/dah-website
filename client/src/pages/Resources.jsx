// /resources — 자료실 (KPC 게시판 문법 + 첨부 다운로드 링크)
// API: GET /content/resource?page=&q= — 정적 폴백 데이터 없음(빈 상태 P6).
import { useState } from 'react'
import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import BoardList from '../components/board/BoardList'
import { AddButton } from '../components/content/EditControls'
import { useApi } from '../hooks/useApi'
import { useTitle } from '../hooks/useTitle'
import { useLang } from '../i18n/LangContext'

const PAGE_SIZE = 10

function toAttachment(file) {
  if (typeof file === 'string') return { name: '첨부파일', url: file }
  return { name: file.name ?? file.filename ?? '첨부파일', url: file.url }
}

function toRow(post, no) {
  const files = post.attachments ?? post.files ?? []
  return {
    id: post.id,
    no,
    tag: post.tag ?? null,
    title: post.title_ko ?? post.title,
    author: post.author ?? null,
    date: post.date ?? (post.created_at ?? '').slice(0, 10) ?? null,
    pinned: Boolean(post.pinned),
    // 자료실은 상세 페이지 없음(14_ROUTES_V2) — 외부 링크만 허용, 첨부는 행 안에서 다운로드
    href: post.external_url ?? undefined,
    attachments: post.external_url ? [] : files.map(toAttachment),
  }
}

function Resources() {
  const { t } = useLang()
  useTitle(t('titles.resources'))
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const { data, loading, error, offline } = useApi('/content/resource', {
    params: { page, q: q || undefined },
  })

  const total = data?.total ?? 0
  const pageSize = data?.pageSize ?? PAGE_SIZE
  const rows = (data?.items ?? []).map((post, idx) =>
    toRow(post, total - (page - 1) * pageSize - idx)
  )

  const statusText = loading
    ? t('common.loading')
    : rows.length === 0
      ? error && !offline
        ? t('common.error')
        : t('common.empty')
      : null

  return (
    <>
      <PageBanner
        titleKo="자료실"
        titleEn="RESOURCES"
        breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('titles.resources'), to: '/resources' }]}
        nebulaX="28%"
        nebulaY="22%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        {offline && (
          <p className="mb-16 font-mono text-caption-m text-text-meta">
            {t('common.offline')}
          </p>
        )}
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
          searchPlaceholder={t('news.resourceSearchPlaceholder')}
          statusText={statusText}
          actions={<AddButton type="resource" to="/admin/posts/resource/new" />}
        />
      </Container>
    </>
  )
}

export default Resources
