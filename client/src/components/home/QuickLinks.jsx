import { Link } from 'react-router-dom'
import { Bell, BookOpen, CalendarCheck, MonitorUp } from 'lucide-react'
import GlassPill from '../common/GlassPill'
import Reveal from '../common/Reveal'
import { useLang } from '../../i18n/LangContext'

// 홈 v2 #2 퀵링크 바 (10_IA_V2 4절) — GlassPill 4종.
// 전시회 접수는 설정의 접수 기간이 on일 때만 노출(12_BACKEND 5절: 서버가 기간 판정).
function QuickLinks({ settings }) {
  const { t } = useLang()

  // B1 계약 가정: GET /settings/public → submitOpen(boolean, 서버 계산 플래그)
  const submitOpen =
    settings?.submitOpen === true || settings?.submit?.open === true

  const links = [
    submitOpen && {
      key: 'submit',
      to: '/submit',
      label: t('quicklinks.submit'),
      Icon: CalendarCheck,
    },
    {
      key: 'showcase-submit',
      to: '/showcase/submit',
      label: t('quicklinks.showcaseSubmit'),
      Icon: MonitorUp,
    },
    { key: 'notice', to: '/news', label: t('quicklinks.notice'), Icon: Bell },
    {
      key: 'codesharing',
      to: '/curriculum/codesharing',
      label: t('quicklinks.codesharing'),
      Icon: BookOpen,
    },
  ].filter(Boolean)

  return (
    <section aria-label={t('quicklinks.label')}>
      <div className="mx-auto w-full max-w-container px-gutter-m md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide">
        <Reveal>
          {/* COSMOS-TONE 1절: 히어로 하단 페이드와 이어지도록 상단 여백 확대 */}
          <ul className="flex flex-wrap gap-12 pb-24 pt-48 md:gap-16 md:pb-32 md:pt-80">
            {links.map(({ key, to, label, Icon }) => (
              <li key={key} className="min-w-0">
                <Link to={to} className="group inline-flex">
                  <GlassPill className="h-11 gap-8 px-20 text-small-m font-semibold text-text-pri transition-colors duration-fast ease-out group-hover:border-border-strong group-hover:bg-glass-strong md:text-small-d">
                    <Icon size={16} aria-hidden="true" />
                    <span>{label}</span>
                  </GlassPill>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

export default QuickLinks
