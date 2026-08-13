# 39_FORM_BUILDER — 구글 폼 대체 자체 폼 시스템 (대형, 단독→병렬3→단독)

## 목표
구글 폼을 완전히 대체하는 자체 폼 시스템을 만든다. 관리자가 어드민에서 폼을 생성·편집·삭제하고, 공개 사용자가 작성·제출하고, 관리자가 시트 형태로 응답을 관리한다. 전시회 접수 시트와 동일한 디자인·기능(필터·복사·CSV·자동 새로고침)을 모든 폼에 공유한다.

## 핵심 원칙
- 폼 내용(제목·안내문·필드 구성)은 전부 DB에 저장. 하드코딩 금지. 내년에 다른 사람이 내용만 바꿔서 쓸 수 있어야 한다.
- 디자인은 전시회 접수와 완전히 통일. 색상 CI.md HEX만. 네이티브 select·date 금지.
- 가운데점·마침표 나열·AI식 문장 금지.
- 구글 OAuth(공개 제출자용)로 본인 확인, 제출 후 수정 가능.

---

# STEP 1 — 단독 (DB 스키마 + 폼 엔진 코어)

## F1. DB 스키마 설계

### custom_forms 테이블
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | serial PK | |
| slug | text unique | URL 경로용 (예: closing-2026-1, recruit-2026-1) |
| title_ko | text | 폼 제목 국문 |
| title_en | text | 폼 제목 영문 |
| description_ko | text | 안내문 국문 (줄바꿈 유지, 마크다운 아님) |
| description_en | text | 안내문 영문 |
| category | text | 분류 (event/recruit/other) |
| fields | jsonb | 폼 필드 정의 배열 (아래 구조) |
| settings | jsonb | 접수 기간, 수정 기간, 노출 여부, 응답 상한 등 |
| published | boolean | 공개 여부 |
| created_by | int FK users | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### fields 배열 각 항목 구조
```json
{
  "id": "uuid-또는-순번",
  "label_ko": "이름",
  "label_en": "Name",
  "type": "text|textarea|select|radio|checkbox|phone|email|studentid|file|date",
  "required": true,
  "placeholder_ko": "",
  "placeholder_en": "",
  "hint_ko": "공백 포함 200자 이내",
  "hint_en": "",
  "options": ["기획부", "홍보부", "웹전시부"],
  "options_en": ["Planning", "PR", "Web Exhibition"],
  "validation": { "maxLength": 200, "pattern": "phone|email|studentid" },
  "order": 1
}
```

type별 동작:
- text: 한 줄 입력
- textarea: 여러 줄 (maxLength 검증)
- select: 커스텀 드롭다운 (네이티브 금지)
- radio: 카드형 라디오 (구글 폼의 객관식)
- checkbox: 다중 선택
- phone: 자동 하이픈 010-XXXX-XXXX 강제
- email: @ 형식 검증
- studentid: 8자리 숫자 검증
- file: PDF 업로드 (Blob 저장)
- date: 커스텀 DatePicker

### settings 구조
```json
{
  "accept_start": "2026-05-28T00:00:00+09:00",
  "accept_end": "2026-06-01T23:59:00+09:00",
  "edit_end": "2026-06-03T23:59:00+09:00",
  "require_google_auth": true,
  "max_responses": null,
  "show_button_in_header": false,
  "button_label_ko": "참가 신청",
  "button_label_en": "Apply"
}
```

### custom_form_responses 테이블
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | serial PK | |
| form_id | int FK custom_forms | |
| data | jsonb | { "field_id": "값", ... } |
| google_email | text | OAuth 인증 이메일 |
| edit_password_hash | text | 수정용 비밀번호 (bcrypt) |
| submitted_at | timestamptz | |
| updated_at | timestamptz | |

CREATE TABLE IF NOT EXISTS로 생성. 기존 테이블 DROP 금지.

## F2. 서버 API

