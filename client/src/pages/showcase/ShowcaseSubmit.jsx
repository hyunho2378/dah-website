// /showcase/submit — 쇼케이스 제출 (비로그인 공개, 12_BACKEND 6절)
// 제목·주제·팀/개인 이름·설명·활용 툴(태그)·링크·메인 1+서브 2 이미지·수정용 비밀번호.
// 이미지는 canvas 중앙 크롭으로 16:9 미리보기만 생성 — 실제 리사이즈는 서버(1920x1080).
// 제출 후 status pending — 승인 대기 안내. 비밀번호는 클라이언트에 저장하지 않는다.
import { useState } from 'react'
import { ImagePlus, Plus, X } from 'lucide-react'
import PageBanner from '../../components/common/PageBanner'
import GlassCard from '../../components/common/GlassCard'
import Button from '../../components/common/Button'
import { api } from '../../hooks/useApi'
import { useTitle } from '../../hooks/useTitle'

const inputCls =
  'w-full min-w-0 rounded-md border border-border-subtle bg-bg-panel px-16 py-12 text-body-m text-text-pri placeholder:text-text-meta transition-colors duration-fast ease-out focus:border-border-strong focus:outline-none md:text-body-d'
const labelCls = 'text-small-m font-semibold text-text-pri md:text-small-d'

// 16:9 중앙 크롭 미리보기 생성 (미리보기 전용 — 서버가 실제 리사이즈)
function cropPreview(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 800
      canvas.height = 450
      const ctx = canvas.getContext('2d')
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
      const w = img.width * scale
      const h = img.height * scale
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('이미지를 불러오지 못했습니다'))
    }
    img.src = url
  })
}

async function uploadImage(file) {
  const fd = new FormData()
  fd.append('file', file)
  const res = await api.post('/upload', fd)
  return res?.url ?? res?.data?.url
}

function Field({ label, required = false, hint, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-8">
      <span className="flex items-baseline gap-8">
        <span className={labelCls}>{label}</span>
        {required && (
          <span className="font-mono text-caption-m text-text-meta">(필수)</span>
        )}
      </span>
      {children}
      {hint && <p className="text-caption-m text-text-meta">{hint}</p>}
    </div>
  )
}

function PickButton({ children, onFiles, multiple = false }) {
  return (
    <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-8 rounded-sm border border-border-subtle px-24 text-body-m font-semibold text-text-pri transition-colors duration-fast ease-out hover:border-border-strong md:h-48 md:text-body-d">
      <ImagePlus size={16} aria-hidden="true" />
      {children}
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          onFiles([...event.target.files])
          event.target.value = ''
        }}
      />
    </label>
  )
}

function CropThumb({ image, label, onRemove }) {
  return (
    <figure className="relative min-w-0">
      <img
        src={image.preview}
        alt={`${label} 16:9 크롭 미리보기`}
        className="aspect-video w-full rounded-md border border-border-subtle object-cover"
      />
      <button
        type="button"
        aria-label={`${label} 제거`}
        onClick={onRemove}
        className="absolute right-8 top-8 flex cursor-pointer items-center justify-center rounded-sm border border-glass-line bg-glass-strong p-4 text-text-pri transition-colors duration-fast ease-out hover:border-border-strong"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </figure>
  )
}

