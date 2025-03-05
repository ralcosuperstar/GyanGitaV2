import { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

export default function SmoothScroll({ children, className }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scroll = window.scrollY;
      const parallaxElements = container.querySelectorAll('.parallax');

      parallaxElements.forEach((el) => {
        const speed = (el as HTMLElement).dataset.speed || '0.5';
        const yPos = -(scroll * parseFloat(speed));
        (el as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen relative ${className || ''}`}
    >
      {children}
    </div>
  );
}