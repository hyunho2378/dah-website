import { useEffect } from 'react';

const BASE_TITLE = '한림대학교 디지털인문예술전공';

/**
 * useTitle — 페이지별 document.title 갱신 훅
 * G10: 구분자 "|" 사용. title이 있으면 "페이지명 | 한림대학교 디지털인문예술전공", 없으면 기본 타이틀.
 *
 * @param {string} [title] - 페이지명
 */
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  }, [title]);
}
