// StateMessage.jsx — 목록·상세 콘텐츠가 공유하는 비동기 데이터 상태 표면.
// 빈 영역을 서로 다른 문장·여백으로 만들지 않고 loading / empty / error / offline / success를
// 같은 자리에서 교체한다. 색은 상태 토큰, 크기·여백은 디자인 시스템 스케일만 사용한다.

const styleByState = {
  loading: 'border-border-subtle bg-bg-elev text-text-meta',
  empty: 'border-border-subtle bg-bg-elev text-text-meta',
  error: 'border-state-error/50 bg-bg-elev text-state-error',
  offline: 'border-border-strong bg-bg-elev text-text-sec',
  success: 'border-state-success/50 bg-bg-elev text-state-success',
}

function StateMessage({ state = 'empty', children, action = null, onRetry, retryLabel = '다시 시도', className = '' }) {
  const liveProps = state === 'error'
    ? { role: 'alert' }
    : { role: 'status', 'aria-live': 'polite' }

  return (
    <div
      {...liveProps}
      className={`flex min-h-160 flex-col items-start justify-center gap-16 rounded-md border px-24 py-32 text-body-m leading-relaxed md:px-32 md:text-body-d ${
        styleByState[state] || styleByState.empty
      } ${className}`.trim()}
    >
      <p>{children}</p>
      {action || (onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-sm border border-border-strong px-16 py-8 text-small-m font-semibold text-text-pri transition-colors duration-fast ease-out hover:border-border-focus hover:bg-bg-panel active:bg-bg-base"
        >
          {retryLabel}
        </button>
      ))}
    </div>
  )
}

export default StateMessage
