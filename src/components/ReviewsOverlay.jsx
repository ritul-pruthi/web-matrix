/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { Star, StarHalf, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const REVIEWS_DATA = [
  {
    name: 'Aryan Malhotra',
    stars: 5,
    half: false,
    text: '"The \'Unified Matrix\' approach is real. They streamlined our entire workflow by building a custom dashboard that feels like it\'s from the future. Peak engineering."',
  },
  {
    name: 'Jessica Chen',
    stars: 5,
    half: false,
    text: '"Founding a startup is chaotic, but WebMatrix brought the order we needed. Their technical pillars for scalability saved us months of refactoring. Simply the best."',
  },
  {
    name: 'Rohan Varma',
    stars: 4,
    half: true,
    text: '"Clean code, high performance, and an aesthetic that is unmatched. The glassmorphism UI they built for our internal tools made our team 2x more productive."',
  },
  {
    name: 'David Miller',
    stars: 5,
    half: false,
    text: '"Security was our biggest concern, but their \'Obsidian Logic\' approach hardened our platform against everything. They don\'t just build sites; they build digital fortresses."',
  },
  {
    name: 'Ishaan Singh',
    stars: 5,
    half: false,
    text: '"WebMatrix didn\'t just meet the requirements—they evolved them. Their recursive innovation ensures our product stays ahead of the curve."',
  },
  {
    name: 'Rhea Kapoor',
    stars: 4,
    half: false,
    text: '"Transitioning our legacy systems to a modern web application was a massive undertaking until we partnered with WebMatrix."',
  },
];

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
  return <div className="review-stars">{filled}</div>;
}

export default function ReviewsOverlay({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

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
          <div className="reviews-header">
            <button
              className="btn btn--outline"
              onClick={onClose}
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            >
              <ArrowLeft style={{ width: 16, height: 16 }} />
              Back to Home
            </button>
            <h2
              className="hero-title"
              style={{ marginBottom: 0, fontSize: 'clamp(2rem, 3vw, 2.5rem)' }}
            >
              Client Reviews
            </h2>
            <div style={{ width: 100 }} />
          </div>

          <div className="reviews-container">
            <div className="reviews-grid">
              {REVIEWS_DATA.map((review, i) => (
                <motion.article
                  className="card card--hover-glow review-card"
                  key={review.name}
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
                    <StarRating stars={review.stars} half={review.half} />
                  </div>
                  <p className="service-body">{review.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
