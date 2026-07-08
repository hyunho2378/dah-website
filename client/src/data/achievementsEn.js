/**
 * achievementsEn.js — 학생 성과 영문 대역 (client/docs/achievements_SOURCE.md 30개 항목)
 *
 * 목적: INTEGRATOR가 .md의 verbatim 한국어(title_ko + body)를 파싱·시드한 뒤,
 *       이 맵을 한국어 제목(### 줄 텍스트, 원문 그대로)으로 매칭해 영문을 붙인다.
 *       한국어 원문은 이 파일에서 절대 다루지 않는다 — 영문만 제공.
 *
 * 키 규칙: '### ' 뒤 텍스트를 한 글자도 바꾸지 않고 그대로 사용(character-for-character).
 *
 * 수상명 영문 매핑(일관 적용):
 *   대상 = Grand Prize · 최우수상 = First Prize · 우수상 = Excellence Award ·
 *   동상 = Bronze Award · 장관상 = Minister's Award · 특별상 = Special Award ·
 *   입선 = Selection · 창의은상 = Creative Silver Award · 혁신상 = Innovation Award ·
 *   공감상 = Empathy Award · 선발(KDM+) = selected for Korea Design Membership Plus (KDM+) ·
 *   게재/발표(논문) = presented/published a paper.
 *   이름 로마자: given name first, SURNAME LAST · 원문과 동일 순서, 쉼표 구분.
 *
 * ── 소스 이상(anomaly) 2건 — INTEGRATOR 주의 ──────────────────────────────
 *  (1) 중복 제목: '2026 동해시 AI 지역 문제 해결 아이디어톤 우수상 수상'가 소스에
 *      두 번(줄 12/15) 나오며 본문(수상자·주제)이 서로 다르다. JS 객체 키는 중복 불가
 *      → 이 키의 값만 예외적으로 두 항목의 배열(소스 등장 순서: 이무원·허준희 먼저,
 *      김민우·김서영 다음)이다. 나머지 키의 값은 모두 { titleEn, descEn } 단일 객체.
 *  (2) 트레일링 스페이스: '2025 제4회 강원디자인전람회 …협회장상) 수상 ' 키는 소스
 *      ### 줄 끝에 공백 1칸이 있어 그대로 포함했다(문자 단위 일치용). 파서가 제목을
 *      trim 한다면 이 키도 trim 기준으로 맞춰야 한다.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const achievementsEn = {
  '2026 동해시 AI 지역 문제 해결 아이디어톤 대상 수상': {
    titleEn: 'Grand Prize at the 2026 Donghae City AI Regional Problem-Solving Ideathon',
    descEn:
      "Hyun Ho Ju won the Grand Prize at the Donghae City AI Regional Problem-Solving Ideathon held in 2026, on the theme of 'the side effects of Donghae City's digital and AI transition'.",
  },
  '2026 동해시 AI 지역 문제 해결 아이디어톤 최우수상 수상': {
    titleEn: 'First Prize at the 2026 Donghae City AI Regional Problem-Solving Ideathon',
    descEn:
      "Young Eun Cho and Eun Young Choi won the First Prize at the Donghae City AI Regional Problem-Solving Ideathon held in 2026, on the theme of 'the increase in short-stay-oriented tourism'.",
  },
  // 중복 제목(anomaly 1) — 값은 배열: [0] 줄12-13(이무원·허준희), [1] 줄15-16(김민우·김서영)
  '2026 동해시 AI 지역 문제 해결 아이디어톤 우수상 수상': [
    {
      titleEn: 'Excellence Award at the 2026 Donghae City AI Regional Problem-Solving Ideathon',
      descEn:
        "Mu Won Lee and Jun Hee Heo won the Excellence Award at the Donghae City AI Regional Problem-Solving Ideathon held in 2026, on the theme of 'the closure of Hanjung University (한중대학교)'.",
    },
    {
      titleEn: 'Excellence Award at the 2026 Donghae City AI Regional Problem-Solving Ideathon',
      descEn:
        "Min Woo Kim and Seo Young Kim won the Excellence Award at the Donghae City AI Regional Problem-Solving Ideathon held in 2026, on the theme of 'the increase in short-stay-oriented tourism'.",
    },
  ],
  '2026 한림 AI 교육 포털 오픈 공모전 대상 수상': {
    titleEn: 'Grand Prize at the 2026 Hallym AI Education Portal Open Competition',
    descEn:
      "Ye Bin Son won the Grand Prize at the Hallym AI Education Portal Open Competition (AI or Nothing: Your Imagination Becomes Hallym's Image) held in 2026.",
  },
  '2026 AI 활용 대학생 로컬임팩트 포럼 최우수상 수상': {
    titleEn: 'First Prize at the 2026 AI-Powered University Student Local Impact Forum',
    descEn:
      'Hyun Ho Ju won the First Prize at the AI-Powered University Student Local Impact Forum, jointly held in 2026 by Hallym University, Kyungpook National University, and Sunchon National University.',
  },
  '2026 지역사회 문제해결 PBL 경진대회 우수상 수상': {
    titleEn: 'Excellence Award at the 2026 Community Problem-Solving PBL Competition',
    descEn:
      "Hyun Ho Ju, Hyun A Yoon, Young Eun Cho, Sung Kyung Kim, and Ho Jin Kim won the Excellence Award at the Community Problem-Solving PBL Competition held in 2026, on the theme of 'UX Design'.",
  },
  '2026 지역사회 문제해결 PBL 경진대회 최우수상 수상': {
    titleEn: 'First Prize at the 2026 Community Problem-Solving PBL Competition',
    descEn:
      "Hyun Ho Ju won the First Prize at the Community Problem-Solving PBL Competition held in 2026, on the theme of 'Entrepreneurship and Design Thinking'.",
  },
  '2026 지역사회 문제해결 PBL 경진대회 대상 수상': {
    titleEn: 'Grand Prize at the 2026 Community Problem-Solving PBL Competition',
    descEn:
      "Na Yeon Choi won the Grand Prize at the Community Problem-Solving PBL Competition held in 2026, on the theme of 'Local Cultural Tourism Content Studies'.",
  },
  '2026 커리어 인바디 아이디어 공모전 대상 수상': {
    titleEn: 'Grand Prize at the 2026 Career InBody Idea Competition',
    descEn:
      'Geun Young Park, Ji Yoon Hong, and Jun Hee Heo won the Grand Prize at the Career InBody Idea Competition held in 2026.',
  },
  '2026 커리어 인바디 아이디어 공모전 우수상 수상': {
    titleEn: 'Excellence Award at the 2026 Career InBody Idea Competition',
    descEn:
      'Seo Young Kim won the Excellence Award at the Career InBody Idea Competition held in 2026.',
  },
  '2026 세계일류 디자이너 양성사업(KDM+) 선발': {
    titleEn: 'Selected for the 2026 World-Class Designer Development Program (KDM+)',
    descEn:
      'Hyun Ho Ju and Jun Hee Heo were selected for Korea Design Membership Plus (KDM+).\nThis marks a fourth consecutive year of acceptance into the KDM+ program, and a remarkable feat of two students being selected at the same time.',
  },
  'HUSS 지산학 아카데미(여수) 비교과 아이디어 공모전 공감상 수상': {
    titleEn: 'Empathy Award at the HUSS Industry-University-Research Academy (Yeosu) Extracurricular Idea Competition',
    descEn:
      'Geun Young Park and Ji Yoon Hong won the Empathy Award at the HUSS Industry-University-Research Academy (Yeosu) Extracurricular Idea Competition held in 2026.\n「블록체인 기반 모바일-웨어러블 연동형 해양 상생 플랫폼 YE:ON」 (YE:ON, a blockchain-based mobile-wearable linked marine coexistence platform)\nGeun Young Park, Ji Yoon Hong',
  },
  '2025-2 캡스톤디자인·PBL 경진대회 대상 수상': {
    titleEn: 'Grand Prize at the 2025-2 Capstone Design & PBL Competition',
    descEn:
      "Yu Jin Jin, Su Min Im, Na Rin Ryu, A Yeon Son, and Chae Won Lee won the Grand Prize at the Capstone Design & PBL Competition held in 2025, on the theme of the course 'Introduction to Design Thinking'.",
  },
  '2025-2 지역사회 문제해결 PBL·캡스톤디자인(종합설계) PT 경진대회 최우수상 수상': {
    titleEn: 'First Prize at the 2025-2 Community Problem-Solving PBL & Capstone Design (Comprehensive Design) Presentation Competition',
    descEn:
      "Hye Ryeon Sim, Su Min Im, Su Min Kim, and Seo Young Kim won the First Prize at the Community Problem-Solving PBL & Capstone Design (Comprehensive Design) Presentation Competition held in 2025, on the theme of the course 'Social Innovation Design'.",
  },
  '2025 제8회 Hallym SW Week 디지털인문예술전공 우수작품 수상': {
    titleEn: 'Outstanding Works at the 2025 8th Hallym SW Week, Digital Arts & Humanities',
    descEn:
      'Multiple students won the Excellence Award, the Creative Silver Award, and the Innovation Award in the Digital Arts & Humanities Outstanding Works category at the 8th Hallym SW Week held in 2025.\nExcellence Award\n「지역의 현재를 데이터로 마주하다: 춘천 일자리 미스매치와 정주 대안」 (Facing the Region\'s Present through Data: Job Mismatch and Settlement Alternatives in Chuncheon)\nDo Hee Kim, Se Hee Woo, Jun Seok Lee, Jae Hoon Jeong, Ga Yeon Ham\nCreative Silver Award\n「향유(香有)」 (Hyangyu)\nChan Min Kim, Ju Hee Gam, Chae Rin Kim, Hyo Eun Im, Hyun Min Jang\nInnovation Award\n「카카오 회의록 : AI 에이전트 서비스 개발 연구」 (Kakao Meeting Minutes: A Study on Developing an AI Agent Service)\nHyun Ji Jang, Dong Gyun Heo, Yu Jin Jin, Jun Won Kim, Yoon Hwan Lee, Jin A Lee',
  },
  // anomaly 2: 키 끝에 트레일링 스페이스 1칸(소스 원문 그대로)
  '2025 제4회 강원디자인전람회 입선 & 특별상(사단법인 강원디자인협회장상) 수상 ': {
    titleEn: 'Selection & Special Award (Award of the Chairperson of the Gangwon Design Association) at the 2025 4th Gangwon Design Exhibition',
    descEn:
      'Hyun Ho Ju, Hyun A Yoon, Ji Yeon Kim, and Geun Young Park received Selections and a Special Award (Award of the Chairperson of the Gangwon Design Association) in the Visual Information, Digital Media, and Service Design categories at the 4th Gangwon Design Exhibition held in 2025.\nSpecial Award (Award of the Chairperson of the Gangwon Design Association)\n「강원디자인랩: 누구나 배우는 공공 디자인 교육 플랫폼 UX UI 리디자인」 (Gangwon Design Lab: UX/UI Redesign of a Public Design Education Platform for Everyone)\nHyun Ho Ju, Hyun A Yoon\nSelection\n「강원디자인진흥원 역량 강화 교육 플랫폼 서포터즈 \'강아디\'」 (\'Gangadi\', the Supporters of the Gangwon Design Promotion Agency\'s Capacity-Building Education Platform)\nJi Yeon Kim, Geun Young Park\nSelection\n「강원디자인진흥원 온라인 역량 강화 플랫폼 \'강원디자인랩\' CI 디자인」 (CI Design for \'Gangwon Design Lab\', the Gangwon Design Promotion Agency\'s Online Capacity-Building Platform)\nHyun Ho Ju\nSelection\n「강원디자인랩 통합 안내 리플렛 디자인」 (Integrated Guide Leaflet Design for Gangwon Design Lab)\nHyun Ho Ju, Hyun A Yoon',
  },
  '2025 AI 에듀테크 소프트랩 해커톤 대상 수상': {
    titleEn: 'Grand Prize at the 2025 AI EduTech SoftLab Hackathon',
    descEn:
      'Do Hee Kim, Ju Hee Gam, Geun Young Park, and Ji Yoon Hong won the Grand Prize at the AI EduTech SoftLab Hackathon held in 2025.\n「AI 저수율 알리미 : 실시간 저수율 데이터로 하는 강릉 가뭄 대비」 (AI Reservoir Level Notifier: Preparing for Drought in Gangneung with Real-Time Reservoir Data)\nDo Hee Kim, Ju Hee Gam, Geun Young Park, Ji Yoon Hong',
  },
  '2025 AI 에듀테크 소프트랩 해커톤 우수상 수상': {
    titleEn: 'Excellence Award at the 2025 AI EduTech SoftLab Hackathon',
    descEn:
      'Gyu Hae Lee, Dae Seung Kang, and Se Hee Woo won the Excellence Award at the AI EduTech SoftLab Hackathon held in 2025.\n「같이:가치, 춘천 쓰레기 문제 해결 기획」 (Together:Value, a plan to solve Chuncheon\'s waste problem)\nGyu Hae Lee, Dae Seung Kang, Se Hee Woo',
  },
  '2025 한국디지털콘텐츠학회 하계종합학술대회 대학생 논문경진대회 동상 수상': {
    titleEn: 'Bronze Award at the 2025 Korea Digital Contents Society Summer Conference University Student Paper Competition',
    descEn:
      'Do Hee Lee won the Bronze Award in the Presented Paper category of the University Student Paper Competition at the Korea Digital Contents Society Summer Conference held in 2025.\n「뉴스 빅데이터를 활용한 한국 게임산업 동향 분석: 1991년부터 2024년까지」 (Analysis of Korean Game Industry Trends Using News Big Data: From 1991 to 2024)\nDo Hee Lee',
  },
  '2025 세계일류 디자이너 양성사업(KDM+) 선발': {
    titleEn: 'Selected for the 2025 World-Class Designer Development Program (KDM+)',
    descEn:
      'Ye Rin Lee was selected for Korea Design Membership Plus (KDM+).\nThis marks the third consecutive year that Digital Arts & Humanities at Hallym University has produced a KDM+ selectee.',
  },
  '2024 세계일류 디자이너 양성사업(KDM+) 선발': {
    titleEn: 'Selected for the 2024 World-Class Designer Development Program (KDM+)',
    descEn:
      'Su Jeong Won was selected for Korea Design Membership Plus (KDM+).\nThis marks the second consecutive year that Digital Arts & Humanities at Hallym University has produced a KDM+ selectee.',
  },
  '2023 디지털인문학대회 논문 포스터 게재': {
    titleEn: 'Paper Posters Presented at the 2023 Digital Humanities Conference',
    descEn:
      'At the Digital Humanities Conference hosted by the Korean Association for Digital Humanities (KADH), a total of four students - Ji Woo Choi, Do Hee Kim, Jong Tae Kim, and Jeong Eum Choi - presented paper posters.\n「Parliamentary Bill Network Visualization: Towards Enhanced Political Engagement」\nDo Hee Kim, Jong Tae Kim, Jeong Eum Choi\n「Character and Context in The Great Gatsby: A Network Analysis Approach」\nJi Woo Choi',
  },
  '2023 IDEEC 논문 포스터 게재': {
    titleEn: 'Paper Posters Presented at the 2023 IDEEC',
    descEn:
      'At the International Design Education Expo and Conference (IDEEC), many students presented paper posters.\nThe presented papers can be viewed via the button below.\nProf. Seong Woo Kim\n「Display」\nSeon Jae Kwak, Ho Yong Yoon, A Ri Choi, Ju Seong Lee, Yu Hyun Kim, Hyun Ji Choi\n「HIBRARY」\nDo Yeon Kang, Min Sung Koo, Seo Young Nam, Su Jin Lee, Seo Yeon Choi, Seung Jin Ha\n「Hallym Welcome Package」\nMin Heo, Hae Rin Ka, Si Young Park, Hee Kyung Kim, Seok Young Yoon, Su Hyun Kim\n「National Assembly: How to be a Good Citizen」\nJeong Eum Choi, Do Hee Kim, Jong Tae Kim\n「Travel Trend 2023」\nSu Jeong Won, Do Yeon Kang, Chan Mi Hwang, Su Bin Baek\n「RunH for a Healthy Life Together」\nHa Kyung Ko, Jae Won Han, Mun Jin Lee, Ji Yeon Lee, I Seul Cha, Ju Young Yang',
  },
  '2023 세계일류 디자이너 양성사업(KDM+) 선발': {
    titleEn: 'Selected for the 2023 World-Class Designer Development Program (KDM+)',
    descEn:
      'Jae Yeon Sim was selected for Korea Design Membership Plus (KDM+).\nThis is the first time Digital Arts & Humanities at Hallym University has produced a KDM+ selectee.',
  },
  '2020 제18회 임베디드 소프트웨어 경진대회 장관상 수상': {
    titleEn: "Minister's Award at the 2020 18th Embedded Software Competition",
    descEn:
      'At the 18th Embedded Software Competition hosted by the Ministry of Trade, Industry and Energy of Korea, Do Kyung Kim won the Award of the Minister of Trade, Industry and Energy.',
  },
  '2020 춘천시 도시재생 BI 공모전 대상 수상': {
    titleEn: 'Grand Prize at the 2020 Chuncheon City Urban Regeneration BI Competition',
    descEn:
      'At the Gyo-dong Urban Regeneration BI Competition hosted by Chuncheon City, Young Don Cheon won the Grand Prize.',
  },
  '2019 제5회 스토리테마파크 창작·콘텐츠 공모전 최우수상 수상': {
    titleEn: 'First Prize at the 2019 5th Story Theme Park Creative Content Competition',
    descEn:
      "At the 5th Story Theme Park Creative Content Competition hosted by the Korean Studies Advancement Center, Ji Won Moon, Hyung Min Park, and Ha Neul Choi won the First Prize with the work '조선궁궐 신입생활' (Freshman Life in a Joseon Palace).",
  },
  '2019 한국디지털경영학회 디지털경영연구 논문 게재': {
    titleEn: 'Paper Published in the 2019 Journal of Digital Management Research, Korea Society of Digital Management',
    descEn:
      'Min Jeong published the paper 「오픈소스 한국어 NLP 툴 성능 평가: HR 업무 데이터 중심으로」 (Performance Evaluation of Open-Source Korean NLP Tools: Focusing on HR Task Data) in the Journal of Digital Management Research, Vol. 6, No. 1, published by the Korea Society of Digital Management.',
  },
  '2019 제13회 한국정보과학회·한국빅데이터학회 공동학술 심포지엄 논문 발표': {
    titleEn: 'Paper Presented at the 2019 13th Joint Academic Symposium of the Korea Information Science Society and the Korea Big Data Society',
    descEn:
      'At the 13th Joint Academic Symposium hosted by the Korea Information Science Society and the Korea Big Data Society, Nae Hyun Nam presented the paper 「고고학 학술연구논문 빅데이터 분석: 키워드와 토픽모델링 분석을 중심으로」 (Big Data Analysis of Archaeological Academic Research Papers: Focusing on Keyword and Topic Modeling Analysis).',
  },
}
