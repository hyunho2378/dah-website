// AttachmentViewer.jsx — F8 첨부 뷰어 (13_CMS_SPEC 1절 자료실·공지 첨부)
// 계약: attachments = [{ name, url, type, bytes }]
//  - type이 application/pdf(또는 url이 .pdf)면 iframe 인라인 미리보기(높이 640, title)
//    · 모바일(md 미만)은 iframe 대신 링크 카드 폴백(모바일 브라우저 PDF 임베드 불안정)
//  - 그 외 파일은 다운로드 링크 카드(파일명 + 용량)
// 토큰 클래스만 사용. 이모지 금지. RichBody 하단 또는 상세에서 사용.
import { Download, FileText, Paperclip } from 'lucide-react'

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return null
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  const rounded = value >= 10 || unit === 0 ? Math.round(value) : Math.round(value * 10) / 10
  return `${rounded}${units[unit]}`
}

function isPdf(file) {
  if (file.type === 'application/pdf') return true
  return /\.pdf($|\?)/i.test(file.url || '')
}

function FileCard({ file }) {
  const size = formatBytes(file.bytes)
  return (
    <a
      href={file.url}
      download
      className="group flex min-w-0 items-center gap-12 rounded-glass border border-glass-line bg-glass-bg px-16 py-12 transition-colors duration-fast ease-out hover:border-border-strong hover:bg-glass-strong"
    >
      <FileText size={20} aria-hidden="true" className="shrink-0 text-text-meta" />
      <span className="flex min-w-0 flex-1 flex-col gap-4">
        <span className="min-w-0 break-keep text-body-m text-text-pri md:text-body-d">
          {file.name || '첨부파일'}
        </span>
        {size && (
          <span className="font-mono text-caption-m text-text-meta">{size}</span>
        )}
      </span>
      <Download
        size={16}
        aria-hidden="true"
        className="shrink-0 text-text-meta transition-colors duration-fast ease-out group-hover:text-text-pri"
      />
    </a>
  )
}

function PdfAttachment({ file }) {
  const name = file.name || '첨부 PDF'
  return (
    <figure className="flex min-w-0 flex-col gap-8">
      <figcaption className="flex items-center gap-8 font-mono text-caption-m text-text-meta">
        <Paperclip size={16} aria-hidden="true" />
        {name}
      </figcaption>
      {/* 데스크탑: 인라인 미리보기 */}
      <div className="hidden overflow-hidden rounded-glass border border-glass-line bg-bg-elev md:block">
        <iframe
          src={file.url}
          title={`${name} 미리보기`}
          className="h-[640px] w-full"
          loading="lazy"
        />
      </div>
      {/* 모바일: 링크 카드 폴백 */}
      <div className="md:hidden">
        <FileCard file={file} />
      </div>
    </figure>
  )
}

/**
 * AttachmentViewer — 첨부 목록 렌더.
 * @param {{ attachments?: Array<{name?:string,url:string,type?:string,bytes?:number}>, className?: string }} props
 */
function AttachmentViewer({ attachments, className = '' }) {
  const files = (attachments || []).filter((f) => f && f.url)
  if (files.length === 0) return null

  return (
    <div className={`flex min-w-0 flex-col gap-16 ${className}`.trim()}>
      {files.map((file) =>
        isPdf(file) ? (
          <PdfAttachment key={file.url} file={file} />
        ) : (
          <FileCard key={file.url} file={file} />
        )
      )}
    </div>
  )
}

export default AttachmentViewer
