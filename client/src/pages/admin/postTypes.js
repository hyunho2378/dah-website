// postTypes.js — /admin/posts/:type 공용 설정 (13_CMS_SPEC 1절 편집 매트릭스)
// template: t1 게시글형 / t2 포스터형 / exhibition T2 확장 / achievement 성좌 필드 / portfolio 진로
// enRequired: true면 발행(published) 시 영문 제목 필수 — 임시저장은 영문 없이 허용 (R1 발행 게이트)

export const POST_TYPES = {
  notice: {
    label: '공지사항',
    template: 't1',
    tags: true, // K1-1: 공용 태그 저장소(GET /tags) 사용 — 하드코딩 배열 없음
    attachments: true, // 공지도 문서 첨부 허용 (content-config notice attachments)
    enRequired: false, // 영문 없이 발행 허용 — 영문 페이지는 국문 폴백(Korean only 뱃지)
  },
  resource: {
    label: '자료실',
    template: 't1',
    attachments: true, // 첨부(Blob) — attachments jsonb에 [{ name, url }]로 저장 (K1-3)
    enRequired: true,
  },
  club: {
    label: '동아리',
    template: 't1',
    enRequired: true,
  },
  lecture: {
    label: '특강',
    template: 't2',
    enRequired: true,
  },
  contest: {
    label: '공모전',
    template: 't2', // external_url 있으면 카드에서 바로 외부 분기 (10_IA_V2)
    enRequired: true,
  },
  exhibitions: {
    label: '프로젝트 전시회',
    template: 'exhibition', // T2 확장 — 기존 아카이브 소급 입력도 동일 폼
    enRequired: true,
  },
  achievement: {
    label: '학생 성과',
    template: 'achievement', // 수상명/수상자/주최/연도/대회 URL. 게시판 렌더 금지
    enRequired: true,
  },
  portfolios: {
    label: '포트폴리오',
    template: 'portfolio',
    enRequired: false, // 링크형 진로 그리드 — 영문 제목 개념 없음
  },
}

/** 리스트 행 제목 — 유형별 필드 차이 흡수 */
export function titleOf(item) {
  return item.title_ko || item.title || item.name || item.grad_name || `#${item.id}`
}

/** 리스트 행 메타(mono) */
export function metaOf(item) {
  const date = item.event_start || item.start_date || item.held_at || item.created_at || item.year
  if (!date) return ''
  return String(date).slice(0, 10)
}
