// RichBody.jsx — Tiptap JSON(body jsonb) → React 렌더러 (13_CMS_SPEC 2절)
// Tiptap 미의존 순수 JSON 워커. 에디터 CSS 유출 금지 — 토큰 클래스만 사용.
// 지원 노드: paragraph, heading(2·3), bulletList, orderedList, listItem,
// blockquote, horizontalRule, codeBlock, image, table 계열, hardBreak,
// 임베드 3종(youtube / figma / googleSlides — 글래스 프레임 + aspect-video)

import { Fragment } from 'react'

const EMBED_FRAME =
  'overflow-hidden rounded-glass border border-glass-line bg-glass-bg'
const EMBED_IFRAME = 'aspect-video h-auto w-full'

// H3-5(37_SHEET_ROADMAP): tone='light'는 G4 밝은 읽기 표면(공지·자료실 상세 본문) 전용 토큰 세트.
// 밝은 배경에서 연보라·Mid Purple은 대비 부족이라 금지 — 강조는 reading.accent 계열만 쓴다.
// 기본값 'dark'는 기존 렌더와 동일(다른 사용처 무변경).
const TONES = {
  dark: {
    body: 'text-text-sec',
    strong: 'text-text-pri',
    heading: 'text-text-pri',
    marker: 'marker:text-text-meta',
    link: 'text-text-pri decoration-border-strong hover:decoration-border-focus',
    code: 'bg-bg-panel text-text-pri',
    line: 'border-border-subtle',
    quote: 'border-border-strong text-text-sec',
    panel: 'bg-bg-panel',
    imageBg: 'bg-bg-elev',
    cellHead: 'text-text-pri [&>p]:text-text-pri',
    cell: 'text-text-sec',
  },
  light: {
    body: 'text-reading-text',
    strong: 'text-reading-textStrong',
    heading: 'text-reading-textStrong',
    marker: 'marker:text-reading-textMeta',
    link: 'text-reading-accent decoration-reading-accent hover:text-reading-accentStrong',
    code: 'bg-reading-subtle text-reading-textStrong',
    line: 'border-reading-hairline',
    quote: 'border-reading-accent text-reading-text',
    panel: 'bg-reading-subtle',
    imageBg: 'bg-reading-subtle',
    cellHead: 'text-reading-textStrong [&>p]:text-reading-textStrong',
    cell: 'text-reading-text',
  },
}

function youtubeEmbedSrc(src) {
  if (!src) return null
  const m = String(src).match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
  )
  if (!m) return null
  return `https://www.youtube-nocookie.com/embed/${m[1]}`
}

function figmaEmbedSrc(src) {
  if (!src) return null
  return `https://www.figma.com/embed?embed_host=dah&url=${encodeURIComponent(src)}`
}

function slidesEmbedSrc(src) {
  if (!src) return null
  const m = String(src).match(/docs\.google\.com\/presentation\/d\/([\w-]+)/)
  if (!m) return null
  return `https://docs.google.com/presentation/d/${m[1]}/embed`
}

function Embed({ src, title }) {
  if (!src) return null
  return (
    <div className={EMBED_FRAME}>
      <iframe
        src={src}
        title={title}
        className={EMBED_IFRAME}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer"
      />
    </div>
  )
}

