// 공용 테이블 — 다크 배경, 헤어라인 구분선(border-border-subtle), radius 4.
// Curriculum.jsx SemesterTable와 동일 토큰 언어(thead mono·text-meta, tbody body·text-pri).
// 표만 가로 스크롤(overflow-x-auto + min-w-0)해 페이지 가로 스크롤을 막는다.
// columns: [{ key, label, align?, nowrap?, mono? }], rows: [{...}], caption?(상단 라벨).
function Table({ columns, rows, caption }) {
  return (
    <div className="min-w-0 overflow-x-auto rounded-md border border-border-subtle">
      {caption && (
        <p className="border-b border-border-subtle bg-bg-elev px-16 py-12 font-mono text-label-m uppercase tracking-label text-text-sec md:text-label-d">
          {caption}
        </p>
      )}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border-subtle">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-16 py-8 font-mono text-caption-m font-medium text-text-meta ${
                  col.align === 'right' ? 'text-right' : ''
                } ${col.nowrap ? 'whitespace-nowrap' : ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {rows.map((row, ri) => (
            <tr key={ri}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-16 py-12 ${
                    col.mono
                      ? 'font-mono text-small-m text-text-sec md:text-small-d'
                      : 'text-body-m text-text-pri md:text-body-d'
                  } ${col.align === 'right' ? 'text-right' : ''} ${
                    col.nowrap ? 'whitespace-nowrap' : 'min-w-0 break-keep'
                  }`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
