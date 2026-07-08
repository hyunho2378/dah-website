// DragHandle.jsx — 노션식 6점 드래그 정렬 (C3, 22_PHASE10)
// HTML5 드래그 앤 드롭 자체 구현(외부 라이브러리 금지). 어드민·공개 인라인 편집 공용.
//
// 사용 계약:
//   const { dragIndex, overIndex, rowProps } = useDragSort(onReorder)
//   onReorder(fromIndex, toIndex) — 드롭 시 호출. 부모가 배열 재정렬 후 sort 저장.
//   <li {...rowProps(i)}> <DragHandle /> ... </li>  // 행 전체가 draggable, 핸들은 시각 어포던스
import { useState } from 'react'
import { GripVertical } from 'lucide-react'

export function useDragSort(onReorder) {
  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  const rowProps = (index) => ({
    draggable: true,
    onDragStart: (e) => {
      setDragIndex(index)
      e.dataTransfer.effectAllowed = 'move'
    },
    onDragOver: (e) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      if (index !== overIndex) setOverIndex(index)
    },
    onDrop: (e) => {
      e.preventDefault()
      if (dragIndex !== null && dragIndex !== index) onReorder(dragIndex, index)
      setDragIndex(null)
      setOverIndex(null)
    },
    onDragEnd: () => {
      setDragIndex(null)
      setOverIndex(null)
    },
  })

  return { dragIndex, overIndex, rowProps }
}

export function DragHandle({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-24 w-24 shrink-0 cursor-grab items-center justify-center text-text-meta transition-colors duration-fast ease-out hover:text-text-pri active:cursor-grabbing ${className}`.trim()}
    >
      <GripVertical size={16} />
    </span>
  )
}

export default DragHandle
