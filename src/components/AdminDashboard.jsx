import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Flag, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMsgs, setExpandedMsgs] = useState(new Set());
  const [flaggedInquiries, setFlaggedInquiries] = useState(new Set());

  const fetchData = async () => {
    // Keep loading true on initial load only to prevent flicker during realtime updates
    if (!inquiries.length && !reviews.length) setLoading(true);
    const [inqRes, revRes] = await Promise.all([
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*, profiles(full_name)').order('created_at', { ascending: false })
    ]);
    if (inqRes.data) setInquiries(inqRes.data);
    if (revRes.data) setReviews(revRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, fetchData)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleInquiryStatus = async (id, evt) => {
    const status = evt.target.value;
    await supabase.from('inquiries').update({ status }).eq('id', id);
  };

  const toggleMessage = (id) => {
    setExpandedMsgs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleFlag = (id) => {
    setFlaggedInquiries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleReviewToggle = async (id, is_featured) => {
    await supabase.from('reviews').update({ is_featured }).eq('id', id);
  };

  const handleDeleteReview = async (id) => {
    if (!confirm('Are you sure you want to delete this review? This cannot be undone.')) return;
    await supabase.from('reviews').delete().eq('id', id);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
              Admin Dashboard
            </h1>
          </div>
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
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="glass" style={{ padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
            <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>Total Inquiries</div>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>{inquiries.length}</div>
          </div>
          <div className="glass" style={{ padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
            <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>New Inquiries</div>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: '#fbbf24' }}>{inquiries.filter(i => i.status === 'new').length}</div>
          </div>
          <div className="glass" style={{ padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
            <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>Total Reviews</div>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: '#10b981' }}>{reviews.length}</div>
          </div>
          <div className="glass" style={{ padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
            <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>Featured Reviews</div>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>{reviews.filter(r => r.is_featured).length}</div>
          </div>
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
                    <th style={{ padding: '0.5rem', width: '25%' }}>Message</th>
                    <th style={{ padding: '0.5rem' }}>Submitted</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map(inq => {
                    const isExpanded = expandedMsgs.has(inq.id);
                    const isFlagged = flaggedInquiries.has(inq.id);
                    
                    const s = inq.status || 'new';
                    const badgeBg = s === 'new' ? 'rgba(6,182,212,0.1)' : 
                                    s === 'in-progress' ? 'rgba(251,191,36,0.1)' : 
                                    s === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)';
                    const badgeColor = s === 'new' ? 'var(--color-accent)' : 
                                       s === 'in-progress' ? '#fbbf24' : 
                                       s === 'completed' ? '#10b981' : 'rgba(255,255,255,0.5)';
                    const badgeBorder = `1px solid ${s === 'new' ? 'var(--color-accent)' : s === 'in-progress' ? '#fbbf24' : s === 'completed' ? '#10b981' : 'rgba(255,255,255,0.3)'}`;

                    return (
                      <tr key={inq.id} style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        borderLeft: isFlagged ? '3px solid #ef4444' : '3px solid transparent',
                        backgroundColor: isFlagged ? 'rgba(239,68,68,0.05)' : 'transparent',
                        transition: 'all 0.2s ease'
                      }}>
                        <td style={{ padding: '0.5rem' }}>{inq.name}</td>
                        <td style={{ padding: '0.5rem' }}>
                          <div>{inq.email}</div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{inq.phone || 'N/A'}</div>
                        </td>
                        <td style={{ padding: '0.5rem' }}>{inq.service || 'N/A'}</td>
                        <td style={{ padding: '0.5rem' }}>
                          {inq.message ? (
                            <div>
                              <span>{isExpanded ? inq.message : `${inq.message.slice(0, 80)}${inq.message.length > 80 ? '...' : ''}`}</span>
                              {inq.message.length > 80 && (
                                <button onClick={() => toggleMessage(inq.id)} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontSize: '0.8rem', cursor: 'pointer', marginLeft: '0.5rem', padding: 0 }}>
                                  {isExpanded ? 'Show less' : 'Read more'}
                                </button>
                              )}
                            </div>
                          ) : 'N/A'}
                        </td>
                        <td style={{ padding: '0.5rem' }}>{new Date(inq.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</td>
                        <td style={{ padding: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <select 
                              value={inq.status || 'new'} 
                              onChange={(e) => handleInquiryStatus(inq.id, e)}
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: 'white',
                                padding: '0.3rem 0.5rem',
                                borderRadius: '0.3rem',
                                outline: 'none',
                                appearance: 'none'
                              }}
                            >
                              <option value="new" style={{color: 'black'}}>New</option>
                              <option value="in-progress" style={{color: 'black'}}>In Progress</option>
                              <option value="completed" style={{color: 'black'}}>Completed</option>
                              <option value="archived" style={{color: 'black'}}>Archived</option>
                            </select>
                            <span style={{
                              padding: '0.2rem 0.5rem',
                              borderRadius: '999px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                              backgroundColor: badgeBg,
                              color: badgeColor,
                              border: badgeBorder
                            }}>
                              {s.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                          <button 
                            onClick={() => toggleFlag(inq.id)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: isFlagged ? '#ef4444' : 'rgba(255,255,255,0.5)', 
                              cursor: 'pointer',
                              padding: '0.2rem'
                            }}
                            title="Flag inquiry"
                          >
                            <Flag size={18} fill={isFlagged ? '#ef4444' : 'none'} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
                    <th style={{ padding: '0.5rem' }}>Featured</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right' }}>Actions</th>
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
                            checked={rev.is_featured}
                            onChange={(e) => handleReviewToggle(rev.id, e.target.checked)}
                          />
                          <span style={{ color: rev.is_featured ? '#10b981' : 'rgba(255,255,255,0.5)', fontWeight: rev.is_featured ? 'bold' : 'normal', fontSize: '0.85rem' }}>
                            {rev.is_featured ? '⭐ Featured' : 'Standard'}
                          </span>
                        </label>
                      </td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDeleteReview(rev.id)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#ef4444', 
                            cursor: 'pointer',
                            padding: '0.2rem'
                          }}
                          title="Delete review"
                        >
                          <Trash2 size={18} />
                        </button>
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
