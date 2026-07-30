# 41_AUTH_CONTRACT — 공개 제출자 구글 인증 계약 (PHASE A 산출, 병렬 착수 기준)

PHASE B의 세 에이전트는 이 문서를 계약으로 고정하고 동시에 작업한다. 계약 변경은 PHASE C에서만.

## PHASE A 실측 결과 — 프롬프트 전제와 다른 두 가지

### 1. 큐레이션(curation) 기능이 존재하지 않는다
`grep -rn "curation|큐레이션"`가 server/src, server/scripts, client/src 전부에서 0건이다.
40_EXHIBITION_CURATION_DASHBOARD는 문서도 커밋도 없다(최신 커밋 이력: 38 배치 A0~AR → 39_FIX).
따라서 **제출 엔티티는 3종이 아니라 2종**이다:
- 전시회 접수 `exhibition_entries` — `POST/PUT /submit/exhibition`, 페이지 `/submit`, `/submit/edit`
- 웹앱 쇼케이스 `showcase` — `POST /submit/showcase`, `PUT /submit/showcase/:id`, 페이지 `/showcase/submit`

큐레이션은 **없는 것을 인증 전환할 수 없으므로 이번 범위에서 제외**한다. 40이 이후 구현되면
그 시점에 `requirePublicAuth` + `public_user_id`를 같은 패턴으로 붙이면 된다(이 계약이 그대로 적용됨).
"40의 큐레이션 폼과 파일이 겹치면 순서 조정" 지시도 겹칠 파일이 없어 무효.

### 2. `GET /auth/me`는 이미 스태프 전용으로 점유되어 있다
`server/src/routes/auth.js`의 `/auth/me`는 `requireAuth` + `users` 테이블 조회다.
공개 신원을 여기 얹으면 스태프 인증에 회귀가 생긴다. 공개용은 경로를 분리한다:
- `GET /auth/public/me`
- `POST /auth/public/logout`

프롬프트의 `GET /auth/me`(공개)·`POST /auth/logout` 문구에서 벗어나는 **의도된 이탈**이다.

## 신원 클래스 분리 (핵심 설계)

스태프와 공개 제출자는 쿠키 이름과 JWT 클레임을 모두 분리한다. 같은 쿠키를 쓰면 공개 로그인이
관리자 세션을 덮어쓰고 그 반대도 성립한다.

| | 스태프 | 공개 제출자 |
|---|---|---|
| 쿠키 | `dah_access` / `dah_refresh` | `dah_pub_access` / `dah_pub_refresh` |
| JWT 클레임 | `role`(owner/admin/manager), `kind` 없음 | `kind: 'public'`, `role` 없음 |
| 미들웨어 | `requireAuth` / `requireRole` → `req.user` | `requirePublicAuth` → `req.publicUser` |
| 테이블 | `users` | `public_users` |

시크릿과 cross-site 쿠키 속성(`sameSite:'none'` + `secure` + trust proxy)은 `auth.js`에서
`jwtSecret` / `baseCookieOpts` / `cookieOpts`로 내보내 **공유**한다(속성이 갈라지면 과거의
cross-site 쿠키 미저장 버그가 재발한다). PHASE A에서 이 export와 `middleware/publicAuth.js`는 완료됐다.

## API 계약 (고정)

| 메서드 | 경로 | 인증 | 동작 |
|---|---|---|---|
| GET | `/auth/google/login?next=` | 없음 | state 쿠키 발급 후 구글 동의 화면 302. `next`는 CLIENT_ORIGIN 기준 **경로만** 허용(오픈 리다이렉트 차단) |
| GET | `/auth/google/callback?code=&state=` | 없음 | state 검증 → code 교환 → id_token 검증 → `public_users` upsert → 공개 쿠키 발급 → `CLIENT_ORIGIN + next` 302 |
| GET | `/auth/public/me` | 공개 | `{ user: { id, email, name } }` / 비로그인 401 |
| POST | `/auth/public/logout` | 없음 | 공개 쿠키 삭제, `{ ok: true }` |
| POST | `/submit/exhibition` | `requirePublicAuth` | 이메일은 **로그인 계정에서 서버가 채운다**(본문 email·password 무시). `public_user_id` 기록 |
| PUT | `/submit/exhibition` | `requirePublicAuth` | 소유 검증: 대상 행의 `public_user_id` 또는 `email`이 로그인 계정과 일치해야 함. 불일치 403 |
| GET | `/submit/exhibition/mine` | `requirePublicAuth` | 본인 접수 목록 + `can_edit`·`edit_close`·`submit_close`. 기존 `/lookup`·`/list`(비번 방식) 대체 |
| POST | `/submit/showcase` | `requirePublicAuth` | `public_user_id` 기록. 비번 필드 무시 |
| PUT | `/submit/showcase/:id` | `requirePublicAuth` | 소유 검증. 불일치 403 |

