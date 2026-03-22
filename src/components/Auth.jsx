import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase-client';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();

  // Smart redirect logic based entirely on global context
  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        alert('You do not have administrative portal access. Returning to home page.');
        signOut();
        navigate('/');
      }
    }
  }, [user, isAdmin, loading, navigate, signOut]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsAuthenticating(false);
    }
    
    // Success flow natively delegates to useEffect tracking the user login state
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'var(--color-bg)',
      padding: '1rem'
    }}>
      <form 
        onSubmit={handleLogin} 
        className="glass card--hover-glow" 
        style={{ 
          padding: '2.5rem', 
          borderRadius: '1rem', 
          width: '100%', 
          maxWidth: '400px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem',
          position: 'relative',
          zIndex: 10
        }}
      >
        <h2 style={{ 
          fontFamily: 'var(--font-heading)', 
          background: 'var(--accent-gradient)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          color: 'transparent', 
          textAlign: 'center', 
          margin: 0, 
          fontSize: '2rem' 
        }}>
          Webmatrix Portal
        </h2>
        
        {error && (
          <div style={{ color: 'var(--color-accent-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="email" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="password" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        <button 
          type="submit" 
          className="btn-glow" 
          disabled={isAuthenticating || loading}
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontFamily: 'var(--font-heading)',
            cursor: (isAuthenticating || loading) ? 'not-allowed' : 'pointer',
            opacity: (isAuthenticating || loading) ? 0.7 : 1,
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-bg)',
            fontWeight: 'bold',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
        >
          {isAuthenticating ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
