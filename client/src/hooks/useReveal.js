import { useEffect, useRef, useState } from 'react';

/**
 * useReveal — 스크롤 리빌 훅 (DESIGN.md 5절, COMPONENTS.md Reveal 스펙)
 * IntersectionObserver 기반. 1회만 발동 후 unobserve.
 * prefers-reduced-motion 환경에서는 관찰 없이 즉시 revealed = true.
 *
 * 가시성 계약(39_FIX_EXHIBITION_REVEAL): 노출 판정은 mount + IntersectionObserver
 * 로만 이뤄진다. 장식 효과(WebGL·html2canvas 스냅샷 등)의 성공 여부에 본문 가시성을
 * 절대 의존시키지 않으며, 관찰 자체가 배달되지 않는 환경에서도 아래 안전망이
 * 무조건 노출로 수렴시킨다 — 읽고 눌러야 하는 콘텐츠가 숨은 채 남는 경로는 없다.
 *
 * @param {number} [threshold=0.15] - IntersectionObserver threshold
 * @returns {{ ref: import('react').RefObject, revealed: boolean }}
 */
export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return undefined;
    }

    const node = ref.current;
    if (!node) return undefined;

    let delivered = false;

    // 초기 뷰포트 안(above-the-fold) 요소는 스크롤이 없어도 즉시 노출한다.
    // IO 첫 배달을 기다리지 않고 다음 프레임에 직접 교차를 판정한다(레이아웃 확정 후).
    const frame = requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) setRevealed(true);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        delivered = true;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(node);

    // 안전망: observe() 등록 직후 1회 배달은 규격상 보장된다(교차 여부 무관).
    // 그 배달이 오지 않으면 관찰 파이프라인이 죽은 것이므로 콘텐츠를 계속 숨겨두지
    // 않고 무조건 노출한다. 정상 환경에서는 첫 배달이 즉시 도착해 발동하지 않는다.
    const watchdog = setTimeout(() => {
      if (!delivered) setRevealed(true);
    }, 1200);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(watchdog);
      observer.disconnect();
    };
  }, [threshold, revealed]);

  return { ref, revealed };
}
