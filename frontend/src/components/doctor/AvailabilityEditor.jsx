import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const emptyDay = (day) => ({ day, enabled: false, startTime: '09:00', endTime: '17:00', maxTokens: 20 });

const AvailabilityEditor = () => {
  const [schedule, setSchedule] = useState(DAYS.map(emptyDay));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axiosInstance.get('/doctors/profile').then(({ data }) => {
      const merged = DAYS.map((day) => {
        const existing = data.availability.find((a) => a.day === day);
        return existing ? { ...existing, enabled: true } : emptyDay(day);
      });
      setSchedule(merged);
    }).finally(() => setLoading(false));
  }, []);

  const updateDay = (day, field, value) => {
    setSchedule((prev) => prev.map((d) => (d.day === day ? { ...d, [field]: value } : d)));
  };

  const handleSave = async () => {
    setSaving(true); setMessage('');
    try {
      const availability = schedule
        .filter((d) => d.enabled)
        .map(({ day, startTime, endTime, maxTokens }) => ({
          day, startTime, endTime, maxTokens: Number(maxTokens),
        }));
      await axiosInstance.put('/doctors/availability', { availability });
      setMessage('Availability saved');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading…</p>;

  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ fontSize: '1.15rem', marginBottom: 4 }}>Weekly availability</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 18 }}>
        Toggle the days you see patients and set the token cap for each.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {schedule.map((d) => (
          <div key={d.day} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
            border: '1px solid var(--border)', borderRadius: 8,
            background: d.enabled ? 'var(--bg)' : 'transparent',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, width: 120, fontWeight: 600, fontSize: '0.88rem' }}>
              <input
                type="checkbox"
                checked={d.enabled}
                onChange={(e) => updateDay(d.day, 'enabled', e.target.checked)}
                style={{ width: 'auto' }}
              />
              {d.day.slice(0, 3)}
            </label>

            {d.enabled && (
              <>
                <input type="time" value={d.startTime} onChange={(e) => updateDay(d.day, 'startTime', e.target.value)} style={{ width: 110 }} />
                <span style={{ color: 'var(--muted)' }}>to</span>
                <input type="time" value={d.endTime} onChange={(e) => updateDay(d.day, 'endTime', e.target.value)} style={{ width: 110 }} />
                <input
                  type="number" min="1" value={d.maxTokens}
                  onChange={(e) => updateDay(d.day, 'maxTokens', e.target.value)}
                  style={{ width: 70 }}
                  title="Max tokens"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>tokens</span>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20 }}>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save availability'}
        </button>
        {message && <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>{message}</span>}
      </div>
    </div>
  );
};

export default AvailabilityEditor;