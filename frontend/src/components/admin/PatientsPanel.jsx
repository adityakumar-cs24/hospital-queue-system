import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import DataTable from './DataTable';

const PatientsPanel = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/admin/patients');
      setPatients(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  const handleDelete = async (id) => {
    if (!confirm('Remove this patient? This cannot be undone.')) return;
    await axiosInstance.delete(`/admin/patients/${id}`);
    fetchPatients();
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'age', label: 'Age', render: (row) => row.age ?? '—' },
    { key: 'gender', label: 'Gender', render: (row) => row.gender ?? '—' },
    {
      key: 'actions', label: '',
      render: (row) => <button className="btn-danger" onClick={() => handleDelete(row._id)}>Remove</button>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ fontSize: '1.1rem' }}>Patients ({patients.length})</h3>
      {loading ? <p style={{ color: 'var(--muted)' }}>Loading…</p> : <DataTable columns={columns} rows={patients} emptyMessage="No patients registered yet" />}
    </div>
  );
};

export default PatientsPanel;