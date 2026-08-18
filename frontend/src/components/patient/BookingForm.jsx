import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const BookingForm = ({ onBooked }) => {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get('/patients/doctors').then(({ data }) => setDoctors(data)).catch(() => {});
  }, []);

  const selectedDoctor = doctors.find((d) => d._id === doctorId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/patients/appointments', { doctorId, date, reason });
      setSuccess(`Booked — you're token #${data.tokenNo}`);
      setDoctorId(''); setDate(''); setReason('');
      onBooked?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not book this appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ fontSize: '1.15rem', marginBottom: 4 }}>Book an appointment</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 18 }}>
        Pick a doctor and date — you'll get a queue token instantly.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label className="field-label">Doctor</label>
          <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
            <option value="">Select a doctor</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>{d.name} — {d.specialization}</option>
            ))}
          </select>
        </div>

        {selectedDoctor && (
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', background: 'var(--bg)', padding: '8px 12px', borderRadius: 8 }}>
            Available: {selectedDoctor.availability.map((a) => a.day).join(', ') || 'No schedule set'}
          </div>
        )}

        <div>
          <label className="field-label">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
        </div>

        <div>
          <label className="field-label">Reason (optional)</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Routine checkup" />
        </div>

        {error && <p className="error-text">{error}</p>}
        {success && <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>{success}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Booking…' : 'Book appointment'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;