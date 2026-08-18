const AuthShell = ({ title, subtitle, children, footer }) => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(180deg, #F7F9F7 0%, #EDF3F0 100%)', padding: 24,
  }}>
    <div className="card" style={{ width: 400, padding: '36px 32px' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 18, marginBottom: 16,
        }}>+</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: 6 }}>{subtitle}</p>}
      </div>
      {children}
      {footer && <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.85rem' }}>{footer}</div>}
    </div>
  </div>
);

export default AuthShell;