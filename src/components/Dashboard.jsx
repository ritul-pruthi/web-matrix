import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Zap, ArrowUpRight, Power, LayoutDashboard } from 'lucide-react';
import { supabase } from '../supabase-client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    if (!user) return;
    
    const fetchUserData = async () => {
      const { data: inqData } = await supabase
        .from('inquiries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (inqData) setInquiries(inqData);
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return null;

  return (
    <>
      <div className="mosaic-bg"></div>
      <div className="mesh-blob blob-1"></div>
      <div className="mesh-blob blob-2"></div>
      
      <div style={{ 
        minHeight: '100vh', 
        padding: '4rem 2rem',
        position: 'relative',
        zIndex: 10,
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ 
              fontFamily: '"Space Grotesk", "Outfit", sans-serif', 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
              fontWeight: 300, 
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '1rem',
              letterSpacing: '-0.04em'
            }}>
              Hello, {profile?.full_name?.split(' ')[0] || 'User'}.
            </h1>
            <div className="meta-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', boxShadow: '0 0 8px var(--color-accent)' }}></span>
              system_status: optimal // access_granted
            </div>
          </div>
          
          <button 
             onClick={() => navigate('/')}
             className="border-beam meta-text"
             style={{ 
               display: 'flex',
               alignItems: 'center',
               gap: '0.5rem',
               padding: '0.8rem 1.25rem', 
               border: '1px solid rgba(255,255,255,0.1)', 
               backgroundColor: 'rgba(255,255,255,0.03)',
               color: 'white',
               cursor: 'pointer',
               transition: 'all 0.3s ease',
               backdropFilter: 'blur(10px)'
             }}
          >
            <Home size={16} /> return_home
          </button>
        </header>

        {/* 3-Column Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          alignItems: 'stretch'
        }}>
          
          {/* Tile 1: Identity */}
          <div className="bento-tile" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '16px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#05080a',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
              }}>
                {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : 'U'}
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: '500', color: 'white', marginBottom: '0.3rem', fontFamily: 'var(--font-heading)' }}>
                  {profile?.full_name || 'Verified User'}
                </div>
                <div className="meta-text" style={{ textTransform: 'none', letterSpacing: 'normal' }}>
                  {user?.email}
                </div>
              </div>
            </div>
            
            <div style={{
              padding: '1.25rem',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
              marginTop: 'auto'
            }}>
               <div className="meta-text" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
                 Identity_Status
               </div>
               <div className="meta-text" style={{ color: 'var(--color-accent)' }}>
                 Access_Level: Matrix_Verified
               </div>
            </div>
          </div>

          {/* Tile 2: Pipeline */}
          <div className="bento-tile" style={{ display: 'flex', flexDirection: 'column' }}>
             <h3 style={{ 
               fontFamily: 'var(--font-heading)', 
               fontSize: '1.25rem', 
               fontWeight: 400,
               marginBottom: '1.5rem',
               display: 'flex',
               alignItems: 'center',
               gap: '0.75rem'
             }}>
               <LayoutDashboard size={20} className="text-accent" />
               Project Pipeline
             </h3>
             
             {inquiries.length === 0 ? (
               <div style={{ opacity: 0.5, fontSize: '0.9rem', fontStyle: 'italic', marginTop: 'auto', marginBottom: 'auto', textAlign: 'center' }}>
                 No active projects in the pipeline.
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                 {inquiries.slice(0, 4).map(inq => (
                   <div key={inq.id} style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     paddingBottom: '1rem',
                     borderBottom: '1px solid rgba(255,255,255,0.05)'
                   }}>
                     <div>
                       <div style={{ color: 'white', fontSize: '1rem', marginBottom: '0.3rem', fontWeight: 500 }}>
                         {inq.service || 'General Scope'}
                       </div>
                       <div className="meta-text">
                         {new Date(inq.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
                       </div>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       {inq.status === 'completed' && (
                         <>
                           <span className="meta-text" style={{ color: '#10b981' }}>100%</span>
                           <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                         </>
                       )}
                       {inq.status === 'in-progress' && (
                         <>
                           <span className="meta-text" style={{ color: '#fbbf24' }}>65%</span>
                           <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fbbf24', boxShadow: '0 0 10px #fbbf24', animation: 'pulse 2s infinite' }}></div>
                         </>
                       )}
                       {(inq.status === 'new' || !inq.status) && (
                         <>
                           <span className="meta-text" style={{ color: 'var(--color-accent-secondary)' }}>0%</span>
                           <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent-secondary)', boxShadow: '0 0 10px var(--color-accent-secondary)' }}></div>
                         </>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Tile 3: Quick Actions */}
          <div className="bento-tile" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ 
               fontFamily: 'var(--font-heading)', 
               fontSize: '1.25rem', 
               fontWeight: 400,
               marginBottom: '1.5rem',
               display: 'flex',
               alignItems: 'center',
               gap: '0.75rem'
             }}>
               <Zap size={20} className="text-accent-secondary" />
               Quick Actions
             </h3>
             
             <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <button 
                    onClick={() => navigate('/#contact')}
                    className="border-beam"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.25rem 1rem',
                      width: '100%',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                      fontFamily: 'inherit',
                      fontSize: '1rem'
                    }}
                 >
                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <Zap size={18} style={{ color: 'var(--color-accent)' }} /> Deploy New Project
                   </span>
                   <ArrowUpRight size={18} style={{ color: 'rgba(255,255,255,0.5)' }} />
                 </button>

                 <button 
                    onClick={() => navigate('/?reviews=open')}
                    className="border-beam"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.25rem 1rem',
                      width: '100%',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                      fontFamily: 'inherit',
                      fontSize: '1rem'
                    }}
                 >
                   <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <ArrowUpRight size={18} style={{ color: 'var(--color-accent-secondary)' }} /> Monitor Reviews
                   </span>
                   <ArrowUpRight size={18} style={{ color: 'rgba(255,255,255,0.5)' }} />
                 </button>
               </div>

               <button 
                  onClick={handleLogout}
                  className="border-beam"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1rem',
                    width: '100%',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    cursor: 'pointer',
                    marginTop: '1rem',
                    fontFamily: 'inherit',
                    fontSize: '1rem'
                  }}
               >
                 <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <Power size={18} /> Disconnect Session
                 </span>
               </button>
             </div>
          </div>

        </div>
      </div>
    </>
  );
}