function renderText(node, key, c) {
  let el = node.text || ''
  for (const mark of node.marks || []) {
    switch (mark.type) {
      case 'bold':
        el = <strong className={`font-bold ${c.strong}`}>{el}</strong>
        break
      case 'italic':
        el = <em>{el}</em>
        break
      case 'underline':
        el = <u className="underline underline-offset-4">{el}</u>
        break
      case 'strike':
        el = <s>{el}</s>
        break
      case 'code':
        el = (
          <code className={`rounded-sm px-8 font-mono text-small-m ${c.code}`}>{el}</code>
        )
        break
      case 'link':
        el = (
          <a
            href={mark.attrs?.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline underline-offset-4 transition duration-fast ease-out ${c.link}`}
          >
            {el}
          </a>
        )
        break
      default:
        break
    }
  }
  return <Fragment key={key}>{el}</Fragment>
}

function renderNode(node, key, c) {
  if (!node || typeof node !== 'object') return null
  const children = (node.content || []).map((child, i) => renderNode(child, i, c))

  switch (node.type) {
    case 'text':
      return renderText(node, key, c)
    case 'paragraph':
      return (
        <p key={key} className={`text-body-m leading-relaxed md:text-body-d ${c.body}`}>
          {children.length ? children : <br />}
        </p>
      )
    case 'heading': {
      if (node.attrs?.level === 2) {
        return (
          <h2
            key={key}
            className={`mt-32 text-h2-m font-bold leading-snug first:mt-0 md:text-h2-d ${c.heading}`}
          >
            {children}
          </h2>
        )
      }
      return (
        <h3
          key={key}
          className={`mt-24 text-h3-m font-bold leading-snug first:mt-0 md:text-h3-d ${c.heading}`}
        >
          {children}
        </h3>
      )
    }
    case 'bulletList':
      return (
        <ul key={key} className="flex list-disc flex-col gap-8 pl-24">
          {children}
        </ul>
      )
    case 'orderedList':
      return (
        <ol key={key} className="flex list-decimal flex-col gap-8 pl-24">
          {children}
        </ol>
      )
    case 'listItem':
      return (
        <li
          key={key}
          className={`text-body-m leading-relaxed md:text-body-d [&>p]:text-body-m md:[&>p]:text-body-d ${c.body} ${c.marker}`}
        >
          {children}
        </li>
      )
    case 'blockquote':
      // 인용 헤어라인
      return (
        <blockquote
          key={key}
          className={`border-l pl-16 text-body-l-m leading-relaxed md:text-body-l-d ${c.quote}`}
        >
          {children}
        </blockquote>
      )
    case 'horizontalRule':
      return <hr key={key} className={`my-16 border-0 border-t ${c.line}`} />
    case 'codeBlock':
      return (
        <pre
          key={key}
          className={`overflow-x-auto rounded-md border p-16 font-mono text-small-m leading-normal md:text-small-d ${c.line} ${c.panel} ${c.body}`}
        >
          <code>{children}</code>
        </pre>
      )
    case 'image':
      return (
        <img
          key={key}
          src={node.attrs?.src}
          alt={node.attrs?.alt || ''}
          loading="lazy"
          className={`w-full rounded-md border ${c.line} ${c.imageBg}`}
        />
      )
    case 'table':
      // 표는 해당 블록만 가로 스크롤 (11_DESIGN_V2 8절)
      return (
        <div key={key} className="overflow-x-auto">
          <table className="w-full border-collapse text-body-m md:text-body-d">
            <tbody>{children}</tbody>
          </table>
        </div>
      )
    case 'tableRow':
      return <tr key={key}>{children}</tr>
    case 'tableHeader':
      return (
        <th
          key={key}
          className={`border px-12 py-8 text-left font-semibold ${c.line} ${c.panel} ${c.cellHead}`}
        >
          {children}
        </th>
      )
    case 'tableCell':
      return (
        <td key={key} className={`border px-12 py-8 align-top ${c.line} ${c.cell}`}>
          {children}
        </td>
      )
    case 'hardBreak':
      return <br key={key} />
    case 'youtube':
      return <Embed key={key} src={youtubeEmbedSrc(node.attrs?.src)} title="YouTube 영상" />
    case 'figma':
      return <Embed key={key} src={figmaEmbedSrc(node.attrs?.src)} title="Figma 임베드" />
    case 'googleSlides':
      return (
        <Embed key={key} src={slidesEmbedSrc(node.attrs?.src)} title="Google Slides 임베드" />
      )
    default:
      // 미지원 노드는 자식만 통과 렌더 (그레이스풀 폴백)
      return <Fragment key={key}>{children}</Fragment>
  }
}

/**
 * RichBody — body(jsonb, Tiptap doc JSON)를 토큰 클래스로만 렌더.
 * @param {{ body: Object|null, className?: string, tone?: 'dark'|'light' }} props
 *   tone='light' — G4 밝은 읽기 표면(reading.*) 위에서 렌더할 때만 사용(H3-5)
 */
function RichBody({ body, className = '', tone = 'dark' }) {
  if (!body || !Array.isArray(body.content) || !body.content.length) return null
  const c = TONES[tone] || TONES.dark
  return (
    <div className={`flex min-w-0 flex-col gap-16 break-keep ${className}`.trim()}>
      {body.content.map((node, i) => renderNode(node, i, c))}
    </div>
  )
}

export default RichBody
