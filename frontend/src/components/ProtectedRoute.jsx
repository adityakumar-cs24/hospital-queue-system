import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Usage: <ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Logged in, but as the wrong role — send them to their own dashboard instead
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;