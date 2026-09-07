export function Table({
  columns,
  data,
  keyField = 'id',
  className = '',
}) {
  return (
    <div className={`overflow-x-auto rounded-[16px] border border-[var(--app-border)] ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--app-border)] bg-[var(--app-surface)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--app-muted)] ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--app-border)] bg-[var(--app-surface)]">
          {data.map((row) => (
            <tr 
              key={String(row[keyField])} 
              className="hover:bg-[#00DF82]/5 hover:border-[#00DF82]/20 transition-all duration-200"
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3.5 text-[var(--app-foreground)] ${col.className || ''}`}>
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
