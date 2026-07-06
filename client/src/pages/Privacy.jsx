import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import { useTitle } from '../hooks/useTitle'
import { site } from '../data/site.js'

// Privacy.jsx — 개인정보처리방침 (F5, 16_PHASE4)
// 표준 골격만 반영(수집항목·이용목적·보유기간·문의처). 학과명·주소 이관, 과장 문구 금지.
// 원문 정책 문서 확정 시 이 상수만 교체한다.
const ORG = `한림대학교 ${site.nameKr}`
const ADDRESS = '강원특별자치도 춘천시 한림대학길 1'

const SECTIONS = [
  {
    title: '수집하는 개인정보 항목',
    body: [
      '본 사이트는 서비스 제공에 필요한 최소한의 개인정보를 수집합니다.',
      '관리자 로그인: 이메일 주소, 비밀번호',
      '문의·접수 과정에서 이용자가 직접 입력한 성명, 연락처, 소속 등의 정보',
    ],
  },
  {
    title: '개인정보의 이용 목적',
    body: [
      '수집한 개인정보는 다음의 목적으로만 이용합니다.',
      '관리자 인증 및 콘텐츠 운영·관리',
      '문의 응대, 프로그램·행사 접수 처리 및 결과 안내',
    ],
  },
  {
    title: '개인정보의 보유 및 이용 기간',
    body: [
      '개인정보는 수집·이용 목적이 달성되면 지체 없이 파기합니다.',
      '관계 법령에 따라 보존이 필요한 경우 해당 법령에서 정한 기간 동안 보관합니다.',
    ],
  },
  {
    title: '개인정보 보호책임자 및 문의처',
    body: [
      `개인정보 관련 문의는 아래 연락처로 접수할 수 있습니다.`,
      `${ORG}`,
      `${ADDRESS}`,
      // 데이터 갭: site.js에 대표 문의 메일 없음 — 추가 시 아래 줄에 노출한다.
      // `이메일: ${site.mail}`,
    ],
  },
]

function Privacy() {
  useTitle('개인정보처리방침')

  return (
    <>
      <PageBanner
        titleKo="개인정보처리방침"
        titleEn="PRIVACY POLICY"
        breadcrumb={[
          { label: '홈', to: '/' },
          { label: '개인정보처리방침', to: '/privacy' },
        ]}
        nebulaX="70%"
        nebulaY="25%"
      />

      <Container className="py-section-m md:py-section-d">
        <div className="max-w-[760px]">
          <p className="text-body-m leading-relaxed text-text-sec md:text-body-d">
            {ORG}(이하 &lsquo;본 전공&rsquo;)은 이용자의 개인정보를 중요하게
            생각하며, 관련 법령에 따라 개인정보를 보호하고 있습니다.
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
                  {section.body.map((line) => (
                    <li
                      key={line}
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
