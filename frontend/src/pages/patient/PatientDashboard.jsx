import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import BookingForm from '../../components/patient/BookingForm';
import TokenTicket from '../../components/patient/TokenTicket';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [tab, setTab] = useState('book'); // 'book' | 'history'

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/patients/appointments');
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await axiosInstance.put(`/patients/appointments/${id}/cancel`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId(null);
    }
  };

  const upcoming = appointments.filter((a) => ['Booked', 'In-Queue'].includes(a.status));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
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
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Patient</div>
          </div>
        </div>
        <button className="btn-ghost" onClick={logout}>Logout</button>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {['book', 'history'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 18px', borderRadius: 7, fontSize: '0.85rem',
                background: tab === t ? 'var(--primary)' : 'transparent',
                color: tab === t ? 'white' : 'var(--muted)',
              }}
            >
              {t === 'book' ? 'Book appointment' : `My appointments${upcoming.length ? ` (${upcoming.length})` : ''}`}
            </button>
          ))}
        </div>

        {tab === 'book' && <BookingForm onBooked={() => { fetchAppointments(); setTab('history'); }} />}

        {tab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}
            {!loading && appointments.length === 0 && (
              <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>
                No appointments yet. Book one to get your first token.
              </div>
            )}
            {appointments.map((appt) => (
              <TokenTicket
                key={appt._id}
                appointment={appt}
                onCancel={handleCancel}
                cancelling={cancellingId === appt._id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;