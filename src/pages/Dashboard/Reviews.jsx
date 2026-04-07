import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Star, Check } from 'lucide-react';

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleFeatured = async (id, isFeatured) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_featured: !isFeatured })
        .eq('id', id);

      if (error) throw error;
      
      setReviews(reviews.map(r => 
        r.id === id ? { ...r, is_featured: !isFeatured } : r
      ));
    } catch (err) {
      console.error('Error toggling featured status:', err);
      alert('Failed to update featured status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      // NOTE: This relies on an RLS role-based delete policy to prevent unauthorized deletion
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. Make sure you have admin permissions.');
    }
  };

  if (loading) return <div style={{ color: 'var(--color-text-muted)' }}>Loading reviews...</div>;
  if (error) return <div style={{ color: '#ef4444' }}>Error: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: '#fff', margin: 0 }}>Reviews Management</h1>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total: {reviews.length}</div>
      </div>

      <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              <th style={{ padding: '1rem' }}>Reviewer</th>
              <th style={{ padding: '1rem' }}>Rating</th>
              <th style={{ padding: '1rem', maxWidth: '300px' }}>Comment</th>
              <th style={{ padding: '1rem' }}>Featured</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No reviews found.</td></tr>
            ) : reviews.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>{r.profiles?.full_name || 'Anonymous User'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{r.profiles?.email}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                    <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>{r.rating}/5</span>
                  </div>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', maxWidth: '250px' }}>
                  <div style={{ 
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-text-muted)'
                  }} title={r.comment}>
                    "{r.comment}"
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button
                    onClick={() => handleToggleFeatured(r.id, r.is_featured)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                      border: r.is_featured ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: r.is_featured ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                      color: r.is_featured ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      fontWeight: r.is_featured ? 'bold' : 'normal',
                      transition: 'all 0.2s'
                    }}
                  >
                    {r.is_featured ? <Check size={14} /> : null}
                    {r.is_featured ? 'Featured' : 'Standard'}
                  </button>
                </td>
                <td style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem' }}>
                  <button
                    onClick={() => handleDelete(r.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      backgroundColor: 'transparent', color: '#ef4444',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    title="Delete Review"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
