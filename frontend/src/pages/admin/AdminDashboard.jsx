import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ReportsPanel from '../../components/admin/ReportsPanel';
import DoctorsPanel from '../../components/admin/DoctorsPanel';
import PatientsPanel from '../../components/admin/PatientsPanel';
import AppointmentsPanel from '../../components/admin/AppointmentsPanel';

const TABS = [
  { key: 'reports', label: 'Reports' },
  { key: 'doctors', label: 'Doctors' },
  { key: 'patients', label: 'Patients' },
  { key: 'appointments', label: 'Appointments' },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('reports');

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
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.username}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Administrator</div>
          </div>
        </div>
        <button className="btn-ghost" onClick={logout}>Logout</button>
      </header>

      <main style={{ maxWidth: 1020, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '8px 18px', borderRadius: 7, fontSize: '0.85rem',
                background: tab === t.key ? 'var(--primary)' : 'transparent',
                color: tab === t.key ? 'white' : 'var(--muted)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'reports' && <ReportsPanel />}
        {tab === 'doctors' && <DoctorsPanel />}
        {tab === 'patients' && <PatientsPanel />}
        {tab === 'appointments' && <AppointmentsPanel />}
      </main>
    </div>
  );
};

export default AdminDashboard;