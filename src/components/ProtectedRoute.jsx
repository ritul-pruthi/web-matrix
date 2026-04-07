import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [notAuth, setNotAuth] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else if (requireAdmin && !isAdmin) {
        alert("Access denied.");
        navigate('/', { replace: true });
      }
    }
  }, [user, isAdmin, loading, navigate, requireAdmin]);

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)' }}>Loading...</div>;
  }

  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return children;
}
