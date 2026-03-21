import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase-client';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--color-bg)', 
      color: 'white', 
      padding: '2rem',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="glass card--hover-glow" style={{ 
        padding: '2rem', 
        borderRadius: '1rem', 
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '1rem'
        }}>
          <h1 style={{ 
            fontFamily: 'var(--font-heading)', 
            margin: 0,
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Admin Dashboard
          </h1>
          <button 
            onClick={handleLogout}
            className="btn-glow"
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '0.5rem', 
              border: '1px solid var(--color-accent-secondary)', 
              backgroundColor: 'transparent',
              color: 'var(--color-accent-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-heading)',
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
            Logout
          </button>
        </div>
        
        <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          <p>Welcome to the secure admin area.</p>
          <div style={{ 
            marginTop: '2rem', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              borderRadius: '0.5rem', 
              border: '1px solid rgba(255,255,255,0.05)' 
            }}>
              <h3 style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>Manage Inquiries</h3>
              <p style={{ fontSize: '0.9rem' }}>View and respond to client inquiries and contact forms.</p>
            </div>
            
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              borderRadius: '0.5rem', 
              border: '1px solid rgba(255,255,255,0.05)' 
            }}>
              <h3 style={{ color: 'var(--color-accent-secondary)', marginBottom: '1rem' }}>Manage Reviews</h3>
              <p style={{ fontSize: '0.9rem' }}>Approve, edit, or remove client reviews displayed on the public site.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
