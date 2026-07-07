// /students/council — 운영위원회 (T4 아카이브형: 기수별 아카이브)
// 기수 탭(최신 기본) → 로고·기수명·소개·구성원 그리드. 기수가 늘어도 동일 템플릿 보존.
import { useState } from 'react'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import { AddButton, EditPencil } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'
import { lucid, councilHistory } from '../../data/council'

const toMember = (member) =>
  typeof member === 'string' ? { name: member } : member

// F7 폴백: 서버 오프라인·빈 응답 시 data/council.js 원문을 기수 아카이브로 렌더.
// LUCID(현 운영위, 2026) + 역대 학생회(councilHistory)를 연도 내림차순으로.
const FALLBACK_ITEMS = [
  {
    id: 'lucid',
    name: lucid.title,
    year: 2026,
    year_label: '2026',
    intro: lucid.intro,
    members: (lucid.committee ?? []).flatMap((c) =>
      Array.isArray(c.members)
        ? c.members.map((m) => ({ name: m, role: c.role }))
        : [{ name: c.name, role: c.role, majors: c.dept }]
    ),
  },
  ...(councilHistory ?? []).map((h) => ({
    id: `council-${h.year}`,
    name: h.name ? `${h.ordinal} ${h.name}` : h.ordinal,
    year: h.year,
    year_label: String(h.year),
    members: [
      h.president ? { name: h.president, role: '회장' } : null,
      h.vicePresident ? { name: h.vicePresident, role: '부회장' } : null,
    ].filter(Boolean),
  })),
]

function Council() {
  const { t } = useLang()
  useTitle(t('titles.council'))
  // G1.3: 페이지네이션 UI 없는 목록은 전량 요청(서버 기본 12건 상한 회피)
  const { data, loading, error, offline } = useApi('/content/council', {
    params: { pageSize: 100 },
  })
  const remote = data?.items ?? []
  // 원격 데이터 있으면 ordinal 내림차순, 없으면 원문 폴백(연도 내림차순)
  const items =
    remote.length > 0
      ? [...remote].sort((a, b) => (b.ordinal ?? 0) - (a.ordinal ?? 0))
      : FALLBACK_ITEMS

  const [selectedId, setSelectedId] = useState(null)
  const active = items.find((c) => c.id === selectedId) ?? items[0] ?? null
  const members = Array.isArray(active?.members) ? active.members.map(toMember) : []

  return (
    <>
      <PageBanner
        titleKo="운영위원회"
        titleEn="COUNCIL"
        breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.activities') }, { label: t('titles.council'), to: '/students/council' }]}
        nebulaX="24%"
        nebulaY="40%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        <div className="flex flex-wrap items-center justify-between gap-16">
          {/* 기수 탭 — 최신 기수 기본 활성 */}
          <div
            role="group"
            aria-label={t('aria.termSelect')}
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
                  {c.year_label ?? (c.ordinal ? `${c.ordinal}기` : c.name)}
                </button>
              )
            })}
          </div>
          <AddButton type="council" to="/admin/council" />
        </div>

        {loading ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.loading')}</p>
        ) : !active ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">
            {error && !offline ? t('common.error') : t('common.empty')}
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
                {t('sections.members')}
              </h3>
              {members.length === 0 ? (
                <p className="py-32 font-mono text-caption-m text-text-meta">
                  {t('common.empty')}
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
      </Container>
    </>
  )
}

export default Council
