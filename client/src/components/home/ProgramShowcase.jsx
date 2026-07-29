import { useState } from 'react'
import Link from '../common/LangLink'
import { ArrowRight, ChevronDown } from 'lucide-react'
import SectionLabel from '../common/SectionLabel'
import Reveal from '../common/Reveal'
import ArrowLink from '../common/ArrowLink'
import Container from '../layout/Container'
import { useApi } from '../../hooks/useApi'
import useContentVisibility from '../../hooks/useContentVisibility'
import { useLang } from '../../i18n/LangContext'

// 홈 v2 #3 프로그램 마스터-디테일 (10_IA_V2 4절, KPC SERVICE 이식)
// 좌 카테고리 hover/focus → 우 글래스 패널 crossfade 200ms + 미세 translateY(11_DESIGN_V2 5절 명시값).
// 모바일(lg 미만)은 세로 아코디언 폴백.
// 38_VISIBILITY: visibilityKey는 서버 settings.js DEFAULT_VISIBILITY 유형 키와 1:1.
// 대시보드에서 비공개로 바꾼 유형은 아래 마스터-디테일 목록에서 통째로 빠진다.
const CATEGORIES = [
  { key: 'exhibitions', no: '01', to: '/programs/exhibitions', api: '/content/exhibitions', visibilityKey: 'exhibitions' },
  { key: 'contests', no: '02', to: '/programs/contests', api: '/content/contest', visibilityKey: 'contest' },
  { key: 'lectures', no: '03', to: '/programs/lectures', api: '/content/lecture', visibilityKey: 'lecture' },
  { key: 'showcase', no: '04', to: '/showcase', api: '/content/showcase', visibilityKey: 'showcase' },
]

// API 응답(배열 또는 {items}) → 최신 3건 제목 리스트. 실패·미기동 시 빈 배열(P6: 리스트만 생략)
function normalizeLatest(data) {
  const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []
  return list
    .map((item) => ({
      id: item.id,
      title: item.title_ko || item.title || item.semester_label || '',
    }))
    .filter((item) => item.id !== undefined && item.title)
    .slice(0, 3)
}

