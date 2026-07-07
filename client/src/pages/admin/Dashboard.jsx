// Dashboard.jsx — /admin 홈 (13_CMS_SPEC 6절)
// 콘텐츠 유형별 카운트 + pending 쇼케이스 큐 + 접수 현황(기간 중) + 스냅샷 내보내기(owner).

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useApi, api } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useAuth } from '../../context/AuthContext'
import ExportButton from '../../components/admin/ExportButton'
import { EmptyNote, ErrorText, PageHead } from '../../components/admin/FormControls'

// 유형별 카운트 대상 — 롤 미충족 유형은 조회 자체를 생략(403 방지)
const COUNT_TARGETS = [
  { type: 'notice', label: '공지사항', to: '/admin/posts/notice', role: 'manager' },
  { type: 'resource', label: '자료실', to: '/admin/posts/resource', role: 'manager' },
  { type: 'lecture', label: '특강', to: '/admin/posts/lecture', role: 'manager' },
  { type: 'contest', label: '공모전', to: '/admin/posts/contest', role: 'manager' },
  { type: 'exhibitions', label: '전시회', to: '/admin/posts/exhibitions', role: 'manager' },
  { type: 'achievement', label: '학생 성과', to: '/admin/posts/achievement', role: 'manager' },
  { type: 'club', label: '동아리', to: '/admin/posts/club', role: 'manager' },
  { type: 'portfolios', label: '포트폴리오', to: '/admin/posts/portfolios', role: 'manager' },
  { type: 'showcase', label: '쇼케이스', to: '/admin/showcase', role: 'manager' },
  { type: 'professors', label: '교수진', to: '/admin/professors', role: 'admin' },
  { type: 'mentors', label: '멘토단', to: '/admin/mentors', role: 'admin' },
  { type: 'curriculum', label: '교과목', to: '/admin/curriculum', role: 'admin' },
  { type: 'council', label: '운영위원회', to: '/admin/council', role: 'admin' },
  { type: 'careers', label: '취업 현황', to: '/admin/careers', role: 'admin' },
]

const PANEL =
  'rounded-glass border border-glass-line bg-glass-bg p-24 backdrop-blur-glass-mobile'