function ShowcaseSubmit() {
  useTitle('쇼케이스 제출')
  const [form, setForm] = useState({
    title: '',
    topic: '',
    creator: '',
    description: '',
    link: '',
    password: '',
    passwordConfirm: '',
  })
  const [tools, setTools] = useState([])
  const [toolInput, setToolInput] = useState('')
  const [main, setMain] = useState(null) // { file, preview }
  const [subs, setSubs] = useState([]) // 최대 2
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)

  const set = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const addTool = () => {
    const value = toolInput.trim()
    if (value && !tools.includes(value)) setTools((prev) => [...prev, value])
    setToolInput('')
  }

  const handleMain = async ([file]) => {
    if (!file) return
    try {
      setMain({ file, preview: await cropPreview(file) })
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubs = async (files) => {
    try {
      const next = []
      for (const file of files) {
        next.push({ file, preview: await cropPreview(file) })
      }
      setSubs((prev) => [...prev, ...next].slice(0, 2))
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!main) {
      setError('메인 이미지 1장이 필요합니다')
      return
    }
    if (subs.length < 2) {
      setError('서브 이미지 2장이 필요합니다')
      return
    }
    if (form.password.length < 4) {
      setError('수정용 비밀번호는 4자 이상이어야 합니다')
      return
    }
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const mainUrl = await uploadImage(main.file)
      const subUrls = []
      for (const sub of subs) {
        subUrls.push(await uploadImage(sub.file))
      }
      await api.post('/submit/showcase', {
        title: form.title.trim(),
        topic: form.topic.trim(),
        creator: form.creator.trim(),
        description: form.description.trim(),
        tools,
        link: form.link.trim() || null,
        main_img: mainUrl,
        sub_imgs: subUrls,
        password: form.password,
      })
      setDone(true)
    } catch {
      setError('제출에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageBanner
        titleKo="쇼케이스 제출"
        titleEn="SHOWCASE SUBMIT"
        breadcrumb={[
          { label: '홈', to: '/' },
          { label: '쇼케이스', to: '/showcase' },
          { label: '제출', to: '/showcase/submit' },
        ]}
        nebulaX="30%"
        nebulaY="48%"
      />
      <section className="mx-auto max-w-container px-gutter-m py-section-m md:px-gutter-t lg:px-gutter-d lg:py-section-d 3xl:max-w-container-wide">
        {done ? (
          <GlassCard className="flex flex-col items-start gap-24">
            <h2 className="text-h2-m font-bold leading-snug text-text-pri md:text-h2-d">
              제출 완료
            </h2>
            <p className="text-body-l-m leading-relaxed text-text-sec md:text-body-l-d">
              승인 대기 상태로 접수되었습니다. 담당자 승인 후 쇼케이스에 게시됩니다.
              수정은 제출 시 등록한 비밀번호로 가능합니다.
            </p>
            <Button variant="secondary" href="/showcase">
              쇼케이스로 이동
            </Button>
          </GlassCard>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex min-w-0 max-w-container flex-col gap-32"
          >
            <Field label="제목" required>
              <input
                type="text"
                required
                value={form.title}
                onChange={set('title')}
                className={inputCls}
                placeholder="프로젝트 제목"
              />
            </Field>
            <Field label="주제" required>
              <input
                type="text"
                required
                value={form.topic}
                onChange={set('topic')}
                className={inputCls}
                placeholder="프로젝트 주제"
              />
            </Field>
            <Field label="팀·개인 이름" required>
              <input
                type="text"
                required
                value={form.creator}
                onChange={set('creator')}
                className={inputCls}
                placeholder="팀명 또는 개인 이름"
              />
            </Field>
            <Field label="설명" required>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={set('description')}
                className={inputCls}
                placeholder="프로젝트 설명"
              />
            </Field>
            <Field
              label="활용 툴"
              hint="입력 후 Enter 또는 추가 버튼으로 태그를 등록합니다"
            >
              <div className="flex min-w-0 items-center gap-8">
                <input
                  type="text"
                  value={toolInput}
                  onChange={(event) => setToolInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ',') {
                      event.preventDefault()
                      addTool()
                    }
                  }}
                  className={inputCls}
                  placeholder="Figma, React 등"
                />
                <button
                  type="button"
                  onClick={addTool}
                  aria-label="툴 추가"
                  className="flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-border-subtle p-12 text-text-sec transition-colors duration-fast ease-out hover:border-border-strong hover:text-text-pri"
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
              {tools.length > 0 && (
                <ul className="flex flex-wrap gap-8">
                  {tools.map((tool) => (
                    <li
                      key={tool}
                      className="inline-flex items-center gap-4 rounded-sm border border-border-subtle px-12 py-4 font-mono text-caption-m text-text-sec"
                    >
                      {tool}
                      <button
                        type="button"
                        aria-label={`${tool} 제거`}
                        onClick={() =>
                          setTools((prev) => prev.filter((t) => t !== tool))
                        }
                        className="cursor-pointer text-text-meta transition-colors duration-fast ease-out hover:text-text-pri"
                      >
                        <X size={16} aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Field>
            <Field label="링크" hint="배포 URL, 프로토타입, 저장소 등">
              <input
                type="url"
                value={form.link}
                onChange={set('link')}
                className={inputCls}
                placeholder="https://"
              />
            </Field>
            <Field
              label="메인 이미지"
              required
              hint="미리보기는 중앙 기준 16:9 크롭입니다. 실제 저장 시 서버에서 1920x1080으로 리사이즈됩니다."
            >
              {main ? (
                <CropThumb
                  image={main}
                  label="메인 이미지"
                  onRemove={() => setMain(null)}
                />
              ) : (
                <div>
                  <PickButton onFiles={handleMain}>이미지 선택</PickButton>
                </div>
              )}
            </Field>
            <Field label="서브 이미지 (2장)" required>
              <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
                {subs.map((sub, idx) => (
                  <CropThumb
                    key={sub.preview}
                    image={sub}
                    label={`서브 이미지 ${idx + 1}`}
                    onRemove={() =>
                      setSubs((prev) => prev.filter((_, i) => i !== idx))
                    }
                  />
                ))}
              </div>
              {subs.length < 2 && (
                <div>
                  <PickButton onFiles={handleSubs} multiple>
                    이미지 선택
                  </PickButton>
                </div>
              )}
            </Field>
            <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
              <Field
                label="수정용 비밀번호"
                required
                hint="제출 후 내용 수정에 사용됩니다. 4자 이상."
              >
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={set('password')}
                  className={inputCls}
                />
              </Field>
              <Field label="비밀번호 확인" required>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.passwordConfirm}
                  onChange={set('passwordConfirm')}
                  className={inputCls}
                />
              </Field>
            </div>
            {error && (
              <p role="alert" className="text-small-m text-state-error md:text-small-d">
                {error}
              </p>
            )}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-sm bg-bg-invert px-24 text-body-m font-semibold text-text-invert transition-opacity duration-fast ease-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:h-48 md:text-body-d"
              >
                {submitting ? '제출 중' : '제출'}
              </button>
            </div>
          </form>
        )}
      </section>
    </>
  )
}

export default ShowcaseSubmit
