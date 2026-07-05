# PATTERNS.md — 반복 UI 패턴 (임의 변형 금지)

## P1. 섹션 도입 3단 위계 (Wpromote 이식)
```
[mono] 01 ——— 섹션명          ← SectionLabel
[h1 KR 800] 섹션 헤드라인
[bodyL sec, max-w 640] 리드 문단 (선택)
```
전 섹션 공통. eyebrow 없이 헤드라인부터 시작하는 섹션 금지.

## P2. 넘버링 문법 (Linear 이식)
- 섹션: "01"~"06" (SectionLabel index)
- 정체성 카드: "FIG 1.1"~"FIG 1.3"
- 트랙: "TRACK 01"~"TRACK 03"
- 커리큘럼 과목: "n.m" (n=학년, m=순번) — 실제 학년 순서를 인코딩
- 전부 IBM Plex Mono. 넘버가 정보(순서·소속)를 담지 않는 곳에 장식용 넘버 금지

## P3. 카드
bg.elev + border.subtle + radius 10 + p24/32. hover: border.strong, 배경 그대로. 그림자·scale 금지. 카드 전체가 링크면 내부에 ArrowLink 시각 요소 + 카드에 단일 a 래핑(중첩 a 금지).

## P4. 리스트 행 (공지, 수상, 취업)
```
[mono date meta] [Tag] [제목 body pri] ............ [→]
```
행 hover: bg.elev + 제목 언더라인. 행 사이 헤어라인. 모바일에서 날짜·태그 위, 제목 아래 2단 랩.

## P5. 링크 화살표
내부 이동 ArrowRight, 외부 ArrowUpRight(모두 lucide 16). 외부 링크는 target _blank + rel "noopener noreferrer" 필수.

## P6. 빈 상태
데이터 배열이 비면 섹션 자체를 렌더하지 않는다(홈), 서브페이지 리스트가 비면 mono caption "등록된 항목이 없습니다" 1줄 + 여백. 일러스트 금지.

## P7. 에러 상태 (폼 없음, 404만)
404: displayL "404" + body 안내 + Button primary "홈으로 돌아가기".

## P8. 이미지
aspect-ratio 고정 + object-cover + loading lazy + grayscale 클래스. 로드 전 bg.elev. alt 필수. 인물 사진 없으면 이니셜 플레이스홀더(bg.panel + mono 이니셜) — 얼굴 아이콘 금지.

## P9. 리빌
Reveal 래핑은 섹션 도입 1회 + 그리드 아이템 스태거만. 문단 단위 개별 리빌 금지(과함). 스태거 지연 최대 6개 이후 0.

## P10. 헤어라인 리듬
섹션 사이 구분이 필요한 곳만 Divider. 연속 두 섹션이 모두 그리드면 사이에 Divider 필수, 텍스트 중심 섹션 사이는 여백만.