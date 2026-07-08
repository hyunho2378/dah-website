// InlineEditBar.jsx — 공개 리스트/상세 상단 편집 바 (C2, 22_PHASE10)
// 로그인+권한(canEdit(type)) 시에만 렌더 — 비로그인 픽셀 미출력.
// "추가" 단독 대신 추가·정렬 모드 토글·전체 관리(수정·삭제·정렬)를 한 곳에서.
// 각 항목의 개별 수정은 행 위 EditPencil, 정렬은 DragHandle(정렬 모드 on일 때)로 처리한다.
//
// props:
//   type      : 권한 판정 콘텐츠 타입
//   addTo     : "추가" 내부 경로(Link). onAdd와 택일
//   onAdd     : "추가" 클릭 핸들러
//   manageTo  : "전체 관리" 어드민 목록 경로(수정·삭제·정렬 풀 CRUD 진입)
//   sortable  : true면 "정렬" 토글 노출
//   sorting   : 현재 정렬 모드 상태(부모 소유)
//   onToggleSort : 정렬 모드 토글
//   children  : 우측 추가 컨트롤 슬롯
import { Link } from 'react-router-dom'
import { ArrowUpDown, Plus, SlidersHorizontal } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const PILL =
  'inline-flex cursor-pointer items-center gap-8 rounded-sm border border-glass-line bg-glass-bg px-12 py-4 font-mono text-caption-m text-text-sec backdrop-blur-glass-mobile transition duration-fast ease-out hover:bg-glass-strong hover:text-text-pri focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

function InlineEditBar({
  type,
  addTo,
  onAdd,
  addLabel = '추가',
  manageTo,
  sortable = false,
  sorting = false,
  onToggleSort,
  className = '',
  children,
}) {
  const { canEdit } = useAuth()
  if (!canEdit(type)) return null

  return (
    <div
      className={`flex flex-wrap items-center gap-8 rounded-sm border border-glass-line bg-glass-bg px-12 py-8 backdrop-blur-glass-mobile ${className}`.trim()}
    >
      <span className="mr-4 font-mono text-caption-m uppercase tracking-label text-text-meta">
        편집
      </span>
      {addTo ? (
        <Link to={addTo} className={PILL}>
          <Plus size={16} aria-hidden="true" />
          <span>{addLabel}</span>
        </Link>
      ) : onAdd ? (
        <button type="button" onClick={onAdd} className={PILL}>
          <Plus size={16} aria-hidden="true" />
          <span>{addLabel}</span>
        </button>
      ) : null}
      {sortable && (
        <button
          type="button"
          onClick={onToggleSort}
          aria-pressed={sorting}
          className={`${PILL} ${sorting ? 'border-border-strong bg-glass-strong text-text-pri' : ''}`}
        >
          <ArrowUpDown size={16} aria-hidden="true" />
          <span>{sorting ? '정렬 완료' : '정렬'}</span>
        </button>
      )}
      {manageTo && (
        <Link to={manageTo} className={PILL}>
          <SlidersHorizontal size={16} aria-hidden="true" />
          <span>전체 관리</span>
        </Link>
      )}
      {children}
    </div>
  )
}

export default InlineEditBar
