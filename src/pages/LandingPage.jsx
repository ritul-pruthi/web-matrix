import { useState } from 'react';

import ScrollProgress from '../components/ScrollProgress';
import ParticleCanvas from '../components/ParticleCanvas';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Location from '../components/Location';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ReviewsOverlay from '../components/ReviewsOverlay';

export default function LandingPage() {
  const [showReviews, setShowReviews] = useState(false);

  return (
    <>
      {/* Fixed-layer UI */}
      <ScrollProgress />
      <ParticleCanvas />

      {/* Page content */}
      <div className="page">
        <Navbar onShowReviews={() => setShowReviews(true)} />

        <main>
          <Hero />
          <Services />
          <About />
          <Location />
          <Contact />
        </main>

        <Footer />
      </div>

      {/* Overlay */}
      <ReviewsOverlay
        isOpen={showReviews}
        onClose={() => setShowReviews(false)}
      />
    </>
  );
}