### 공개 API
- GET /forms/:slug — 폼 정의 반환 (fields + settings, 응답 데이터 제외)
- POST /forms/:slug/submit — 응답 제출 (구글 OAuth 검증 + 기간 검증 + 필드 검증)
- POST /forms/:slug/lookup — 이메일+비밀번호로 본인 응답 조회
- PUT /forms/:slug/responses/:id — 응답 수정 (본인 확인 + 수정 기간 검증)

### 어드민 API (admin 이상)
- GET /admin/forms — 폼 목록
- POST /admin/forms — 폼 생성
- PUT /admin/forms/:id — 폼 수정 (제목·안내·필드·설정 전체)
- DELETE /admin/forms/:id — 폼 삭제
- GET /admin/forms/:id/responses — 응답 목록 (시트용)
- PUT /admin/forms/:id/responses/:rid/reset-password — 비밀번호 1234 초기화
- GET /admin/forms/:id/responses/export?format=csv|xlsx — 내보내기

필드 검증은 서버에서 수행: required 체크, type별 pattern 검증, maxLength, 기간 검증.

## F3. 폼 렌더러 공용 컴포넌트 (FormRenderer.jsx)
fields 배열을 받아 type별로 올바른 입력 컴포넌트를 렌더하는 공용 컴포넌트.
- text → 일반 input
- textarea → textarea (maxLength 카운터 표시)
- select → 커스텀 Select (네이티브 금지)
- radio → 카드형 라디오 (전시회 과목 선택과 동일)
- checkbox → 커스텀 체크박스 그룹
- phone → 자동 하이픈 input (010-XXXX-XXXX)
- email → @ 검증 input
- studentid → 8자리 숫자 input
- file → 파일 업로드 (PDF, Blob)
- date → 커스텀 DatePicker
모든 필드에 label, hint, required 표시, 에러 메시지 인라인.

STEP 1 빌드 확인 후 병렬.

---

# STEP 2 — 병렬 3

소유: P1=어드민 폼 관리. P2=공개 폼 페이지+제출+수정. P3=응답 시트.
FormRenderer(F3)는 수정 금지, 사용만.

## AGENT-P1 — 어드민 폼 관리

### P1-1. 대시보드 사이드바에 "행사 설정" 추가
SYSTEM 그룹 안에 "행사 설정" 메뉴를 추가해라. 클릭하면 폼 목록 페이지.

### P1-2. 폼 목록 페이지
등록된 폼 목록: 제목, 카테고리, 접수 기간, 공개 상태, 응답 수.
"폼 만들기" 버튼으로 새 폼 생성.

### P1-3. 폼 편집기 (구글 폼 편집 화면 대체)
폼 기본 정보(제목 국/영, 안내문 국/영, 카테고리, slug) + 설정(접수 기간,
수정 기간, 구글 인증 여부, 응답 상한, 헤더 버튼 노출) + **필드 편집기**.

필드 편집기:
- 필드 목록이 카드 형태로 나열됨
- 각 카드: 라벨(국/영), 타입 선택(커스텀 드롭다운), 필수 토글, 힌트, placeholder
- 타입이 select/radio/checkbox면 options 입력(추가·삭제·순서 변경)
- 타입이 textarea면 maxLength 입력
- 필드 추가("+필드 추가" 버튼), 삭제, 드래그로 순서 변경
- 미리보기 버튼: FormRenderer로 실제 렌더 미리보기

공개/비공개 토글 + 저장 버튼(토글만으로 즉시 저장 안 됨, 저장 눌러야 반영).

### P1-4. 시드: 종강총회 + 신입부원 모집 폼 2개
아래 내용을 **정확히** 시드해라. 원문 한 글자도 바꾸지 마라.
seed_key + ON CONFLICT DO NOTHING.

