import ArrowLink from '../common/ArrowLink'
import { newsbar } from '../../data/site'

function NewsBar() {
  if (!newsbar?.title) return null

  return (
    <section
      aria-label="진행 중인 전시"
      className="border-y border-border-subtle transition-colors duration-base ease-out hover:bg-bg-elev"
    >
      <div className="mx-auto flex w-full max-w-container flex-col gap-8 px-gutter-m py-20 md:flex-row md:items-center md:gap-24 md:px-gutter-t lg:px-gutter-d 3xl:max-w-container-wide">
        <p className="shrink-0 font-mono text-label-m uppercase tracking-label text-text-meta lg:text-label-d">
          {newsbar.label}
        </p>
        <p className="text-body-m text-text-pri md:flex-1 lg:text-body-d">{newsbar.title}</p>
        <ArrowLink href={newsbar.href} external>
          보러가기
        </ArrowLink>
      </div>
    </section>
  )
}

export default NewsBar
