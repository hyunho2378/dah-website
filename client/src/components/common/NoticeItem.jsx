// 홈 NewsSection에서 사용
// P4 리스트 행: [mono date meta] [Tag] [제목 body pri] … [화살표]
// 행 사이 헤어라인은 부모에서 divide-y divide-border-subtle로 처리한다.
// J7: 외부(구글 사이트) 아웃바운드 폐지 — 항상 내부 상세(/news/:id)로 이동.
import Link from './LangLink'
import { ArrowRight } from 'lucide-react'
import Tag from './Tag'

function NoticeItem({ notice }) {
  const { id, date, org, tag, title, to } = notice
  const label = tag ?? org

  return (
    <Link
      to={to ?? `/news/${id}`}
      className="group flex min-w-0 flex-col gap-8 py-16 transition-colors duration-fast ease-out hover:bg-bg-elev md:flex-row md:items-center md:gap-24 md:py-20"
    >
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
        <ArrowRight
          size={16}
          aria-hidden="true"
          className="shrink-0 text-text-meta transition-colors duration-fast ease-out group-hover:text-text-pri"
        />
      </span>
    </Link>
  )
}

export default NoticeItem
