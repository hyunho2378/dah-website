import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import { useTitle } from '../hooks/useTitle'
import { useLang, KoreanOnlyBadge } from '../i18n/LangContext'
import { site } from '../data/site.js'

// Privacy.jsx — 개인정보처리방침 (Y1-6, 33_PHASE18)
// 실제 이 사이트가 수집하는 항목만 적는다. 존재하지 않는 수탁사·해외 이전·분석 도구를 쓰지 않는다.
//   - 상담 신청: server/src/routes/consult.js (name, grade, main_major, double_major, contact, message)
//   - 전시회 접수: server/src/routes/submit.js (entry_type, email, fields, 수정용 비밀번호 해시)
//   - 관리자 인증: JWT 쿠키(access·refresh) — 로그인 사용자에게만 발급
//   - 분석 도구: Google Analytics(GA4, 39_GA4) — 관리자 로그인 세션은 전송 제외(src/components/Analytics.jsx)
// 문구를 바꿀 일이 생기면 아래 상수·SECTIONS만 교체한다.
const ORG = `한림대학교 ${site.nameKr}`
const ADDRESS = '강원특별자치도 춘천시 한림대학길 1'
const CONTACT_EMAIL = 'de46141@hallym.ac.kr'
const CONTACT_TEL = '033-248-3556'

const SECTIONS = [
  {
    title: '수집하는 개인정보 항목과 수집 방법',
    body: [
      '본 전공은 서비스 제공에 필요한 최소한의 개인정보만 수집하며, 별도의 회원가입 절차를 두지 않습니다. 개인정보는 이용자가 웹사이트의 신청 양식에 직접 입력하는 방법으로만 수집합니다.',
      '상담 신청: 성명, 학년, 주전공, 복수전공, 연락처, 문의 내용',
      '프로젝트 전시회 접수: 참가 유형(개인·팀), 참가자 성명 등 인적사항, 이메일 주소, 연락처, 신청 과목, 작품명·작품 설명 등 작품 정보, 접수 내역 확인·수정용 비밀번호',
      '관리자 계정: 이메일 주소, 비밀번호',
      '이용자가 설정한 비밀번호는 복호화할 수 없는 일방향 암호화 방식으로 저장하며, 운영자를 포함한 누구도 원문을 확인할 수 없습니다.',
      '본 전공은 사상·신념, 건강 상태, 병력 등 민감정보와 고유식별정보를 수집하지 않습니다.',
    ],
  },
  {
    title: '개인정보의 이용 목적',
    body: [
      '수집한 개인정보는 아래 목적으로만 이용하며, 목적이 변경되는 경우 사전에 동의를 받습니다.',
      '상담 신청의 접수·확인, 상담 응대 및 결과 안내',
      '프로젝트 전시회 접수의 확인, 접수 내역 조회·수정 시 본인 확인, 전시 운영과 결과 안내',
      '관리자 인증 및 웹사이트 콘텐츠 운영·관리',
      '위 목적을 벗어난 마케팅, 광고, 외부 제공 목적으로는 이용하지 않습니다.',
    ],
  },
  {
    title: '쿠키와 접속 분석 도구',
    body: [
      '본 사이트는 일반 방문자를 대상으로 하는 광고·행태정보 수집 목적의 쿠키를 사용하지 않습니다.',
      '관리자가 로그인한 경우에 한해 인증 상태 유지를 위한 쿠키(접속 토큰)를 사용하며, 로그아웃하면 즉시 삭제됩니다.',
      '이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다. 다만 이 경우 관리자 로그인 등 일부 기능이 제한될 수 있습니다.',
      '본 사이트는 방문 통계 파악을 위해 Google Analytics(GA4)를 사용하며, 페이지 조회 등 비식별 이용 통계를 수집합니다. 관리자로 로그인한 상태의 접속은 방문 통계에서 제외됩니다.',
    ],
  },
  {
    title: '개인정보의 보유 및 이용 기간',
    body: [
      '개인정보는 수집·이용 목적이 달성되면 지체 없이 파기하는 것을 원칙으로 합니다.',
      '상담 신청 정보: 상담 응대가 완료된 때',
      '프로젝트 전시회 접수 정보: 해당 학기 전시회 운영과 결과 안내가 완료된 때',
      '관리자 계정 정보: 관리자 권한이 종료된 때',
      '관계 법령에 따라 일정 기간 보존이 필요한 정보는 해당 법령에서 정한 기간 동안 분리하여 보관한 뒤 파기합니다.',
    ],
  },
  {
    title: '개인정보의 제3자 제공',
    body: [
      '본 전공은 수집한 개인정보를 제3자에게 제공하거나 판매하지 않습니다.',
      '다만 정보주체가 사전에 동의한 경우, 또는 법령에 특별한 규정이 있거나 수사기관이 법령에 정해진 절차와 방법에 따라 요구하는 경우에는 예외로 합니다.',
      '신청 접수 사실은 학과 운영을 위해 학과 담당자에게만 전달되며, 이는 본 전공 내부의 처리에 해당합니다.',
      '본 전공은 개인정보를 국외로 이전하지 않습니다.',
    ],
  },
  {
    title: '개인정보의 파기 절차와 방법',
    body: [
      '파기 절차: 보유 기간이 지나거나 이용 목적이 달성된 개인정보는 담당자의 확인과 개인정보 보호책임자의 승인을 거쳐 파기합니다.',
      '파기 방법: 전자적 파일 형태의 정보는 복구·재생할 수 없는 기술적 방법으로 삭제하고, 종이에 출력된 정보는 분쇄하거나 소각합니다.',
    ],
  },
  {
    title: '정보주체의 권리와 행사 방법',
    body: [
      '정보주체는 언제든지 본인의 개인정보에 대한 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다.',
      '프로젝트 전시회 접수 내역은 접수 시 입력한 이메일 주소와 수정용 비밀번호로 이용자가 직접 조회하고 수정할 수 있습니다. 다만 수정 마감 이후에는 수정이 제한됩니다.',
      '그 밖의 권리 행사는 아래 문의처로 서면 또는 이메일을 통해 요청할 수 있으며, 본 전공은 본인 여부를 확인한 뒤 지체 없이 조치합니다.',
      '만 14세 미만 아동의 개인정보에 관한 권리는 법정대리인이 행사할 수 있습니다.',
      '권리 행사로 인해 신청 처리가 제한되는 경우에는 그 사유를 함께 안내합니다.',
    ],
  },
  {
    title: '개인정보의 안전성 확보 조치',
    body: [
      '관리적 조치: 개인정보 취급자를 학과 운영에 필요한 최소 인원으로 제한하고, 접근 권한을 역할에 따라 구분해 부여합니다.',
      '기술적 조치: 비밀번호는 일방향 암호화하여 저장하고, 통신 구간은 암호화(HTTPS)하여 전송합니다.',
      '접근 통제: 관리 화면은 인증된 관리자만 접근할 수 있도록 제한합니다.',
    ],
  },
  {
    title: '개인정보 보호책임자와 문의처',
    body: [
      '개인정보 처리에 관한 문의, 불만 처리, 피해 구제는 아래로 접수할 수 있습니다.',
      `개인정보 보호책임자: ${ORG} 행정실`,
      `주소: ${ADDRESS}`,
      `전화: ${CONTACT_TEL}`,
      `이메일: ${CONTACT_EMAIL}`,
      '개인정보 침해에 대한 상담과 분쟁 조정이 필요한 경우 개인정보침해신고센터(privacy.kisa.or.kr, 국번 없이 118) 또는 개인정보분쟁조정위원회(kopico.go.kr)에 도움을 요청할 수 있습니다.',
    ],
  },
  {
    title: '개인정보처리방침의 변경',
    body: [
      '법령·정책 또는 서비스 내용의 변경에 따라 본 방침을 개정하는 경우, 변경 사항과 시행일을 본 페이지에 게시합니다.',
      '이용자의 권리에 중대한 영향을 미치는 변경은 시행일로부터 최소 7일 전에 공지합니다.',
    ],
  },
]

