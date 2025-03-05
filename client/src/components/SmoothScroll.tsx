import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

export default function SmoothScroll({ children, className }: SmoothScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 0.8,
      class: 'is-revealed',
      mobile: {
        smooth: true,
        multiplier: 0.8,
        breakpoint: 0,
      },
      tablet: {
        smooth: true,
        multiplier: 0.8,
        breakpoint: 0,
      },
    });

    // Clean up
    return () => {
      scroll.destroy();
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className={`min-h-screen relative ${className || ''}`}
    >
      {children}
    </div>
  );
}
