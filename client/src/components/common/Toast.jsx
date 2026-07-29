import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Toast.jsx — G2(37_SHEET_ROADMAP) 논-시프트 알림.
//
// 왜: 시트에서 "셀을 복사했습니다"를 문서 흐름 안에 렌더하면 표가 밀려 레이아웃 시프트가 난다.
// 이 컴포넌트는 body 포털 + position:fixed로만 뜨므로 문서 흐름에 공간을 전혀 차지하지 않는다
// (표가 1px도 움직이지 않는다).
//
// z 위계: Select·DatePicker 패널 z-[110], 모달 z-[100], 헤더 z-50 위 — 토스트가 최상단 z-[120].
// 접근성: role="status" + aria-live="polite" (읽던 위치를 뺏지 않는다).
// 모션: opacity·translate 전환만. reduced-motion은 index.css 전역 미디어쿼리가 무효화한다.

const ToastContext = createContext(null)

const DURATION_MS = 1800

/** useToast() → showToast(message). Provider 밖에서 호출해도 조용히 무시(크래시 금지). */
export function useToast() {
  return useContext(ToastContext) || (() => {})
}

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const timersRef = useRef(new Map())
  const seqRef = useRef(0)

  const remove = useCallback((id) => {
    setItems((list) => list.filter((t) => t.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const showToast = useCallback(
    (message) => {
      if (!message) return
      seqRef.current += 1
      const id = seqRef.current
      setItems((list) => [...list.slice(-2), { id, message }])
      timersRef.current.set(
        id,
        setTimeout(() => remove(id), DURATION_MS)
      )
    },
    [remove]
  )

  // 언마운트 시 남은 타이머 정리
  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((t) => clearTimeout(t))
      timers.clear()
    }
  }, [])

  const value = useMemo(() => showToast, [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed bottom-24 right-24 z-[120] flex flex-col items-end gap-8"
          >
            {items.map((t) => (
              <div
                key={t.id}
                className="pointer-events-auto rounded-sm border border-glass-line bg-cosmos-depth1/[0.98] px-16 py-12 text-small-m text-text-pri shadow-glass backdrop-blur-glass-mobile md:text-small-d"
              >
                {t.message}
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  )
}

export default ToastProvider
