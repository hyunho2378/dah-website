// 전시회 접수 폼 공용 컴포넌트 (12_BACKEND 5절) — ExhibitSubmit·ExhibitEdit 전용
// 상수·헬퍼는 exhibitFormShared.js(비 JSX 모듈) — 이 파일은 컴포넌트만 export.
import { ImagePlus, Lock, X } from 'lucide-react'
import { MAX_IMAGES, formatKst, inputCls, labelCls } from './exhibitFormShared'

/** 라벨+힌트 래퍼. 입력 1개면 기본 label, 그룹(이미지·팀원 등)은 as="div". */
export function Field({ as: Tag = 'label', label, required = false, hint, children }) {
  return (
    <Tag className="flex min-w-0 flex-col gap-8">
      <span className="flex items-baseline gap-8">
        <span className={labelCls}>{label}</span>
        {required && (
          <span className="font-mono text-caption-m text-text-meta">(필수)</span>
        )}
      </span>
      {children}
      {hint && <p className="text-caption-m text-text-meta">{hint}</p>}
    </Tag>
  )
}

/** readonly 항목 — 자물쇠 아이콘 + 비활성 톤. 서버도 해당 값 변경을 무시한다. */
export function LockedField({ label, value }) {
  return (
    <div className="flex min-w-0 flex-col gap-8">
      <span className="flex items-baseline gap-8">
        <span className={labelCls}>{label}</span>
        <span className="font-mono text-caption-m text-text-meta">(수정 불가)</span>
      </span>
      <div className="relative min-w-0">
        <input
          type="text"
          readOnly
          aria-label={`${label} (수정 불가 항목)`}
          value={value ?? ''}
          className={`${inputCls} cursor-not-allowed pr-48 text-text-meta focus:border-border-subtle`}
        />
        <Lock
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 text-text-meta"
        />
      </div>
    </div>
  )
}

export function PickButton({ children, onFiles, multiple = false }) {
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

/**
 * 작품 이미지 필드 — 항목은 { url }(기존 업로드) 또는 { file, preview }(신규 선택).
 * 미리보기는 object URL — 제거 시 revoke. 최대 MAX_IMAGES.
 */
export function ImagesField({ images, onChange }) {
  const add = (files) => {
    const next = files.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    onChange([...images, ...next].slice(0, MAX_IMAGES))
  }
  const remove = (idx) => {
    const target = images[idx]
    if (target?.preview) URL.revokeObjectURL(target.preview)
    onChange(images.filter((_, i) => i !== idx))
  }
  return (
    <Field
      as="div"
      label={`작품 이미지 (최대 ${MAX_IMAGES}장)`}
      hint="작품을 보여주는 이미지를 등록합니다. 용량 상한은 서버에서 검증됩니다."
    >
      {images.length > 0 && (
        <ul className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {images.map((image, idx) => (
            <li key={image.url ?? image.preview} className="relative min-w-0">
              <img
                src={image.url ?? image.preview}
                alt={`작품 이미지 ${idx + 1} 미리보기`}
                className="aspect-video w-full rounded-md border border-border-subtle object-cover"
              />
              <button
                type="button"
                aria-label={`작품 이미지 ${idx + 1} 제거`}
                onClick={() => remove(idx)}
                className="absolute right-8 top-8 flex cursor-pointer items-center justify-center rounded-sm border border-glass-line bg-glass-strong p-4 text-text-pri transition-colors duration-fast ease-out hover:border-border-strong"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {images.length < MAX_IMAGES && (
        <div>
          <PickButton onFiles={add} multiple>
            이미지 선택
          </PickButton>
        </div>
      )}
    </Field>
  )
}

/** 팀원 목록 — {name, studentNo, major} 행 편집. 최소 1행 유지. */
export function MemberRows({ members, onChange }) {
  const setAt = (idx, key) => (event) =>
    onChange(members.map((m, i) => (i === idx ? { ...m, [key]: event.target.value } : m)))
  return (
    <ul className="flex flex-col gap-12">
      {members.map((member, idx) => (
        <li key={idx} className="flex min-w-0 flex-col gap-8 md:flex-row md:items-center">
          <input
            type="text"
            required
            aria-label={`팀원 ${idx + 1} 이름`}
            placeholder="이름"
            value={member.name}
            onChange={setAt(idx, 'name')}
            className={inputCls}
          />
          <input
            type="text"
            required
            aria-label={`팀원 ${idx + 1} 학번`}
            placeholder="학번"
            value={member.studentNo}
            onChange={setAt(idx, 'studentNo')}
            className={inputCls}
          />
          <input
            type="text"
            required
            aria-label={`팀원 ${idx + 1} 전공`}
            placeholder="전공"
            value={member.major}
            onChange={setAt(idx, 'major')}
            className={inputCls}
          />
          {members.length > 1 && (
            <button
              type="button"
              aria-label={`팀원 ${idx + 1} 제거`}
              onClick={() => onChange(members.filter((_, i) => i !== idx))}
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-border-subtle p-12 text-text-sec transition-colors duration-fast ease-out hover:border-border-strong hover:text-text-pri"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

/** 접수·수정 일정 표기 — settings/public.exhibition의 KST 일시. */
export function ScheduleList({ exhibition }) {
  const rows = [
    { label: '접수 시작', value: formatKst(exhibition?.submit_open) },
    { label: '접수 마감', value: formatKst(exhibition?.submit_close) },
    { label: '수정 마감', value: formatKst(exhibition?.edit_close) },
  ].filter((row) => row.value)
  if (!rows.length) return null
  return (
    <dl className="flex flex-col gap-8">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex flex-wrap items-baseline gap-12">
          <dt className="text-small-m font-semibold text-text-pri md:text-small-d">
            {label}
          </dt>
          <dd className="font-mono text-small-m text-text-sec md:text-small-d">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