**폼 1: 종강총회 참가 신청**
- slug: closing-2026-1
- category: event
- title_ko: 2026-1학기 디지털인문예술전공 종강 총회 및 회식 참가 신청
- description_ko: (아래 원문 그대로, 줄바꿈 유지)
```
안녕하십니까, 디지털인문예술전공 제1대 운영위원회 'LUCID'입니다.

2026학년도 1학기 디지털인문예술전공 종강 총회와 함께, 학기를 마무리하며 식사 자리를 마련했습니다.

디지털인문예술 전공생, 복수전공생과 이번 학기 디지털인문예술전공 강의를 수강한 학생들 모두 환영하오니 많은 관심과 참여 부탁드립니다.

일시: 2026. 6. 4 (목) 18:00
장소: C.square Blue
신청 기간: 2026.05.28(목) ~ 2026.06.01(월)
뒷풀이 장소: 별미닭갈비 / 비용 8,000원
뒷풀이 참가 희망자는 폼 제출 후 꼭 아래 계좌로 입금해 주시기 바랍니다.
(농협 351-0693-3247-73 주현호)
문의: 위원장 주현호 (010-7262-2378)
```
- fields:
  1. type:text, label:"이름", required:true
  2. type:studentid, label:"학번", hint:"8자리 (예: 20261234)", required:true
  3. type:radio, label:"전공 구분", options:["주전공생","복수전공생","1학기 디인예 전공 과목 수강생(타과생)","디인예 전공 동아리원","기타"], required:true
  4. type:phone, label:"연락처", hint:"예: 010-1234-5678", required:true
  5. type:radio, label:"종강 총회 참석 여부", options:["참석","불참(뒷풀이만 참가)"], required:true
  6. type:radio, label:"뒷풀이 참석 여부", options:["참석 (비용 8,000원 입금 후 제출, 농협 351-0693-3247-73 주현호)","불참"], required:true

**폼 2: 신입 부원 모집**
- slug: recruit-2026-1
- category: recruit
- title_ko: 2026 제1대 디지털인문예술전공 운영위원회 "LUCID" 신입 부원 모집
- description_ko: (아래 원문 그대로)
```
"흐릿한 가능성을 선명한 확신으로."
안녕하세요, 한림대학교 디지털인문예술전공 제1대 운영위원회 LUCID(루시드)입니다.
저희와 함께 가장 투명하고 선명한 빛을 만들어갈 1기 국원을 모집합니다.

[모집 일정]
서류 접수: 2026.01.23(금) ~ 01.30(금)
면접 일정: 2026.01.31(토) ~ 02.01(일) (대면/비대면 추후 공지)

[문의]
위원장 주현호 (010-7262-2378) / 인스타그램 @hallym_lucid

원활한 국원 모집 및 면접 진행을 위해 아래와 같이 개인정보를 수집·이용하고자 합니다.
1. 수집 목적: 신입 국원 모집 서류 심사, 면접 안내, 합격자 통보
2. 수집 항목: 성명, 학번, 전공(주/복수), 전화번호, 포트폴리오
3. 보유 기간: 모집 종료 후 1개월 이내 파기 (단, 합격자는 활동 기간 동안 보유)
귀하는 개인정보 수집 거부 권리가 있으나, 거부 시 지원이 불가능할 수 있습니다.
```
- fields:
  1. type:text, label:"이름", required:true
  2. type:studentid, label:"학번", hint:"ex. 20260000", required:true
  3. type:text, label:"주전공", required:true
  4. type:text, label:"복수전공", hint:"해당 없을 시 '없음' 기재", required:true
  5. type:phone, label:"전화번호", hint:"ex. 010-1234-5678 형식으로 기재해주세요", required:true
  6. type:radio, label:"희망부서 (1순위)", options:["기획부","홍보부","웹전시부"], required:true
  7. type:radio, label:"희망부서 (2순위)", options:["기획부","홍보부","웹전시부"], required:true
  8. type:textarea, label:"자기소개", hint:"자신을 가장 잘 표현할 수 있는 키워드나 경험을 바탕으로 작성해 주세요. (공백 포함 200자 이내)", validation:{maxLength:200}, required:true
  9. type:textarea, label:"지원 동기 및 포부", hint:"운영위원회에 지원하게 된 계기와 입부 후 해보고 싶은 활동을 구체적으로 작성해 주세요. (공백 포함 500자 이내)", validation:{maxLength:500}, required:true
  10. type:file, label:"포트폴리오 제출", hint:"홍보부 1순위 지원자 필수, 그 외 부서 선택 사항. 본인의 작업물(카드뉴스, 디자인, 프로젝트, 웹사이트 등)을 PDF 형태로 제출해 주세요.", required:false
  11. type:checkbox, label:"면접 가능 일자", hint:"가능 일자에 따른 구체적인 시간을 개별 공지합니다. 면접은 비대면(ZOOM)으로 진행합니다.", options:["2026.01.31(토)","2026.02.01(일)","양일 가능"], required:true

