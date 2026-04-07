import { useEffect, useState } from 'react';
import { supabase } from '../supabase-client';
import { Star } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching reviews:', error);
      } else if (data) {
        setReviews(data);
      }
    }
    fetchReviews();
  }, []);

  return (
    <div style={{ padding: '0', width: '100%', containerType: 'inline-size' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '1.5rem',
        gridAutoRows: 'min-content'
      }}>
        {reviews.map((review) => (
          <div 
            key={review.id} 
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'rgba(16, 185, 129, 0.03)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.2)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.15)';
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.03)';
            }}
          >
            <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
              {[...Array(Math.floor(review.rating || 5))].map((_, i) => (
                <Star key={i} size={16} fill="var(--color-accent, #10b981)" color="var(--color-accent, #10b981)" />
              ))}
            </div>
            <p style={{ 
              fontSize: '1rem', 
              marginBottom: '1.5rem', 
              fontStyle: 'italic', 
              color: '#e2e8f0',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: '1.5'
            }}>"{review.comment}"</p>
            <div style={{ marginTop: 'auto', fontWeight: '500', color: 'var(--color-text-primary, #fff)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: 'var(--color-accent, #10b981)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                color: '#05080a', flexShrink: 0
              }}>
                {(review.profiles?.full_name || 'A').charAt(0).toUpperCase()}
              </div>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {review.profiles?.full_name || 'Anonymous User'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
