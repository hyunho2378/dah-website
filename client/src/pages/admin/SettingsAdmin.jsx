// SettingsAdmin.jsx — 사이트 설정 (13_CMS_SPEC 1절 site_settings, owner·admin)
// 히어로 버튼 텍스트·링크 2쌍(settings.hero.ctas — HeroSection 계약) +
// 접수 버튼 강제 노출 on/off(header_visible)·위치(button_mode: header|floating).

import { useEffect, useState } from 'react'
import { useApi, api } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'
import {
  ErrorText,
  Field,
  Input,
  PageHead,
  PrimaryButton,
  Select,
  Toggle,
} from '../../components/admin/FormControls'

const PANEL =
  'flex flex-col gap-16 rounded-glass border border-glass-line bg-glass-bg p-24 backdrop-blur-glass-mobile'

const EMPTY_CTA = { label: '', href: '' }

function SettingsAdmin() {
  useTitle('사이트 설정')
  const { data, loading, error, refetch } = useApi('/settings/public')

  const [ctas, setCtas] = useState([{ ...EMPTY_CTA }, { ...EMPTY_CTA }])
  const [headerVisible, setHeaderVisible] = useState(true)
  const [buttonMode, setButtonMode] = useState('header')
  const [hydrated, setHydrated] = useState(false)
  const [busy, setBusy] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (hydrated || !data) return
    const remote = data.settings?.hero?.ctas
    if (Array.isArray(remote) && remote.length > 0) {
      setCtas([
        { ...EMPTY_CTA, ...(remote[0] || {}), href: remote[0]?.href || remote[0]?.to || '' },
        { ...EMPTY_CTA, ...(remote[1] || {}), href: remote[1]?.href || remote[1]?.to || '' },
      ])
    }
    if (data.exhibition) {
      setHeaderVisible(data.exhibition.header_visible !== false)
      setButtonMode(data.exhibition.button_mode || 'header')
    }
    setHydrated(true)
  }, [hydrated, data])

  const setCta = (i, key, v) => {
    setSaved(false)
    setCtas((prev) => prev.map((cta, idx) => (idx === i ? { ...cta, [key]: v } : cta)))
  }

  const save = async (e) => {
    e.preventDefault()
    setBusy(true)
    setSaveError(null)
    try {
      // hero의 다른 키(eyebrow 등)는 보존하고 ctas만 교체
      const heroBase = data?.settings?.hero || {}
      const nextCtas = ctas
        .filter((cta) => cta.label.trim() !== '' && cta.href.trim() !== '')
        .map((cta) => ({
          label: cta.label.trim(),
          href: cta.href.trim(),
          external: /^https?:\/\//.test(cta.href.trim()),
        }))
      await api.put('/admin/settings', {
        settings: { hero: { ...heroBase, ctas: nextCtas } },
        exhibition: { header_visible: headerVisible, button_mode: buttonMode },
      })
      setSaved(true)
      refetch()
    } catch (err) {
      setSaveError(err.hint ? `${err.message} (${err.hint})` : err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="flex flex-col gap-32">
      <PageHead title="사이트 설정" desc="히어로 버튼과 접수 버튼 노출을 관리합니다." />

      {error && <ErrorText>{error.message}</ErrorText>}
      {loading && <p className="font-mono text-caption-m text-text-meta">불러오는 중</p>}

      <form onSubmit={save} className="flex flex-col gap-32">
        {/* 히어로 버튼 2쌍 (13_CMS 1절) */}
        <div className={PANEL}>
          <h3 className="text-h3-m font-bold text-text-pri md:text-h3-d">히어로 버튼</h3>
          <p className="text-small-m text-text-sec">
            비워 두면 홈은 기본 버튼(전공 소개·전시회)을 렌더합니다. 내부 경로(/about)와 외부
            URL(https://) 모두 가능합니다.
          </p>
          {ctas.map((cta, i) => (
            <div key={i} className="grid grid-cols-1 gap-16 md:grid-cols-2">
              <Field label={`버튼 ${i + 1} 텍스트`}>
                <Input value={cta.label} onChange={(e) => setCta(i, 'label', e.target.value)} />
              </Field>
              <Field label={`버튼 ${i + 1} 링크`}>
                <Input value={cta.href} onChange={(e) => setCta(i, 'href', e.target.value)} />
              </Field>
            </div>
          ))}
        </div>

        {/* 접수 버튼 노출 (13_CMS 1절: on/off + 위치) */}
        <div className={PANEL}>
          <h3 className="text-h3-m font-bold text-text-pri md:text-h3-d">접수 버튼 노출</h3>
          <p className="text-small-m text-text-sec">
            스위치를 켜면 접수 기간과 무관하게 버튼을 노출합니다. 기간 검증은 제출 시점에
            서버가 적용합니다.
          </p>
          <div className="flex flex-wrap items-start gap-24">
            <Field label="노출 허용">
              <Toggle
                checked={headerVisible}
                onChange={(v) => {
                  setSaved(false)
                  setHeaderVisible(v)
                }}
                label="접수 버튼 노출 허용"
              />
            </Field>
            <Field label="위치">
              <Select
                value={buttonMode}
                onChange={(e) => {
                  setSaved(false)
                  setButtonMode(e.target.value)
                }}
                options={[
                  { value: 'header', label: '헤더' },
                  { value: 'floating', label: '플로팅' },
                ]}
              />
            </Field>
          </div>
        </div>

        <ErrorText>{saveError}</ErrorText>
        {saved && <p className="font-mono text-caption-m text-text-meta">저장 완료</p>}
        <div>
          <PrimaryButton type="submit" disabled={busy || !hydrated}>
            {busy ? '저장 중' : '저장'}
          </PrimaryButton>
        </div>
      </form>
    </section>
  )
}

export default SettingsAdmin
