import { useEffect, useRef, useState } from 'react';

/**
 * useReveal — 스크롤 리빌 훅 (DESIGN.md 5절, COMPONENTS.md Reveal 스펙)
 * IntersectionObserver 기반. 1회만 발동 후 unobserve.
 * prefers-reduced-motion 환경에서는 관찰 없이 즉시 revealed = true.
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

    const observer = new IntersectionObserver(
      (entries) => {
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
    return () => observer.disconnect();
  }, [threshold, revealed]);

  return { ref, revealed };
}
