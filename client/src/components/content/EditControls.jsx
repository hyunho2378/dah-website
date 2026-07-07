// EditControls.jsx — 인라인 편집 컨트롤 (13_CMS_SPEC 1절 편집 UI 원칙)
// 비로그인·권한 미충족 시 null 반환 — 숨김이 아니라 미렌더. 픽셀 하나도 출력 금지.
// B4·B5가 콘텐츠 위에 얹는 계약 컴포넌트: <EditPencil type to|onClick />, <AddButton type to />

import { Link } from 'react-router-dom'
import { Pencil, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const PILL =
  'inline-flex cursor-pointer items-center gap-8 rounded-sm border border-glass-line bg-glass-bg px-12 py-4 font-mono text-caption-m text-text-sec backdrop-blur-glass-mobile transition duration-fast ease-out hover:bg-glass-strong hover:text-text-pri focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus'

/**
 * EditPencil — 콘텐츠 위 연필 아이콘(글래스 필). canEdit(type) false면 미렌더.
 * @param {{ type: string, to?: string, onClick?: Function, label?: string }} props
 */
export function EditPencil({ type, to, onClick, label = '수정' }) {
  const { canEdit } = useAuth()
  if (!canEdit(type)) return null

  if (to) {
    return (
      <Link to={to} className={PILL} aria-label={label}>
        <Pencil size={16} aria-hidden="true" />
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={PILL} aria-label={label}>
      <Pencil size={16} aria-hidden="true" />
    </button>
  )
}

/**
 * AddButton — 목록 상단 "+ 추가" 버튼(글래스 필). canEdit(type) false면 미렌더.
 * @param {{ type: string, to?: string, onClick?: Function, label?: string }} props
 */
export function AddButton({ type, to, onClick, label = '추가' }) {
  const { canEdit } = useAuth()
  if (!canEdit(type)) return null

  if (to) {
    return (
      <Link to={to} className={PILL}>
        <Plus size={16} aria-hidden="true" />
        <span>{label}</span>
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={PILL}>
      <Plus size={16} aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
