# 12_BACKEND — 서버·DB·인증·운영 아키텍처

## 0. 스택 확정

| 층 | 선택 | 비고 |
|---|---|---|
| 프론트 | Vercel (기존) | |
| API 서버 | Render Free (Node + Express, JS) | 15분 무활동 슬립 |
| 슬립 방지 | UptimeRobot 5분 간격 GET /health | 무료 플랜 |
| DB | Neon Postgres | 스터디 사이트와 별도 프로젝트(브랜치 아님) 권장 |
| 파일 저장 | Vercel Blob | 아래 1절: 스터디 사이트와 계정 공유 가능 |
| 이미지 규칙 | 업로드 시 서버에서 WebP 변환, 최장변 1600(포스터 2400), 원본 폐기 | Blob 용량 절약 |

## 1. Vercel Blob 계정 공유 판정

가능. Blob은 계정 아래 "스토어" 단위로 분리되고 프로젝트마다 스토어·토큰을 따로 발급한다. 스터디 사이트 스토어와 이 사이트 스토어를 분리 생성하면 데이터 섞임 없음. 단 무료 티어 용량·대역폭은 계정 합산이므로: (a) WebP 강제 (b) 포스터 외 이미지 최장변 1600 (c) 영상은 Blob 금지, 유튜브 임베드만. 이 규칙으로 저빈도 쓰기면 충분히 공존한다.

## 2. 권한 4단계 (사용자 확정)

| 롤 | 대상 | 권한 |
|---|---|---|
| owner | 주현호 1인 | 전부 + 사용자 관리 + 사이트 설정 + 파일 export |
| admin | 교수 | 콘텐츠 전 유형 작성·수정·삭제, 사용자 초대 불가 |
| manager | 관리 학생 (전시회 담당 등) | 지정 유형(공지·전시회·특강·공모전·쇼케이스 승인) 작성·수정, 삭제는 자기 글만 |
| public | 비로그인 | 열람 + 쇼케이스 제출 + 전시회 접수·수정(이메일+비번) + 공유 |

비로그인 화면에 편집 버튼·어드민 흔적 렌더 자체 금지(숨김이 아니라 미렌더).

## 3. 인증 (localStorage 금지 준수)

- 방식: bcrypt 해시 + JWT를 httpOnly Secure SameSite=Lax 쿠키로. access 15분 + refresh 30일(자동 로그인 요구 충족). 토큰을 JS로 읽지 않으므로 localStorage 불필요
- 최초 온보딩: owner가 어드민에서 이메일+롤 사전 등록 → 대상자 첫 로그인 시 "비밀번호 설정" 플로우(설정 전 상태 플래그) → 이후 자동 로그인 유지
- CORS: Vercel 도메인 화이트리스트 + credentials true. 프론트 fetch는 credentials 'include'
- 비밀번호 재설정: owner가 리셋 플래그 → 대상자 재설정. 이메일 발송 인프라는 v2 스코프 밖

## 4. DB 스키마 (Neon, 초안)

```sql
users(id, email unique, name, role, password_hash null, must_set_pw bool, created_at)
site_settings(key primary, value jsonb)  -- hero 버튼 텍스트·링크, 접수 버튼 노출 위치 등
posts(id, type, title_ko, title_en, body jsonb, tag, poster_url, gallery jsonb,
      external_url, event_start, event_end, published bool, pinned bool,
      created_by, created_at, updated_at)
  -- type: notice | lecture | contest | achievement | resource | club
professors(id, name_ko, name_en, title_ko, title_en, email, photo_url,
           links jsonb, sort, active bool)
mentors(id, name, company, title, link, sort, active)
curriculum(id, grade int, semester int, track, name_ko, name_en, sort)
  -- track: common | design | ai | culture. common은 로드맵 최상단 고정
codesharing(id=1 single row, body jsonb, depts jsonb, hwp_url)
council(id, ordinal int, name, logo_url, intro, members jsonb, year_label, sort)
exhibitions(id, semester_label, title, poster_url, site_url, intro, body jsonb,
            gallery jsonb, held_at, published)
showcase(id, title, topic, creator, description, tools jsonb, link,
         main_img, sub_imgs jsonb, semester_label, edit_pw_hash,
         status: pending|published, created_at)
exhibition_settings(id=1, submit_open, submit_close, edit_close, form_schema jsonb,
                    header_visible bool, button_mode)
exhibition_entries(id, semester_label, entry_type solo|team, fields jsonb,
                   email, pw_hash, images jsonb, created_at, updated_at)
careers(id, grad_name, majors, company, company_url, position, year, sort)
portfolios(id, student_no, name, majors, link, sort)
```

