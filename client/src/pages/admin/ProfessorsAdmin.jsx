// ProfessorsAdmin.jsx — 교수진 카드 CRUD (13_CMS_SPEC 1절, admin+)
// 추가·수정·삭제·정렬(sort 스왑) + 사진 업로드. EntityCrud 얇은 래퍼.

import EntityCrud from '../../components/admin/EntityCrud'
import { useTitle } from '../../hooks/useTitle'

const FIELDS = [
  { key: 'name_ko', label: '이름 (국문)' },
  { key: 'name_en', label: '이름 (영문)' },
  { key: 'title_ko', label: '직함 (국문)' },
  { key: 'title_en', label: '직함 (영문)' },
  { key: 'email', label: '이메일', kind: 'email' },
  { key: 'photo_url', label: '사진', kind: 'image', span2: true },
  {
    key: 'links',
    label: '링크',
    kind: 'pairs',
    span2: true,
    pairKeys: [
      { key: 'label', label: '라벨' },
      { key: 'url', label: 'URL' },
    ],
  },
  { key: 'sort', label: '정렬 순서', kind: 'number' },
  { key: 'active', label: '표시 여부', kind: 'toggle', default: true },
]

function ProfessorsAdmin() {
  useTitle('교수진 관리')
  return (
    <EntityCrud
      type="professors"
      title="교수진"
      desc="추가·수정·삭제·정렬. 사진 미보유 교수는 이니셜 플레이스홀더로 렌더됩니다."
      fields={FIELDS}
      display={(item) => ({
        title: item.name_ko,
        meta: [item.title_ko, item.email].filter(Boolean).join(' · '),
        thumb: item.photo_url,
      })}
    />
  )
}

export default ProfessorsAdmin
