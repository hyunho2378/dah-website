import SectionLabel from '../common/SectionLabel'
import Reveal from '../common/Reveal'
import ArrowLink from '../common/ArrowLink'
import NoticeItem from '../common/NoticeItem'
import { useLang, KoreanOnlyBadge } from '../../i18n/LangContext'
import { notices } from '../../data/notices'
import { motion } from '../../styles/tokens.js'

// 홈 v2 #6 최신 소식 4건 (10_IA_V2 4절, 타이틀 명사형 "공지사항")
// 공지 제목은 국문 원문 → /en 미러에서 KoreanOnlyBadge 병기(13_CMS_SPEC 5절 패턴)
function NewsSection() {
  const { t } = useLang()

  if (!notices?.length) return null

  const latest = [...notices]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 4)

  return (
    <section className="py-section-m lg:py-section-d">
      <div className="mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide">
        <Reveal>
          <SectionLabel index="04" text="NEWS" />
          <div className="mt-24 flex flex-wrap items-center gap-12">
            <h2 className="max-w-2xl text-h1-m font-extrabold leading-snug tracking-display text-text-pri lg:text-h1-d">
              {t('sections.news')}
            </h2>
            <KoreanOnlyBadge />
          </div>
        </Reveal>

        <div className="mt-64 divide-y divide-border-subtle">
          {latest.map((notice, i) => (
            <Reveal key={notice.id} delay={i < 6 ? i * motion.stagger : 0}>
              <NoticeItem notice={notice} />
            </Reveal>
          ))}
        </div>

        <div className="mt-48">
          <ArrowLink href="/news">{t('actions.viewAll')}</ArrowLink>
        </div>
      </div>
    </section>
  )
}

export default NewsSection
