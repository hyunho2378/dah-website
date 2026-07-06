import PageBanner from '../components/layout/PageBanner'
import SectionLabel from '../components/common/SectionLabel'
import Reveal from '../components/common/Reveal'
import ArrowLink from '../components/common/ArrowLink'
import { EditPencil } from '../components/content/EditControls'
import { useTitle } from '../hooks/useTitle'
import { useLang } from '../i18n/LangContext'
import { tracks } from '../data/tracks'
import { curriculum } from '../data/curriculum'
import { motion } from '../styles/tokens'

// 교육과정 v2 (10_IA_V2 2절 /curriculum) — Tracks.jsx 대체 페이지.
// 트랙 표시명 v2(i18n 매핑), 앵커 id=track-1..3 유지, 로드맵 압축(공통기초 최상단 고정 + 한눈 뷰).

const CONTAINER =
  'mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide'

// 다이어그램 레이아웃 계산 헬퍼 — Tracks.jsx 빌더 이식 + v2 압축(행높이·패딩 축소, 한눈 뷰)
// 렌더 좌표 데이터만 반환. 색·텍스트는 렌더 측에서 border/text 토큰으로만 지정한다.
function buildDiagramLayout(lanes, items) {
  const W = 960
  const colW = W / 4
  const axisH = 40 // v1 56 → 압축
  const labelH = 24 // v1 32 → 압축
  const rowH = 24 // v1 34 → 압축(세로 밀도 상향)
  const lanePad = 12 // v1 16 → 압축
  let y = axisH
  const laneBoxes = []
  for (const lane of lanes) {
    const byYear = [1, 2, 3, 4].map((year) =>
      items.filter((c) => c.track === lane.key && c.year === year)
    )
    const maxRows = Math.max(...byYear.map((list) => list.length))
    if (maxRows === 0) continue
    const top = y
    const blocks = []
    byYear.forEach((yearItems, yi) => {
      yearItems.forEach((course, ri) => {
        blocks.push({
          code: course.code,
          name: course.name,
          x: yi * colW + 10,
          y: top + labelH + ri * rowH,
          w: colW - 20,
          h: rowH - 6,
        })
      })
    })
    laneBoxes.push({ label: lane.label, top, blocks })
    y = top + labelH + maxRows * rowH + lanePad
  }
  return { W, H: y, colW, axisH, lanes: laneBoxes }
}

