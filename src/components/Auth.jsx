import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase-client';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
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

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(null);

    let authError = null;

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      authError = error;
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      authError = error;
    }

    if (authError) {
      setError(authError.message);
      setIsAuthenticating(false);
    }
  };

  const handleOAuth = async (provider) => {
    setIsAuthenticating(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin }
    });
    if (error) {
      setError(error.message);
      setIsAuthenticating(false);
    }
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
        onSubmit={handleAuth} 
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

        {isSignUp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="fullName" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
          {isAuthenticating ? 'Authenticating...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-accent)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'inherit'
            }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>OR CONTINUE WITH</span>
            <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={isAuthenticating}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                cursor: isAuthenticating ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('apple')}
              disabled={isAuthenticating}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                cursor: isAuthenticating ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'}
            >
              Apple
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
