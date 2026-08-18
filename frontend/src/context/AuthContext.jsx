import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const stored = localStorage.getItem('authData');
    return stored ? JSON.parse(stored) : null;
  });

  // Called after successful login/register API response
  // role must be one of: 'patient' | 'doctor' | 'admin'
  const login = (userData, role) => {
    const data = { ...userData, role };
    localStorage.setItem('authData', JSON.stringify(data));
    setAuthData(data);
  };

  const logout = () => {
    localStorage.removeItem('authData');
    setAuthData(null);
  };

  const value = {
    user: authData,           // { _id, name, email, token, role, ... }
    role: authData?.role || null,
    isAuthenticated: !!authData,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook so components just do: const { user, role, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};