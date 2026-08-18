const statusStyles = {
  Booked:     { bg: 'var(--warn-bg)', color: 'var(--accent-dark)' },
  'In-Queue': { bg: 'var(--warn-bg)', color: 'var(--accent-dark)' },
  Completed:  { bg: 'var(--success-bg)', color: 'var(--success)' },
  Cancelled:  { bg: 'var(--danger-bg)', color: 'var(--danger)' },
  'No-Show':  { bg: 'var(--danger-bg)', color: 'var(--danger)' },
};

const TokenTicket = ({ appointment, onCancel, cancelling }) => {
  const { doctor, date, tokenNo, status, reason } = appointment;
  const style = statusStyles[status] || statusStyles.Booked;
  const canCancel = status === 'Booked' || status === 'In-Queue';

  const dateLabel = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  return (
    <div className="card" style={{ display: 'flex', overflow: 'hidden' }}>
      {/* Ticket stub — the signature element */}
      <div style={{
        width: 96, background: 'var(--primary)', color: 'white',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '18px 8px', position: 'relative',
        borderRight: '2px dashed rgba(255,255,255,0.35)',
      }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.08em', opacity: 0.75, textTransform: 'uppercase' }}>Token</span>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '2rem', fontWeight: 600, lineHeight: 1 }}>
          {String(tokenNo).padStart(2, '0')}
        </span>
      </div>

      <div style={{ flex: 1, padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>{doctor?.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{doctor?.specialization}</div>
          </div>
          <span style={{
            background: style.bg, color: style.color, fontSize: '0.75rem', fontWeight: 600,
            padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap',
          }}>{status}</span>
        </div>

        <div style={{ marginTop: 10, fontSize: '0.85rem', color: 'var(--muted)' }}>
          {dateLabel}{reason && `  ·  ${reason}`}
        </div>

        {canCancel && (
          <button
            className="btn-danger"
            style={{ marginTop: 12 }}
            disabled={cancelling}
            onClick={() => onCancel(appointment._id)}
          >
            {cancelling ? 'Cancelling…' : 'Cancel appointment'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TokenTicket;