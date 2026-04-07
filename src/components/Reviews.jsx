import { useState, useEffect } from 'react';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { Star } from 'lucide-react';

export default function Reviews() {
  const { reviews, loading, error, addReview } = useReviews();
  const { user } = useAuth();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sort featured reviews first, then by date (already sorted by date in hook)
  const displayedReviews = [...reviews]
    .sort((a, b) => (b.is_featured === true ? 1 : 0) - (a.is_featured === true ? 1 : 0))
    .slice(0, 6);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess(false);

    if (rating === 0) {
      setFormError('Please select a star rating.');
      return;
    }
    if (comment.length < 20) {
      setFormError('Comment must be at least 20 characters.');
      return;
    }
    if (comment.length > 500) {
      setFormError('Comment must be less than 500 characters.');
      return;
    }

    setIsSubmitting(true);
    const { error: submitErr } = await addReview(user.id, rating, comment);
    setIsSubmitting(false);

    if (submitErr) {
      setFormError(submitErr);
    } else {
      setSuccess(true);
      setRating(0);
      setComment('');
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <div style={{ padding: '0', width: '100%', containerType: 'inline-size' }}>
      
      {loading ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem',
          gridAutoRows: 'min-content'
        }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{
              padding: '1.5rem', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)', height: '200px', animation: 'pulse 2s infinite'
            }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ color: 'var(--color-error, #f87171)', textAlign: 'center', padding: '2rem' }}>
          Error loading reviews: {error}
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem',
          gridAutoRows: 'min-content',
          marginBottom: '3rem'
        }}>
          {displayedReviews.map((review) => (
            <div 
              key={review.id} 
              style={{
                position: 'relative',
                padding: '1.5rem',
                borderRadius: '16px',
                background: 'rgba(16, 185, 129, 0.03)',
                border: review.is_featured ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(16, 185, 129, 0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease',
                boxShadow: review.is_featured ? '0 0 15px rgba(16, 185, 129, 0.1)' : '0 4px 20px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              {review.is_featured && (
                <div style={{
                  position: 'absolute', top: '-10px', right: '20px',
                  background: 'var(--color-accent, #10b981)', color: '#000',
                  fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px',
                  borderRadius: '12px', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                }}>
                  Featured
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < review.rating ? "var(--color-accent, #10b981)" : "none"} color="var(--color-accent, #10b981)" opacity={i < review.rating ? 1 : 0.3} />
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
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: '500', color: 'var(--color-text-primary, #fff)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: 'var(--color-accent, #10b981)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                    color: '#05080a', overflow: 'hidden'
                  }}>
                    {review.profiles?.avatar_url ? (
                      <img src={review.profiles.avatar_url} alt="avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      (review.profiles?.full_name || 'A').charAt(0).toUpperCase()
                    )}
                  </div>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                    {review.profiles?.full_name || 'Anonymous User'}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Submission Form */}
      <div style={{ 
        marginTop: '2rem', padding: '2rem', borderRadius: '16px',
        background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-heading, #fff)' }}>Write a Review</h3>
        
        {!user ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>Please sign in to leave a review.</p>
            <a href="/auth" style={{
              display: 'inline-block', padding: '0.75rem 1.5rem', borderRadius: '8px',
              background: 'var(--color-accent, #10b981)', color: '#000', fontWeight: 'bold',
              textDecoration: 'none'
            }}>Sign In</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Rating</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    size={28}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    fill={(hoverRating || rating) >= star ? "var(--color-accent, #10b981)" : "none"}
                    color="var(--color-accent, #10b981)"
                    style={{ cursor: 'pointer', transition: 'all 0.2s', opacity: (hoverRating || rating) >= star ? 1 : 0.4 }}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>
                <span>Review</span>
                <span style={{ fontSize: '0.8rem', color: comment.length < 20 || comment.length > 500 ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
                  {comment.length} / 500
                </span>
              </label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience working with WebMatrix..."
                style={{
                  width: '100%', minHeight: '120px', padding: '1rem', borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff', fontSize: '1rem', resize: 'vertical', fontFamily: 'inherit'
                }}
              />
            </div>

            {formError && (
              <div style={{ color: '#f87171', fontSize: '0.9rem', padding: '0.75rem', background: 'rgba(248, 113, 113, 0.1)', borderRadius: '6px' }}>
                {formError}
              </div>
            )}
            
            {success && (
              <div style={{ color: '#10b981', fontSize: '0.9rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                Thank you for your review!
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                alignSelf: 'flex-start', padding: '0.75rem 2rem', borderRadius: '8px',
                background: 'var(--color-accent, #10b981)', color: '#000', fontWeight: 'bold',
                border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.2s'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
      
    </div>
  );
}
