import { ArrowUpRight } from 'lucide-react'
import PageBanner from '../../components/layout/PageBanner'
import Container from '../../components/layout/Container'
import SectionLabel from '../../components/common/SectionLabel'
import Reveal from '../../components/common/Reveal'
import StateMessage from '../../components/common/StateMessage'
import InlineEditBar from '../../components/content/InlineEditBar'
import { useApi } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useLang } from '../../i18n/LangContext'
import { portfolios as staticPortfolios } from '../../data/portfolios'

const joinMajors = (majors) => (Array.isArray(majors) ? majors.join(' / ') : majors)
const normalize = (item) => ({
  id: item.id,
  studentNo: item.student_no ?? item.studentNo,
  name: item.name,
  majors: item.majors,
  url: item.link ?? item.url ?? null,
})

function PortfolioItem({ item }) {
  const content = (
    <>
      <span className="shrink-0 font-mono text-caption-m text-text-meta">{item.studentNo}</span>
      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-12 gap-y-4">
        <span className={`text-body-m text-text-pri underline-offset-4 md:text-body-d ${item.url ? 'group-hover:underline' : ''}`}>
          {item.name}
        </span>
        {item.majors && <span className="font-mono text-caption-m text-text-sec">{joinMajors(item.majors)}</span>}
        {item.url && <ArrowUpRight size={16} aria-hidden="true" className="ml-auto shrink-0 text-text-meta group-hover:text-text-pri" />}
      </span>
    </>
  )
  const className = 'flex min-w-0 flex-col gap-4 py-16 transition-colors duration-fast ease-out md:flex-row md:items-center md:gap-24 md:py-20'
  return item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer" className={`group ${className} hover:bg-bg-elev`}>{content}</a> : <div className={className}>{content}</div>
}

function Portfolios() {
  const { t } = useLang()
  useTitle(t('sections.portfolio'))
  const result = useApi('/content/portfolios', { params: { pageSize: 100 } })
  const fallback = result.offline || (result.error && !result.data)
  const items = (fallback ? staticPortfolios : result.data?.items ?? []).map(normalize)
  return (
    <>
      <PageBanner titleKo="재학생 포트폴리오" titleEn="PORTFOLIO" breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: t('nav.activities') }, { label: t('sections.portfolio'), to: '/students/portfolios' }]} nebulaX="50%" nebulaY="24%" />
      <Container as="section" className="py-section-m lg:py-section-d">
        <Reveal>
          <SectionLabel index="02" text="PORTFOLIO" />
          <div className="mt-24 flex flex-wrap items-center justify-between gap-16">
            <h1 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">{t('sections.portfolio')}</h1>
            <InlineEditBar type="portfolios" addTo="/admin/careers" manageTo="/admin/careers" />
          </div>
        </Reveal>
        {items.length === 0 ? (
          <StateMessage state={result.loading ? 'loading' : result.error && !fallback ? 'error' : 'empty'} onRetry={result.error && !fallback ? result.refetch : undefined}>
            {result.loading ? t('common.loading') : result.error && !fallback ? t('common.error') : t('common.empty')}
          </StateMessage>
        ) : (
          <div className="mt-48 divide-y divide-border-subtle">{items.map((item) => <PortfolioItem key={item.id} item={item} />)}</div>
        )}
      </Container>
    </>
  )
}

export default Portfolios
