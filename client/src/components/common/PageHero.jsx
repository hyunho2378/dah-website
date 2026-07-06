// COMPONENTS.md §1 PageHero — eyebrow mono → h1 → desc(bodyL sec, max-w 640)
// 하단 헤어라인, 섹션 패딩 상단만 절반(48/80), 하단은 기본(96/160)
// v2: 기존 페이지 호환용으로 유지(PageBanner와 별개). 헤어라인만 glass-line 톤 정돈.
// props 시그니처 변경 금지.
import Container from '../layout/Container'

function PageHero({ eyebrow, titleKr, desc }) {
  return (
    <section className="border-b border-glass-line">
      <Container className="pb-96 pt-48 md:pb-160 md:pt-80">
        <p className="font-mono text-label-m uppercase tracking-label text-text-sec md:text-label-d">
          {eyebrow}
        </p>
        {/* v2(11_DESIGN_V2 3절): KR 헤드라인 700(font-bold), 800 남발 금지 */}
        <h1 className="mt-16 text-h1-m font-bold leading-tight tracking-display text-text-pri md:text-h1-d">
          {titleKr}
        </h1>
        {desc && (
          <p className="mt-24 max-w-[640px] text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
            {desc}
          </p>
        )}
      </Container>
    </section>
  )
}

export default PageHero
