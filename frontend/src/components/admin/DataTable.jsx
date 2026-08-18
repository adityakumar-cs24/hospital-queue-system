const DataTable = ({ columns, rows, emptyMessage = 'No records found' }) => (
  <div className="card" style={{ overflow: 'hidden' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
      <thead>
        <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
          {columns.map((col) => (
            <th key={col.key} style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--muted)' }}>
              {emptyMessage}
            </td>
          </tr>
        ) : rows.map((row, i) => (
          <tr key={row._id || i} style={{ borderBottom: '1px solid var(--border)' }}>
            {columns.map((col) => (
              <td key={col.key} style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;