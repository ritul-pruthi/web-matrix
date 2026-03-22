import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, signOut } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'var(--color-bg)', 
        color: 'white',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '1rem'
      }}>
        <div className="glass card--hover-glow" style={{ padding: '2.5rem', borderRadius: '1rem', textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent-secondary)', marginBottom: '1rem' }}>Access Denied</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>You do not have administrator privileges to view this page.</p>
          <button 
            className="btn-glow" 
            onClick={signOut} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem', 
              border: '1px solid var(--color-accent-secondary)', 
              backgroundColor: 'transparent', 
              color: 'var(--color-accent-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'var(--color-accent-secondary)';
              e.target.style.color = 'var(--color-bg)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'var(--color-accent-secondary)';
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return children;
}
