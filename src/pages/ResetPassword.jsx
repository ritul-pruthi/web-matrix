import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase-client';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
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
        onSubmit={handleReset}
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
          Access Recovery
        </h2>

        {error && (
          <div style={{ color: 'var(--color-accent-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ color: 'var(--color-accent)', textAlign: 'center', fontSize: '1rem', padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', border: '1px solid var(--color-accent)' }}>
            Password Updated! <br/> <span style={{ fontSize: '0.85rem' }}>Redirecting to login portal...</span>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="newPassword" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
              <label htmlFor="confirmPassword" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              className="btn-glow btn-emerald"
              disabled={loading}
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontFamily: 'var(--font-heading)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
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
              {loading ? 'Updating...' : 'Set New Password'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
