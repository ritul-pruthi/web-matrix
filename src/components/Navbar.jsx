import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

export default function Navbar({ onShowReviews }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <header>
      <div className={`glass navbar${scrolled ? ' scrolled' : ''}`}>
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

        <button
          className="hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
