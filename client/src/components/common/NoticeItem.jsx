// 홈 NewsSection에서도 사용(AGENT-3)
// P4 리스트 행: [mono date meta] [Tag 기관] [제목 body pri] … [ArrowUpRight]
// 행 사이 헤어라인은 부모에서 divide-y divide-border-subtle로 처리한다.
import { ArrowUpRight } from 'lucide-react'
import Tag from './Tag'

function NoticeItem({ notice }) {
  const { date, org, title, url } = notice

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-8 py-16 transition-colors duration-fast ease-out hover:bg-bg-elev md:flex-row md:items-center md:gap-24 md:py-20"
    >
      <span className="flex shrink-0 items-center gap-12">
        <time
          dateTime={date}
          className="font-mono text-caption-m text-text-meta md:text-caption-d"
        >
          {date}
        </time>
        <Tag>{org}</Tag>
      </span>
      <span className="flex flex-1 items-center justify-between gap-16">
        <span className="text-body-m text-text-pri underline-offset-4 group-hover:underline md:text-body-d">
          {title}
        </span>
        <ArrowUpRight
          size={16}
          aria-hidden="true"
          className="shrink-0 text-text-meta transition-colors duration-fast ease-out group-hover:text-text-pri"
        />
      </span>
    </a>
  )
}

export default NoticeItem