## 5. 전시회 접수 시스템 (구글 폼 대체)

- 2026-2 일정 초기값: submit_open 2026-11-02T00:00+09, submit_close 2026-11-13T23:59:59+09, edit_close 2026-11-23T23:59:59+09. 11-24 00:00부터 신규·수정 전면 차단. exhibition_settings로 owner·admin이 변경 가능
- 플로우: /submit(기간 내) → 개인/팀 분기 폼(기존 Apps Script 필드 구조 이관: 인적사항, 메일·연락처, 작품명, 작품 설명 100자, 이미지) → 이메일+비밀번호 등록 → 저장
- 수정: /submit/edit → 이메일+비밀번호 → 본인 접수 목록 → 수정(기존 UX Study 폼의 readonly/editable 분류 로직 이관: 참가 유형·과목·이메일은 readonly)
- 검증: 서버에서 기간 재검증(클라 시계 불신), 이미지 개수·용량 상한, rate limit(IP당 시간 10회)
- 헤더 노출: 기간 중 자동 + settings로 강제 on/off, 위치(header|floating) 선택

## 6. 쇼케이스 제출 (비로그인)

- /showcase/submit: 제목·주제·팀/개인 이름·설명·활용 툴(태그)·링크·메인 1장·서브 2장(16:9 강제 크롭 미리보기)·수정용 비밀번호
- 반달 방지: status pending으로 저장 → manager 이상이 승인 시 published. 제출자는 비밀번호로 자기 항목 수정 가능(published 후 수정 시 재승인 큐)
- 파일: Blob 업로드, 16:9 검증(서버 리사이즈로 1920x1080 통일)

## 7. DB ↔ 파일 동기화 (사용자 질문 답)

진짜 양방향 동기화는 충돌 관리 비용이 커서 반려. 대신 3층 구조로 요구를 전부 충족한다:
1. 시드(파일→DB, 1회): 현재 src/data/*.js를 scripts/seed.mjs로 최초 주입
2. 운영(DB 단일 진실): 모든 CMS 수정은 DB에만
3. 스냅샷 export(DB→파일, 수시): 어드민 "파일로 내보내기" 버튼 또는 `npm run export:content` → API에서 전체 콘텐츠 JSON을 src/data/snapshot/*.json으로 기록 → 사용자가 확인 후 git commit. 용도: 백업 + 아래 폴백

폴백 아키텍처(Render 콜드스타트 대응): 프론트 데이터 훅은 API 우선, 3초 타임아웃 시 snapshot JSON 렌더 + "실시간 동기화 대기 중" 미세 배지. 사이트가 서버 죽어도 절대 빈 화면이 안 됨.

## 8. API 계약 (요약)

```
GET  /health
POST /auth/login | /auth/setup-password | POST /auth/logout | GET /auth/me
GET  /content/:type?tag=&page=&q=     (published만, KPC식 페이지네이션)
GET  /content/:type/:id
POST /admin/content/:type             (manager+, 유형별 권한 매트릭스)
PUT  /admin/content/:type/:id
DELETE /admin/content/:type/:id       (admin+, manager는 자기 글)
POST /upload (multipart → Blob, 역할·용도별 제한)
GET  /export/all                      (owner, 스냅샷 JSON)
POST /submit/exhibition | PUT /submit/exhibition (이메일+비번 검증)
POST /submit/showcase | PUT /submit/showcase/:id (비번 검증)
GET  /settings/public  | PUT /admin/settings (owner·admin)
```

## 9. 운영 체크리스트 (사용자 액션)

- [ ] Neon 프로젝트 생성 → DATABASE_URL을 Render 환경변수로
- [ ] Render Web Service 생성(main 브랜치 server/) → URL 확보
- [ ] UptimeRobot 모니터: GET https://<render>/health, 5분
- [ ] Vercel Blob 스토어 신규 생성 → BLOB_READ_WRITE_TOKEN Render에
- [ ] Vercel 프론트 환경변수 VITE_API_URL
- [ ] owner 계정 시드(이메일) 후 최초 비밀번호 설정