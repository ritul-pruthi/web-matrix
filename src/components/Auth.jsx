import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabase-client';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  // Smart redirect logic based entirely on global context
  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, loading, navigate]);

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
        
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#06b6d4',
                  brandAccent: 'var(--color-accent-secondary)',
                  brandButtonText: 'var(--color-bg)',
                  inputBackground: '#18181b',
                  inputText: 'white',
                  inputBorder: 'rgba(255,255,255,0.1)',
                  inputBorderFocus: '#06b6d4',
                  inputBorderHover: '#06b6d4',
                  inputLabelText: 'rgba(255,255,255,0.8)',
                  defaultButtonBackground: 'rgba(255,255,255,0.05)',
                  defaultButtonBackgroundHover: 'rgba(255,255,255,0.1)',
                  defaultButtonBorder: 'rgba(255,255,255,0.1)',
                  defaultButtonText: 'white',
                  dividerBackground: 'rgba(255,255,255,0.1)',
                  messageText: '#06b6d4',
                }
              }
            }
          }}
          theme="dark"
          providers={['google', 'apple']}
          redirectTo={window.location.origin}
          localization={{
            variables: {
              forgotten_password: {
                confirmation_text: 'Security link dispatched. Check your inbox to regain access to the Matrix.',
              },
            },
          }}
        />
      </div>
    </div>
  );
}
