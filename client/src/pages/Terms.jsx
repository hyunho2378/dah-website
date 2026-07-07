import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import { useTitle } from '../hooks/useTitle'
import { useLang, KoreanOnlyBadge } from '../i18n/LangContext'
import { site } from '../data/site.js'

// Terms.jsx — 이용약관 (F5, 16_PHASE4)
// 표준 골격만 반영(목적·정의·서비스·책임). 학과명 이관, 과장 문구 금지.
// 원문 약관 문서 확정 시 이 상수만 교체한다.
const ORG = `한림대학교 ${site.nameKr}`

const SECTIONS = [
  {
    title: '목적',
    body: [
      `본 약관은 ${ORG}(이하 '본 전공')이 제공하는 웹사이트 서비스의 이용 조건과 절차, 이용자와 본 전공의 권리·의무 및 책임 사항을 규정하는 것을 목적으로 합니다.`,
    ],
  },
  {
    title: '정의',
    body: [
      "'서비스'란 본 전공이 웹사이트를 통해 제공하는 정보, 콘텐츠 및 관련 기능 일체를 말합니다.",
      "'이용자'란 본 약관에 따라 서비스를 이용하는 모든 방문자 및 회원을 말합니다.",
    ],
  },
  {
    title: '서비스의 제공',
    body: [
      '본 전공은 학과 소개, 교육과정, 프로그램, 소식 등 학과 활동에 관한 정보를 제공합니다.',
      '본 전공은 운영상·기술상 필요에 따라 서비스의 내용을 변경하거나 중단할 수 있습니다.',
    ],
  },
  {
    title: '이용자의 의무',
    body: [
      '이용자는 관계 법령과 본 약관을 준수하여야 하며, 서비스의 정상적인 운영을 방해하는 행위를 하여서는 안 됩니다.',
      '이용자가 게시한 자료의 내용에 대한 책임은 이용자 본인에게 있습니다.',
    ],
  },
  {
    title: '책임의 제한',
    body: [
      '본 전공은 천재지변, 통신 장애 등 불가항력으로 인한 서비스 중단에 대하여 책임을 지지 않습니다.',
      '외부 링크로 연결된 사이트의 콘텐츠에 대하여 본 전공은 책임을 지지 않습니다.',
    ],
  },
]

function Terms() {
  const { t } = useLang()
  useTitle(t('titles.terms'))

  return (
    <>
      <PageBanner
        titleKo="이용약관"
        titleEn="TERMS OF SERVICE"
        breadcrumb={[
          { label: t('nav.home'), to: '/' },
          { label: t('titles.terms'), to: '/terms' },
        ]}
        nebulaX="30%"
        nebulaY="70%"
      />

      <Container className="py-section-m md:py-section-d">
        <div className="max-w-[760px]">
          <div className="mb-16"><KoreanOnlyBadge /></div>
          <p className="text-body-m leading-relaxed text-text-sec md:text-body-d">
            본 약관은 {ORG} 웹사이트 이용에 필요한 기본 사항을 규정합니다. 서비스를
            이용함으로써 이용자는 본 약관에 동의한 것으로 봅니다.
          </p>
          <div className="mt-48 flex flex-col gap-40 md:mt-64">
            {SECTIONS.map((section, i) => (
              <section key={section.title}>
                <h2 className="flex items-baseline gap-12 text-h3-m font-bold text-text-pri md:text-h3-d">
                  <span className="font-mono text-label-m text-text-meta md:text-label-d">
                    제{i + 1}조
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
            본 약관은 2026년 1월 1일부터 적용됩니다.
          </p>
        </div>
      </Container>
    </>
  )
}

export default Terms
