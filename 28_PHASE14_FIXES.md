# 28_PHASE14_FIXES — 크리틱 배치 (Opus, 병렬 3)

절대 원칙: 사용자 제공 원문(특히 achievements_SOURCE.md)은 토씨 하나 바꾸지 마라. 요약·윤문·재작성·이름 재배치 전면 금지. Task로 S1·S2·S3 병렬 후 통합.

═══════════ AGENT-S1: 학생 성과 원문 복구 + 정적 데이터 [최우선] ═══════════

## S1-1. 학생 성과 원문 그대로 재시드 [절대 변경 금지]
docs/achievements_SOURCE.md 파일을 그대로 읽어 achievement를 전면 재시드하라. 규칙:
- 각 "### 제목" = title_ko(원문 그대로), 그 아래 본문 전체 = body(원문 그대로, 「」 작품명 블록과 수상자 줄 포함).
- 본문에 이미 수상자 이름이 있으므로 별도 이름 필드/블록을 추가하지 마라.
- 요약·윤문·문장 재구성·이름 순서 변경 절대 금지. 파일 텍스트를 그대로 복사한다.
- 연도(## 2026 등)를 tag로, 파일 등장 순서를 sort로.
- 기존 achievement 전부 삭제 후 이 파일 기준으로만 재생성. 배포 Neon DB 대상.
- 시드 후 무작위 3건을 파일과 문자 단위로 대조해 일치 확인.
영문(en): 각 항목 영문 번역을 대학원 소개 수준으로 별도 생성해 en 필드에 저장(원문 정보 보존, 이름 성 뒤로 로마자, 학과명 Digital Arts & Humanities). 국문은 원문 그대로 유지.

## S1-2. 연혁 재확정 (안 바뀜 → 강제 반영)
About 연혁이 이전 지시에도 안 바뀌었다. 연혁 데이터 소스를 찾아 아래로 전면 교체하고, About 페이지가 실제로 이 소스를 읽는지 확인하라(다른 하드코딩된 옛 데이터를 렌더 중일 수 있음). 최신순 상단. 국문+영문:
- 2024.09.01. 전공주임교수 김용수 교수 취임 / Prof. Yong Soo Kim appointed as Head of Department
- 2023.03.01. 유인선 교수 부임 / Prof. In Sun Yoo joined the faculty
- 2022.07.01. 전공주임교수 김성우 교수 취임 / Prof. Seong Woo Kim appointed as Head of Department
- 2022.03.01. 김성우 교수 부임 / Prof. Seong Woo Kim joined the faculty
- 2020.09.01. 전공주임교수 이승은 교수 취임 / Prof. Seung Eun Lee appointed as Head of Department
- 2019.07.01. 전공주임교수 한수미 교수 취임 / Prof. Su Mi Han appointed as Head of Department
- 2018.09.01. 이승은 교수 부임 / Prof. Seung Eun Lee joined the faculty
- 2018.09.01. 미래융합스쿨 소속 전공 / Affiliated with the School of Future Convergence
- 2018.03.01. 글로벌융합대학 소속 전공 / Affiliated with the College of Global Convergence
- 2017.03.01. 한림대학교 디지털인문예술전공 설립 / Digital Arts & Humanities established at Hallym University
- 2017.03.01. 전공주임교수 김용수 교수 취임 / Prof. Yong Soo Kim appointed as founding Head of Department
- 2017.03.01. 한수미 교수 부임 / Prof. Su Mi Han joined the faculty

## S1-3. 운영위 전 멤버 로마자 [빠짐 → 전원 처리]
운영위 모든 기수의 전 멤버(위원장·부위원장·회장·부회장·각 부서원 전부)를 EN에서 성 뒤로 로마자 표기하라. 주현호=Hyun Ho Ju. 나머지 전원도 표준 로마자(성을 뒤로). 소속 전공 풀네임(Digital Arts & Humanities, DAH 축약 금지), 학번 유지. 대상 멤버 전체(2026 LUCID부터 2017 임시학생회까지 각 기수 임원 명단 전원). 국문 모드는 국문.

## S1-4. 미션 영문 중복 제거
미션 섹션에서 EN일 때 "인간에 대한 깊은 이해와..." 국문 줄을 제거(이미 위에 영문이 있으므로). EN 모드에서 국문 잔재 삭제.

═══════════ AGENT-S2: i18n 잔여 버그 [막힌 것들] ═══════════

## S2-1. 히어로 버튼·Curriculum by Year EN 안 됨 [진단]
히어로 "트랙 살펴보기"·"전시회 보러가기"가 EN 전환 시 바뀌려다 만다(무언가 막고 있음). "Curriculum by Year"도 안 바뀐다. 원인 진단: (a) 해당 텍스트가 i18n 사전을 안 거치고 하드코딩됐는지 (b) LangContext를 구독하지 않는 컴포넌트인지 (c) 조건부 렌더가 언어 변경에 반응 안 하는지. 실제 원인을 찾아 EN이 적용되게 고치고, 유사하게 막힌 다른 텍스트도 전수 점검하라.

## S2-2. 전시회 피처드 EN [재지시]
제18회 디지털인문예술전공 프로젝트 전시회(full_title)·Against the Flow·기간·인트로·CTA 버튼 라벨 EN 적용. full_title EN "The 18th Digital Arts & Humanities Project Exhibition". Against the Flow 인트로 EN은 27_I18N_MANUAL R3-1의 번역 사용.

## S2-3. 언어 전환 인터랙션 제거
전환 시 텍스트만 opacity 크로스페이드, 레이아웃 이동·깜빡임 0.

═══════════ AGENT-S3: 공개/어드민 UI 크리틱 ═══════════

## S3-1. 상담 신청 위치·필드 변경
1. 전공 소개 하단의 상담 신청 링크를 제거한다.
2. 상담 폼 필드를 변경: "회사명" 삭제. 순서를 이름 / 학년 / 주전공 / 복수전공 / 연락처(전화 또는 이메일) / 문의 내용으로. 각 필드 입력 가능. 동의 문구·개인정보 안내는 유지하되 수집 항목을 이 필드에 맞게 수정.
3. 상담 폼 진입 경로는 푸터 링크만 유지(전공 소개 하단 제거).

## S3-2. 쇼케이스 카드 수정 [아직 안 됨]
쇼케이스 카드가 여전히 박스 안에서 작고 텍스트가 뭉쳐 있다. 카드 이미지를 16:9로 크게(ImageFrame), 카드 내부 텍스트(제목·설명·팀) 간 간격 확보, 그리드 밀도 높여 섹션 대비 콘텐츠 비율 상향. NO IMAGE 플레이스홀더도 깔끔하게.

## S3-3. 어드민 사용자 3열
어드민 사용자 페이지(/admin/users)가 한 명씩 세로로 나열돼 공간을 많이 차지한다. 한 줄에 3개(3열 그리드)로. owner 역할 선택 UI가 한 줄 전체를 차지하는데 폭을 줄여 카드 안에 맞게. 카드: 이름·이메일·역할 선택 간결히.

## S3-4. 로그아웃 확인 모달
로그아웃 버튼을 누르면 즉시 로그아웃된다. "로그아웃 하시겠습니까?" 확인 모달(취소/확인)을 띄우고 확인 시에만 로그아웃.

## S3-5. 동아리 로고 안 뜸 [파일 단위 정밀 진단]
CON:NECT, DS4H 로고가 여전히 안 뜬다. 추측 말고 파일을 하나씩 확인하라: (1) clubs 데이터의 logo_url 실제 값 확인 (2) 업로드 시 Blob 저장·URL 반환 확인 (3) 프론트 렌더에서 logo_url을 실제로 img src에 넣는지 (4) has_bg·ImageFrame 처리에서 누락되는지 (5) 더인스튜디오 en 이름이 EN에서 왜 안 뜨는지(club name_en 필드). 각 단계 로그로 원인 지점을 특정하고 고쳐라. 동아리 분야 라벨 영문(UX/UI, Visual Design, Content, Data)도 함께.

═══════════ 통합 ═══════════
## S4-1
성과 원문 문자 대조 통과, 연혁 반영, 운영위 전원 로마자, 히어로·Curriculum EN, 상담 필드, 쇼케이스 카드, 사용자 3열, 로그아웃 모달, 동아리 로고. build·커밋·푸시·배포·육안확인·PROGRESS 기록.