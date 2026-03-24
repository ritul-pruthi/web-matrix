/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase-client';

const AuthContext = createContext();

function SplashScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg)',
      flexDirection: 'column'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '3px solid rgba(16, 185, 129, 0.15)',
        borderTopColor: 'var(--color-accent)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUser.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Automatically create missing profile
        const email = currentUser.email || '';
        const defaultName = currentUser.user_metadata?.full_name || email.split('@')[0] || 'User';
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: currentUser.id, 
            email: email, 
            full_name: defaultName
          }])
          .select()
          .single();
          
        if (insertError) {
          console.error('Error creating profile automatically:', insertError);
          setProfile(null);
          setIsAdmin(false);
          return;
        }
        setProfile(newProfile);
        setIsAdmin(newProfile?.role === 'admin');
        return;
      }
      console.error('Error fetching profile:', error);
      setProfile(null);
      setIsAdmin(false);
      return;
    }

    setProfile(profileData);
    setIsAdmin(profileData?.role === 'admin');
  };

  useEffect(() => {
    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setLoading(true);
        fetchProfile(session.user).finally(() => setLoading(false));
      } else {
        fetchProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    profile,
    isAdmin,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <SplashScreen /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
