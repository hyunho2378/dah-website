import { Download } from 'lucide-react'
import PageBanner from '../components/layout/PageBanner'
import SectionLabel from '../components/common/SectionLabel'
import Reveal from '../components/common/Reveal'
import Tag from '../components/common/Tag'
import { EditPencil } from '../components/content/EditControls'
import { useTitle } from '../hooks/useTitle'
import { useLang, KoreanOnlyBadge } from '../i18n/LangContext'
import { codeSharing } from '../data/tracks'
import { motion } from '../styles/tokens'

// 코드쉐어링 v2 (10_IA_V2 2절 /curriculum/codesharing) — 구 Tracks.jsx 하단 섹션의 분리 페이지.
// HWP 신청서: public/files/codesharing-form.hwp 정적 슬롯(실물 파일은 사용자 배치 — 데이터 갭).

const CONTAINER =
  'mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide'

const HWP_HREF = '/files/codesharing-form.hwp'

function CodeSharing() {
  const { t } = useLang()
  useTitle(t('titles.codesharing'))

  // 인정 학과 목록에 붙는 학점 상한 안내 — 원문 '학점인정형 코드쉐어링' 항목(types 3번째)
  const limitNote = codeSharing.types?.[2]?.detail ?? ''

  return (
    <>
      <PageBanner
        titleKo="코드쉐어링"
        titleEn="CODE SHARING"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.curriculum'), to: '/curriculum' },
          { label: t('titles.codesharing'), to: '/curriculum/codesharing' },
        ]}
        nebulaX="75%"
        nebulaY="60%"
      />

      <div className="pb-section-m md:pb-section-d">
        {/* 01 안내 — 정의·유의 사항 원문 + HWP 다운로드 */}
        <section className={`${CONTAINER} pt-section-m md:pt-section-d`}>
          <Reveal>
            <div className="flex flex-wrap items-center gap-12">
              <SectionLabel index="01" text="OVERVIEW" />
              <KoreanOnlyBadge />
              {/* 코드쉐어링 단일 문서 편집(admin+, 13_CMS_SPEC 1절) — 비로그인 미렌더 */}
              <EditPencil type="codesharing" to="/admin/codesharing" />
            </div>
            <p className="mt-24 max-w-4xl text-h3-m font-bold leading-snug tracking-display text-text-pri md:mt-32 md:text-h3-d">
              {codeSharing.definition}
            </p>
            <p className="mt-16 max-w-[640px] text-body-m leading-relaxed text-text-sec md:text-body-d">
              {codeSharing.note}
            </p>
            {/* 글래스 다운로드 버튼 — 파일 슬롯 예약(파일명 고정: codesharing-form.hwp) */}
            <a
              href={HWP_HREF}
              download
              className="mt-32 inline-flex h-11 cursor-pointer items-center gap-8 rounded-glass border border-glass-line bg-glass-bg px-24 text-body-m font-semibold text-text-pri backdrop-blur-glass-mobile transition-colors duration-fast ease-out hover:bg-glass-strong md:h-48 md:backdrop-blur-glass md:text-body-d"
            >
              <Download size={16} aria-hidden="true" />
              {t('actions.download')}
            </a>
          </Reveal>
        </section>

        {/* 02 승인 절차 4단계 (원문 그대로) */}
        {codeSharing.steps.length > 0 && (
          <section className={`${CONTAINER} pt-section-m md:pt-section-d`}>
            <Reveal>
              <SectionLabel index="02" text="PROCESS" />
              <h2 className="mt-24 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
                {t('sections.procedure')}
              </h2>
            </Reveal>
            <ol className="mt-32 grid gap-24 border-t border-border-subtle pt-24 md:mt-48 md:grid-cols-4 md:gap-32">
              {codeSharing.steps.map((step, i) => (
                <Reveal key={step} delay={i < 6 ? i * motion.stagger : 0} as="li">
                  <p className="font-mono text-small-m text-text-pri md:text-small-d">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-8 text-body-m leading-relaxed text-text-sec md:text-body-d">
                    {step}
                  </p>
                </Reveal>
              ))}
            </ol>
          </section>
        )}

        {/* 03 인정 학과 (원문 19개 + 학점 상한 안내) */}
        {codeSharing.departments.length > 0 && (
          <section className={`${CONTAINER} pt-section-m md:pt-section-d`}>
            <Reveal>
              <SectionLabel index="03" text="DEPARTMENTS" />
              <h2 className="mt-24 text-h2-m font-extrabold leading-snug tracking-display text-text-pri md:mt-32 md:text-h2-d">
                {t('sections.departments')} {codeSharing.departments.length}
              </h2>
              {limitNote && (
                <p className="mt-16 max-w-[640px] text-body-m leading-relaxed text-text-sec md:text-body-d">
                  {limitNote}
                </p>
              )}
            </Reveal>
            <div className="mt-32 flex flex-wrap gap-8 md:mt-48 md:gap-12">
              {codeSharing.departments.map((dept) => (
                <Tag key={dept}>{dept}</Tag>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default CodeSharing
