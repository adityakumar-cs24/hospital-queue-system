import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import QueueView from '../../components/doctor/QueueView';
import AvailabilityEditor from '../../components/doctor/AvailabilityEditor';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('queue');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 32px', background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fraunces, serif', fontWeight: 700,
          }}>+</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{user?.specialization}</div>
          </div>
        </div>
        <button className="btn-ghost" onClick={logout}>Logout</button>
      </header>

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {['queue', 'availability'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 18px', borderRadius: 7, fontSize: '0.85rem',
                background: tab === t ? 'var(--primary)' : 'transparent',
                color: tab === t ? 'white' : 'var(--muted)',
              }}
            >
              {t === 'queue' ? "Today's queue" : 'Availability'}
            </button>
          ))}
        </div>

        {tab === 'queue' && <QueueView />}
        {tab === 'availability' && <AvailabilityEditor />}
      </main>
    </div>
  );
};

export default DoctorDashboard;