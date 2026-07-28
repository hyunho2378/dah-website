// /students/achievements — 학생 성과 (F6: 성좌 폐기 → 연도별 원문 리스트)
// PageBanner + 연도 앵커 네비(존재 연도만) + 연도별 수직 리스트.
// 항목: 제목(title 원문) + 본문(desc 원문). (M3-4: desc에 이미 담긴 수상자 중복 표시 블록 제거)
// API: GET /content/achievement 우선, offline·오류 시 src/data/achievements 폴백.
// 원문 보존 원칙 — 조사 오류 등 일절 수정하지 않고 데이터 원문 그대로 렌더.
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import Accent from '../../components/common/Accent'
import { DragHandle, useDragSort } from '../../components/common/DragHandle'
import InlineEditBar from '../../components/content/InlineEditBar'
import { EditPencil } from '../../components/content/EditControls'
import { useApi, api } from '../../hooks/useApi'
import { useContentVisibility } from '../../hooks/useContentVisibility'
import { useTitle } from '../../hooks/useTitle'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../i18n/LangContext'
import { achievements } from '../../data/achievements'

// 연도 판정 — normalize와 드래그 정렬(원본 행 그룹화)이 같은 규칙을 쓰도록 분리
function yearOf(post) {
  const body = post.body && typeof post.body === 'object' ? post.body : {}
  const year = Number(
    post.year ?? body.year ?? post.tag ?? (post.event_start ?? post.created_at ?? '').slice(0, 4)
  )
  return Number.isFinite(year) && year > 0 ? year : null
}

// 성과 원문(achievements_SOURCE) 시드: title_ko + body{desc,descEn,year} + title_en. 정적 폴백은
// title/titleEn/desc/descEn 평면. EN 모드는 영문 대역 우선(없으면 국문 폴백). 원문 그대로 렌더.
function normalize(post, isEn) {
  const body = post.body && typeof post.body === 'object' ? post.body : {}
  const year = yearOf(post)
  const titleKo = post.title_ko ?? post.title ?? ''
  const titleEn = post.title_en ?? post.titleEn ?? null
  const descKo = post.desc ?? body.desc ?? null
  const descEn = post.descEn ?? body.descEn ?? null
  return {
    id: String(post.id),
    year,
    title: isEn ? titleEn || titleKo : titleKo,
    url: post.external_url ?? post.url ?? null,
    desc: isEn ? descEn || descKo : descKo,
    awardees: body.awardees ?? post.awardees ?? null,
    awardeesEn: body.awardeesEn ?? post.awardeesEn ?? null,
  }
}