function Dashboard() {
  useTitle('관리 대시보드')
  const { hasRole } = useAuth()
  const targets = COUNT_TARGETS.filter((t) => hasRole(t.role))

  const [counts, setCounts] = useState({})
  const [countError, setCountError] = useState(null)

  // pending 쇼케이스 큐 (13_CMS 6절)
  const pending = useApi('/admin/content/showcase', {
    params: { status: 'pending', page: 1, pageSize: 5 },
  })
  // 접수 기간 상태 (/settings/public — B1 계약)
  const settings = useApi('/settings/public')
  const exhibition = settings.data?.exhibition
  const inPeriod = Boolean(exhibition?.is_submit_period || exhibition?.is_edit_period)

  // 접수 현황 건수 — 기간 중 + admin 이상만 조회
  const entries = useApi(hasRole('admin') && inPeriod ? '/admin/exhibition/entries' : null, {
    params: { page: 1, pageSize: 1 },
  })

  useEffect(() => {
    let alive = true
    setCountError(null)
    Promise.all(
      targets.map((t) =>
        api
          .get(`/admin/content/${t.type}`, { page: 1, pageSize: 1 })
          .then((r) => [t.type, r?.total ?? 0])
          .catch(() => [t.type, null])
      )
    ).then((pairs) => {
      if (!alive) return
      const next = Object.fromEntries(pairs)
      setCounts(next)
      if (pairs.every(([, v]) => v === null)) {
        setCountError('카운트를 불러오지 못했습니다. 서버 연결을 확인하세요.')
      }
    })
    return () => {
      alive = false
    }
    // targets는 롤에서만 파생 — hasRole 변경 시 재계산
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRole])

  const approve = async (item) => {
    try {
      await api.put(`/admin/content/showcase/${item.id}`, { status: 'published' })
      pending.refetch()
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <section className="flex flex-col gap-32">
      <PageHead title="대시보드" desc="콘텐츠 현황 요약" actions={<ExportButton />} />

      {/* 유형별 카운트 */}
      <div>
        <p className="font-mono text-label-m uppercase tracking-label text-text-meta">CONTENT</p>
        <ErrorText>{countError}</ErrorText>
        <ul className="mt-16 grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-4">
          {targets.map((t) => (
            <li key={t.type}>
              <Link
                to={t.to}
                className="flex flex-col gap-8 rounded-glass border border-glass-line bg-glass-bg p-16 backdrop-blur-glass-mobile transition duration-fast ease-out hover:bg-glass-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
              >
                <span className="font-mono text-caption-m text-text-meta">{t.label}</span>
                <span className="font-display text-h1-m font-bold tracking-display text-text-pri">
                  {counts[t.type] ?? '-'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* pending 쇼케이스 큐 */}
      <div className={PANEL}>
        <div className="flex flex-wrap items-center justify-between gap-16">
          <h3 className="text-h3-m font-bold text-text-pri md:text-h3-d">쇼케이스 승인 대기</h3>
          <Link
            to="/admin/showcase"
            className="font-mono text-caption-m text-text-sec underline underline-offset-4 transition duration-fast ease-out hover:text-text-pri"
          >
            큐 전체 보기
          </Link>
        </div>
        {pending.error && <ErrorText>{pending.error.message}</ErrorText>}
        {pending.loading && (
          <p className="mt-16 font-mono text-caption-m text-text-meta">불러오는 중</p>
        )}
        {!pending.loading && !(pending.data?.items || []).length && (
          <EmptyNote>대기 중인 제출물이 없습니다</EmptyNote>
        )}
        {(pending.data?.items || []).length > 0 && (
          <ul className="mt-16 flex flex-col">
            {(pending.data?.items || []).map((item) => (
              <li
                key={item.id}
                className="flex min-w-0 items-center gap-12 border-b border-border-subtle py-12 first:border-t"
              >
                {item.main_img && (
                  <img
                    src={item.main_img}
                    alt=""
                    loading="lazy"
                    className="h-48 w-48 shrink-0 rounded-md border border-border-subtle bg-bg-elev object-cover"
                  />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body-m text-text-pri">{item.title}</span>
                  <span className="block truncate font-mono text-caption-m text-text-meta">
                    {item.creator}
                    {item.topic ? ` · ${item.topic}` : ''}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => approve(item)}
                  className="inline-flex cursor-pointer items-center gap-8 rounded-sm border border-glass-line bg-glass-bg px-12 py-4 font-mono text-caption-m text-text-sec transition duration-fast ease-out hover:bg-glass-strong hover:text-text-pri focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
                >
                  <Check size={16} aria-hidden="true" />
                  승인
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 접수 현황 — 기간 중에만 노출 (13_CMS 6절) */}
      {inPeriod && (
        <div className={PANEL}>
          <div className="flex flex-wrap items-center justify-between gap-16">
            <h3 className="text-h3-m font-bold text-text-pri md:text-h3-d">전시회 접수 현황</h3>
            {hasRole('admin') && (
              <Link
                to="/admin/exhibition"
                className="font-mono text-caption-m text-text-sec underline underline-offset-4 transition duration-fast ease-out hover:text-text-pri"
              >
                접수 목록 보기
              </Link>
            )}
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            <div>
              <dt className="font-mono text-caption-m text-text-meta">접수 상태</dt>
              <dd className="mt-4 text-body-m text-text-pri">
                {exhibition?.is_submit_period ? '접수 기간' : '수정 기간'}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-caption-m text-text-meta">마감</dt>
              <dd className="mt-4 font-mono text-body-m text-text-pri">
                {String(
                  exhibition?.is_submit_period ? exhibition?.submit_close : exhibition?.edit_close
                ).slice(0, 10)}
              </dd>
            </div>
            {hasRole('admin') && (
              <div>
                <dt className="font-mono text-caption-m text-text-meta">누적 접수</dt>
                <dd className="mt-4 font-mono text-body-m text-text-pri">
                  {entries.data?.total ?? '-'}건
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </section>
  )
}

export default Dashboard
