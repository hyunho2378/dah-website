// scripts/contest-data.mjs — 공모전 원문 (51_CONTEST_SPLIT)
//
// 회차 하나 = post 하나. seed-contests.mjs(신규 DB 시드)와
// split-contest-editions.mjs(기존 묶음 post 분리)가 같은 정의를 공유해
// 두 경로의 결과가 어긋나지 않게 한다.
//
// 제목은 사용자 원문 그대로다. 학기마다 주관 도서관이 바뀌므로 기계 파생이 불가능해 나열한다.

const poster = (semester) => `/images/contests/poster-contest-${semester}.webp`
const bookplate = (semester) => `/images/contests/bookplate-contest-${semester}.webp`

const DAH_HOST = '디지털인문예술전공 운영위원회'
const LIBRARY_HOST = '한림대학교 도서관'

export const CONTEST_POSTS = [
  // 디지털인문예술 프로젝트 전시회 포스터 공모전
  {
    seed_key: 'contest-dah-poster-2024-2',
    semester_label: '2024-2',
    title_ko: '2024-2 디지털인문예술 프로젝트 전시회 포스터 공모전',
    title_en: 'DAH Project Exhibition Poster Contest',
    poster_url: poster('2024-2'),
    host: DAH_HOST,
  },
  {
    seed_key: 'contest-dah-poster-2025-1',
    semester_label: '2025-1',
    title_ko: '2025-1 디지털인문예술 프로젝트 전시회 포스터 공모전',
    title_en: 'DAH Project Exhibition Poster Contest',
    poster_url: poster('2025-1'),
    host: DAH_HOST,
  },
  {
    seed_key: 'contest-dah-poster-2025-2',
    semester_label: '2025-2',
    title_ko: '2025-2 디지털인문예술 프로젝트 전시회 포스터 공모전',
    title_en: 'DAH Project Exhibition Poster Contest',
    poster_url: poster('2025-2'),
    host: DAH_HOST,
  },
  {
    seed_key: 'contest-dah-poster-2026-1',
    semester_label: '2026-1',
    title_ko: '2026-1 디지털인문예술 프로젝트 전시회 포스터 공모전',
    title_en: 'DAH Project Exhibition Poster Contest',
    poster_url: poster('2026-1'),
    host: DAH_HOST,
  },

  // 도서관 장서표 디자인 공모전 — 학기마다 주관 도서관이 다르다
  {
    seed_key: 'contest-library-bookplate-2024-2',
    semester_label: '2024-2',
    title_ko: '일송기념도서관 장서표 디자인 공모전',
    title_en: 'Library Bookplate Design Contest',
    poster_url: bookplate('2024-2'),
    host: LIBRARY_HOST,
  },
  {
    seed_key: 'contest-library-bookplate-2025-1',
    semester_label: '2025-1',
    title_ko: '일송기념도서관 장서표 디자인 공모전',
    title_en: 'Library Bookplate Design Contest',
    poster_url: bookplate('2025-1'),
    host: LIBRARY_HOST,
  },
  {
    seed_key: 'contest-library-bookplate-2025-2',
    semester_label: '2025-2',
    title_ko: '정선군립도서관 장서표 디자인 공모전',
    title_en: 'Library Bookplate Design Contest',
    poster_url: bookplate('2025-2'),
    host: LIBRARY_HOST,
  },
  {
    seed_key: 'contest-library-bookplate-2026-1',
    semester_label: '2026-1',
    title_ko: '인제 기적의 도서관 장서표 디자인 공모전',
    title_en: 'Library Bookplate Design Contest',
    poster_url: bookplate('2026-1'),
    host: LIBRARY_HOST,
  },
]

/** 분리 대상 묶음 post의 seed_key → 회차 seed_key 접두사 */
export const LEGACY_BUNDLES = {
  'contest-dah-poster': 'contest-dah-poster',
  'contest-library-bookplate': 'contest-library-bookplate',
}
