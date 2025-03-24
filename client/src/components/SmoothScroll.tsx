import { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

export default function SmoothScroll({ children, className }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // More performant implementation using requestAnimationFrame
    // for smooth parallax effects
    let scrollY = window.scrollY;
    let rafId: number;

    const handleScroll = () => {
      scrollY = window.scrollY;
      if (!rafId) {
        rafId = requestAnimationFrame(updateElements);
      }
    };

    const updateElements = () => {
      rafId = 0;
      if (!containerRef.current) return;

      const parallaxElements = containerRef.current.querySelectorAll('.parallax');

      parallaxElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const speed = htmlEl.dataset.speed || '0.3';
        const yPos = -(scrollY * parseFloat(speed));
        htmlEl.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className || ''}`}
    >
      {children}
    </div>
  );
}