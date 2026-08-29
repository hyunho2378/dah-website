import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import SectionLabel from '../components/common/SectionLabel'
import Reveal from '../components/common/Reveal'
import { useTitle } from '../hooks/useTitle'
import { useLang } from '../i18n/LangContext'
import { history } from '../data/history'
import { motion } from '../styles/tokens'

// About (10_IA_V2 /about) — 개요 + 미션·비전 + 연혁 타임라인
// G12: 단조로운 텍스트 나열 → 리드 문단(크게, 행간 1.8, 최대 폭 720) + 소섹션 위계로 재배치.
//      새 콘텐츠 창작 없음 — 기존 원문 텍스트 재배치만.
// G16: 고정 페이지 영문 원고 — 국문 원문의 정보를 늘리거나 줄이지 않은 대역.
// KR 원문은 source_content.md 이관본 그대로(교정 제외 대상).
const COPY = {
  ko: {
    what: '한림대학교 디지털인문예술전공은 AI와 디지털 트랜스포메이션과 같이 글로벌 혁신을 주도하는 디지털·정보통신기술, 인간을 위한 가치를 구현하는 디자인, 그리고 사람과 사회를 이해하는 인문사회학적 소양이 융합하여 미래의 주역이 될 인재를 양성하는 새로운 융합 프로그램입니다.',
    whyStatement: '앞으로는 한 전문 영역의 경계를 넘어 다방면의 지식을 통섭할 수 있어야 합니다.',
    whyLead: '디지털인문예술에서는 개개인의 삶의 질을 높이고 사회의 발전을 이끌고자 인문사회학적 지성에 기술과 디자인을 융합하여 혁신을 창안하는 역량을 키우고자 합니다.',
    missionKr: '인간에 대한 깊은 이해와 창의적인 디지털 역량을 결합하여, 세상에 없던 새로운 가치를 창조한다.',
    whatKeywords: ['디지털·정보통신기술', '디자인', '인문사회학적 소양'],
    whyKeywords: ['인문사회학적 지성', '기술과 디자인', '혁신'],
    vision: [
      {
        title: '미래를 디자인하는 창의적 리더 양성',
        desc: '인문학적 통찰력과 예술적 상상력을 바탕으로 디지털 시대의 새로운 미래를 이끌어갈 인재를 키웁니다.',
      },
      {
        title: '가치 기반의 융합 지식 창출',
        desc: '기술과 인문학, 예술이 만나는 접점에서 사회적 가치를 창출하는 혁신적인 지식과 프로젝트를 만들어갑니다.',
      },
      {
        title: '지속가능한 디지털 생태계 구축',
        desc: '사람과 기술이 조화롭게 공존하는 지속가능한 디지털 환경을 조성하고, 모두에게 이로운 기술의 확산을 주도합니다.',
      },
    ],
  },
  en: {
    what: 'Digital Arts and Humanities at Hallym University is a new convergence program that unites digital and information technologies driving global innovation, such as AI and digital transformation, with design that realizes human-centered value and humanistic insight into people and society, educating students who will lead the future.',
    whyStatement: 'The coming era demands the ability to reach beyond a single specialty and integrate knowledge across disciplines.',
    whyLead: 'Digital Arts and Humanities builds the capacity to create innovation by fusing technology and design with humanistic intelligence, raising the quality of individual life and advancing society.',
    missionKr: 'We combine a deep understanding of people with creative digital capability to create value the world has not seen.',
    whatKeywords: ['digital and information technologies', 'human-centered value', 'humanistic insight'],
    whyKeywords: ['technology and design', 'humanistic intelligence'],
    vision: [
      {
        title: 'Educating creative leaders who design the future',
        desc: 'We educate students who will lead the new future of the digital era, grounded in humanistic insight and artistic imagination.',
      },
      {
        title: 'Creating value-driven convergent knowledge',
        desc: 'We build innovative knowledge and projects that create social value where technology, the humanities, and the arts meet.',
      },
      {
        title: 'Building a sustainable digital ecosystem',
        desc: 'We foster a sustainable digital environment where people and technology coexist in harmony, and lead the spread of technology that benefits everyone.',
      },
    ],
  },
}

const MISSION_EN = 'We combine human insight and digital creativity to build a better future.'

