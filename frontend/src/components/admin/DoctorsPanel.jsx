import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import DataTable from './DataTable';

const emptyForm = { name: '', email: '', phone: '', password: '', specialization: '' };

const DoctorsPanel = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/admin/doctors');
      setDoctors(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); setSaving(true);
    try {
      await axiosInstance.post('/admin/doctors', form);
      setForm(emptyForm);
      setShowForm(false);
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create doctor');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (doctor) => {
    await axiosInstance.put(`/admin/doctors/${doctor._id}`, { isActive: !doctor.isActive });
    fetchDoctors();
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this doctor? This cannot be undone.')) return;
    await axiosInstance.delete(`/admin/doctors/${id}`);
    fetchDoctors();
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'isActive', label: 'Status',
      render: (row) => (
        <button
          onClick={() => toggleActive(row)}
          style={{
            fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 20,
            background: row.isActive ? 'var(--success-bg)' : 'var(--danger-bg)',
            color: row.isActive ? 'var(--success)' : 'var(--danger)',
          }}
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </button>
      ),
    },
    {
      key: 'actions', label: '',
      render: (row) => (
        <button className="btn-danger" onClick={() => handleDelete(row._id)}>Remove</button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem' }}>Doctors ({doctors.length})</h3>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add doctor'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card" style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <input type="password" placeholder="Temporary password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Creating…' : 'Create doctor'}</button>
          </div>
          {error && <p className="error-text" style={{ gridColumn: '1 / -1' }}>{error}</p>}
        </form>
      )}

      {loading ? <p style={{ color: 'var(--muted)' }}>Loading…</p> : <DataTable columns={columns} rows={doctors} emptyMessage="No doctors yet" />}
    </div>
  );
};

export default DoctorsPanel;