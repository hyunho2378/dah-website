// embeds.js — 피그마·구글 슬라이드 커스텀 임베드 노드 (13_CMS_SPEC 2절)
// URL 붙여넣기 감지(nodePasteRule) 시 글래스 프레임 iframe 노드로 삽입.
// 유튜브는 @tiptap/extension-youtube가 담당. JSON 노드명: figma / googleSlides.

import { Node, nodePasteRule } from '@tiptap/core'

// 붙여넣기 감지용 (전역 플래그 필수)
export const YOUTUBE_URL_REGEX =
  /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)[\w-]{6,}\S*/gi
export const FIGMA_URL_REGEX =
  /https?:\/\/(?:www\.)?figma\.com\/(?:file|proto|design|board|slides)\/\S+/gi
export const SLIDES_URL_REGEX = /https?:\/\/docs\.google\.com\/presentation\/d\/\S+/gi

function figmaEmbedSrc(src) {
  return `https://www.figma.com/embed?embed_host=dah&url=${encodeURIComponent(src || '')}`
}

function slidesEmbedSrc(src) {
  const m = String(src || '').match(/docs\.google\.com\/presentation\/d\/([\w-]+)/)
  return m ? `https://docs.google.com/presentation/d/${m[1]}/embed` : ''
}

const FRAME_CLASS =
  'my-12 overflow-hidden rounded-glass border border-glass-line bg-glass-bg'
const IFRAME_CLASS = 'pointer-events-none aspect-video h-auto w-full'

function createEmbedNode({ name, title, findRegex, buildSrc }) {
  return Node.create({
    name,
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
      return { src: { default: null } }
    },

    parseHTML() {
      return [
        {
          tag: `div[data-embed="${name}"]`,
          getAttrs: (el) => ({ src: el.getAttribute('data-src') }),
        },
      ]
    },

    renderHTML({ node }) {
      return [
        'div',
        { 'data-embed': name, 'data-src': node.attrs.src, class: FRAME_CLASS },
        [
          'iframe',
          {
            src: buildSrc(node.attrs.src),
            title,
            class: IFRAME_CLASS,
            loading: 'lazy',
            allowfullscreen: 'true',
          },
        ],
      ]
    },

    addPasteRules() {
      return [
        nodePasteRule({
          find: findRegex,
          type: this.type,
          getAttributes: (match) => ({ src: match[0] }),
        }),
      ]
    },
  })
}

export const FigmaEmbed = createEmbedNode({
  name: 'figma',
  title: 'Figma 임베드',
  findRegex: FIGMA_URL_REGEX,
  buildSrc: figmaEmbedSrc,
})

export const SlidesEmbed = createEmbedNode({
  name: 'googleSlides',
  title: 'Google Slides 임베드',
  findRegex: SLIDES_URL_REGEX,
  buildSrc: slidesEmbedSrc,
})
