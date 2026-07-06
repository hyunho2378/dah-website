/**
 * professors.js — 교수진 11명 (source_content.md '교수진' 절 원문 이관)
 * 이름·이메일·링크 원문 그대로. 오탈자 임의 수정 금지.
 *
 * @typedef {Object} Professor
 * @property {string} id - 고유 id
 * @property {string} nameKr - 이름(한글, 원문 그대로)
 * @property {string} nameEn - 이름(영문, 원문 그대로)
 * @property {string} role - 직함 (원문 첫 줄 그대로)
 * @property {string|null} affiliation - 겸무 소속 (원문 둘째 줄, 없으면 null)
 * @property {string} email - 이메일 (원문 그대로)
 * @property {string|null} link - 외부 링크 (원문 '교수 소개'/'website', 없으면 null)
 * @property {boolean} lead - 주임교수 여부 (김용수만 true)
 */
export const professors = [
  {
    id: 'kim-yongsoo',
    nameKr: '김용수',
    nameEn: 'Yongsoo Kim',
    role: '디지털인문예술전공 주임교수',
    affiliation: '영어영문학과 교수',
    email: 'vadoropupille@gmail.com',
    // 원문에 링크 2개: 교수 소개(아래), website(https://sites.google.com/site/vadoroclass/)
    link: 'https://jazzy-timpani-51c.notion.site/CV-720152021c234c4baa3d610be64cbc1d',
    lead: true,
  },
  {
    id: 'kim-sungwoo',
    nameKr: '김성우',
    nameEn: 'Sungwoo Kim',
    role: '디지털인문예술전공 교수',
    affiliation: null,
    email: 'caerang@gmail.com',
    link: 'https://www.hallym.ac.kr/future/3527/subview.do?enc=Zm5jdDF8QEB8JTJGcHJvZkluZm8lMkZmdXR1cmUlMkY2NiUyRjQ0MjAzJTJGdmlldy5kbyUzRmZpbmRUeXBlJTNEJTI2',
    lead: false,
  },
  {
    id: 'yoo-inseon',
    nameKr: '유인선',
    nameEn: 'Inseon Yoo',
    role: '디지털인문예술전공 교수',
    affiliation: '국어국문학전공 교수',
    email: 'insun710@glab.hallym.ac.kr',
    link: null,
    lead: false,
  },
  {
    id: 'han-soomi',
    nameKr: '한수미',
    nameEn: 'Soomi Han',
    role: '디지털인문예술전공 교수',
    affiliation: '영어영문학과 교수',
    email: 'sumihan20@gmail.com',
    link: 'https://sites.google.com/glab.hallym.ac.kr/sumihan',
    lead: false,
  },
  {
    id: 'song-injae',
    nameKr: '송인재',
    nameEn: 'Injae Song',
    role: '디지털인문예술전공 교수',
    affiliation: '한림과학원',
    email: 'tanksong@hallym.ac.kr',
    link: null,
    lead: false,
  },
  {
    id: 'yang-taegeun',
    nameKr: '양태근',
    nameEn: 'Taegeun Yang',
    role: '디지털인문예술전공 교수',
    affiliation: '중국학과 교수',
    email: 'ytk@hallym.ac.kr',
    link: null,
    lead: false,
  },
  {
    id: 'lee-junggeun',
    nameKr: '이정근',
    nameEn: 'Junggeun Lee',
    role: '디지털인문예술전공 교수',
    affiliation: 'SW소프트웨어전공 교수', // 원문 표기 그대로
    email: 'jeonggun.lee@hallym.ac.kr',
    link: null,
    lead: false,
  },
  {
    id: 'lee-eunsol',
    nameKr: '이은솔',
    nameEn: 'Eunsol Lee',
    role: '디지털인문예술전공 겸임교수',
    affiliation: null,
    email: 'eunsol_erin@naver.com',
    link: null,
    lead: false,
  },
  {
    id: 'kim-jeehyun',
    nameKr: '김지현',
    nameEn: 'Jeehyun Kim',
    role: '디지털인문예술전공', // 원문에 직함 표기 없음 — 그대로 이관
    affiliation: null,
    email: '41986@hallym.ac.kr',
    link: null,
    lead: false,
  },
  {
    id: 'song-hanna',
    nameKr: '송한나',
    nameEn: 'Hanna Song',
    role: '디지털인문예술전공', // 원문에 직함 표기 없음 — 그대로 이관
    affiliation: null,
    email: '89570@gmail.hallym.ac.kr', // 원문 표기 그대로 (gmail.hallym.ac.kr 도메인)
    link: 'https://www.cognitumlab.com/',
    lead: false,
  },
  {
    id: 'seo-joohee',
    nameKr: '서주희',
    nameEn: 'Joohee Seo',
    role: '디지털인문예술전공 겸임교수',
    affiliation: null,
    email: 'kbsmac77@hanmail.net',
    link: null,
    lead: false,
  },
];
