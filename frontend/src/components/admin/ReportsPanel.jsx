import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '../../api/axiosInstance';
import SummaryCards from './SummaryCards';

const ReportsPanel = () => {
  const [summary, setSummary] = useState(null);
  const [perDay, setPerDay] = useState([]);
  const [doctorLoad, setDoctorLoad] = useState([]);
  const [noShow, setNoShow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p, d, n] = await Promise.all([
          axiosInstance.get('/admin/reports/summary'),
          axiosInstance.get('/admin/reports/appointments-per-day'),
          axiosInstance.get('/admin/reports/doctor-load'),
          axiosInstance.get('/admin/reports/no-show-rate'),
        ]);
        setSummary(s.data);
        setPerDay(p.data);
        setDoctorLoad(d.data);
        setNoShow(n.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading reports…</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SummaryCards summary={summary} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>Appointments per day</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: 12 }}>All bookings across all doctors</p>
          {perDay.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', padding: '30px 0', textAlign: 'center' }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={perDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: '0.8rem', borderRadius: 8, border: '1px solid var(--border)' }} />
                <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>Doctor load</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: 12 }}>Appointments handled per doctor</p>
          {doctorLoad.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem', padding: '30px 0', textAlign: 'center' }}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={doctorLoad}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: '0.8rem', borderRadius: 8, border: '1px solid var(--border)' }} />
                <Bar dataKey="totalAppointments" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {noShow && (
        <div className="card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 24 }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>No-show rate</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.6rem', fontWeight: 600 }}>{noShow.noShowRatePercent}%</div>
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
            {noShow.noShows} no-shows out of {noShow.totalAppointments} total appointments
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPanel;