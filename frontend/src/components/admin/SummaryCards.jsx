const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  const cards = [
    { label: 'Patients', value: summary.totalPatients },
    { label: 'Doctors', value: summary.totalDoctors },
    { label: 'Appointments', value: summary.totalAppointments },
    { label: 'Completed', value: summary.statusBreakdown?.Completed || 0 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      {cards.map((c) => (
        <div key={c.label} className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {c.label}
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.8rem', fontWeight: 600, marginTop: 6 }}>
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;