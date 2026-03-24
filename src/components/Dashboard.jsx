import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase-client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id); // Protects update with user's ID

    setUpdating(false);

    if (error) {
      setMessage({ type: 'error', text: 'Failed to update profile: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }
  };

  if (loading) return null;

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
        maxWidth: '800px', 
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
            User Dashboard
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
          >
            Logout
          </button>
        </div>
        
        <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
          <p>Welcome to your portal.</p>
          
          <div style={{ 
            marginTop: '2rem',
            padding: '1.5rem', 
            backgroundColor: 'rgba(255,255,255,0.02)', 
            borderRadius: '0.5rem', 
            border: '1px solid rgba(255,255,255,0.05)' 
          }}>
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>Profile Information</h3>
            
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                    width: '100%',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  required
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    width: '100%',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                />
              </div>

              {message.text && (
                <div style={{ 
                  color: message.type === 'error' ? '#ef4444' : '#10b981', 
                  fontSize: '0.9rem',
                  marginTop: '0.5rem'
                }}>
                  {message.text}
                </div>
              )}

              <button 
                type="submit" 
                disabled={updating}
                className="btn-glow"
                style={{
                  padding: '0.8rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: 'var(--accent-gradient)',
                  color: 'var(--color-bg)',
                  fontWeight: 'bold',
                  cursor: updating ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-heading)',
                  marginTop: '0.5rem',
                  opacity: updating ? 0.7 : 1
                }}
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
