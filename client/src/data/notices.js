/**
 * notices.js — 공지사항 19건 (source_content.md '공지사항' 절 원문 전량 이관, 날짜 내림차순)
 *
 * - org 매핑 (IA.md /news 필터 4종 고정): 디지털인문예술전공 → '전공',
 *   미래융합스쿨/창업지원본부는 그대로, 그 외 기관은 '기타' (원본 기관명은 각 항목 주석에 보존)
 * - 제목·URL 원문 그대로. 원문 마크다운 이스케이프(\~, \_ 등)만 실제 문자로 복원
 * - 일부 항목의 기관 태그에 무관한 blog.naver.com 링크가 붙은 원문 마크다운 깨짐 있음 — 공지 본문 URL만 이관
 *
 * @typedef {Object} Notice
 * @property {string} id - 고유 id
 * @property {string} date - 게시일 'YYYY-MM-DD' (원문 그대로)
 * @property {('전공'|'미래융합스쿨'|'창업지원본부'|'기타')} org - 기관 태그
 * @property {string} title - 공지 제목 (원문 그대로)
 * @property {string} url - 구글 사이트 원본 공지 URL (원문 그대로)
 */
export const notices = [
  {
    id: 'notice-01',
    date: '2026-05-08',
    org: '전공',
    title: '2026 디지털인문예술전공 신규 캐릭터 공모전 결과 공지',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/2026-%EC%8B%A0%EA%B7%9C-%EC%BA%90%EB%A6%AD%ED%84%B0-%EA%B3%B5%EB%AA%A8%EC%A0%84-%EA%B2%B0%EA%B3%BC-%EA%B3%B5%EC%A7%80?authuser=0',
  },
  {
    id: 'notice-02',
    date: '2026-05-02',
    org: '미래융합스쿨',
    title: '2026 강원과 함께 하는 도서관 장서표 디자인 공모전',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/2026-%EC%9E%A5%EC%84%9C%ED%91%9C-%EB%94%94%EC%9E%90%EC%9D%B8-%EA%B3%B5%EB%AA%A8%EC%A0%84?authuser=0',
  },
  {
    id: 'notice-03',
    date: '2026-05-02',
    org: '미래융합스쿨',
    title: '2026-1학기 디지털인문예술전공 프로젝트 전시회 포스터 공모전',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/2026-%EC%A0%84%EC%8B%9C%ED%9A%8C-%ED%8F%AC%EC%8A%A4%ED%84%B0-%EA%B3%B5%EB%AA%A8%EC%A0%84?authuser=0',
  },
  {
    id: 'notice-04',
    date: '2026-05-02',
    org: '전공',
    title: '2026 신규 캐릭터 공모전 온라인 투표',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/2026-%EC%8B%A0%EA%B7%9C-%EC%BA%90%EB%A6%AD%ED%84%B0-%EA%B3%B5%EB%AA%A8%EC%A0%84-%EC%98%A8%EB%9D%BC%EC%9D%B8-%ED%88%AC%ED%91%9C?authuser=0',
  },
  {
    id: 'notice-05',
    date: '2026-05-02',
    org: '전공',
    title: '2026학년도 1학기 디지털인문예술전공 프로젝트 전시회 참가 신청',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/2026%ED%95%99%EB%85%84%EB%8F%84-1%ED%95%99%EA%B8%B0-%EB%94%94%EC%A7%80%ED%84%B8%EC%9D%B8%EB%AC%B8%EC%98%88%EC%88%A0%EC%A0%84%EA%B3%B5-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%A0%84%EC%8B%9C%ED%9A%8C-%EC%B0%B8%EA%B0%80-%EC%8B%A0%EC%B2%AD?authuser=0',
  },
  {
    id: 'notice-06',
    date: '2026-03-31',
    org: '창업지원본부',
    title: '2026 Station C 아이데이션 캠프 모집 안내',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/2026-station-c-%EC%95%84%EC%9D%B4%EB%8D%B0%EC%9D%B4%EC%85%98-%EC%BA%A0%ED%94%84-%EB%AA%A8%EC%A7%91-%EC%95%88%EB%82%B4?authuser=0',
  },
  {
    id: 'notice-07',
    date: '2026-03-26',
    org: '기타', // 원문 기관: 대학일자리플러스센터
    title: '2026 커리어 아이디어 공모전 개최',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/%EC%BB%A4%EB%A6%AC%EC%96%B4-%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4-%EA%B3%B5%EB%AA%A8%EC%A0%84?authuser=0',
  },
  {
    id: 'notice-08',
    date: '2026-03-23',
    org: '전공',
    title: '2026 디지털인문예술전공 신규 캐릭터 공모전 안내',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/2026-%EB%94%94%EC%A7%80%ED%84%B8%EC%9D%B8%EB%AC%B8%EC%98%88%EC%88%A0%EC%A0%84%EA%B3%B5-%EC%8B%A0%EA%B7%9C-%EC%BA%90%EB%A6%AD%ED%84%B0-%EA%B3%B5%EB%AA%A8%EC%A0%84-%EC%95%88%EB%82%B4?authuser=0',
  },
  {
    id: 'notice-09',
    date: '2026-03-20',
    org: '기타', // 원문 기관: 교육혁신센터
    title: 'AI 활용 능력 강화 학습지원 프로그램 온라인 특강 안내',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/ai-%ED%99%9C%EC%9A%A9-%EB%8A%A5%EB%A0%A5-%EA%B0%95%ED%99%94-%ED%95%99%EC%8A%B5%EC%A7%80%EC%9B%90-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8-%EC%98%A8%EB%9D%BC%EC%9D%B8-%ED%8A%B9%EA%B0%95-%EC%95%88%EB%82%B4?authuser=0',
  },
  {
    id: 'notice-10',
    date: '2026-03-18',
    org: '기타', // 원문 기관: 교육혁신센터
    title: '2026-1학기 지역사회 문제해결 PBL 프레젠테이션 경진대회 개최 안내',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/26-1-pbl-%EA%B2%BD%EC%A7%84%EB%8C%80%ED%9A%8C?authuser=0',
  },
  {
    id: 'notice-11',
    date: '2026-03-18',
    org: '창업지원본부',
    title: '2026 Station C 서포터즈 모집',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/%EC%8A%A4%ED%85%8C%EC%9D%B4%EC%85%98%EC%94%A8%EC%84%9C%ED%8F%AC%ED%84%B0%EC%A6%88?authuser=0',
  },
  {
    id: 'notice-12',
    date: '2026-03-17',
    org: '기타', // 원문 기관: 멋쟁이사자처럼
    title: '한림대학교 멋쟁이사자처럼 대학 14기 아기사자 모집',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/%EB%A9%8B%EC%9F%81%EC%9D%B4%EC%82%AC%EC%9E%90%EC%B2%98%EB%9F%BC?authuser=0',
  },
  {
    id: 'notice-13',
    date: '2026-03-13',
    org: '기타', // 원문 기관: 강원신용보증재단
    title: '청년 서포터즈 모집',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/%EC%B2%AD%EB%85%84%EC%84%9C%ED%8F%AC%ED%84%B0%EC%A6%88?authuser=0',
  },
  {
    id: 'notice-14',
    date: '2026-03-13',
    org: '기타', // 원문 기관: KOICA. 원문 마크다운 깨짐: 링크 텍스트가 "(~3.20"에서 끊기고 닫는 괄호가 링크 밖에 있음
    title: '2026 그린 ODA 서포터즈 추가 모집 안내 (~3.20)',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/%EC%BD%94%EC%9D%B4%EC%B9%B4%EC%84%9C%ED%8F%AC%ED%84%B0%EC%A6%88?authuser=0',
  },
  {
    id: 'notice-15',
    date: '2026-03-13',
    org: '기타', // 원문 기관: 지역정주센터. 제목의 'G-Sㅓ포터즈'는 원문 표기 그대로 (오탈자 임의 수정 금지)
    title: '5기 G-Sㅓ포터즈 모집 안내',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/%EC%A7%80%EC%97%AD%EC%A0%95%EC%A3%BC%EC%84%BC%ED%84%B0-%EC%A7%80%EC%84%9C%ED%8F%AC%ED%84%B0%EC%A6%88?authuser=0',
  },
  {
    id: 'notice-16',
    date: '2026-03-11',
    org: '기타', // 원문 기관: 교육혁신센터
    title: '2026-1학기 좋은 수업 Learning Portfolio 공모전',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/26-1-%EC%A2%8B%EC%9D%80-%EC%88%98%EC%97%85-%EA%B3%B5%EB%AA%A8%EC%A0%84?authuser=0',
  },
  {
    id: 'notice-17',
    date: '2026-03-04',
    org: '전공',
    title: '2026-1 디지털인문예술전공 비전 설명회 및 개강 총회 공지',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/26-1-%EA%B0%9C%EA%B0%95-%EC%B4%9D%ED%9A%8C?authuser=0',
  },
  {
    id: 'notice-18',
    date: '2026-02-19',
    org: '기타', // 원문 기관: L-HUSS
    title: '2026 L-HUSS in the World 해외 탐방(일본/삿포로) 모집 공고',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/huss-%EC%82%BF%ED%8F%AC%EB%A1%9C?authuser=0',
  },
  {
    id: 'notice-19',
    date: '2026-01-23',
    org: '전공',
    title: '2026 제1대 디지털인문예술전공 운영위원회 "LUCID" 신입 부원 모집',
    url: 'https://sites.google.com/glab.hallym.ac.kr/dah-hallym/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/26-%EC%9C%84%EC%9B%90%ED%9A%8C-%EC%8B%A0%EC%9E%85%EB%B6%80%EC%9B%90-%EB%AA%A8%EC%A7%91-1?authuser=0',
  },
];
