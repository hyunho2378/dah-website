// scripts/convert-posters-webp.mjs — 전시회 포스터 PNG → WebP 일괄 변환 (G5, 18_PHASE6)
// 품질 80 시작, 결과가 400KB 초과면 품질을 10씩 낮춰 재압축(하한 40).
// 변환 성공 시 원본 PNG 삭제. 실행: server/ 안에서 `node scripts/convert-posters-webp.mjs`
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIR = path.resolve(__dirname, '../../client/public/images/exhibitions')
const MAX_BYTES = 400 * 1024
const START_Q = 80
const MIN_Q = 40

async function convert(file) {
  const src = path.join(DIR, file)
  const out = src.replace(/\.png$/i, '.webp')
  let q = START_Q
  let buf = await sharp(src).webp({ quality: q }).toBuffer()
  while (buf.length > MAX_BYTES && q > MIN_Q) {
    q -= 10
    buf = await sharp(src).webp({ quality: q }).toBuffer()
  }
  fs.writeFileSync(out, buf)
  fs.unlinkSync(src)
  const kb = Math.round(buf.length / 1024)
  console.log(`[webp] ${file} → ${path.basename(out)} q${q} ${kb}KB${buf.length > MAX_BYTES ? ' (하한 도달, 400KB 초과)' : ''}`)
}

const files = fs.readdirSync(DIR).filter((f) => /\.png$/i.test(f))
if (!files.length) {
  console.log('[webp] 변환할 PNG 없음')
} else {
  for (const f of files.sort()) await convert(f)
  console.log(`[webp] 완료 — ${files.length}개 변환`)
}