function Privacy() {
  const { t } = useLang()
  useTitle(t('titles.privacy'))

  return (
    <>
      <PageBanner
        titleKo="개인정보처리방침"
        titleEn="PRIVACY POLICY"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('titles.privacy'), to: '/privacy' },
        ]}
        nebulaX="70%"
        nebulaY="25%"
      />

      <Container className="py-section-m md:py-section-d">
        <div className="max-w-[760px]">
          <div className="mb-16"><KoreanOnlyBadge /></div>
          <p className="text-body-m leading-relaxed text-text-sec md:text-body-d">
            {ORG}(이하 &lsquo;본 전공&rsquo;)은 개인정보 보호법 등 관련 법령을 준수하며,
            이용자의 개인정보를 보호하기 위해 다음과 같이 개인정보처리방침을 수립·공개합니다.
            본 방침은 본 전공이 운영하는 웹사이트에서 이루어지는 상담 신청, 프로젝트 전시회
            접수, 관리자 운영에 적용됩니다.
          </p>
          <div className="mt-48 flex flex-col gap-40 md:mt-64">
            {SECTIONS.map((section, i) => (
              <section key={section.title}>
                <h2 className="flex items-baseline gap-12 text-h3-m font-bold text-text-pri md:text-h3-d">
                  <span className="font-mono text-label-m text-text-meta md:text-label-d">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </h2>
                <ul className="mt-16 flex flex-col gap-8">
                  {section.body.map((line, j) => (
                    <li
                      // 조문 본문은 원문 순서가 곧 의미라 인덱스 키가 정확하다(재정렬 없음)
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${section.title}-${j}`}
                      className="text-body-m leading-relaxed text-text-sec md:text-body-d"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <p className="mt-48 font-mono text-caption-m text-text-meta md:mt-64 md:text-caption-d">
            본 방침은 2026년 1월 1일부터 적용됩니다.
          </p>
        </div>
      </Container>
    </>
  )
}

export default Privacy
