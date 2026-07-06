import Button from '../components/common/Button'
import { useTitle } from '../hooks/useTitle'

// P7 에러 상태: displayL "404" + body 안내 + Button primary "홈으로 돌아가기"
function NotFound() {
  useTitle('404')

  return (
    <section className="mx-auto flex max-w-container flex-col items-start gap-32 px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
      <h1 className="font-display text-display-l-m uppercase leading-tight tracking-display text-text-pri md:text-display-l-d">
        404
      </h1>
      <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
        요청하신 페이지를 찾을 수 없습니다. 주소가 바뀌었거나 삭제된 페이지일 수
        있습니다.
      </p>
      <Button variant="primary" href="/">
        홈으로 돌아가기
      </Button>
    </section>
  )
}

export default NotFound
