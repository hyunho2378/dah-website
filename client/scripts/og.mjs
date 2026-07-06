// og.mjs — DAH 웹사이트 OG(Open Graph) 소셜 공유 이미지 생성기 (일회성/재생성용)
// 산출물: client/public/og.png (1600x840), 전부 모노크롬 (DESIGN.md 준수)
//
// 렌더 방식: opentype.js로 폰트 글리프를 SVG path로 변환 → 폰트 의존 제거한
//            순수 SVG 문자열을 조립 → sharp(librsvg)로 png 렌더.
//            orbit-static.svg는 파일을 읽어 SVG에 인라인 합성.
//
// 실행: node scripts/og.mjs   (client 디렉터리 기준)
// devDependencies: sharp, opentype.js

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = path.join(__dirname, 'fonts');
const CLIENT_DIR = path.join(__dirname, '..');

// 색상 (tokens.js 원본 값 그대로)
const COLOR = {
  bg: '#08090A',
  pri: '#F7F8F8',
  sec: '#8A8F98',
};

const W = 1600;
const H = 840;

// 다운로드할 폰트 (로컬 캐시 우선, 없으면 fetch)
const FONTS = [
  {
    file: 'Anton-Regular.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/anton/Anton-Regular.ttf',
  },
  {
    file: 'IBMPlexMono-Regular.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf',
  },
  {
    file: 'IBMPlexMono-Medium.ttf',
    url: 'https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Medium.ttf',
  },
  {
    // 원 지침의 github raw 경로는 Git LFS라 HTML을 반환하므로,
    // index.html이 이미 사용하는 jsdelivr(npm) 미러의 정적 ttf를 사용.
    file: 'Pretendard-Bold.ttf',
    url: 'https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/alternative/Pretendard-Bold.ttf',
  },
];

async function ensureFonts() {
  await mkdir(FONT_DIR, { recursive: true });
  for (const f of FONTS) {
    const dest = path.join(FONT_DIR, f.file);
    if (existsSync(dest)) continue;
    process.stdout.write(`downloading ${f.file} ... `);
    const res = await fetch(f.url);
    if (!res.ok) throw new Error(`font download failed (${res.status}): ${f.url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    console.log('ok');
  }
}

// 문자열을 SVG 조각으로 변환.
// 주의: opentype.js 는 accumulate 된 fractional x 로 getPath 를 연속 호출하면
//       toPathData 결과에 NaN 이 섞이는 버그가 있다(librsvg 가 path 전체를 폐기).
//       따라서 각 글리프는 항상 원점(0,0)에서 path 화하고, 배치는 SVG transform 으로 처리한다.
function textGroup(font, text, x, baseline, size, fill, letterSpacing = 0) {
  let cursor = x;
  const parts = [];
  for (const ch of text) {
    const d = font.getPath(ch, 0, 0, size).toPathData(2);
    if (d && !d.includes('NaN')) {
      const tx = Math.round(cursor * 100) / 100;
      parts.push(
        `<path transform="translate(${tx},${baseline})" d="${d}" fill="${fill}"/>`
      );
    }
    cursor += font.getAdvanceWidth(ch, size) + letterSpacing;
  }
  return { svg: parts.join('\n  '), width: cursor - letterSpacing - x };
}

function measure(font, text, size, letterSpacing = 0) {
  let w = 0;
  for (const ch of text) w += font.getAdvanceWidth(ch, size) + letterSpacing;
  return w - letterSpacing;
}

// orbit-static.svg 의 내부 그래픽만 추출해 그룹으로 인라인
async function orbitInner() {
  const svg = await readFile(
    path.join(CLIENT_DIR, 'public', 'images', 'orbit-static.svg'),
    'utf8'
  );
  // 최상위 <svg ...> 와 </svg> 만 제거하고 내부 <g> 들을 그대로 사용
  const inner = svg
    .replace(/<svg[\s\S]*?>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim();
  return inner;
}

async function main() {
  await ensureFonts();

  const load = (file) => {
    const b = readFileSync(path.join(FONT_DIR, file));
    return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
  };
  const antonFont = load('Anton-Regular.ttf');
  const monoFont = load('IBMPlexMono-Medium.ttf');
  const krFont = load('Pretendard-Bold.ttf');

  const marginL = 96;

  // --- 상단 좌측: mono eyebrow ---
  const eyebrow = 'HALLYM UNIVERSITY — SINCE 2017';
  const eyebrowSize = 22;
  const eyebrowLS = eyebrowSize * 0.12; // tracking 0.12em (DESIGN.md label 규칙)
  const eyebrowG = textGroup(monoFont, eyebrow, marginL, 108, eyebrowSize, COLOR.sec, eyebrowLS);

  // --- 중앙: Anton 대문자 타이틀 (좌측 정렬, 2줄) ---
  const line1 = 'DIGITAL ARTS';
  const line2 = '& HUMANITIES';
  const maxTitleWidth = 1040; // 우측 궤도 공간 확보
  let titleSize = 156;
  const w1 = () => measure(antonFont, line1, titleSize);
  const w2 = () => measure(antonFont, line2, titleSize);
  while (Math.max(w1(), w2()) > maxTitleWidth && titleSize > 60) titleSize -= 2;
  const lineGap = titleSize * 0.98;
  const baseY1 = 428;
  const baseY2 = baseY1 + lineGap;
  const titleG1 = textGroup(antonFont, line1, marginL, baseY1, titleSize, COLOR.pri);
  const titleG2 = textGroup(antonFont, line2, marginL, baseY2, titleSize, COLOR.pri);

  // --- 하단: 한글 라벨 (Pretendard Bold) ---
  const krLabel = '디지털인문예술전공';
  const krSize = 30;
  const krG = textGroup(krFont, krLabel, marginL, 782, krSize, COLOR.sec);

  // --- 우측: 궤도 그래픽 (은은하게, 밝기 낮춤) ---
  const orbit = await orbitInner();
  // orbit-static.svg 중심(792,405) 을 캔버스 우측(1480,420)으로 이동, 밝기(opacity) 하향
  const orbitG = `<g transform="translate(688,15)" opacity="0.75">${orbit}</g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${COLOR.bg}"/>
  ${orbitG}
  ${eyebrowG.svg}
  ${titleG1.svg}
  ${titleG2.svg}
  ${krG.svg}
</svg>`;

  const outPath = path.join(CLIENT_DIR, 'public', 'og.png');
  await sharp(Buffer.from(svg)).png().toFile(outPath);

  const meta = await sharp(outPath).metadata();
  console.log(`\nwrote ${outPath}`);
  console.log(`size: ${meta.width}x${meta.height}`);
  console.log(`title font size (auto-fit): ${titleSize}`);
}

main().catch((err) => {
  console.error('OG generation failed:', err);
  process.exit(1);
});
