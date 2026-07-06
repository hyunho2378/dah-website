// /students/council — 운영위원회 (T4 아카이브형: 기수별 아카이브)
// 기수 탭(최신 기본) → 로고·기수명·소개·구성원 그리드. 기수가 늘어도 동일 템플릿 보존.
import { useState } from 'react'
import PageBanner from '../../components/common/PageBanner'
import { AddButton, EditPencil } from '../../components/admin/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'

const EMPTY_TEXT = '등록된 항목이 없습니다'

const toMember = (member) =>
  typeof member === 'string' ? { name: member } : member

function Council() {
  useTitle('운영위원회')
  const { data, loading, error, offline } = useApi('/content/council')
  const items = [...(data?.items ?? [])].sort(
    (a, b) => (b.ordinal ?? 0) - (a.ordinal ?? 0)
  )

  const [selectedId, setSelectedId] = useState(null)
  const active = items.find((c) => c.id === selectedId) ?? items[0] ?? null
  const members = Array.isArray(active?.members) ? active.members.map(toMember) : []

  return (
    <>
      <PageBanner
        titleKo="운영위원회"
        titleEn="COUNCIL"
        breadcrumb={[{ label: '홈', to: '/' }, { label: '학생' }, { label: '운영위원회', to: '/students/council' }]}
        nebulaX="24%"
        nebulaY="40%"
      />
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        <div className="flex flex-wrap items-center justify-between gap-16">
          {/* 기수 탭 — 최신 기수 기본 활성 */}
          <div
            role="group"
            aria-label="기수 선택"
            className="flex flex-wrap gap-x-24 gap-y-8"
          >
            {items.map((c) => {
              const isActive = c.id === active?.id
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedId(c.id)}
                  className={`-mb-px cursor-pointer border-b-2 pb-8 font-mono text-small-m transition-colors duration-fast ease-out md:text-small-d ${
                    isActive
                      ? 'border-text-pri text-text-pri'
                      : 'border-transparent text-text-meta hover:text-text-sec'
                  }`}
                >
                  {c.ordinal ? `${c.ordinal}기` : c.name}
                </button>
              )
            })}
          </div>
          <AddButton type="council" to="/admin/council" />
        </div>

        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">불러오는 중</p>
        ) : !active ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {error && !offline ? '목록을 불러오지 못했습니다' : EMPTY_TEXT}
          </p>
        ) : (
          <div className="mt-48 flex min-w-0 flex-col gap-48">
            {/* T4 헤더: 로고 + 기수명 + 소개 */}
            <div className="flex flex-col items-start gap-24 md:flex-row md:gap-48">
              <div className="flex h-96 w-96 shrink-0 items-center justify-center overflow-hidden rounded-glass border border-glass-line bg-glass-bg p-8">
                {active.logo_url ? (
                  <img
                    src={active.logo_url}
                    alt={`${active.name} 로고`}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="font-mono text-caption-m text-text-meta">
                    {active.ordinal ? `${active.ordinal}기` : 'LOGO'}
                  </span>
                )}
              </div>
              <div className="flex min-w-0 flex-col gap-12">
                <p className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
                  {[
                    active.ordinal ? `제${active.ordinal}대` : null,
                    active.year_label,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                <div className="flex flex-wrap items-center gap-12">
                  <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
                    {active.name}
                  </h2>
                  <EditPencil type="council" to="/admin/council" />
                </div>
                {active.intro && (
                  <p className="max-w-container text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
                    {active.intro}
                  </p>
                )}
              </div>
            </div>

            {/* 구성원 그리드 */}
            <div className="flex flex-col gap-16">
              <h3 className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
                구성원
              </h3>
              {members.length === 0 ? (
                <p className="py-32 font-mono text-caption-m text-text-meta">
                  {EMPTY_TEXT}
                </p>
              ) : (
                <ul className="grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-4">
                  {members.map((member) => (
                    <li
                      key={`${member.name}-${member.role ?? ''}`}
                      className="flex min-w-0 flex-col gap-4 rounded-md border border-border-subtle bg-bg-elev px-16 py-12"
                    >
                      <span className="text-body-m font-semibold text-text-pri md:text-body-d">
                        {member.name}
                      </span>
                      {(member.role || member.part) && (
                        <span className="font-mono text-caption-m text-text-sec">
                          {member.role ?? member.part}
                        </span>
                      )}
                      {member.majors && (
                        <span className="text-caption-m text-text-meta">
                          {member.majors}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default Council
