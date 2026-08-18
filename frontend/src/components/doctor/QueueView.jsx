import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import QueueRow from './QueueRow';

const todayISO = () => new Date().toISOString().split('T')[0];

const QueueView = () => {
  const [date, setDate] = useState(todayISO());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/doctors/queue?date=${date}`);
      setAppointments(data.appointments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await axiosInstance.put(`/doctors/appointments/${id}/status`, { status });
      fetchQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const waiting = appointments.filter((a) => ['Booked', 'In-Queue'].includes(a.status)).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h3 style={{ fontSize: '1.15rem' }}>Today's queue</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 2 }}>
            {loading ? 'Loading…' : `${waiting} waiting · ${appointments.length} total`}
          </p>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: 'auto' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {!loading && appointments.length === 0 && (
          <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>
            No appointments for this date.
          </div>
        )}
        {appointments.map((appt) => (
          <QueueRow
            key={appt._id}
            appointment={appt}
            onUpdateStatus={handleUpdateStatus}
            updating={updatingId}
          />
        ))}
      </div>
    </div>
  );
};

export default QueueView;