// UsersAdmin.jsx — 사용자 관리 (13_CMS_SPEC 6절, owner 전용)
// 이메일·롤 사전 등록(must_set_pw=TRUE → 첫 로그인 시 비밀번호 설정) + 리셋 플래그 + 롤 변경.
// API: /admin/users (server/src/routes/adminExtra.js — 8절 계약 외 확장)

import { useState } from 'react'
import { KeyRound, Plus, Trash2 } from 'lucide-react'
import { useApi, api } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import { useAuth } from '../../context/AuthContext'
import {
  EmptyNote,
  ErrorText,
  Field,
  Input,
  PageHead,
  PrimaryButton,
  Select,
} from '../../components/admin/FormControls'

const ICON_BTN =
  'flex h-32 w-32 shrink-0 cursor-pointer items-center justify-center rounded-sm text-text-sec transition duration-fast ease-out hover:bg-glass-strong hover:text-text-pri focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus disabled:cursor-default disabled:opacity-40'

const ROLE_OPTIONS = [
  { value: 'manager', label: 'manager (지정 유형 작성·수정)' },
  { value: 'admin', label: 'admin (콘텐츠 전 유형)' },
  { value: 'owner', label: 'owner (전체 관리)' },
]

function UsersAdmin() {
  useTitle('사용자 관리')
  const { user: me } = useAuth()
  const { data, loading, error, refetch } = useApi('/admin/users')

  const [form, setForm] = useState({ email: '', name: '', role: 'manager' })
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState(null)
  const [listError, setListError] = useState(null)

  const items = data?.items || []

  const create = async (e) => {
    e.preventDefault()
    setBusy(true)
    setFormError(null)
    try {
      await api.post('/admin/users', form)
      setForm({ email: '', name: '', role: 'manager' })
      refetch()
    } catch (err) {
      setFormError(err.hint ? `${err.message} (${err.hint})` : err.message)
    } finally {
      setBusy(false)
    }
  }

  const changeRole = async (item, role) => {
    setListError(null)
    try {
      await api.put(`/admin/users/${item.id}`, { role })
      refetch()
    } catch (err) {
      setListError(err.message)
    }
  }

  // 리셋 플래그 — 대상자가 다음 로그인에서 비밀번호를 다시 설정 (12_BACKEND 3절)
  const reset = async (item) => {
    if (!window.confirm(`${item.email} 계정의 비밀번호를 리셋하시겠습니까?`)) return
    setListError(null)
    try {
      await api.put(`/admin/users/${item.id}`, { reset: true })
      refetch()
    } catch (err) {
      setListError(err.message)
    }
  }

  const remove = async (item) => {
    if (!window.confirm(`${item.email} 계정을 삭제하시겠습니까? 되돌릴 수 없습니다.`)) return
    setListError(null)
    try {
      await api.del(`/admin/users/${item.id}`)
      refetch()
    } catch (err) {
      setListError(err.message)
    }
  }

  return (
    <section className="flex flex-col gap-24">
      <PageHead
        title="사용자"
        desc="이메일·롤을 등록하면 대상자는 첫 로그인에서 비밀번호를 설정합니다."
      />

      {/* 등록 폼 */}
      <form
        onSubmit={create}
        className="flex flex-col gap-16 rounded-glass border border-glass-line bg-glass-bg p-24 backdrop-blur-glass-mobile"
      >
        <h3 className="text-h3-m font-bold text-text-pri md:text-h3-d">계정 등록</h3>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          <Field label="이메일">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </Field>
          <Field label="이름">
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </Field>
          <Field label="롤">
            <Select
              value={form.role}
              onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              options={ROLE_OPTIONS}
            />
          </Field>
        </div>
        <ErrorText>{formError}</ErrorText>
        <div>
          <PrimaryButton type="submit" disabled={busy}>
            <Plus size={16} aria-hidden="true" />
            {busy ? '등록 중' : '등록'}
          </PrimaryButton>
        </div>
      </form>

      {/* 목록 */}
      {error && <ErrorText>{error.message}</ErrorText>}
      <ErrorText>{listError}</ErrorText>
      {loading && <p className="font-mono text-caption-m text-text-meta">불러오는 중</p>}
      {!loading && !items.length && <EmptyNote>등록된 계정이 없습니다</EmptyNote>}

      {items.length > 0 && (
        <ul className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const isMe = me?.id === item.id
            return (
              <li
                key={item.id}
                className="flex min-w-0 flex-col gap-12 rounded-md border border-border-subtle bg-bg-elev p-16"
              >
                <span className="min-w-0">
                  <span className="block truncate text-body-m text-text-pri md:text-body-d">
                    {item.name}
                    {isMe && (
                      <span className="ml-8 font-mono text-caption-m text-text-meta">본인</span>
                    )}
                  </span>
                  <span className="block truncate font-mono text-caption-m text-text-meta">
                    {item.email}
                  </span>
                </span>
                {item.must_set_pw && (
                  <span className="inline-flex w-fit items-center rounded-sm border border-glass-line bg-glass-bg px-12 py-4 font-mono text-caption-m text-text-meta">
                    비밀번호 미설정
                  </span>
                )}
                <div className="mt-auto flex items-center gap-8">
                  <Select
                    value={item.role}
                    onChange={(e) => changeRole(item, e.target.value)}
                    disabled={isMe}
                    aria-label={`${item.email} 롤`}
                    options={ROLE_OPTIONS.map((o) => ({ value: o.value, label: o.value }))}
                    className="min-w-0 flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => reset(item)}
                    disabled={isMe}
                    aria-label={`${item.email} 비밀번호 리셋`}
                    title="비밀번호 리셋"
                    className={ICON_BTN}
                  >
                    <KeyRound size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    disabled={isMe}
                    aria-label={`${item.email} 삭제`}
                    title="계정 삭제"
                    className={ICON_BTN}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default UsersAdmin
