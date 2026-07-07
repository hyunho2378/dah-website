// CosmosBackground — 우주 톤 배경 (P5-4: StarField 별/트윙클 전면 제거).
// 별 캔버스·rAF 없이 cosmos.depth0 바탕 + 매우 옅은 성운 글로우만 유지(COSMOS-TONE 계승).
// 좌상 보라 / 우하 청록 비대칭 + 중앙 상단 아주 옅은 보강 글로우(별 제거로 인한 허전함 최소 보정).
// 전부 정적 radial-gradient — backdrop-filter 미사용(blur 상한 무관), reduced-motion 무관.
function CosmosBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 bg-cosmos-depth0">
      <div className="pointer-events-none absolute inset-0 bg-nebula-violet" />
      <div className="pointer-events-none absolute inset-0 bg-nebula-teal" />
      <div className="pointer-events-none absolute inset-0 bg-nebula-soft" />
    </div>
  )
}

export default CosmosBackground
