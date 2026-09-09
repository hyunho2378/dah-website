import { useEffect, useState } from 'react'
import { api, useApi } from '../../hooks/useApi'
import { ABOUT_COPY } from '../About'
import { history as defaultHistory } from '../../data/history'
import { ErrorText, Field, PageHead, PrimaryButton, TextArea } from '../../components/admin/FormControls'

const clone = (value) => JSON.parse(JSON.stringify(value))
const PANEL = 'flex flex-col gap-16 rounded-glass border border-glass-line bg-glass-bg p-24 backdrop-blur-glass-mobile'

function visionText(items) {
  return (items || []).map((item) => `${item.title || ''} | ${item.desc || ''}`).join('\n')
}

function parseVision(value) {
  return String(value || '').split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
    const [title, ...rest] = line.split('|')
    return { title: title.trim(), desc: rest.join('|').trim() }
  })
}

function historyText(items) {
  return (items || []).map((item) => `${item.date || ''} | ${item.text || ''} | ${item.textEn || ''}`).join('\n')
}

function parseHistory(value) {
  return String(value || '').split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
    const [date, text, ...english] = line.split('|')
    return { date: date.trim(), text: text?.trim() || '', textEn: english.join('|').trim() || '' }
  }).filter((item) => item.date && item.text)
}

function AboutAdmin() {
  const result = useApi('/settings/public')
  const [content, setContent] = useState(() => clone(ABOUT_COPY))
  const [history, setHistory] = useState('')
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (ready || !result.data) return
    const remote = result.data.settings?.aboutContent
    setContent({
      ko: { ...clone(ABOUT_COPY.ko), ...(remote?.ko || {}), vision: Array.isArray(remote?.ko?.vision) ? remote.ko.vision : clone(ABOUT_COPY.ko.vision) },
      en: { ...clone(ABOUT_COPY.en), ...(remote?.en || {}), vision: Array.isArray(remote?.en?.vision) ? remote.en.vision : clone(ABOUT_COPY.en.vision) },
    })
    setHistory(historyText(result.data.settings?.aboutHistory || defaultHistory))
    setReady(true)
  }, [ready, result.data])

  const setField = (lang, key, value) => {
    setSaved(false)
    setContent((prev) => ({ ...prev, [lang]: { ...prev[lang], [key]: value } }))
  }
  const save = async (event) => {
    event.preventDefault()
    setBusy(true); setError(null)
    try {
      await api.put('/admin/settings', {
        settings: {
          aboutContent: content,
          aboutHistory: parseHistory(history),
        },
      })
      setSaved(true)
      result.refetch()
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return (
    <section className="flex flex-col gap-32">
      <PageHead title="전공 소개·연혁" desc="공개 About 페이지의 모든 본문과 연혁을 여기서 직접 수정합니다." />
      {result.error && <ErrorText>{result.error.message}</ErrorText>}
      {!ready ? <p className="font-mono text-caption-m text-text-meta">불러오는 중</p> : <form onSubmit={save} className="flex flex-col gap-24">
        {['ko', 'en'].map((lang) => <div key={lang} className={PANEL}>
          <h3 className="text-h3-m font-bold text-text-pri md:text-h3-d">{lang === 'ko' ? '국문 본문' : '영문 본문'}</h3>
          <Field label="What is DAH"><TextArea rows={5} value={content[lang].what} onChange={(e) => setField(lang, 'what', e.target.value)} /></Field>
          <Field label="Why DAH — 첫 문장"><TextArea rows={3} value={content[lang].whyStatement} onChange={(e) => setField(lang, 'whyStatement', e.target.value)} /></Field>
          <Field label="Why DAH — 본문"><TextArea rows={5} value={content[lang].whyLead} onChange={(e) => setField(lang, 'whyLead', e.target.value)} /></Field>
          <Field label="Mission"><TextArea rows={3} value={content[lang].missionKr} onChange={(e) => setField(lang, 'missionKr', e.target.value)} /></Field>
          <Field label="Vision 3개" hint="한 줄에 ‘제목 | 설명’ 형식으로 입력합니다."><TextArea rows={7} value={visionText(content[lang].vision)} onChange={(e) => setField(lang, 'vision', parseVision(e.target.value))} /></Field>
        </div>)}
        <div className={PANEL}>
          <h3 className="text-h3-m font-bold text-text-pri md:text-h3-d">연혁</h3>
          <Field label="연혁 전체" hint="한 줄에 ‘날짜 | 국문 내용 | 영문 내용’ 형식으로 입력합니다. 최신 항목은 화면에서 자동으로 위에 표시됩니다."><TextArea rows={14} value={history} onChange={(e) => { setSaved(false); setHistory(e.target.value) }} /></Field>
        </div>
        <ErrorText>{error}</ErrorText>{saved && <p className="font-mono text-caption-m text-text-meta">저장 완료</p>}
        <div><PrimaryButton type="submit" disabled={busy}>{busy ? '저장 중' : '저장'}</PrimaryButton></div>
      </form>}
    </section>
  )
}

export default AboutAdmin
