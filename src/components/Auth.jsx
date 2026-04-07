/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, loading } = useAuth();

  const [view, setView] = useState('sign_in'); // 'sign_in' or 'sign_up'
  const [infoMessage, setInfoMessage] = useState(location.state?.message || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Smart redirect logic based entirely on global context
  useEffect(() => {
    if (!loading && user) {
      const pending = localStorage.getItem('pendingInquiry');
      if (pending) {
        navigate('/#contact');
      } else if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, loading, navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const redirectUrl = window.location.origin + '/auth/callback';

    try {
      if (view === 'sign_up') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
        if (!fullName.trim()) {
          throw new Error('Full Name is required');
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: redirectUrl
          }
        });

        if (signUpError) throw signUpError;

        if (data?.user) {
          setMessage('Sign up successful! Please check your email for a confirmation link.');
          // Reset form fields
          setView('sign_in');
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw signInError;
      }
    } catch (err) {
      if (err.code === 'user_already_exists') {
        setError('An account with this email already exists.');
      } else if (err.code === 'invalid_credentials') {
        setError('Invalid email or password.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider) => {
    setError(null);
    const redirectUrl = window.location.origin + '/auth/callback';
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl
      }
    });
    if (oauthError) setError(oauthError.message);
  };

  const inputStyle = {
    padding: '0.75rem',
    paddingRight: '2.5rem',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease'
  };

  const labelStyle = {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    display: 'block'
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
      <div 
        className="glass card--hover-glow" 
        style={{ 
          padding: '2.5rem', 
          borderRadius: '1rem', 
          width: '100%', 
          maxWidth: '430px', 
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

        {/* Custom Tabs */}
        <div style={{ display: 'flex', width: '100%', marginBottom: '0.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', padding: '0.25rem' }}>
          <button
            type="button"
            onClick={() => { setView('sign_in'); setError(null); setMessage(null); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '0.375rem',
              backgroundColor: view === 'sign_in' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              color: view === 'sign_in' ? 'white' : 'rgba(255,255,255,0.6)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: view === 'sign_in' ? '600' : '400',
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setView('sign_up'); setError(null); setMessage(null); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '0.375rem',
              backgroundColor: view === 'sign_up' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              color: view === 'sign_up' ? 'white' : 'rgba(255,255,255,0.6)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: view === 'sign_up' ? '600' : '400',
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div style={{ color: '#ef4444', textAlign: 'center', fontSize: '0.9rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ color: '#10b981', textAlign: 'center', fontSize: '0.9rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>
            {message}
          </div>
        )}

        {infoMessage && (
          <div style={{ color: '#3b82f6', textAlign: 'center', fontSize: '0.9rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            {infoMessage}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {view === 'sign_up' && (
            <div>
              <label htmlFor="fullName" style={labelStyle}>Full Name</label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={inputStyle}
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(6, 182, 212, 0.6)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {view === 'sign_up' && (
            <div>
              <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                  placeholder="••••••••"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(6, 182, 212, 0.6)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {view === 'sign_in' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={async () => {
                  if (!email) {
                    setError('Please enter your email to reset password.');
                    return;
                  }
                  setIsSubmitting(true);
                  const resetUrl = window.location.origin + '/reset-password';
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: resetUrl,
                  });
                  setIsSubmitting(false);
                  if (error) setError(error.message);
                  else setMessage('Password reset link sent to your email.');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-accent)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'inherit'
                }}
              >
                Forgot your password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-glow"
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontFamily: 'var(--font-heading)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-bg)',
              fontWeight: 'bold',
              fontSize: '1rem',
              width: '100%',
              transition: 'all 0.3s ease',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {isSubmitting ? 'Processing...' : (view === 'sign_in' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ margin: '0 1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={() => handleOAuth('google')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              fontSize: '0.95rem'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <button
            onClick={() => handleOAuth('apple')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              fontSize: '0.95rem'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.365 14.4c.026 3.655 3.09 4.832 3.12 4.846-.023.076-.484 1.666-1.583 3.272-1.082 1.58-2.203 3.15-3.924 3.18-1.693.033-2.247-1.015-4.187-1.015-1.94 0-2.541.983-4.156 1.048-1.666.066-2.956-1.696-4.048-3.272-2.232-3.226-3.945-9.11-1.662-13.078 1.134-1.972 3.109-3.227 5.253-3.26 1.637-.033 3.179 1.1 4.187 1.1 1.006 0 2.883-1.385 4.846-1.176 1.016.05 3.868.411 5.672 3.047-.145.09-3.388 1.977-3.418 5.412h-.101zm-3.136-9.5c.895-1.082 1.498-2.585 1.332-4.088-1.295.052-2.855.864-3.784 1.946-.832.955-1.538 2.483-1.34 3.955 1.455.113 2.898-.733 3.792-1.813z"/>
            </svg>
            Continue with Apple
          </button>
        </div>
        
      </div>
    </div>
  );
}
