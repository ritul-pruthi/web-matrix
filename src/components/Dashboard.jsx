import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { supabase } from '../supabase-client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [inquiries, setInquiries] = useState([]);
  const [myReview, setMyReview] = useState(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchUserData = async () => {
      const { data: inqData } = await supabase
        .from('inquiries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (inqData) setInquiries(inqData);

      const { data: rev } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (rev) setMyReview(rev);
    };

    fetchUserData();
  }, [user]);

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
          <button 
            onClick={() => navigate('/')}
            className="btn-glow"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
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
            <Home size={18} /> Home
          </button>

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

          {/* Section 1: My Inquiries */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}>My Inquiries</h3>
            {inquiries.length === 0 ? (
              <p style={{ opacity: 0.5, textAlign: 'center' }}>
                You haven't submitted any inquiries yet.{' '}
                <a href="/#contact" style={{ color: 'var(--color-accent)' }}>Start one →</a>
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {inquiries.map(inq => (
                  <div key={inq.id} style={{
                    padding: '1rem', 
                    borderRadius: '0.5rem', 
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <strong style={{ color: 'white' }}>{inq.service || 'General Inquiry'}</strong>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        backgroundColor: inq.status === 'new' ? 'rgba(6,182,212,0.1)' : 
                                       inq.status === 'in-progress' ? 'rgba(251,191,36,0.1)' : 
                                       inq.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                        color: inq.status === 'new' ? 'var(--color-accent)' : 
                               inq.status === 'in-progress' ? '#fbbf24' : 
                               inq.status === 'completed' ? '#10b981' : 'rgba(255,255,255,0.5)',
                        border: `1px solid ${
                          inq.status === 'new' ? 'var(--color-accent)' : 
                          inq.status === 'in-progress' ? '#fbbf24' : 
                          inq.status === 'completed' ? '#10b981' : 'rgba(255,255,255,0.3)'
                        }`
                      }}>
                        {inq.status ? inq.status.replace('-', ' ').toUpperCase() : 'NEW'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
                      {new Date(inq.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                      {inq.message?.slice(0, 100)}{inq.message?.length > 100 ? '...' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: My Review */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}>My Review</h3>
            {myReview ? (
              <div style={{
                position: 'relative',
                padding: '1rem', 
                borderRadius: '0.5rem', 
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {myReview.is_featured && (
                  <span style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    fontSize: '0.7rem', color: 'var(--color-accent)',
                    border: '1px solid var(--color-accent)',
                    borderRadius: '999px', padding: '0.15rem 0.5rem',
                    boxShadow: '0 0 8px rgba(6,182,212,0.3)'
                  }}>⭐ Featured</span>
                )}
                <div style={{ color: 'var(--color-accent)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                  {'★'.repeat(Math.round(myReview.rating))}{'☆'.repeat(5 - Math.round(myReview.rating))}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>
                  {new Date(myReview.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                  "{myReview.comment}"
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => navigate('/?reviews=open')}
                  className="btn btn--outline"
                  style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
                >
                  Write a Review
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Account Info */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}>Account Info</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, auto) 1fr', gap: '0.5rem 1rem', alignItems: 'center' }}>
              <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Email:</strong>
              <span>{user?.email}</span>
              
              <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Member since:</strong>
              <span>{new Date(user?.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
              
              <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Role:</strong>
              <div>
                {profile?.role === 'admin' ? (
                  <span style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    🛡 Admin
                  </span>
                ) : (
                  <span style={{ color: 'var(--color-accent)', backgroundColor: 'rgba(6,182,212,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    👤 User
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Quick Actions */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/#contact')}
                className="btn btn--outline"
                style={{ borderColor: 'var(--color-accent-secondary)', color: 'var(--color-accent-secondary)' }}
              >
                🚀 Start New Project
              </button>
              <button
                onClick={() => navigate('/?reviews=open')}
                className="btn btn--outline"
                style={{ borderColor: 'var(--color-accent-secondary)', color: 'var(--color-accent-secondary)' }}
              >
                ⭐ Read Reviews
              </button>
              <button
                onClick={() => navigate('/#services')}
                className="btn btn--outline"
                style={{ borderColor: 'var(--color-accent-secondary)', color: 'var(--color-accent-secondary)' }}
              >
                🛠 Our Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
