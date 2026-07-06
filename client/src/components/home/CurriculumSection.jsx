import SectionLabel from '../common/SectionLabel'
import Reveal from '../common/Reveal'
import ArrowLink from '../common/ArrowLink'
import { curriculum } from '../../data/curriculum'
import { tracks } from '../../data/tracks'
import { colors, layout } from '../../styles/tokens.js'

// SVG 로드맵 지오메트리 (viewBox 좌표계, 화면 px 아님)
const VB_W = 960
const LABEL_W = 150
const CHART_W = VB_W - LABEL_W
const YEAR_W = CHART_W / 4
const LANE_H = 104
const BLOCK_H = 48
const TOP = 32
const YEARS = [1, 2, 3, 4]

function truncate(name, max = 13) {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name
}

function CurriculumSection() {
  if (!curriculum?.length) return null

  // 트랙 레인별 대표 과목: 학년당 1과목, 레인당 최대 3개 (총 8~10개 유지)
  const lanes = (tracks || []).map((t) => {
    const seen = new Set()
    const courses = []
    curriculum
      .filter((c) => c.track === t.id)
      .sort((a, b) => a.year - b.year)
      .forEach((c) => {
        if (!seen.has(c.year) && courses.length < 3) {
          seen.add(c.year)
          courses.push(c)
        }
      })
    return { track: t, courses }
  })

  const vbH = TOP + lanes.length * LANE_H + 1
  const years = YEARS.filter((y) => curriculum.some((c) => c.year === y))

  return (
    <section className="py-section-m lg:py-section-d">
      <div className="mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide">
        <Reveal>
          <SectionLabel index="03" text="4년의 설계" />
          <h2 className="mt-24 max-w-2xl text-h1-m font-extrabold leading-snug tracking-display text-text-pri lg:text-h1-d">
            1학년 입문부터 4학년 캡스톤까지
          </h2>
        </Reveal>

        {lanes.some((l) => l.courses.length > 0) && (
          <svg
            viewBox={`0 0 ${VB_W} ${vbH}`}
            width="100%"
            role="img"
            aria-label="트랙별 4년 커리큘럼 로드맵"
            className="mt-64 hidden h-auto w-full md:block"
          >
            {YEARS.map((y) => (
              <text
                key={y}
                x={LABEL_W + YEAR_W * (y - 0.5)}
                y={20}
                textAnchor="middle"
                fill={colors.text.meta}
                className="font-mono text-caption-m"
              >
                {`${y}학년`}
              </text>
            ))}

            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1={LABEL_W + YEAR_W * i}
                y1={TOP}
                x2={LABEL_W + YEAR_W * i}
                y2={vbH - 1}
                stroke={colors.border.subtle}
              />
            ))}

            {lanes.map(({ track, courses }, i) => {
              const laneY = TOP + i * LANE_H
              return (
                <g key={track.id}>
                  <line x1={0} y1={laneY} x2={VB_W} y2={laneY} stroke={colors.border.subtle} />
                  <text
                    x={0}
                    y={laneY + LANE_H / 2 + 4}
                    fill={colors.text.sec}
                    className="text-small-m"
                  >
                    {track.name}
                  </text>
                  {courses.map((c) => {
                    const bx = LABEL_W + YEAR_W * (c.year - 1) + 12
                    const by = laneY + (LANE_H - BLOCK_H) / 2
                    return (
                      <g key={c.code}>
                        <rect
                          x={bx}
                          y={by}
                          width={YEAR_W - 24}
                          height={BLOCK_H}
                          rx={layout.radius.sm}
                          fill={colors.bg.panel}
                          stroke={colors.border.subtle}
                        />
                        <text
                          x={bx + 14}
                          y={by + 20}
                          fill={colors.text.meta}
                          className="font-mono text-caption-m"
                        >
                          {c.code}
                        </text>
                        <text
                          x={bx + 14}
                          y={by + 38}
                          fill={colors.text.sec}
                          className="text-caption-m"
                        >
                          {truncate(c.name)}
                        </text>
                      </g>
                    )
                  })}
                </g>
              )
            })}
            <line x1={0} y1={vbH - 1} x2={VB_W} y2={vbH - 1} stroke={colors.border.subtle} />
          </svg>
        )}

        <div className="mt-64 md:hidden">
          {years.map((y) => (
            <div key={y} className="border-t border-border-subtle py-24 last:border-b">
              <p className="font-mono text-label-m uppercase tracking-label text-text-meta">
                {`${y}학년`}
              </p>
              <ul className="mt-16 flex flex-col gap-12">
                {curriculum
                  .filter((c) => c.year === y)
                  .map((c) => (
                    <li key={c.code} className="flex items-baseline gap-12">
                      <span className="shrink-0 font-mono text-caption-m text-text-meta">
                        {c.code}
                      </span>
                      <span className="text-body-m text-text-pri">{c.name}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-48">
          <ArrowLink href="/tracks">전체 커리큘럼</ArrowLink>
        </div>
      </div>
    </section>
  )
}

export default CurriculumSection
