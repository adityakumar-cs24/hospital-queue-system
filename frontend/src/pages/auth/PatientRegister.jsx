import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import AuthShell from '../../components/auth/AuthShell';

const PatientRegister = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', age: '', gender: '', address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, age: form.age ? Number(form.age) : undefined };
      const { data } = await axiosInstance.post('/patients/register', payload);
      login(data, 'patient');
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Book appointments and skip the waiting room"
      footer={<div>Already registered? <Link to="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link></div>}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label className="field-label">Full name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="field-label">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="field-label">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <div style={{ width: 90 }}>
            <label className="field-label">Age</label>
            <input name="age" type="number" min="0" value={form.age} onChange={handleChange} />
          </div>
        </div>
        <div>
          <label className="field-label">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Prefer not to say</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="field-label">Address</label>
          <input name="address" value={form.address} onChange={handleChange} />
        </div>
        <div>
          <label className="field-label">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  );
};

export default PatientRegister;