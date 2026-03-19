import { useEffect, useRef, useCallback } from 'react';

export default function CyberCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ring = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const handleMouseMove = useCallback((e) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;

    if (dotRef.current) {
      dotRef.current.style.left = `${e.clientX}px`;
      dotRef.current.style.top = `${e.clientY}px`;
    }
  }, []);

  useEffect(() => {
    let animationId;

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
    };
  }, [handleMouseMove]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