## AGENT-P2 — 공개 폼 페이지

### P2-1. 공개 폼 라우트
/forms/:slug 라우트를 추가해라. FormRenderer로 폼을 렌더하고 제출.
- 접수 기간 전: "접수 시작 전" 안내 + 시작일 표시
- 접수 기간 중: 폼 표시 + 제출 가능
- 접수 기간 후: "접수 마감" 안내
- 비공개: 404

### P2-2. 제출 플로우
1. 구글 OAuth 인증 (require_google_auth가 true면)
2. 폼 작성 (FormRenderer)
3. 수정용 비밀번호 입력 (4자 이상)
4. 제출 → 완료 화면 (문의처 표시)

### P2-3. 수정 플로우
폼 페이지 하단 또는 온보딩에 "제출 내역 확인·수정" 진입.
이메일 + 비밀번호 → 본인 응답 로드 → 수정 → 저장.
수정 기간 검증은 서버에서.

### P2-4. 폼 디자인
전시회 접수와 완전히 통일된 디자인. 상단에 제목 + 안내문(description) +
접수 기간 강조(유리 패널 + purple.light). 필드는 FormRenderer가 처리.
가운데점·마침표 나열 금지. 안내문은 줄바꿈 그대로 유지(마크다운 변환 아님).

## AGENT-P3 — 응답 시트

### P3-1. 응답 관리 시트
어드민에서 "응답 보기" 클릭 시 새 탭으로 열리는 전용 시트 페이지.
전시회 접수 시트와 동일한 디자인·기능:
- 구글 시트 스타일 테이블
- 컬럼 헤더 필터 (G1 재사용)
- 셀 클릭 복사, 드래그 범위 선택 (구현돼 있으면 재사용)
- 행 확장 (긴 응답 보기)
- CSV·XLSX 내보내기
- 자동 새로고침 + 수동 새로고침
- 하단 탭 고정 (응답 전체 / 응답자 인적사항)
- 비밀번호 초기화 (admin 이상, 1234로)
- 상태 문구 위계 있게 (가운데점 금지)

### P3-2. 컬럼 자동 생성
폼의 fields 정의에서 컬럼을 자동으로 생성해 시트에 표시.
필드가 추가·삭제되면 시트 컬럼도 자동으로 맞춰짐.

---

# STEP 3 — 단독 통합

## S1. 헤더 버튼 연동
settings.show_button_in_header가 true인 폼이 있으면, 전시회 접수 CTA처럼
헤더에 버튼을 표시하고 클릭 시 /forms/:slug로 이동. 동시에 2개 이상이면
첫 번째(우선순위 높은 것)만 표시하거나 드롭다운으로.

## S2. 대시보드 행사 설정에서 버튼 노출·비노출 관리
각 폼의 공개/비공개 + 헤더 버튼 노출을 대시보드에서 관리 가능하게.

## S3. 시드 검증
종강총회·신입부원 폼 2건의 fields가 원문과 정확히 일치하는지 표본 대조.
/forms/closing-2026-1, /forms/recruit-2026-1 접근 시 폼이 렌더되는지 확인.

## S4. 최종 검증
네이티브 UI 잔존 0건, 가운데점 잔존 0건, 전 구간 가로 스크롤 0.
build·커밋·푸시·배포·PROGRESS 기록.