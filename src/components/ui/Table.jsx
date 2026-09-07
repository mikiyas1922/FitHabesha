export function Table({
  columns,
  data,
  keyField = 'id',
  emptyMessage = 'No data available',
  emptyIcon,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {emptyIcon && <div className="mb-4 text-muted">{emptyIcon}</div>}
        <p className="text-sm text-muted">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="border-b border-border bg-subtle">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {data.map((row) => (
            <tr key={String(row[keyField])} className="hover:bg-hover/70 transition-colors cursor-default">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3.5 text-foreground/85 ${col.className || ''}`}>
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
