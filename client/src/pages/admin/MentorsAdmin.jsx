// MentorsAdmin.jsx — 멘토단 카드 CRUD (13_CMS_SPEC 1절, admin+)
// 추가·수정·삭제·정렬(sort 스왑). EntityCrud 얇은 래퍼.

import EntityCrud from '../../components/admin/EntityCrud'
import { useTitle } from '../../hooks/useTitle'

const FIELDS = [
  { key: 'name', label: '이름' },
  { key: 'company', label: '소속' },
  { key: 'title', label: '직함' },
  { key: 'link', label: '링크', kind: 'url' },
  { key: 'sort', label: '정렬 순서', kind: 'number' },
  { key: 'active', label: '표시 여부', kind: 'toggle', default: true },
]

function MentorsAdmin() {
  useTitle('멘토 관리')
  return (
    <EntityCrud
      type="mentors"
      title="멘토"
      fields={FIELDS}
      display={(item) => ({
        title: item.name,
        meta: [item.company, item.title].filter(Boolean).join(' · '),
      })}
    />
  )
}

export default MentorsAdmin
