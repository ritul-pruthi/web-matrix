// 1. Mobile Toggle: Hamburger opens/closes mobile nav menu
function toggleMobileNav() {
  const nav = document.querySelector('nav, .navbar');
  if (!nav) return;
  nav.classList.toggle('mobile-open');
}

// If your hamburger icon has id 'hamburger', wire up click handler
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileNav);
  }

  // 2. Initialize Icons: run immediately + fallback so icons render in service cards
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
    setTimeout(lucide.createIcons, 100);
  }

  // 3. Scroll Reveal Logic (cards, vm-section, contact section, headers)
  const revealElements = document.querySelectorAll(
    '.section > *, .card, .core-value-card, .vm-section, .contact-form-container, .project-starter-box, .services-cta'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      // Group entries that intersect at the exact same time
      const intersectingEntries = entries.filter((entry) => entry.isIntersecting);
      
      intersectingEntries.forEach((entry, index) => {
        // Apply staggering incrementally using inline style transition
        entry.target.style.transitionDelay = `${index * 120}ms`;
        entry.target.classList.add('revealed');
        // Optional: Unobserve if we only want it to happen once
        // revealObserver.unobserve(entry.target);
      });

      // Clear transition delays after animation concludes to avoid hovering bugs
      intersectingEntries.forEach((entry) => {
        setTimeout(() => {
           if (entry.target.classList.contains('revealed')) {
             entry.target.style.transitionDelay = '0ms';
           }
        }, 1500); // Wait longer than the 1.2s duration to be safe
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => {
    el.classList.add('will-reveal'); // Sets initial opacity to 0
    revealObserver.observe(el);
  });

  // 4. Navbar Scroll Effect (glass after 50px)
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    if (window.scrollY > 50) {
      nav.style.background = 'rgba(5, 8, 10, 0.8)';
      nav.style.borderColor = 'rgba(16, 185, 129, 0.3)';
    } else {
      nav.style.background = 'rgba(255, 255, 255, 0.03)';
      nav.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }
  });

  // 5. Contact form: on submit hide form and show success message
  const contactForm = document.getElementById('contact-form');
  const contactContainer = document.querySelector('.contact-form-container');
  const contactSuccess = document.getElementById('contact-success');
  if (contactForm && contactContainer && contactSuccess) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      contactContainer.classList.add('form-sent');
      contactSuccess.hidden = false;
    });
  }

  // --- NEW INTERACTIVE UI LOGIC ---

  // 6. Scroll Progress Bar
  const scrollProgress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (totalScroll / scrollHeight) * 100;
    if(scrollProgress) scrollProgress.style.width = scrollPercentage + '%';
  });

  // 7. Custom Cyber Cursor & Magnetic Buttons
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;
  const magneticBtns = document.querySelectorAll('.btn, .btn-glow, .btn-large');

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Instantly move dot
    if (cursorDot) {
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    }

    // Magnetic interaction for buttons
    magneticBtns.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = mouseX - centerX;
      const distanceY = mouseY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const radius = Math.max(rect.width, rect.height) / 2 + 50;
      
      if (distance < radius) {
        // Apply magnetic pull
        const pullX = distanceX * 0.25;
        const pullY = distanceY * 0.25;
        btn.style.transform = `translate(${pullX}px, ${pullY}px)`;
      } else {
        // Reset transform if out of range, but be careful not to override standard hover transforms implicitly
        // For safe fallback, we use empty string to remove our inline style. 
        // This allows CSS hover scale transforms to still work untouched when resetting.
        btn.style.transform = '';
      }
    });
  });

  // Lerp calculation for ring trail
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    if (cursorRing) {
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Hover states for the custom cursor
  const interactables = document.querySelectorAll('a, button, .btn, .card, .project-starter-box');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if(cursorRing) cursorRing.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      if(cursorRing) cursorRing.classList.remove('cursor-hover');
    });
  });

  // 8. Background Particle Network Canvas
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 65; // Balanced for performance and visual density
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6; // Lightweight speed
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.5 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges smoothly
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.7)'; // Emerald tint nodes
        ctx.fill();
      }
    }

    // Initialize nodes
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Connect nodes via proximity threshold
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 140) { // Connect if near
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = 1 - (dist / 140);
            ctx.strokeStyle = `rgba(14, 165, 233, ${opacity * 0.25})`; // Cyan low-opacity line
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // 9. Reviews Overlay Logic
  const navReviewsLink = document.getElementById('nav-reviews');
  const reviewsOverlay = document.getElementById('reviews-page');
  const closeReviewsBtn = document.getElementById('close-reviews');

  if (navReviewsLink && reviewsOverlay && closeReviewsBtn) {
    navReviewsLink.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default anchor scrolling
      reviewsOverlay.classList.add('active');
      document.body.classList.add('no-scroll');
      
      // If mobile nav is open, close it
      const nav = document.querySelector('nav, .navbar');
      if (nav && nav.classList.contains('mobile-open')) {
        nav.classList.remove('mobile-open');
      }

      // Re-trigger icon rendering for the overlay dynamically just in case
      if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
      }
    });

    closeReviewsBtn.addEventListener('click', () => {
      reviewsOverlay.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  }

});
