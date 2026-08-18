import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import AuthShell from '../../components/auth/AuthShell';

const PatientLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const { data } = await axiosInstance.post('/patients/login', form);
      login(data, 'patient');
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to book and track your appointments"
      footer={
        <>
          <div>New patient? <Link to="/patient/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create an account</Link></div>
          <div style={{ marginTop: 10, color: 'var(--muted)' }}>
            <Link to="/doctor/login" style={{ color: 'var(--muted)' }}>Doctor login</Link>
            {'  ·  '}
            <Link to="/admin/login" style={{ color: 'var(--muted)' }}>Admin login</Link>
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label className="field-label">Email</label>
          <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label className="field-label">Password</label>
          <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  );
};

export default PatientLogin;