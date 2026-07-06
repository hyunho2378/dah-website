// RichBody.jsx — Tiptap JSON(body jsonb) → React 렌더러 (13_CMS_SPEC 2절)
// Tiptap 미의존 순수 JSON 워커. 에디터 CSS 유출 금지 — 토큰 클래스만 사용.
// 지원 노드: paragraph, heading(2·3), bulletList, orderedList, listItem,
// blockquote, horizontalRule, codeBlock, image, table 계열, hardBreak,
// 임베드 3종(youtube / figma / googleSlides — 글래스 프레임 + aspect-video)

import { Fragment } from 'react'

const EMBED_FRAME =
  'overflow-hidden rounded-glass border border-glass-line bg-glass-bg'
const EMBED_IFRAME = 'aspect-video h-auto w-full'

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

function renderText(node, key) {
  let el = node.text || ''
  for (const mark of node.marks || []) {
    switch (mark.type) {
      case 'bold':
        el = <strong className="font-bold text-text-pri">{el}</strong>
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
          <code className="rounded-sm bg-bg-panel px-8 font-mono text-small-m text-text-pri">
            {el}
          </code>
        )
        break
      case 'link':
        el = (
          <a
            href={mark.attrs?.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-pri underline decoration-border-strong underline-offset-4 transition duration-fast ease-out hover:decoration-border-focus"
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

function renderNode(node, key) {
  if (!node || typeof node !== 'object') return null
  const children = (node.content || []).map((child, i) => renderNode(child, i))

  switch (node.type) {
    case 'text':
      return renderText(node, key)
    case 'paragraph':
      return (
        <p
          key={key}
          className="text-body-m leading-relaxed text-text-sec md:text-body-d"
        >
          {children.length ? children : <br />}
        </p>
      )
    case 'heading': {
      if (node.attrs?.level === 2) {
        return (
          <h2
            key={key}
            className="mt-32 text-h2-m font-bold leading-snug text-text-pri first:mt-0 md:text-h2-d"
          >
            {children}
          </h2>
        )
      }
      return (
        <h3
          key={key}
          className="mt-24 text-h3-m font-bold leading-snug text-text-pri first:mt-0 md:text-h3-d"
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
          className="text-body-m leading-relaxed text-text-sec marker:text-text-meta md:text-body-d [&>p]:text-body-m md:[&>p]:text-body-d"
        >
          {children}
        </li>
      )
    case 'blockquote':
      // 인용 헤어라인
      return (
        <blockquote
          key={key}
          className="border-l border-border-strong pl-16 text-body-l-m leading-relaxed text-text-sec md:text-body-l-d"
        >
          {children}
        </blockquote>
      )
    case 'horizontalRule':
      return <hr key={key} className="my-16 border-0 border-t border-border-subtle" />
    case 'codeBlock':
      return (
        <pre
          key={key}
          className="overflow-x-auto rounded-md border border-border-subtle bg-bg-panel p-16 font-mono text-small-m leading-normal text-text-sec md:text-small-d"
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
          className="w-full rounded-md border border-border-subtle bg-bg-elev"
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
          className="border border-border-subtle bg-bg-panel px-12 py-8 text-left font-semibold text-text-pri [&>p]:text-text-pri"
        >
          {children}
        </th>
      )
    case 'tableCell':
      return (
        <td
          key={key}
          className="border border-border-subtle px-12 py-8 align-top text-text-sec"
        >
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
 * @param {{ body: Object|null, className?: string }} props
 */
function RichBody({ body, className = '' }) {
  if (!body || !Array.isArray(body.content) || !body.content.length) return null
  return (
    <div className={`flex min-w-0 flex-col gap-16 break-keep ${className}`.trim()}>
      {body.content.map((node, i) => renderNode(node, i))}
    </div>
  )
}

export default RichBody
