
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

  // 3. Scroll Reveal Logic (cards, vm-section, contact section)
  const revealElements = document.querySelectorAll(
    '.card, .vm-section, .contact-form-container'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
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
});
