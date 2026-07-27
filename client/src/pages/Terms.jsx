import PageBanner from '../components/layout/PageBanner'
import Container from '../components/layout/Container'
import { useTitle } from '../hooks/useTitle'
import { useLang, KoreanOnlyBadge } from '../i18n/LangContext'
import { site } from '../data/site.js'

// Terms.jsx — 이용약관 (Y1-6, 33_PHASE18)
// 실제 제공 중인 기능(정보 열람·상담 신청·프로젝트 전시회 접수와 접수 내역 수정)만 규정한다.
// 존재하지 않는 유료 서비스·회원 등급·제휴를 만들지 않는다. 문구 교체는 아래 상수·SECTIONS만.
const ORG = `한림대학교 ${site.nameKr}`
const CONTACT_EMAIL = 'de46141@hallym.ac.kr'
const CONTACT_TEL = '033-248-3556'

const SECTIONS = [
  {
    title: '목적',
    body: [
      `본 약관은 ${ORG}(이하 '본 전공')이 운영하는 웹사이트에서 제공하는 서비스의 이용 조건과 절차, 이용자와 본 전공의 권리·의무 및 책임 사항을 정하는 것을 목적으로 합니다.`,
    ],
  },
  {
    title: '용어의 정의',
    body: [
      "'서비스'란 본 전공이 웹사이트를 통해 제공하는 정보, 콘텐츠, 신청 기능 일체를 말합니다.",
      "'이용자'란 본 약관에 따라 서비스를 이용하는 모든 방문자를 말합니다.",
      "'관리자'란 본 전공으로부터 권한을 부여받아 콘텐츠를 등록·수정·삭제하는 자를 말합니다.",
      "'신청'이란 이용자가 상담 신청, 프로젝트 전시회 접수 등 웹사이트의 양식을 통해 제출하는 행위를 말합니다.",
      '본 약관에서 정하지 않은 용어의 뜻은 관계 법령과 일반적인 상관례에 따릅니다.',
    ],
  },
  {
    title: '약관의 효력과 변경',
    body: [
      '본 약관은 웹사이트에 게시함으로써 효력이 발생합니다.',
      '본 전공은 관계 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 변경 내용과 시행일을 본 페이지에 게시합니다.',
      '이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있습니다.',
    ],
  },
  {
    title: '서비스의 제공',
    body: [
      '본 전공은 학과 소개, 교육과정, 학과 행사, 학생 활동, 공지사항, 자료실 등 학과 활동에 관한 정보를 제공합니다.',
      '본 전공은 복수전공·교육과정 상담 신청 기능과 프로젝트 전시회 접수 기능을 제공합니다.',
      '서비스 이용에는 별도의 회원가입이나 이용 요금이 필요하지 않습니다.',
    ],
  },
  {
    title: '서비스의 변경과 중단',
    body: [
      '본 전공은 학사 일정, 운영상·기술상 필요에 따라 서비스의 내용을 변경하거나 일부 또는 전부를 중단할 수 있습니다.',
      '정기 점검, 설비 보수, 통신 장애 등으로 서비스가 일시 중단될 수 있으며, 예측 가능한 중단은 사전에 공지합니다.',
    ],
  },
  {
    title: '이용자의 의무',
    body: [
      '이용자는 신청 시 사실에 부합하는 정보를 정확하게 입력하여야 합니다.',
      '이용자는 타인의 성명, 연락처, 이메일 등 개인정보를 도용하여 신청하여서는 안 됩니다.',
      '이용자는 접수 내역 수정용 비밀번호를 스스로 관리할 책임이 있으며, 이를 타인에게 알려 발생한 결과에 대해서는 본 전공이 책임지지 않습니다.',
      '이용자는 서비스의 정상적인 운영을 방해하는 행위, 무단으로 정보를 수집·복제하는 행위를 하여서는 안 됩니다.',
      '이용자는 관계 법령과 본 약관을 준수하여야 합니다.',
    ],
  },
  {
    title: '신청과 접수의 처리',
    body: [
      '신청은 본 전공이 정한 접수 기간 내에만 가능하며, 접수 기간과 마감 시각은 서버 시각을 기준으로 판단합니다.',
      '이용자는 접수 시 입력한 이메일 주소와 수정용 비밀번호로 본인의 접수 내역을 조회하고 수정할 수 있습니다.',
      '수정 마감 이후에는 접수 내용을 수정할 수 없습니다.',
      '참가 유형, 신청 과목, 이메일 주소 등 접수 확인의 기준이 되는 항목은 접수 이후 변경할 수 없습니다.',
      '허위 정보로 접수한 사실이 확인된 경우 본 전공은 해당 접수를 취소할 수 있으며, 그 사유를 신청자에게 안내합니다.',
    ],
  },
  {
    title: '게시물과 저작물의 권리',
    body: [
      '웹사이트에 게시된 문서, 이미지, 디자인 등 본 전공이 제작한 콘텐츠의 저작권은 본 전공 또는 정당한 권리자에게 있습니다.',
      '이용자는 본 전공의 사전 동의 없이 게시된 콘텐츠를 복제, 배포, 전송, 출판 등 상업적 목적으로 이용할 수 없습니다.',
      '이용자가 제출한 작품의 저작권은 제출자에게 있습니다. 본 전공은 전시 운영과 학과 홍보 목적의 범위에서 제출자의 동의를 받아 작품을 게시할 수 있습니다.',
      '이용자가 제출한 내용이 제3자의 권리를 침해하는 경우 그 책임은 제출한 이용자에게 있습니다.',
    ],
  },
  {
    title: '개인정보의 보호',
    body: [
      '본 전공은 서비스 제공에 필요한 최소한의 개인정보를 수집하며, 수집한 개인정보는 개인정보처리방침에 따라 처리합니다.',
      '개인정보의 수집 항목, 이용 목적, 보유 기간, 정보주체의 권리에 관한 사항은 개인정보처리방침에서 확인할 수 있습니다.',
    ],
  },
  {
    title: '책임의 제한',
    body: [
      '본 전공은 천재지변, 정전, 통신 장애 등 불가항력으로 인한 서비스 중단에 대하여 책임을 지지 않습니다.',
      '본 전공은 이용자가 입력한 정보의 오기·누락으로 발생한 결과에 대하여 책임을 지지 않습니다.',
      '외부 링크로 연결된 사이트의 콘텐츠와 서비스에 대하여 본 전공은 책임을 지지 않습니다.',
    ],
  },
  {
    title: '준거법과 문의',
    body: [
      '본 약관과 서비스 이용에 관하여는 대한민국 법령을 적용합니다.',
      '서비스 이용과 관련한 분쟁은 당사자 간 협의로 해결하는 것을 원칙으로 하며, 협의가 이루어지지 않는 경우 관계 법령이 정한 절차에 따릅니다.',
      `서비스 이용에 관한 문의는 전화 ${CONTACT_TEL} 또는 이메일 ${CONTACT_EMAIL}로 접수할 수 있습니다.`,
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
            본 약관은 {ORG} 웹사이트의 이용에 필요한 기본 사항을 규정합니다. 이용자가
            서비스를 이용하는 경우 본 약관에 동의한 것으로 봅니다.
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
            본 약관은 2026년 1월 1일부터 적용됩니다.
          </p>
        </div>
      </Container>
    </>
  )
}

export default Terms
