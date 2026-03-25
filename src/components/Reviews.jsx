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
        .eq('status', 'approved')
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
    <section className="section" id="reviews" style={{ padding: '4rem 2rem' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', color: 'var(--color-primary, #fff)' }}>What Our Clients Say</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {reviews.map((review) => (
            <div 
              key={review.id} 
              style={{
                padding: '2rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px 5px var(--color-accent, #00ffff)';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'var(--color-accent, #00ffff)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                {[...Array(review.stars || 5)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--color-accent, #00ffff)" color="var(--color-accent, #00ffff)" />
                ))}
              </div>
              <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontStyle: 'italic', color: '#e2e8f0' }}>"{review.text}"</p>
              <div style={{ fontWeight: 'bold', color: 'var(--color-primary, #fff)' }}>{review.profiles?.full_name || 'Anonymous User'}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