에러 계약은 기존 `{ error, hint? }` 유지. 공개 인증 401 응답에는 `loginPath: '/auth/google/login'`을 동봉한다.

## 저장 모델 (추가만, DROP 금지)

```sql
CREATE TABLE IF NOT EXISTS public_users (
  id            SERIAL PRIMARY KEY,
  google_sub    TEXT UNIQUE NOT NULL,
  email         TEXT NOT NULL,
  name          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);
ALTER TABLE exhibition_entries ADD COLUMN IF NOT EXISTS public_user_id INTEGER;
ALTER TABLE showcase           ADD COLUMN IF NOT EXISTS public_user_id INTEGER;
-- 비번 컬럼은 삭제하지 않는다. 다만 NOT NULL이면 신규 접수가 막히므로 제약만 해제한다.
ALTER TABLE exhibition_entries ALTER COLUMN pw_hash DROP NOT NULL;
```

`exhibition_entries.pw_hash`는 현재 `TEXT NOT NULL`(schema.sql:169)이다. 컬럼 자체는 남기고
NOT NULL 제약만 해제한다 — 이것은 DROP COLUMN이 아니므로 마이그레이션 규칙 위반이 아니다.

### 기존 접수 건의 승계
기존 행에는 `public_user_id`가 없다. 로그인 계정의 이메일과 행의 `email`이 같으면 본인으로 인정하고,
조회 시점에 `public_user_id`를 backfill한다. 사용자 원문 데이터(fields·images·email)는 건드리지 않는다.
이 규칙이 없으면 비번 제거와 동시에 기존 접수자가 자기 접수에 접근할 수 없게 된다.

## 구글 OAuth 구현 방침
- 신규 의존성 없이 code 플로우를 직접 구현한다(`google-auth-library` 미설치, 추가하지 않는다).
  인가: `https://accounts.google.com/o/oauth2/v2/auth`, 토큰 교환: `https://oauth2.googleapis.com/token`.
- 스코프 `openid email profile`. `id_token`은 TLS 위 서버-서버 응답이므로 서명 검증 대신
  `aud === GOOGLE_CLIENT_ID`, `iss`가 accounts.google.com, `email_verified === true`를 확인한다.
- state(CSRF): 랜덤값 + next를 담은 단기 JWT를 `dah_oauth_state` 쿠키에 저장하고 콜백에서 대조·삭제.
- `next`는 `/`로 시작하는 경로만 허용한다. 외부 URL·`//`는 거부하고 `/`로 폴백(오픈 리다이렉트 차단).

## 메일 (Gmail SMTP)
`server/src/routes/consult.js`의 `notifyEmail` 패턴을 따른다: 환경변수 미설정 시 **조용히 스킵**,
`nodemailer`는 동적 import, 발송 실패가 접수 응답을 깨뜨리지 않게 catch. 공용 유틸로
`server/src/lib/mailer.js`를 신설하고 접수 완료 시 제출자에게 확인 메일을 보낸다.
제목은 명사형, 본문에 접수 요약과 수정 안내 링크(`CLIENT_ORIGIN/submit/edit`).

## 파일 소유 (PHASE B 충돌 방지)

| 에이전트 | 소유 파일 |
|---|---|
| BE | `server/src/routes/googleAuth.js`(신설), `server/src/routes/submit.js`, `server/src/lib/mailer.js`(신설), `server/scripts/migrate-phase41.mjs`(신설), `server/scripts/schema.sql`, `server/src/app.js` |
| FE | `client/src/pages/submit/*`, `client/src/pages/showcase/ShowcaseSubmit.jsx`, `client/src/App.jsx`(필요 시 라우트만) |
| ADMIN | `client/src/pages/admin/EntriesSheet.jsx`, `server/src/routes/adminExtra.js`(reset-password 라우트 제거분만) |

공용(PHASE A 완료, 수정 금지): `server/src/middleware/publicAuth.js`, `server/src/middleware/auth.js`,
`client/src/hooks/usePublicAuth.js`, `client/src/components/auth/GoogleLoginButton.jsx`.

## 환경변수 (Render)
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`,
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`.
기존 유지: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_ORIGIN`, `BLOB_READ_WRITE_TOKEN`.
미설정 시 동작: OAuth 변수 없으면 `/auth/google/login`이 503 + 안내 JSON(사이트 나머지는 정상),
SMTP 변수 없으면 메일만 조용히 스킵.
