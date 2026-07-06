// COMPONENTS.md §1 PageHero — eyebrow mono → h1(Pretendard 800) → desc(bodyL sec, max-w 640)
// 하단 헤어라인, 섹션 패딩 상단만 절반(48/80), 하단은 기본(96/160)
function PageHero({ eyebrow, titleKr, desc }) {
  return (
    <section className="border-b border-border-subtle">
      <div className="mx-auto max-w-container px-gutter-m pb-96 pt-48 md:px-gutter-t md:pb-160 md:pt-80 lg:px-gutter-d">
        <p className="font-mono text-label-m uppercase tracking-label text-text-sec md:text-label-d">
          {eyebrow}
        </p>
        <h1 className="mt-16 text-h1-m font-extrabold leading-tight tracking-display text-text-pri md:text-h1-d">
          {titleKr}
        </h1>
        {desc && (
          <p className="mt-24 max-w-[640px] text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
            {desc}
          </p>
        )}
      </div>
    </section>
  )
}

export default PageHero
