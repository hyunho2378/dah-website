import { ACCENT } from '../../styles/accents'

// Accent.jsx — X1(33_PHASE18) 보라 포인트 인라인 텍스트.
// 색은 accents.js 규약만 사용한다(하드코딩 금지). 의미 전달용이 아니라 위계 표시용이므로
// 스크린리더에 추가 정보를 주지 않는다(순수 시각 강조).
//
// kind: 'proper'(연도·기수·고유명) | 'role'(직책) | 'index'(섹션 번호) | 'status' | 'link'
function Accent({ kind = 'proper', as: Tag = 'span', className = '', children }) {
  return (
    <Tag className={`${ACCENT[kind] || ACCENT.proper} ${className}`.trim()}>
      {children}
    </Tag>
  )
}

export default Accent
