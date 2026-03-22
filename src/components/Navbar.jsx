import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.jpeg';

export default function Navbar({ onShowReviews }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user: session, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleReviewsClick = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    onShowReviews();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header>
      <div className={`glass navbar${scrolled ? ' scrolled' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
        <a href="#top" className="logo">
          <img src={logoImg} alt="WebMatrix Solution" className="logo-img" />
        </a>

        <nav className="nav-links">
          <a href="#top">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About Us</a>
          <a href="#location">Location</a>
          <a href="#contact">Contact</a>
          <a href="#" onClick={handleReviewsClick}>Reviews</a>
        </nav>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {!session ? (
            <button 
              onClick={() => navigate('/login')}
              className="btn-glow"
              style={{
                fontFamily: 'var(--font-heading)',
                padding: '0.4rem 1rem',
                borderRadius: '2rem',
                border: 'none',
                background: 'var(--accent-gradient)',
                color: 'var(--color-bg)',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Sign In
            </button>
          ) : (
            <>
              <button 
                onClick={() => navigate('/admin')}
                className="btn-glow"
                style={{
                  fontFamily: 'var(--font-heading)',
                  padding: '0.4rem 1rem',
                  borderRadius: '2rem',
                  border: '1px solid var(--color-accent)',
                  background: 'transparent',
                  color: 'var(--color-accent)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Dashboard
              </button>
              <button 
                onClick={handleSignOut}
                className="btn-glow"
                style={{
                  fontFamily: 'var(--font-heading)',
                  padding: '0.4rem 1rem',
                  borderRadius: '2rem',
                  border: 'none',
                  background: 'var(--accent-gradient)',
                  color: 'var(--color-bg)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Sign Out
              </button>
            </>
          )}

          <button
            className="hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            style={{ marginLeft: '0.5rem' }}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
