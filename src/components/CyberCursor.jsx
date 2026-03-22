import { useEffect, useRef, useCallback } from 'react';

export default function CyberCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ring = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const magneticBtnsRef = useRef([]);

  const handleMouseMove = useCallback((e) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;

    if (dotRef.current) {
      dotRef.current.style.left = `${e.clientX}px`;
      dotRef.current.style.top = `${e.clientY}px`;
    }

    if (magneticBtnsRef.current && magneticBtnsRef.current.length > 0) {
      magneticBtnsRef.current.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const radius = Math.max(rect.width, rect.height) / 2 + 50;

        if (distance < radius) {
          const pullX = distanceX * 0.25;
          const pullY = distanceY * 0.25;
          btn.style.transform = `translate(${pullX}px, ${pullY}px)`;
        } else {
          btn.style.transform = '';
        }
      });
    }
  }, []);

  useEffect(() => {
    let animationId;

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
      if (dotRef.current) dotRef.current.style.display = 'none';
      if (ringRef.current) ringRef.current.style.display = 'none';
      return;
    }

    const updateMagneticBtns = () => {
      magneticBtnsRef.current = Array.from(document.querySelectorAll('.btn, .btn-glow, .btn-large'));
    };
    
    updateMagneticBtns();
    
    const observer = new MutationObserver(updateMagneticBtns);
    observer.observe(document.body, { childList: true, subtree: true });

    function animateRing() {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.15;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top = `${ring.current.y}px`;
      }

      animationId = requestAnimationFrame(animateRing);
    }

    window.addEventListener('mousemove', handleMouseMove);
    animationId = requestAnimationFrame(animateRing);

    // Hover detection
    function onMouseOver(e) {
      if (e.target.closest('a, button, .btn, .card, .project-starter-box')) {
        ringRef.current?.classList.add('cursor-hover');
      }
    }

    function onMouseOut(e) {
      if (e.target.closest('a, button, .btn, .card, .project-starter-box')) {
        ringRef.current?.classList.remove('cursor-hover');
      }
    }

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      observer.disconnect();
    };
  }, [handleMouseMove]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
