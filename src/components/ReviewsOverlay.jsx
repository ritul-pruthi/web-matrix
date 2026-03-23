import { useEffect, useState } from 'react';
import { Star, StarHalf, ArrowLeft, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase-client';
import { useAuth } from '../context/AuthContext';

function StarRating({ stars, half }) {
  const filled = [];
  for (let i = 0; i < stars; i++) {
    filled.push(
      <Star
        key={`full-${i}`}
        style={{ width: 16, fill: 'var(--color-accent)', color: 'var(--color-accent)' }}
      />
    );
  }
  if (half) {
    filled.push(
      <StarHalf
        key="half"
        style={{ width: 16, color: 'var(--color-accent)' }}
      />
    );
  }
  return <div className="review-stars" style={{ display: 'flex', gap: '0.2rem' }}>{filled}</div>;
}

export default function ReviewsOverlay({ isOpen, onClose }) {
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [newReview, setNewReview] = useState({ text: '', stars: 5 });
  const [submitting, setSubmitting] = useState(false);

  const { user, profile } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
      fetchReviews();
    } else {
      document.body.classList.remove('no-scroll');
      setIsWriting(false);
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_published', true);
      
    if (error) {
      console.error('Error fetching reviews:', error);
    } else if (data) {
      setReviewsData(data);
    }
    setLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    
    const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous';

    const { error } = await supabase
      .from('reviews')
      .insert([{
        name: userName,
        stars: Number(newReview.stars),
        half: false,
        text: newReview.text,
        is_published: false
      }]);

    setSubmitting(false);

    if (error) {
      alert('Failed to submit review: ' + error.message);
    } else {
      alert('Your review has been submitted and is pending approval. Thank you!');
      setIsWriting(false);
      setNewReview({ text: '', stars: 5 });
    }
  };

  const inputStyle = {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
    width: '100%',
    marginBottom: '1rem'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="reviews-overlay custom-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{ visibility: 'visible' }}
        >
          <div className="reviews-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              className="btn btn--outline"
              onClick={onClose}
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            >
              <ArrowLeft style={{ width: 16, height: 16, marginRight: '0.5rem' }} />
              Back to Home
            </button>
            <h2
              className="hero-title"
              style={{ marginBottom: 0, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', textAlign: 'center' }}
            >
              Client Reviews
            </h2>
            
            <div style={{ minWidth: '130px', display: 'flex', justifyContent: 'flex-end' }}>
              {user && !isWriting && (
                <button
                  className="btn btn--outline"
                  onClick={() => setIsWriting(true)}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
                >
                  <Edit3 style={{ width: 16, height: 16, marginRight: '0.5rem' }} />
                  Write Review
                </button>
              )}
            </div>
          </div>

          <div className="reviews-container" style={{ marginTop: '2rem' }}>
            {isWriting ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="card glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', borderRadius: '1rem' }}
              >
                <h3 style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}>Share Your Experience</h3>
                <form onSubmit={handleReviewSubmit}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>Rating</label>
                  <select 
                    value={newReview.stars} 
                    onChange={(e) => setNewReview(prev => ({ ...prev, stars: e.target.value }))}
                    style={{ ...inputStyle, appearance: 'none' }}
                  >
                    <option value="5" style={{color: 'black'}}>⭐⭐⭐⭐⭐ - Excellent</option>
                    <option value="4" style={{color: 'black'}}>⭐⭐⭐⭐ - Very Good</option>
                    <option value="3" style={{color: 'black'}}>⭐⭐⭐ - Good</option>
                    <option value="2" style={{color: 'black'}}>⭐⭐ - Fair</option>
                    <option value="1" style={{color: 'black'}}>⭐ - Poor</option>
                  </select>

                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.8)' }}>Your Review</label>
                  <textarea 
                    value={newReview.text} 
                    onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Tell us about your project and experience with WebMatrix..."
                    required
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      type="button" 
                      onClick={() => setIsWriting(false)} 
                      className="btn btn--outline" 
                      style={{ flex: 1 }}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-emerald" 
                      style={{ flex: 1, justifyContent: 'center' }}
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-accent)' }}>
                    Loading reviews...
                  </div>
                ) : reviewsData.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.6)' }}>
                    No reviews available yet.
                  </div>
                ) : (
                  <div className="reviews-grid">
                    {reviewsData.map((review, i) => (
                      <motion.article
                        className="card card--hover-glow review-card"
                        key={review.id || i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                      >
                        <div className="review-header">
                          <h3
                            className="service-title"
                            style={{ color: 'var(--color-text-primary)', marginBottom: 0 }}
                          >
                            {review.name}
                          </h3>
                          <StarRating stars={Math.floor(review.stars)} half={review.half || review.stars % 1 !== 0} />
                        </div>
                        <p className="service-body">{review.text}</p>
                      </motion.article>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
