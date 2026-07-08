// /students/council — 운영위원회 (T4 아카이브형: 기수별 아카이브)
// 기수 탭(최신 기본) → 로고·기수명·소개·구성원 그리드. 기수가 늘어도 동일 템플릿 보존.
import { useState } from 'react'
import PageBanner from '../../components/layout/PageBanner'
import ImageFrame from '../../components/common/ImageFrame'
import Container from '../../components/layout/Container'
import { AddButton, EditPencil } from '../../components/content/EditControls'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'
import { councils } from '../../data/council'

const toMember = (member) =>
  typeof member === 'string' ? { name: member } : member

// J5: EN 모드 소속 전공 라벨 — '디지털인문예술[전공]' 접두만 풀네임으로 치환(뒤 숫자 보존).
// 타 학과(사회학과 등)는 EN 대역 원문이 없어 국문 그대로 둔다.
function majorsEn(majors) {
  if (!majors) return majors
  return majors.replace(/^디지털인문예술( ?전공)?/, 'Digital Arts & Humanities')
}

// J6: 연속한 같은 부서(role)를 한 행으로 묶는다 — 원문 순서 보존
function groupByRole(members) {
  const rows = []
  for (const m of members) {
    const last = rows[rows.length - 1]
    if (last && last.role === (m.role ?? '')) last.members.push(m)
    else rows.push({ role: m.role ?? '', members: [m] })
  }
  return rows
}

// H3 폴백: data/council.js 원문(councils) — 2026(현 LUCID) 맨 앞, 이후 연도 내림차순
const FALLBACK_ITEMS = councils.map((c) => ({
  id: `council-${c.year}`,
  name: c.title,
  titleEn: c.titleEn,
  year_label: String(c.year),
  intro: c.intro,
  members: c.members,
}))

function Council() {
  const { lang, t } = useLang()
  useTitle(t('titles.council'))
  // G1.3: 페이지네이션 UI 없는 목록은 전량 요청(서버 기본 12건 상한 회피)
  const { data, loading, error, offline } = useApi('/content/council', {
    params: { pageSize: 100 },
  })
  const remote = data?.items ?? []
  // H3: 연도(year_label) 내림차순 — 2026(현 운영위)이 항상 맨 앞
  const items =
    remote.length > 0
      ? [...remote].sort(
          (a, b) => Number(b.year_label ?? 0) - Number(a.year_label ?? 0)
        )
      : FALLBACK_ITEMS

  const [selectedId, setSelectedId] = useState(null)
  const active = items.find((c) => c.id === selectedId) ?? items[0] ?? null
  const members = Array.isArray(active?.members) ? active.members.map(toMember) : []
  // J5: EN 모드 소개문 — 원격 행에는 introEn이 없어 정적 원문(councils)을 연도로 매칭
  const staticMatch = councils.find((c) => String(c.year) === String(active?.year_label))
  const introText =
    lang === 'en' ? staticMatch?.introEn ?? active?.intro : active?.intro
  // J5: EN 모드 기수 타이틀 — titleEn(연도 포함) 우선, 없으면 국문 합성으로 폴백
  const composedTitle = [active?.year_label, active?.name].filter(Boolean).join(' ')
  const titleText =
    lang === 'en'
      ? staticMatch?.titleEn ?? active?.titleEn ?? composedTitle
      : composedTitle

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
                  className={`-mb-px cursor-pointer border-b-2 pb-8 font-mono transition-colors duration-fast ease-out ${
                    c === items[0]
                      ? 'text-body-m font-bold md:text-body-d'
                      : 'text-small-m md:text-small-d'
                  } ${
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
            {/* T4 헤더 (K2-4): 로고(박스 없이 이미지만, 1.5배 h-144) + 타이틀 한 줄 수직 중앙 정렬.
                타이틀은 "{연도} {기수라벨 포함 이름}" 한 줄 합성. 로고 없으면 미표시(빈 박스 금지). */}
            <div className="flex min-w-0 flex-col gap-24">
              <div className="flex min-w-0 flex-wrap items-center gap-24 md:gap-32">
                {active.logo_url &&
                  (active.has_bg ? (
                    // Q4: 배경 토글 on — 투명 PNG를 중성 배경 프레임 위에 표시(검은 배경에서 안 보이던 문제 해결)
                    <div className="w-[144px] shrink-0 md:w-[200px]">
                      <ImageFrame
                        src={active.logo_url}
                        alt={`${active.name} 로고`}
                        ratio="3/2"
                        contain
                        bg
                      />
                    </div>
                  ) : (
                    <img
                      src={active.logo_url}
                      alt={`${active.name} 로고`}
                      loading="lazy"
                      className="h-96 w-auto shrink-0 object-contain md:h-144"
                    />
                  ))}
                <div className="flex min-w-0 flex-wrap items-center gap-12">
                  <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
                    {titleText}
                  </h2>
                  <EditPencil type="council" to="/admin/council" />
                </div>
              </div>
              {introText && (
                <p className="max-w-[960px] whitespace-pre-line text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
                  {introText}
                </p>
              )}
            </div>

            {/* J6: 구성 — eyebrow + 제목 + 부서별 행 리스트(좌 라벨 / 우 이름, 헤어라인) */}
            <div className="flex flex-col gap-24">
              <div>
                <p className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
                  COMMITTEE
                </p>
                <h3 className="mt-12 text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
                  {t('council.compositionTitle')}
                </h3>
              </div>
              {members.length === 0 ? (
                <p className="py-32 font-mono text-caption-m text-text-meta">
                  {t('common.empty')}
                </p>
              ) : (
                <dl className="border-t border-border-subtle">
                  {groupByRole(members).map((row) => (
                    <div
                      key={row.role}
                      className="flex flex-col gap-8 border-b border-border-subtle py-16 md:flex-row md:items-baseline md:gap-24 md:py-20"
                    >
                      <dt className="w-128 shrink-0 font-mono text-small-m text-text-meta md:text-small-d">
                        {row.role}
                      </dt>
                      <dd className="flex min-w-0 flex-wrap gap-x-24 gap-y-8">
                        {row.members.map((member) => (
                          <span
                            key={`${member.name}-${member.majors ?? ''}`}
                            className="text-body-m text-text-pri md:text-body-d"
                          >
                            {lang === 'en' ? member.nameEn ?? member.name : member.name}
                            {member.majors && (
                              <span className="ml-8 text-small-m text-text-meta md:text-small-d">
                                ({lang === 'en' ? majorsEn(member.majors) : member.majors})
                              </span>
                            )}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        )}
      </Container>
    </>
  )
}

export default Council