// 수상자 이름 강조용 — 정규식 특수문자 이스케이프(부분·과매칭 방지)
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// 본문(desc/descEn) 안에서 수상자 이름과 정확히 일치하는 부분 문자열만 <strong>으로 감싼다.
// 본문 원문은 변형하지 않고, 전체 이름 단위로만 매칭(긴 이름 우선 정렬로 '김'이 '김소연' 안에서
// 잡히는 과매칭 방지). 이름 이외 문자(줄바꿈 등)는 split 후 그대로 남아 whitespace-pre-line 보존.
function highlightNames(text, names) {
  if (!text || !names.length) return text
  const pattern = new RegExp(
    `(${names
      .slice()
      .sort((a, b) => b.length - a.length)
      .map(escapeRegExp)
      .join('|')})`,
    'g'
  )
  return text.split(pattern).map((part, i) =>
    names.includes(part) ? (
      // A3(36_ACCENT_POLISH): 수상자 이름 강조를 화이트 → purple.primary(#815FD7)로.
      // 국문·영문 동일 적용. 본문 나머지는 text.sec 유지(CI 4.4 보라 본문 금지 — 이름 단위 포인트만).
      <strong key={i} className="font-bold text-purple-primary">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

function AwardItem({ item, isEn, sorting = false }) {
  const names = ((isEn ? item.awardeesEn : item.awardees) || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return (
    <div className="flex flex-col gap-8 py-24">
      <div className="flex items-start justify-between gap-12">
        {sorting && <DragHandle />}
        <h3 className="min-w-0 flex-1 text-body-l-m font-bold leading-snug text-text-pri md:text-body-l-d">
          {item.title}
        </h3>
        <EditPencil
          type="achievement"
          to={`/admin/posts/achievement/${item.id}/edit`}
        />
      </div>
      {item.desc && (
        <p className="whitespace-pre-line break-keep text-body-m leading-relaxed text-text-sec md:text-body-d">
          {highlightNames(item.desc, names)}
        </p>
      )}
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 font-mono text-caption-m text-text-sec transition-colors duration-fast ease-out hover:text-text-pri"
        >
          대회 페이지
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
    </div>
  )
}

// Y3-4(33_PHASE18): 연도 섹션 — 같은 연도 안에서만 6점 핸들 드래그로 순서를 바꾼다.
// useDragSort는 훅이라 연도마다 독립 인스턴스가 필요해 섹션을 컴포넌트로 분리했다.
function YearSection({ year, rows, isEn, sorting, onReorder }) {
  const { dragIndex, overIndex, rowProps } = useDragSort((from, to) => onReorder(year, from, to))

  return (
    <section id={`year-${year}`} aria-label={`${year}년 실적`} className="scroll-mt-96">
      <h2 className="border-b border-border-strong pb-12 text-h2-m font-bold md:text-h2-d">
        <Accent kind="proper">{year}</Accent>
      </h2>
      <ul className="divide-y divide-border-subtle">
        {rows.map((row, index) => (
          <li
            key={row.id}
            className={`transition-opacity duration-fast ${
              dragIndex === index ? 'opacity-40' : ''
            } ${
              overIndex === index && dragIndex !== null && dragIndex !== index
                ? 'bg-glass-bg'
                : ''
            }`}
            {...(sorting ? rowProps(index) : {})}
          >
            <AwardItem item={normalize(row, isEn)} isEn={isEn} sorting={sorting} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function Achievements() {
  const { lang, t } = useLang()
  useTitle(t('titles.achievements'))
  const isEn = lang === 'en'
  // G1.3: 페이지네이션 없이 전량 노출 — 서버 기본 12건 상한 회피
  const { data, error, offline } = useApi('/content/achievement', {
    params: { pageSize: 100 },
  })

  const useFallback = offline || (error && !data)

  // Y3-4: 드래그 정렬을 위해 원본 행(sort 포함)을 상태로 보관한다.
  const [rows, setRows] = useState([])
  const [sorting, setSorting] = useState(false)
  useEffect(() => {
    const source = useFallback ? achievements : data?.items ?? []
    setRows(source.filter((p) => yearOf(p) !== null))
  }, [data, useFallback])

  const years = [...new Set(rows.map((p) => yearOf(p)))].sort((a, b) => b - a)

  // Y3-3: 대시보드에서 비공개로 두면 일반 방문자에겐 목록을 렌더하지 않는다(편집 권한자는 유지)
  const { isPublic } = useContentVisibility()
  const { canEdit } = useAuth()
  const hidden = !isPublic('achievement') && !canEdit('achievement')

  // 같은 연도 안 재정렬 — 그 연도 자리에 새 순서를 그대로 채워 넣고 sort를 0..N으로 저장한다.
  const reorder = (year, from, to) => {
    const list = rows.filter((p) => yearOf(p) === year)
    const next = [...list]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    const withSort = next.map((p, i) => ({ ...p, sort: i }))
    withSort.forEach((p, i) => {
      if (list[i]?.id !== p.id || list[i]?.sort !== i) {
        api.put(`/admin/content/achievement/${p.id}`, { sort: i }).catch(() => {})
      }
    })
    const queue = withSort[Symbol.iterator]()
    setRows((prev) => prev.map((p) => (yearOf(p) === year ? queue.next().value : p)))
  }

  return (
    <>
      <PageBanner
        titleKo="학생 성과"
        titleEn="ACHIEVEMENTS"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.activities') },
          { label: t('titles.achievements'), to: '/students/achievements' },
        ]}
        nebulaX="58%"
        nebulaY="12%"
      />
      <Container as="section" className="py-section-m lg:py-section-d">
        {offline && (
          <p className="mb-16 font-mono text-caption-m text-text-meta">
            {t('common.offline')}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-end gap-16">
          <InlineEditBar
            type="achievement"
            addTo="/admin/posts/achievement/new"
            manageTo="/admin/posts/achievement"
            sortable={!useFallback}
            sorting={sorting}
            onToggleSort={() => setSorting((s) => !s)}
          />
        </div>

        {hidden ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.empty')}</p>
        ) : rows.length === 0 ? (
          <p className="py-64 font-mono text-caption-m text-text-meta">{t('common.empty')}</p>
        ) : (
          <>
            {/* 연도 앵커 네비 — 존재하는 연도만 */}
            <nav
              aria-label={t('aria.yearNav')}
              className="mt-24 flex flex-wrap gap-8 border-y border-border-subtle py-16"
            >
              {years.map((year) => (
                <a
                  key={year}
                  href={`#year-${year}`}
                  className="rounded-sm border border-border-subtle px-12 py-4 font-mono text-caption-m text-text-sec transition-colors duration-fast ease-out hover:border-border-strong hover:text-text-pri"
                >
                  {year}
                </a>
              ))}
            </nav>

            {/* 연도별 수직 리스트 */}
            <div className="mt-48 flex flex-col gap-48">
              {years.map((year) => (
                <YearSection
                  key={year}
                  year={year}
                  rows={rows.filter((p) => yearOf(p) === year)}
                  isEn={isEn}
                  sorting={sorting}
                  onReorder={reorder}
                />
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  )
}

export default Achievements