// 트랙 상세 블록 — Tracks.jsx TrackDetail 이식. 표시명만 v2(i18n), 앵커·과목 행 문법 유지
function TrackDetail({ track, displayName, courses, coursesLabel }) {
  return (
    <section
      id={track.id}
      className={`${CONTAINER} scroll-mt-header pt-section-m md:pt-section-d`}
    >
      <Reveal>
        <p className="font-mono text-label-m uppercase tracking-label text-text-sec md:text-label-d">
          {track.no}
        </p>
        <h2 className="mt-16 text-h1-m font-extrabold leading-tight tracking-display text-text-pri md:mt-24 md:text-h1-d">
          {displayName}
        </h2>
        <p className="mt-16 max-w-[640px] text-body-l-m leading-relaxed text-text-sec md:mt-24 md:text-body-l-d">
          {track.summary}
        </p>
      </Reveal>

      {courses.length > 0 && (
        <div className="mt-48 md:mt-64">
          <p className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
            {coursesLabel}
          </p>
          <ul className="mt-16 border-t border-border-subtle">
            {courses.map((course) => (
              <li
                key={course.code}
                className="flex items-baseline gap-16 border-b border-border-subtle py-12 md:gap-24 md:py-16"
              >
                <span className="w-40 shrink-0 font-mono text-small-m text-text-meta md:text-small-d">
                  {course.code}
                </span>
                <span className="text-body-m text-text-pri md:text-body-d">
                  {course.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function Curriculum() {
  const { t } = useLang()
  useTitle(t('titles.curriculum'))

  // 공통기초(common) 레인 최상단 고정(13_CMS_SPEC 1절 교과목 행) → 트랙 3 순서
  const lanes = [
    { key: 'common', label: t('tracks.common') },
    ...tracks.map((track) => ({ key: track.id, label: t(`tracks.${track.id}`) })),
  ]
  const diagram = buildDiagramLayout(lanes, curriculum)

  return (
    <>
      <PageBanner
        titleKo="교육과정"
        titleEn="CURRICULUM"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.curriculum'), to: '/curriculum' },
        ]}
        nebulaX="65%"
        nebulaY="25%"
      />

      <div className="pb-section-m md:pb-section-d">
        {/* TRACK 01~03 상세 블록 (앵커 유지: /curriculum#track-n) */}
        {tracks.map((track) => (
          <TrackDetail
            key={track.id}
            track={track}
            displayName={t(`tracks.${track.id}`)}
            courses={curriculum.filter((c) => c.track === track.id)}
            coursesLabel={t('sections.relatedCourses')}
          />
        ))}

        {/* 04 4년 로드맵 — 압축 SVG: 공통기초 최상단, 4학년 4열 한눈 뷰(초과 스크롤 없음) */}
        {curriculum.length > 0 && (
          <section className={`${CONTAINER} pt-section-m md:pt-section-d`}>
            <Reveal>
              <SectionLabel index="04" text="ROADMAP" />
              <div className="mt-24 flex flex-wrap items-center gap-12 md:mt-32">
                <h2 className="text-h1-m font-extrabold leading-tight tracking-display text-text-pri md:text-h1-d">
                  {t('sections.roadmap')}
                </h2>
                {/* 교과목 편집(admin+, 13_CMS_SPEC 1절) — 비로그인 미렌더 */}
                <EditPencil type="curriculum" to="/admin/curriculum" />
              </div>
            </Reveal>

            <div className="mt-48 md:mt-64">
              {/* md 이상: SVG 다이어그램 (색은 border/text 토큰만, 절대폭 금지 — viewBox 반응형) */}
              <svg
                viewBox={`0 0 ${diagram.W} ${diagram.H}`}
                role="img"
                aria-label="공통기초를 최상단에 두고 1학년부터 4학년까지 학년 축으로 배치한 트랙별 교육과정 로드맵"
                className="hidden h-auto w-full md:block"
              >
                {/* 학년·학기 축 */}
                {[0, 1, 2, 3].map((i) => (
                  <g key={i}>
                    <text
                      x={i * diagram.colW + diagram.colW / 2}
                      y="16"
                      textAnchor="middle"
                      fontSize="13"
                      fill="currentColor"
                      className="font-mono text-text-pri"
                    >
                      {`${i + 1}학년`}
                    </text>
                    <text
                      x={i * diagram.colW + diagram.colW / 4}
                      y="32"
                      textAnchor="middle"
                      fontSize="9"
                      fill="currentColor"
                      className="font-mono text-text-meta"
                    >
                      1학기
                    </text>
                    <text
                      x={i * diagram.colW + (diagram.colW * 3) / 4}
                      y="32"
                      textAnchor="middle"
                      fontSize="9"
                      fill="currentColor"
                      className="font-mono text-text-meta"
                    >
                      2학기
                    </text>
                    {/* 학기 경계: 점선 헤어라인 */}
                    <line
                      x1={i * diagram.colW + diagram.colW / 2}
                      y1={diagram.axisH - 6}
                      x2={i * diagram.colW + diagram.colW / 2}
                      y2={diagram.H}
                      stroke="currentColor"
                      strokeDasharray="2 6"
                      className="text-border-subtle"
                    />
                    {/* 학년 경계: 실선 */}
                    {i > 0 && (
                      <line
                        x1={i * diagram.colW}
                        y1="6"
                        x2={i * diagram.colW}
                        y2={diagram.H}
                        stroke="currentColor"
                        className="text-border-strong"
                      />
                    )}
                  </g>
                ))}

                {/* 레인(공통기초 → 트랙 3) + 과목 블록 */}
                {diagram.lanes.map((lane) => (
                  <g key={lane.label}>
                    <line
                      x1="0"
                      y1={lane.top}
                      x2={diagram.W}
                      y2={lane.top}
                      stroke="currentColor"
                      className="text-border-subtle"
                    />
                    <text
                      x="0"
                      y={lane.top + 16}
                      fontSize="11"
                      fill="currentColor"
                      className="font-sans font-bold text-text-pri"
                    >
                      {lane.label}
                    </text>
                    {lane.blocks.map((b) => (
                      <g key={b.code}>
                        <rect
                          x={b.x}
                          y={b.y}
                          width={b.w}
                          height={b.h}
                          rx="5"
                          fill="none"
                          stroke="currentColor"
                          className="text-border-subtle"
                        />
                        <text
                          x={b.x + 10}
                          y={b.y + b.h / 2 + 3.5}
                          fontSize="10"
                          fill="currentColor"
                        >
                          <tspan className="font-mono text-text-meta">{b.code}</tspan>
                          <tspan dx="8" className="font-sans text-text-sec">
                            {b.name}
                          </tspan>
                        </text>
                      </g>
                    ))}
                  </g>
                ))}
              </svg>

              {/* md 미만: 학년별 리스트 폴백 (공통기초 먼저, 트랙 순) */}
              <div className="md:hidden">
                {[1, 2, 3, 4].map((year) => {
                  const items = lanes.flatMap((lane) =>
                    curriculum.filter((c) => c.year === year && c.track === lane.key)
                  )
                  if (items.length === 0) return null
                  return (
                    <div key={year} className="mt-40 first:mt-0">
                      <p className="font-mono text-label-m uppercase tracking-label text-text-meta">
                        {`${year}학년`}
                      </p>
                      <ul className="mt-12 border-t border-border-subtle">
                        {items.map((c) => (
                          <li
                            key={c.code}
                            className="flex items-baseline gap-16 border-b border-border-subtle py-12"
                          >
                            <span className="w-40 shrink-0 font-mono text-small-m text-text-meta">
                              {c.code}
                            </span>
                            <span className="min-w-0 text-body-m text-text-pri">
                              {c.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* 05 코드쉐어링 — /curriculum/codesharing 분리 페이지 안내 (10_IA_V2 2절) */}
        <section className={`${CONTAINER} pt-section-m md:pt-section-d`}>
          <Reveal delay={motion.stagger}>
            <SectionLabel index="05" text="CODE SHARING" />
            <h2 className="mt-24 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
              {t('sections.codesharing')}
            </h2>
            <div className="mt-24">
              <ArrowLink href="/curriculum/codesharing">{t('actions.detail')}</ArrowLink>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  )
}

export default Curriculum
