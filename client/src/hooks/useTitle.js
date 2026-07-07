import { useEffect } from 'react';

const BASE_TITLE = '디지털인문예술전공';

/**
 * useTitle — 페이지별 document.title 갱신 훅
 * K2-6: "디지털인문예술전공 - 페이지명" 형식(하이픈). 페이지명 없으면 기본 타이틀만.
 *
 * @param {string} [title] - 페이지명
 */
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${BASE_TITLE} - ${title}` : BASE_TITLE;
  }, [title]);
}
