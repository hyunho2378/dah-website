import PageHero from '../components/common/PageHero'
import SectionLabel from '../components/common/SectionLabel'
import Reveal from '../components/common/Reveal'
import Tag from '../components/common/Tag'
import { useTitle } from '../hooks/useTitle'
import { tracks, codeSharing } from '../data/tracks'
import { curriculum } from '../data/curriculum'
import { motion } from '../styles/tokens'

const CONTAINER =
  'mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide'

// 다이어그램 레이아웃 계산 헬퍼 — 렌더 좌표 데이터만 반환 (컴포넌트 아님)
// 색·텍스트는 렌더 측에서 border/text 토큰으로만 지정한다
function buildDiagramLayout(lanes, items) {
  const W = 960
  const colW = W / 4
  const axisH = 56
  const labelH = 32
  const rowH = 34
  const lanePad = 16
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
          h: rowH - 8,
        })
      })
    })
    laneBoxes.push({ label: lane.label, top, blocks })
    y = top + labelH + maxRows * rowH + lanePad
  }
  return { W, H: y, colW, axisH, lanes: laneBoxes }
}

// Tracks 전용 조각 — 트랙 상세 블록 (COMPONENTS.md 4절)
// 앵커 id="track-1..3", 과목 행은 mono "n.m" 넘버 + 과목명 (PATTERNS.md P2)
function TrackDetail({ track, courses }) {
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
          {track.name}
        </h2>
        <p className="mt-16 max-w-[640px] text-body-l-m leading-relaxed text-text-sec md:mt-24 md:text-body-l-d">
          {track.summary}
        </p>
      </Reveal>

      {courses.length > 0 && (
        <div className="mt-48 md:mt-64">
          <p className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
            관련 교과목
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

// Tracks 전용 조각 — 코드쉐어링 (COMPONENTS.md 4절)
// 정의 + 승인 절차 4단계 넘버 리스트 + 인정 학과 Tag 랩 (data/tracks.js codeSharing에서 map)
function CodeSharing() {
  // 인정 학과 목록에 붙는 학점 상한 안내 — 원문 '학점인정형 코드쉐어링' 항목(types 3번째)
  const limitNote = codeSharing.types?.[2]?.detail ?? ''

  return (
    <section
      id="codesharing"
      className={`${CONTAINER} scroll-mt-header pt-section-m md:pt-section-d`}
    >
      <Reveal>
        <SectionLabel index="05" text="CODE SHARING" />
        <h2 className="mt-24 text-h1-m font-extrabold leading-tight tracking-display text-text-pri md:mt-32 md:text-h1-d">
          코드쉐어링
        </h2>
        <p className="mt-16 max-w-[640px] text-body-l-m leading-relaxed text-text-sec md:mt-24 md:text-body-l-d">
          {codeSharing.definition}
        </p>
        <p className="mt-12 max-w-[640px] text-body-m leading-relaxed text-text-sec md:text-body-d">
          {codeSharing.note}
        </p>
      </Reveal>

      {codeSharing.steps.length > 0 && (
        <div className="mt-48 md:mt-64">
          <p className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
            승인 절차
          </p>
          <ol className="mt-16 grid gap-24 border-t border-border-subtle pt-24 md:grid-cols-4 md:gap-32">
            {codeSharing.steps.map((step, i) => (
              <Reveal key={step} delay={i * motion.stagger} as="li">
                <p className="font-mono text-small-m text-text-pri md:text-small-d">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="mt-8 text-body-m leading-relaxed text-text-sec md:text-body-d">
                  {step}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      )}

      {codeSharing.departments.length > 0 && (
        <div className="mt-48 md:mt-64">
          <p className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
            인정 학과 {codeSharing.departments.length}
          </p>
          {limitNote && (
            <p className="mt-12 max-w-[640px] text-body-m leading-relaxed text-text-sec md:text-body-d">
              {limitNote}
            </p>
          )}
          <div className="mt-24 flex flex-wrap gap-8 md:gap-12">
            {codeSharing.departments.map((dept) => (
              <Tag key={dept}>{dept}</Tag>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function Tracks() {
  useTitle('트랙·커리큘럼')

  const lanes = [
    ...tracks.map((t) => ({ key: t.id, label: t.name })),
    { key: 'common', label: '공통' },
  ]
  const diagram = buildDiagramLayout(lanes, curriculum)

  return (
    <>
      <PageHero eyebrow="TRACKS" titleKr="트랙·커리큘럼" />

      <div className="pb-section-m md:pb-section-d">
        {/* TRACK 01~03 상세 블록 */}
        {tracks.map((track) => (
          <TrackDetail
            key={track.id}
            track={track}
            courses={curriculum.filter((c) => c.track === track.id)}
          />
        ))}

        {/* 04 4년 커리큘럼 다이어그램 — 인라인 SVG, 학년·학기 축 */}
        {curriculum.length > 0 && (
          <section className={`${CONTAINER} pt-section-m md:pt-section-d`}>
            <Reveal>
              <SectionLabel index="04" text="CURRICULUM" />
              <h2 className="mt-24 text-h1-m font-extrabold leading-tight tracking-display text-text-pri md:mt-32 md:text-h1-d">
                4년 커리큘럼
              </h2>
            </Reveal>

            <div className="mt-48 md:mt-64">
              {/* md 이상: SVG 다이어그램 (색은 border/text 토큰만) */}
              <svg
                viewBox={`0 0 ${diagram.W} ${diagram.H}`}
                role="img"
                aria-label="1학년부터 4학년까지 학년과 학기 축으로 배치한 트랙별 커리큘럼 다이어그램"
                className="hidden h-auto w-full md:block"
              >
                {/* 학년·학기 축 */}
                {[0, 1, 2, 3].map((i) => (
                  <g key={i}>
                    <text
                      x={i * diagram.colW + diagram.colW / 2}
                      y="20"
                      textAnchor="middle"
                      fontSize="14"
                      fill="currentColor"
                      className="font-mono text-text-pri"
                    >
                      {`${i + 1}학년`}
                    </text>
                    <text
                      x={i * diagram.colW + diagram.colW / 4}
                      y="42"
                      textAnchor="middle"
                      fontSize="10"
                      fill="currentColor"
                      className="font-mono text-text-meta"
                    >
                      1학기
                    </text>
                    <text
                      x={i * diagram.colW + (diagram.colW * 3) / 4}
                      y="42"
                      textAnchor="middle"
                      fontSize="10"
                      fill="currentColor"
                      className="font-mono text-text-meta"
                    >
                      2학기
                    </text>
                    {/* 학기 경계: 점선 헤어라인 */}
                    <line
                      x1={i * diagram.colW + diagram.colW / 2}
                      y1={diagram.axisH - 8}
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
                        y1="8"
                        x2={i * diagram.colW}
                        y2={diagram.H}
                        stroke="currentColor"
                        className="text-border-strong"
                      />
                    )}
                  </g>
                ))}

                {/* 트랙 레인 + 과목 블록 */}
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
                      y={lane.top + 20}
                      fontSize="12"
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
                          rx="6"
                          fill="none"
                          stroke="currentColor"
                          className="text-border-subtle"
                        />
                        <text
                          x={b.x + 12}
                          y={b.y + b.h / 2 + 4}
                          fontSize="10"
                          fill="currentColor"
                        >
                          <tspan className="font-mono text-text-meta">
                            {b.code}
                          </tspan>
                          <tspan dx="8" className="font-sans text-text-sec">
                            {b.name}
                          </tspan>
                        </text>
                      </g>
                    ))}
                  </g>
                ))}
              </svg>

              {/* md 미만: 학년별 리스트 폴백 */}
              <div className="md:hidden">
                {[1, 2, 3, 4].map((year) => {
                  const items = curriculum.filter((c) => c.year === year)
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
                            <span className="text-body-m text-text-pri">
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

        {/* 05 코드쉐어링 */}
        <CodeSharing />
      </div>
    </>
  )
}

export default Tracks
