// LoginModalContext.jsx — 전역 로그인 모달 오픈 제어 (F9, 16_PHASE4)
// Header·GlassDock의 "로그인" 버튼과 RequireRole 가드가 openLogin()으로 모달을 연다.
// storage 미사용 — 열림 상태는 메모리만.

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Provider 밖에서 호출돼도 안전한 기본값 (모달 없이 무동작)
const FALLBACK = { isOpen: false, openLogin: () => {}, closeLogin: () => {} }

const LoginModalContext = createContext(null)

export function LoginModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const openLogin = useCallback(() => setIsOpen(true), [])
  const closeLogin = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({ isOpen, openLogin, closeLogin }),
    [isOpen, openLogin, closeLogin]
  )

  return (
    <LoginModalContext.Provider value={value}>{children}</LoginModalContext.Provider>
  )
}

/** useLoginModal — { isOpen, openLogin, closeLogin } */
export function useLoginModal() {
  return useContext(LoginModalContext) || FALLBACK
}