// 원문은 한 글자도 바꾸지 않고, 지정 구절만 <strong>으로 감싸 위계만 준다.
// 문자열을 자르지 않고 split의 캡처 그룹으로 나누므로 원문 순서·문자가 그대로 보존된다.
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function Highlight({ text, keywords = [] }) {
  if (!text || keywords.length === 0) return text
  const parts = text.split(new RegExp(`(${keywords.map(escapeRe).join('|')})`, 'g'))
  return parts.map((part, i) =>
    keywords.includes(part) ? (
      <strong key={i} className="font-semibold text-text-pri">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

// 레퍼런스 이식분: 큰 밑줄 헤딩 + What/Why 좌우 지그재그.
// 색·폰트는 우리 토큰 그대로 — 레퍼런스의 흰 배경·검정 텍스트는 가져오지 않는다.
// 밑줄은 CI 4.5 1단계 강조색(Primary Purple) 2px 한 줄로만 쓴다(면적 최소).
function SectionHeading({ children }) {
  return (
    <h2 className="inline-block border-b-2 border-purple-primary pb-12 text-h1-m font-extrabold leading-tight tracking-display text-text-pri md:text-h1-d">
      {children}
    </h2>
  )
}

// K2-8 미션·비전 아이콘 3종 — 모노크롬 스트로크(인라인 SVG, 장식용 aria-hidden)
// 공통: viewBox 24, fill none, stroke currentColor 1.5, 렌더 48px, 색은 텍스트 토큰만
const visionIconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.5',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  className: 'h-48 w-48 text-text-sec',
}

// 1. 창의적 리더 — 사람 실루엣 + 머리 위 전구
function IconLeader() {
  return (
    <svg {...visionIconProps}>
      <path d="M9.75 4.75a2.25 2.25 0 0 1 4.5 0c0 .9-.5 1.45-1 1.95-.3.3-.5.6-.5 1.05h-1.5c0-.45-.2-.75-.5-1.05-.5-.5-1-1.05-1-1.95Z" />
      <path d="M11 9.75h2" />
      <path d="M5.75 3.5l1.1.85M18.25 3.5l-1.1.85" />
      <circle cx="12" cy="13.75" r="2.25" />
      <path d="M6.75 20.75c0-2.6 2.35-4 5.25-4s5.25 1.4 5.25 4" />
    </svg>
  )
}

// 2. 융합 지식 — 펼친 책 + 교차 궤도(원자 타원 2개)
function IconKnowledge() {
  return (
    <svg {...visionIconProps}>
      <ellipse cx="12" cy="12" rx="10" ry="4.25" transform="rotate(-18 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.25" transform="rotate(18 12 12)" />
      <path d="M12 8.9c-1.3-.85-2.95-1.15-4.75-1.15v8.5c1.8 0 3.45.3 4.75 1.15 1.3-.85 2.95-1.15 4.75-1.15v-8.5c-1.8 0-3.45.3-4.75 1.15Z" />
      <path d="M12 8.9v8.5" />
    </svg>
  )
}

// 3. 지속가능 생태계 — 지구(원 + 경위선) + 순환 화살표
function IconEcosystem() {
  return (
    <svg {...visionIconProps}>
      <circle cx="12" cy="12" r="6.25" />
      <path d="M5.75 12h12.5" />
      <path d="M12 5.75c2.1 1.75 3.1 3.85 3.1 6.25s-1 4.5-3.1 6.25c-2.1-1.75-3.1-3.85-3.1-6.25s1-4.5 3.1-6.25Z" />
      <path d="M20.75 8.25A9.6 9.6 0 0 0 12 2.4" />
      <path d="M20.75 5v3.25H17.5" />
      <path d="M3.25 15.75A9.6 9.6 0 0 0 12 21.6" />
      <path d="M3.25 19v-3.25H6.5" />
    </svg>
  )
}

const VISION_ICONS = [IconLeader, IconKnowledge, IconEcosystem]

// About 전용 조각 — 연혁 타임라인 (수직: 좌측 헤어라인 세로선 + 좌 mono 날짜 + 우 내용)
function HistoryTimeline({ items, lang }) {
  if (items.length === 0) return null
  return (
    <ol className="border-l border-border-subtle">
      {items.map((item) => (
        <li
          key={`${item.date}-${item.text}`}
          className="pb-40 pl-24 last:pb-0 md:flex md:items-baseline md:gap-40 md:pl-40"
        >
          <time className="font-mono text-small-m text-text-meta md:w-160 md:shrink-0 md:text-small-d">
            {item.date}
          </time>
          <p className="mt-4 text-body-m text-text-pri md:mt-0 md:text-body-d">
            {lang === 'en' ? item.textEn : item.text}
          </p>
        </li>
      ))}
    </ol>
  )
}

function About() {
  const { lang, t } = useLang()
  useTitle(t('titles.about'))
  const copy = COPY[lang] ?? COPY.ko

  return (
    <>
      <PageBanner
        titleKo="전공소개"
        titleEn="ABOUT"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.people'), to: '/about' },
          { label: t('titles.about'), to: '/about' },
        ]}
        nebulaX="20%"
        nebulaY="30%"
      />

      <div className="pb-section-m md:pb-section-d">
        {/* 01 개요 — What is DAH / Why DAH를 좌우 번갈아 배치. 원문 재배치만이고 문구 추가·삭제 없음 */}
        <Container as="section" className="pt-section-m md:pt-section-d">
          <Reveal>
            <SectionLabel index="01" text="OVERVIEW" />
          </Reveal>
          {/* 12컬럼 위에 제목 5칸 + 본문 7칸을 바로 붙여 놓는다. 2등분(grid-cols-2)이면
              제목 컬럼 절반이 비어 가운데가 433px씩 벌어졌다 → 314px.
              본문을 6칸이 아니라 7칸으로 둔 것은 12번째 칸이 남아 본문 오른쪽 끝이
              컨테이너보다 100px 짧아지기 때문이다(가운데 간격은 6칸일 때와 같다).
              items-baseline: 제목의 밑줄·pb를 빼고 첫 줄 baseline끼리 맞춘다
              (top 정렬이면 글자 크기 차이만큼 본문 첫 줄이 위로 뜬다). */}
          <Reveal className="mt-40 grid gap-24 md:mt-48 md:grid-cols-12 md:items-baseline md:gap-32">
            <div className="min-w-0 md:col-span-5">
              <SectionHeading>What is DAH</SectionHeading>
            </div>
            <p className="min-w-0 text-body-l-m leading-[1.8] text-text-sec md:col-span-7 md:text-body-l-d">
              <Highlight text={copy.what} keywords={copy.whatKeywords} />
            </p>
          </Reveal>
          {/* 지그재그: Why는 헤딩이 오른쪽. 모바일은 헤딩이 먼저 오도록 order로 되돌린다 */}
          <Reveal className="mt-48 grid gap-24 border-t border-border-subtle pt-32 md:mt-64 md:grid-cols-12 md:items-baseline md:gap-32 md:pt-48">
            <div className="min-w-0 md:order-2 md:col-span-5">
              <SectionHeading>Why DAH</SectionHeading>
            </div>
            <div className="flex min-w-0 flex-col gap-24 md:order-1 md:col-span-7">
              <p className="text-h3-m font-medium leading-snug text-text-pri md:text-h3-d">
                {copy.whyStatement}
              </p>
              <p className="text-body-l-m leading-[1.8] text-text-sec md:text-body-l-d">
                <Highlight text={copy.whyLead} keywords={copy.whyKeywords} />
              </p>
            </div>
          </Reveal>
        </Container>

        {/* 02 미션·비전 */}
        <Container as="section" className="pt-section-m md:pt-section-d">
          <Reveal>
            <SectionLabel index="02" text="MISSION & VISION" />
            <div className="mt-32 md:mt-40">
              <p className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
                Mission
              </p>
              {/* 폭 상한(max-w-4xl=896px)이 "better" 뒤를 끊고 있었다 — 상한을 풀어
                  데스크탑에서 한 줄로 흐르게 하고 좁은 화면에서만 자연 줄바꿈되게 한다 */}
              <h2 className="mt-16 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:text-h2-d">
                {MISSION_EN}
              </h2>
              {lang !== 'en' && (
                <p className="mt-24 max-w-[960px] text-body-l-m leading-[1.8] text-text-sec md:text-body-l-d">
                  {copy.missionKr}
                </p>
              )}
            </div>
          </Reveal>

          <div className="mt-64 md:mt-96">
            <p className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
              Vision
            </p>
            <div className="mt-24 grid gap-32 md:grid-cols-3">
              {copy.vision.map((item, i) => {
                const Icon = VISION_ICONS[i]
                return (
                // T2: key는 언어 무관 index — 언어 전환 시 리마운트·재애니메이션 방지
                <Reveal key={i} delay={i < 6 ? i * motion.stagger : 0}>
                  <div className="border-t border-border-subtle pt-24">
                    {/* K2-8: 비전 항목 카드 상단 아이콘 */}
                    {Icon && (
                      <div className="mb-20">
                        <Icon />
                      </div>
                    )}
                    <h3 className="text-h3-m font-bold leading-snug text-text-pri md:text-h3-d">
                      {item.title}
                    </h3>
                    <p className="mt-12 text-body-m leading-relaxed text-text-sec md:text-body-d">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
                )
              })}
            </div>
          </div>
        </Container>

        {/* 03 연혁 타임라인 — 항목은 언어별(KR: text / EN: textEn) 렌더 */}
        {history.length > 0 && (
          <Container as="section" id="history" className="scroll-mt-header pt-section-m md:pt-section-d">
            <Reveal>
              <div className="flex flex-wrap items-center gap-12">
                <SectionLabel index="03" text="HISTORY" />
              </div>
              <h2 className="mt-24 text-h1-m font-extrabold leading-tight tracking-display text-text-pri md:mt-32 md:text-h1-d">
                {t('sections.history')}
              </h2>
            </Reveal>
            <div className="mt-48 md:mt-64">
              {/* K2-7: 최신 연도 최상단(내림차순) — 데이터 원문 순서(오름차순)는 유지, 렌더에서만 정렬 */}
              <HistoryTimeline items={[...history].sort((a, b) => b.date.localeCompare(a.date))} lang={lang} />
            </div>
          </Container>
        )}
      </div>
    </>
  )
}

export default About
