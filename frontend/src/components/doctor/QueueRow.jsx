const statusStyles = {
  Booked:     { bg: 'var(--warn-bg)', color: 'var(--accent-dark)' },
  'In-Queue': { bg: '#E6F0FB', color: '#2A5D8F' },
  Completed:  { bg: 'var(--success-bg)', color: 'var(--success)' },
  Cancelled:  { bg: 'var(--danger-bg)', color: 'var(--danger)' },
  'No-Show':  { bg: 'var(--danger-bg)', color: 'var(--danger)' },
};

const QueueRow = ({ appointment, onUpdateStatus, updating }) => {
  const { patient, tokenNo, status, reason } = appointment;
  const style = statusStyles[status] || statusStyles.Booked;
  const isBusy = updating === appointment._id;

  return (
    <div className="card" style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px',
      opacity: status === 'Cancelled' ? 0.5 : 1,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 8, background: 'var(--primary)', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, fontSize: '1rem', flexShrink: 0,
      }}>
        {String(tokenNo).padStart(2, '0')}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{patient?.name}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
          {patient?.phone}{reason && `  ·  ${reason}`}
        </div>
      </div>

      <span style={{
        background: style.bg, color: style.color, fontSize: '0.75rem', fontWeight: 600,
        padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0,
      }}>{status}</span>

      {(status === 'Booked' || status === 'In-Queue') && (
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {status === 'Booked' && (
            <button
              className="btn-ghost"
              disabled={isBusy}
              onClick={() => onUpdateStatus(appointment._id, 'In-Queue')}
            >Call in</button>
          )}
          <button
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            disabled={isBusy}
            onClick={() => onUpdateStatus(appointment._id, 'Completed')}
          >Complete</button>
          <button
            className="btn-danger"
            disabled={isBusy}
            onClick={() => onUpdateStatus(appointment._id, 'No-Show')}
          >No-show</button>
        </div>
      )}
    </div>
  );
};

export default QueueRow;