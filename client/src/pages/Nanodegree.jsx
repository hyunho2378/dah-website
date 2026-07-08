// /curriculum/nanodegree — 나노디그리 (K2-13)
// DB 문서(GET /content/nanodegree, body {intro,cert,programs,…}) 우선, 없으면 정적 원문(data/nanodegree).
// EN 모드는 En 필드(introEn/certEn/programsEn) 사용, 없으면 국문 폴백.
import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import SectionLabel from '../components/common/SectionLabel'
import Reveal from '../components/common/Reveal'
import GlassCard from '../components/common/GlassCard'
import Table from '../components/common/Table'
import { EditPencil } from '../components/content/EditControls'
import { useApi, firstItem } from '../hooks/useApi'
import { useTitle } from '../hooks/useTitle'
import { useLang } from '../i18n/LangContext'
import { nanodegree } from '../data/nanodegree'
import { motion } from '../styles/tokens'

function Nanodegree() {
  const { lang, t } = useLang()
  useTitle(t('titles.nanodegree'))

  // DB 문서가 있으면 body 우선(K1 데이터 계약), 미기동·미등록이면 정적 원문.
  // P13: DB body는 새 구조(각 program.courses가 배열)일 때만 채택. 구 시드(courses가 문자열)면
  // Table에 문자열이 넘어가 .map 크래시 → migrate-phase13 전에도 안전하도록 새 시드로 폴백.
  const { data } = useApi('/content/nanodegree')
  const doc = firstItem(data)
  const body = doc?.body
  const isNewShape =
    body &&
    Array.isArray(body.programs) &&
    body.programs.length > 0 &&
    body.programs.every((p) => Array.isArray(p.courses))
  const source = isNewShape ? body : nanodegree

  const intro = lang === 'en' && source.introEn ? source.introEn : source.intro
  const cert = lang === 'en' && source.certEn ? source.certEn : source.cert
  const programs =
    lang === 'en' && Array.isArray(source.programsEn) && source.programsEn.length > 0
      ? source.programsEn
      : source.programs ?? []

  return (
    <>
      <PageBanner
        titleKo="나노디그리"
        titleEn="NANODEGREE"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.curriculum'), to: '/curriculum' },
          { label: t('titles.nanodegree'), to: '/curriculum/nanodegree' },
        ]}
        nebulaX="38%"
        nebulaY="55%"
      />

      <div className="pb-section-m md:pb-section-d">
        {/* 01 개요 — 원문 intro */}
        <Container as="section" className="pt-section-m md:pt-section-d">
          <Reveal>
            <div className="flex flex-wrap items-center gap-12">
              <SectionLabel index="01" text="OVERVIEW" />
              {/* 나노디그리 단일 문서 편집(admin+). 비로그인 미렌더 */}
              <EditPencil type="nanodegree" to="/admin/nanodegree" />
            </div>
            <h2 className="mt-24 text-h1-m font-extrabold leading-tight tracking-display text-text-pri md:mt-32 md:text-h1-d">
              {t('sections.nanodegree')}
            </h2>
            <p className="mt-24 max-w-[960px] text-body-l-m leading-relaxed text-text-sec md:mt-32 md:text-body-l-d">
              {intro}
            </p>
          </Reveal>
        </Container>

        {/* 02 인증기준 — 원문 cert */}
        <Container as="section" className="pt-section-m md:pt-section-d">
          <Reveal>
            <SectionLabel index="02" text="CERTIFICATION" />
            <h2 className="mt-24 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
              {t('nanodegree.cert')}
            </h2>
            <p className="mt-16 max-w-[960px] text-body-l-m leading-relaxed text-text-sec md:mt-24 md:text-body-l-d">
              {cert}
            </p>
          </Reveal>
        </Container>

        {/* 03 운영과정 — 과정 4개 카드 */}
        {programs.length > 0 && (
          <Container as="section" className="pt-section-m md:pt-section-d">
            <Reveal>
              <SectionLabel index="03" text="PROGRAMS" />
              <h2 className="mt-24 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
                {t('nanodegree.programs')}
              </h2>
            </Reveal>
            {/* R3-5: auto-rows-fr + 그리드 기본 stretch로 전 과정 박스 동일 높이(가장 긴 것 기준).
                GlassCard h-full이 늘어난 높이를 채운다 */}
            <div className="mt-32 grid auto-rows-fr grid-cols-1 gap-16 md:mt-48 md:grid-cols-2 md:gap-24">
              {programs.map((program, i) => (
                <Reveal key={i} delay={i < 6 ? i * motion.stagger : 0} className="h-full">
                  <GlassCard className="flex h-full flex-col gap-16 p-24 md:p-32">
                    <p className="font-mono text-label-m uppercase tracking-label text-text-meta md:text-label-d">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="text-h3-m font-bold leading-snug text-text-pri md:text-h3-d">
                      {program.name}
                    </h3>
                    <div className="flex flex-col gap-8 border-t border-border-subtle pt-16">
                      <p className="text-body-m leading-relaxed text-text-sec md:text-body-d">
                        <span className="text-text-pri">{t('nanodegree.criteria')} : </span>
                        {program.criteria}
                      </p>
                      <p className="text-body-m leading-relaxed text-text-sec md:text-body-d">
                        <span className="text-text-pri">{t('nanodegree.partner')} : </span>
                        {program.partner}
                      </p>
                    </div>
                    <Table
                      columns={[
                        { key: 'code', label: t('nanodegree.thCode'), mono: true },
                        { key: 'name', label: t('nanodegree.thCourse') },
                        { key: 'credit', label: t('nanodegree.thCredit'), mono: true, nowrap: true },
                      ]}
                      rows={program.courses ?? []}
                    />
                    <p className="mt-auto text-small-m text-text-pri md:text-small-d">
                      <span className="text-text-meta">{t('nanodegree.completion')} : </span>
                      {program.completion}
                    </p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </Container>
        )}
      </div>
    </>
  )
}

export default Nanodegree
