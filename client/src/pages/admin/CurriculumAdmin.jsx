// CurriculumAdmin.jsx — 교과목 로드맵 노드 CRUD (13_CMS_SPEC 1절, admin+)
// 학년·학기·트랙 선택 → 로드맵 자동 반영. 공통기초는 track=common으로 최상단 고정.

import EntityCrud from '../../components/admin/EntityCrud'
import { useTitle } from '../../hooks/useTitle'

// B1 서버 계약 track 값: common | design | ai | culture (content-config 검증)
const TRACKS = [
  { value: 'common', label: '공통기초 (로드맵 최상단 고정)' },
  { value: 'design', label: 'Design Track' },
  { value: 'ai', label: 'AI Track' },
  { value: 'culture', label: 'Enter-Culture Track' },
]

const TRACK_LABEL = { common: '공통기초', design: '디자인', ai: 'AI', culture: '엔터컬처' }

const FIELDS = [
  { key: 'name_ko', label: '과목명 (국문)' },
  { key: 'name_en', label: '과목명 (영문)' },
  {
    key: 'grade',
    label: '학년',
    kind: 'select',
    default: '1',
    options: [1, 2, 3, 4].map((n) => ({ value: String(n), label: `${n}학년` })),
  },
  {
    key: 'semester',
    label: '학기',
    kind: 'select',
    default: '1',
    options: [
      { value: '1', label: '1학기' },
      { value: '2', label: '2학기' },
    ],
  },
  { key: 'track', label: '트랙', kind: 'select', default: 'common', options: TRACKS, span2: true },
  { key: 'sort', label: '정렬 순서', kind: 'number' },
]

// select는 문자열로 다루고 저장 시 int 컬럼에 맞게 숫자화
function toPayload(form) {
  return {
    ...form,
    grade: Number(form.grade),
    semester: Number(form.semester),
    sort: form.sort === '' ? 0 : Number(form.sort),
  }
}

function fromItem(item) {
  return {
    name_ko: item.name_ko || '',
    name_en: item.name_en || '',
    grade: String(item.grade ?? 1),
    semester: String(item.semester ?? 1),
    track: item.track || 'common',
    sort: item.sort ?? 0,
  }
}

// 로드맵과 동일 순서: 공통기초 최상단 → 학년 → 정렬
function sortFn(a, b) {
  const commonFirst = (a.track === 'common' ? 0 : 1) - (b.track === 'common' ? 0 : 1)
  return (
    commonFirst ||
    (a.grade ?? 0) - (b.grade ?? 0) ||
    (a.sort ?? 0) - (b.sort ?? 0) ||
    (a.id ?? 0) - (b.id ?? 0)
  )
}

function CurriculumAdmin() {
  useTitle('교과목 관리')
  return (
    <EntityCrud
      type="curriculum"
      title="교과목"
      desc="학년·학기·트랙 선택 시 로드맵에 자동 반영됩니다. 공통기초는 track=common으로 최상단에 고정됩니다."
      fields={FIELDS}
      toPayload={toPayload}
      fromItem={fromItem}
      sortFn={sortFn}
      orderable={false}
      display={(item) => ({
        title: item.name_ko,
        meta: `${item.grade}학년 ${item.semester ?? '-'}학기 · ${TRACK_LABEL[item.track] || item.track}`,
      })}
    />
  )
}

export default CurriculumAdmin
