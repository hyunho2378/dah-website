// CouncilAdmin.jsx — 운영위원회 T4 기수 CRUD (13_CMS_SPEC 1절, admin+)
// 기수 추가 시 과거 기수 자동 보존(아카이브형, ordinal DESC). 로고 업로드 + members jsonb.

import EntityCrud from '../../components/admin/EntityCrud'
import { useTitle } from '../../hooks/useTitle'

const FIELDS = [
  { key: 'ordinal', label: '기수', kind: 'number', hint: '숫자만 (예: 3기 → 3)' },
  { key: 'name', label: '기수명', placeholder: '예: LUCID' },
  { key: 'year_label', label: '연도 라벨', placeholder: '예: 2026' },
  { key: 'logo_url', label: '로고', kind: 'image' },
  { key: 'intro', label: '소개', kind: 'textarea', span2: true },
  {
    key: 'members',
    label: '구성원',
    kind: 'pairs',
    span2: true,
    pairKeys: [
      { key: 'name', label: '이름' },
      { key: 'role', label: '역할' },
    ],
  },
  { key: 'sort', label: '정렬 순서', kind: 'number' },
]

function toPayload(form) {
  return {
    ...form,
    ordinal: form.ordinal === '' ? null : Number(form.ordinal),
    sort: form.sort === '' ? 0 : Number(form.sort),
  }
}

// 아카이브형 — 최신 기수 우선 (서버 orderBy와 동일)
function sortFn(a, b) {
  return (b.ordinal ?? 0) - (a.ordinal ?? 0) || (a.sort ?? 0) - (b.sort ?? 0) || (a.id ?? 0) - (b.id ?? 0)
}

function CouncilAdmin() {
  useTitle('운영위원회 관리')
  return (
    <EntityCrud
      type="council"
      title="운영위원회"
      desc="기수를 추가하면 과거 기수는 동일 템플릿으로 자동 보존됩니다."
      fields={FIELDS}
      toPayload={toPayload}
      sortFn={sortFn}
      orderable={false}
      display={(item) => ({
        title: `${item.ordinal ? `${item.ordinal}기 ` : ''}${item.name}`,
        meta: [item.year_label, item.members?.length ? `구성원 ${item.members.length}명` : null]
          .filter(Boolean)
          .join(' · '),
        thumb: item.logo_url,
      })}
    />
  )
}

export default CouncilAdmin
