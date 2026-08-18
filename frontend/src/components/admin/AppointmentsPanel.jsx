import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import DataTable from './DataTable';

const STATUS_OPTIONS = ['Booked', 'In-Queue', 'Completed', 'Cancelled', 'No-Show'];

const statusColors = {
  Booked: { bg: 'var(--warn-bg)', color: 'var(--accent-dark)' },
  'In-Queue': { bg: '#E6F0FB', color: '#2A5D8F' },
  Completed: { bg: 'var(--success-bg)', color: 'var(--success)' },
  Cancelled: { bg: 'var(--danger-bg)', color: 'var(--danger)' },
  'No-Show': { bg: 'var(--danger-bg)', color: 'var(--danger)' },
};

const AppointmentsPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const { data } = await axiosInstance.get(`/admin/appointments${params}`);
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this appointment record?')) return;
    await axiosInstance.delete(`/admin/appointments/${id}`);
    fetchAppointments();
  };

  const columns = [
    { key: 'tokenNo', label: 'Token', render: (row) => `#${String(row.tokenNo).padStart(2, '0')}` },
    { key: 'patient', label: 'Patient', render: (row) => row.patient?.name || '—' },
    { key: 'doctor', label: 'Doctor', render: (row) => row.doctor?.name || '—' },
    { key: 'date', label: 'Date', render: (row) => new Date(row.date).toLocaleDateString() },
    {
      key: 'status', label: 'Status',
      render: (row) => {
        const s = statusColors[row.status] || statusColors.Booked;
        return (
          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: s.bg, color: s.color }}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: 'actions', label: '',
      render: (row) => <button className="btn-danger" onClick={() => handleDelete(row._id)}>Delete</button>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem' }}>Appointments ({appointments.length})</h3>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <p style={{ color: 'var(--muted)' }}>Loading…</p> : <DataTable columns={columns} rows={appointments} emptyMessage="No appointments match this filter" />}
    </div>
  );
};

export default AppointmentsPanel;