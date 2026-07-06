// Login.jsx — 로그인 + 최초 온보딩 비밀번호 설정 플로우 (12_BACKEND 3절, 13_CMS_SPEC)
// owner가 이메일·롤 사전 등록 → 대상자 첫 로그인 시 must_set_pw → 비밀번호 설정 후 자동 로그인.

import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTitle } from '../hooks/useTitle'
import {
  ErrorText,
  Field,
  Input,
  PrimaryButton,
} from '../components/admin/FormControls'

function Login() {
  useTitle('로그인')
  const { user, loading, login, setupPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/admin'

  const [mode, setMode] = useState('login') // 'login' | 'setup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (!loading && user) return <Navigate to={from} replace />

  const handleLogin = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const data = await login(email, password)
      if (data?.must_set_pw) {
        setMode('setup')
      } else {
        navigate(from, { replace: true })
      }
    } catch (err) {
      setError(err.hint ? `${err.message} — ${err.hint}` : err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleSetup = async (e) => {
    e.preventDefault()
    setError(null)
    if (newPassword.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setBusy(true)
    try {
      await setupPassword(email, newPassword)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.hint ? `${err.message} — ${err.hint}` : err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto flex min-h-[80svh] w-full max-w-container items-center justify-center px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d">
      <div className="w-full max-w-sm rounded-glass border border-glass-line bg-glass-bg p-32 backdrop-blur-glass">
        <p className="font-mono text-label-m uppercase tracking-label text-text-meta">
          DAH ADMIN
        </p>
        <h1 className="mt-8 text-h2-m font-bold text-text-pri md:text-h2-d">
          {mode === 'login' ? '로그인' : '비밀번호 설정'}
        </h1>
        <p className="mt-8 text-small-m text-text-sec md:text-small-d">
          {mode === 'login'
            ? '등록된 계정으로 로그인합니다.'
            : '최초 로그인 계정은 비밀번호 설정이 필요합니다.'}
        </p>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="mt-24 flex flex-col gap-16">
            <Field label="이메일">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </Field>
            <Field label="비밀번호">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Field>
            <ErrorText>{error}</ErrorText>
            <PrimaryButton type="submit" disabled={busy} className="w-full">
              {busy ? '확인 중' : '로그인'}
            </PrimaryButton>
          </form>
        ) : (
          <form onSubmit={handleSetup} className="mt-24 flex flex-col gap-16">
            <Field label="이메일">
              <Input type="email" value={email} disabled readOnly />
            </Field>
            <Field label="새 비밀번호" hint="8자 이상">
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </Field>
            <Field label="비밀번호 확인">
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </Field>
            <ErrorText>{error}</ErrorText>
            <PrimaryButton type="submit" disabled={busy} className="w-full">
              {busy ? '설정 중' : '설정 후 로그인'}
            </PrimaryButton>
          </form>
        )}
      </div>
    </section>
  )
}

export default Login
