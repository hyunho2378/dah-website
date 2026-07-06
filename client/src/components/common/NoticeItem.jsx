// 홈 NewsSection에서도 사용(AGENT-3)
// P4 리스트 행: [mono date meta] [Tag] [제목 body pri] … [화살표]
// 행 사이 헤어라인은 부모에서 divide-y divide-border-subtle로 처리한다.
// v2: 내부 상세(/news/:id) 링크 지원 — notice.to가 있으면 내부 Link(ArrowRight),
//     notice.url이면 외부 앵커(ArrowUpRight). tag는 v2 태그, org는 v1 폴백.
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Tag from './Tag'

function NoticeItem({ notice }) {
  const { date, org, tag, title, url, to } = notice
  const label = tag ?? org
  const Arrow = to ? ArrowRight : ArrowUpRight

  const body = (
    <>
      <span className="flex shrink-0 items-center gap-12">
        <time
          dateTime={date}
          className="font-mono text-caption-m text-text-meta md:text-caption-d"
        >
          {date}
        </time>
        {label && <Tag>{label}</Tag>}
      </span>
      <span className="flex min-w-0 flex-1 items-center justify-between gap-16">
        <span className="min-w-0 text-body-m text-text-pri underline-offset-4 group-hover:underline md:text-body-d">
          {title}
        </span>
        <Arrow
          size={16}
          aria-hidden="true"
          className="shrink-0 text-text-meta transition-colors duration-fast ease-out group-hover:text-text-pri"
        />
      </span>
    </>
  )

  const className =
    'group flex min-w-0 flex-col gap-8 py-16 transition-colors duration-fast ease-out hover:bg-bg-elev md:flex-row md:items-center md:gap-24 md:py-20'

  if (to) {
    return (
      <Link to={to} className={className}>
        {body}
      </Link>
    )
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  )
}

export default NoticeItem
