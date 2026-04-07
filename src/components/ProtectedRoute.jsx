import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else if (requireAdmin && profile?.role !== 'admin') {
        alert("Access denied.");
        navigate('/', { replace: true });
      }
    }
  }, [user, profile, loading, navigate, requireAdmin]);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>Loading...</div>;
  }

  if (!user || (requireAdmin && profile?.role !== 'admin')) {
    return null;
  }

  return children;
}
