# IA.md — 정보 구조

방문자 2종을 동시에 상대한다: (A) 진학·전과 고민 학생과 학부모, (B) 산학·공모전·채용 관계자. 홈은 A/B 공용 요약, 서브페이지는 목적 탐색용.

## 1. 사이트맵

```
/                Home
/about           전공 소개 (What·Why, Mission·Vision, 연혁)
/tracks          트랙·커리큘럼 (3트랙, 4년 로드맵, 코드쉐어링)
/people          사람 (교수진 11, 산업 멘토단)
/achievements    실적 (수상·논문 연도별 아카이브)
/careers         진로 (졸업생 취업 현황, 재학생 포트폴리오)
/news            소식 (공지사항 전체, 전시회 링크)
*                404
```

전시회(26-1-dah-exhibition.vercel.app)와 인스타그램(@hallym_lucid)은 외부 링크. 내부 재구현 금지.

## 2. Home 섹션 순서 (고정, 임의 변경 금지)

| # | 섹션 | 내용 | 데이터 소스 |
|---|---|---|---|
| 0 | Header | 로고(DAH) + 메뉴 6 + CTA(전시회 →) | site.js |
| 1 | Hero | eyebrow "HALLYM UNIVERSITY / SINCE 2017" + EN 캡스 "DIGITAL ARTS & HUMANITIES" (Anton, displayXL) + KR 서브 헤드 + 본문 2줄 + CTA 2(트랙 살펴보기 / 전시회 보러가기) + OrbitCanvas 배경 | site.js |
| 2 | NewsBar | "26-1 전공 프로젝트 전시회 — Against the Flow" 풀폭 배너 + 외부 링크 | site.js |
| 3 | Identity 3열 | 01 AI 퍼스트 커리큘럼(전 수업 AI·바이브코딩 도입) / 02 3트랙 융합(디자인·인문·콘텐츠) / 03 매 학기 전시(프로젝트를 공개로 증명). mono 넘버 + 아이소 에셋 + 제목 + 본문 | identity.js |
| 4 | Tracks 프리뷰 | 3카드: 미래융합디자인 / AI디지털인문학 / 문화예술콘텐츠. 각 카드 → /tracks 앵커 | tracks.js |
| 5 | Curriculum 다이어그램 | 1~4학년 로드맵 인라인 SVG (Linear 간트 문법). "전체 커리큘럼 →" 링크 | curriculum.js |
| 6 | Stats | 실측 수치만: 설립 2017 / 트랙 3 / 교수진 11 / 산업 멘토 12 / 코드쉐어링 인정 학과 19 / 매 학기 전시 1회. 이 외 수치 임의 추가 금지 | stats.js |
| 7 | People 프리뷰 | 교수 카드 4명(주임 김용수 포함) + "전체 교수진 →" | professors.js |
| 8 | News 리스트 | Changelog 패턴 최근 공지 4건(날짜 mono + 기관 태그 + 제목) + "전체 소식 →" | notices.js |
| 9 | Final CTA | bg.invert 반전 블록. EN 캡스 "BUILD WHAT'S NEXT." + KR 한 줄 + 버튼 2(전시회 / Instagram) | site.js |
| 10 | Footer | 학과명 KR/EN, 주소(한림대 미래융합스쿨), 링크(전시회·인스타·한림대), 카피라이트 | site.js |

## 3. 서브페이지 구성

### /about
PageHero(eyebrow ABOUT + h1) → What is DAH → Why DAH → Mission·Vision 3항 → 연혁 타임라인(2017~2024, 수직, 날짜 mono) 

### /tracks
PageHero → 트랙 상세 3블록(각: mono 넘버 + 트랙명 + 설명 + 관련 교과목 리스트) → 4년 커리큘럼 전체 다이어그램(홈 SVG 확장판, 학년·학기 축) → 코드쉐어링 안내(정의 + 승인 절차 4단계 + 인정 학과 19개 리스트)

### /people
PageHero → 교수진 그리드 11명(카드: 이름 KR/EN, 직함, 소속, 이메일, 외부 링크 있으면 →) → 구분 헤어라인 → 멘토단 그리드 12명(이름, 기업, 직함, 기업 링크)

### /achievements
PageHero → 연도 필터(2026~2019, mono 탭) → 연도별 수상·논문 리스트(제목 + 수상자 + 주최 + 1줄 설명). 데이터는 source_content.md 원문에서 전량 이관

### /careers
PageHero → 취업 현황 그리드(졸업생명 + 전공 조합 + 회사명(외부 링크) + 직무) 약 24건 → 재학생 포트폴리오 8건(학번 + 이름 + 전공 조합 + 링크)

### /news
PageHero → 공지 전체 리스트(Changelog 패턴, 날짜 내림차순) + 기관 태그 필터(전공/미래융합스쿨/창업지원본부/기타). 각 항목은 구글 사이트 원본 URL로 외부 링크 (v1은 링크 아웃, 자체 CMS는 스코프 밖)

## 4. 내비게이션 플로우

- Header 메뉴: About / Tracks / People / Achievements / Careers / News + CTA "Exhibition →"(외부)
- 모바일: 햄버거 → 풀스크린 오버레이 메뉴(bg.base, 대형 링크 수직)
- Footer에서 전 페이지 재접근 가능
- 홈 각 프리뷰 섹션 → 해당 서브페이지 딥링크

## 5. 데이터 파일 계약 (src/data/)

site.js, identity.js, tracks.js, curriculum.js, stats.js, professors.js, mentors.js, history.js, achievements.js, careers.js, portfolios.js, notices.js

전 데이터는 docs/source_content.md 원문에서만 이관한다. 원문에 없는 수치·인명·인용 생성 절대 금지. 원문이 비어 있으면 해당 UI 항목을 렌더하지 않는다(빈 배열 허용).