function DetailPanel({ category, items, t }) {
  // K2-1: 패널 높이 = 좌측 리스트 높이 — h-full + flex-col, 부족분은 VIEW MORE 위(mt-auto) 여백으로
  // Y1-1(33_PHASE18): 좌측 리스트가 이미 같은 번호를 노출하므로 패널 상단 인덱스 숫자는 삭제.
  // 제목이 패널 최상단에 오면서 좌측 첫 항목과 같은 높이에서 읽힌다.
  return (
    // A4(36_ACCENT_POLISH): 공용 글로우 적용. 이 패널은 GlassCard가 아니라 자체 표면이라
    // 같은 토큰 클래스(shadow-glow-card)를 직접 붙여 다른 카드들과 질감을 통일한다.
    // 마스터-디테일 패널은 hover로 전환되는 구조라 기본 잔광만 두고 hover 상승은 생략한다.
    <div className="relative flex h-full flex-col rounded-glass border border-glass-line bg-bg-elev p-24 shadow-glow-card backdrop-blur-glass-mobile md:p-32 md:backdrop-blur-glass">
      <h3 className="text-h3-m font-bold leading-snug text-text-pri md:text-h3-d">
        {t(`programs.${category.key}.label`)}
      </h3>
      <p className="mt-12 text-body-m leading-relaxed text-text-sec md:text-body-d">
        {t(`programs.${category.key}.desc`)}
      </p>
      {items.length > 0 && (
        <ul className="mt-24 border-t border-border-subtle">
          {items.map((item) => (
            <li key={item.id} className="min-w-0 border-b border-border-subtle py-12">
              <p className="truncate text-body-m text-text-pri md:text-body-d">
                {item.title}
              </p>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-24">
        <ArrowLink href={category.to}>{t('actions.viewMore')}</ArrowLink>
      </div>
    </div>
  )
}

function ProgramShowcase() {
  const { t } = useLang()
  const [active, setActive] = useState(CATEGORIES[0].key)
  const [openMobile, setOpenMobile] = useState(null)
  // 훅 호출 개수·순서는 가시성과 무관하게 고정해야 하므로(Rules of Hooks)
  // useApi 4개는 그대로 두고 "렌더할 목록"만 걸러낸다.
  const { isPublic } = useContentVisibility()
  const shown = CATEGORIES.filter((c) => isPublic(c.visibilityKey))
  // 첫 카테고리(전시회)가 비공개면 active가 사라진 항목을 가리켜 우측 패널이 비어버린다.
  // 표시 목록에 없으면 첫 노출 항목으로 되돌린다(상태는 그대로 두고 파생값만 보정).
  const activeKey = shown.some((c) => c.key === active) ? active : shown[0]?.key

  // 최신 항목 4소스 — 서버 미기동 시 data null → 리스트 생략, 설명+VIEW MORE는 유지
  const exhibitions = useApi(CATEGORIES[0].api)
  const contests = useApi(CATEGORIES[1].api)
  const lectures = useApi(CATEGORIES[2].api)
  const showcase = useApi(CATEGORIES[3].api)
  const latest = {
    exhibitions: normalizeLatest(exhibitions.data),
    contests: normalizeLatest(contests.data),
    lectures: normalizeLatest(lectures.data),
    showcase: normalizeLatest(showcase.data),
  }

  return (
    <section className="py-section-m lg:py-section-d">
      <Container>
        <Reveal>
          <SectionLabel index="01" text="PROGRAMS" />
          <h2 className="mt-24 text-h1-m font-extrabold leading-snug tracking-display text-text-pri lg:text-h1-d">
            {t('sections.programs')}
          </h2>
        </Reveal>

        {/* 데스크탑: 좌 카테고리 리스트 + 우 패널 (같은 셀에 4장 겹침, 활성만 표시)
            K2-1: items-stretch로 우측 패널 높이를 좌측 리스트 전체 높이에 정합 */}
        <div className="mt-64 hidden items-stretch gap-48 lg:grid lg:grid-cols-2">
          {/* Y1-1: 좌측 리스트도 열 높이를 채우게(flex-col + 항목 flex-1) 해 마지막 헤어라인과
              우측 패널 하단(VIEW MORE)이 같은 선에서 끝난다 */}
          <ul className="flex flex-col">
            {shown.map((category) => {
              const isActive = activeKey === category.key
              return (
                <li
                  key={category.key}
                  className="flex flex-1 flex-col border-b border-border-subtle first:border-t"
                >
                  <Link
                    to={category.to}
                    onMouseEnter={() => setActive(category.key)}
                    onFocus={() => setActive(category.key)}
                    className={`group flex h-full cursor-pointer items-center justify-between gap-24 py-24 transition-colors duration-200 ease-out ${
                      isActive ? 'text-text-pri' : 'text-text-sec'
                    }`}
                  >
                    <span className="flex min-w-0 items-baseline gap-16">
                      <span className="shrink-0 font-mono text-label-d uppercase tracking-label text-text-meta">
                        {category.no}
                      </span>
                      <span className="truncate text-h2-m font-bold leading-snug lg:text-h2-d">
                        {t(`programs.${category.key}.label`)}
                      </span>
                    </span>
                    <ArrowRight
                      size={20}
                      aria-hidden="true"
                      className={`shrink-0 transition-transform duration-200 ease-out ${
                        isActive ? 'translate-x-4 text-text-pri' : 'text-text-meta'
                      }`}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="grid h-full">
            {shown.map((category) => {
              const isActive = activeKey === category.key
              return (
                <div
                  key={category.key}
                  inert={!isActive}
                  className={`col-start-1 row-start-1 h-full min-w-0 transition-all duration-200 ease-out ${
                    isActive
                      ? 'translate-y-0 opacity-100'
                      : 'pointer-events-none translate-y-2 opacity-0'
                  }`}
                >
                  <DetailPanel category={category} items={latest[category.key]} t={t} />
                </div>
              )
            })}
          </div>
        </div>

        {/* 모바일: 세로 아코디언 폴백 */}
        <div className="mt-48 lg:hidden">
          <ul className="border-t border-border-subtle">
            {shown.map((category) => {
              const isOpen = openMobile === category.key
              return (
                <li key={category.key} className="border-b border-border-subtle">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenMobile(isOpen ? null : category.key)}
                    className="flex w-full cursor-pointer items-center justify-between gap-16 py-20 text-left"
                  >
                    <span className="flex min-w-0 items-baseline gap-12">
                      <span className="shrink-0 font-mono text-label-m uppercase tracking-label text-text-meta">
                        {category.no}
                      </span>
                      <span className="truncate text-h3-m font-bold text-text-pri">
                        {t(`programs.${category.key}.label`)}
                      </span>
                    </span>
                    <ChevronDown
                      size={20}
                      aria-hidden="true"
                      className={`shrink-0 text-text-meta transition-transform duration-200 ease-out ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-20">
                      <DetailPanel
                        category={category}
                        items={latest[category.key]}
                        t={t}
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </section>
  )
}

export default ProgramShowcase
