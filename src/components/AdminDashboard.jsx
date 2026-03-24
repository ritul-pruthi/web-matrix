import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase-client';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [inqRes, revRes] = await Promise.all([
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*, profiles(full_name)').order('created_at', { ascending: false })
    ]);
    if (inqRes.data) setInquiries(inqRes.data);
    if (revRes.data) setReviews(revRes.data);
    setLoading(false);
  };

  const handleInquiryStatus = async (id, evt) => {
    const status = evt.target.value;
    await supabase.from('inquiries').update({ status }).eq('id', id);
    fetchData();
  };

  const handleReviewToggle = async (id, is_published) => {
    await supabase.from('reviews').update({ is_published }).eq('id', id);
    fetchData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '3rem' }}>Loading Admin Panel...</div>;
  }

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
        maxWidth: '1200px', 
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
              fontFamily: 'var(--font-heading)'
            }}
          >
            Logout
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {/* INQUIRIES SECTION */}
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>Manage Inquiries ({inquiries.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '0.5rem' }}>Name</th>
                    <th style={{ padding: '0.5rem' }}>Email / Phone</th>
                    <th style={{ padding: '0.5rem' }}>Service</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map(inq => (
                    <tr key={inq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.5rem' }}>{inq.name}</td>
                      <td style={{ padding: '0.5rem' }}>
                        <div>{inq.email}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{inq.phone || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '0.5rem' }}>{inq.service || 'N/A'}</td>
                      <td style={{ padding: '0.5rem' }}>
                        <select 
                          value={inq.status || 'pending'} 
                          onChange={(e) => handleInquiryStatus(inq.id, e)}
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'white',
                            padding: '0.3rem 0.5rem',
                            borderRadius: '0.3rem'
                          }}
                        >
                          <option value="pending" style={{color: 'black'}}>Pending</option>
                          <option value="in_progress" style={{color: 'black'}}>In Progress</option>
                          <option value="resolved" style={{color: 'black'}}>Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {inquiries.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center', opacity: 0.5 }}>No inquiries found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* REVIEWS SECTION */}
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ color: 'var(--color-accent-secondary)', marginBottom: '1rem' }}>Manage Reviews ({reviews.length})</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '0.5rem' }}>Reviewer</th>
                    <th style={{ padding: '0.5rem' }}>Rating</th>
                    <th style={{ padding: '0.5rem' }}>Comment</th>
                    <th style={{ padding: '0.5rem' }}>Published</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(rev => (
                    <tr key={rev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.5rem' }}>{rev.profiles?.full_name || 'Anonymous'}</td>
                      <td style={{ padding: '0.5rem' }}>{rev.rating} / 5</td>
                      <td style={{ padding: '0.5rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {rev.comment}
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                          <input 
                            type="checkbox" 
                            checked={rev.is_published}
                            onChange={(e) => handleReviewToggle(rev.id, e.target.checked)}
                          />
                          <span style={{ color: rev.is_published ? '#10b981' : '#fbbf24' }}>
                            {rev.is_published ? 'Live' : 'Hidden'}
                          </span>
                        </label>
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center', opacity: 0.5 }}>No reviews found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
