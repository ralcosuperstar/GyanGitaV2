import { useEffect, useRef } from 'react';
import { type Container } from 'locomotive-scroll';

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

export default function SmoothScroll({ children, className }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const locomotiveRef = useRef<Container | null>(null);

  useEffect(() => {
    let instance: Container | null = null;

    const initLocomotiveScroll = async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;

      if (!containerRef.current) return;

      instance = new LocomotiveScroll({
        el: containerRef.current,
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

      locomotiveRef.current = instance;
    };

    initLocomotiveScroll();

    return () => {
      if (locomotiveRef.current) {
        locomotiveRef.current.destroy();
        locomotiveRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-scroll-container
      className={`min-h-screen relative ${className || ''}`}
    >
      {children}
    </div>
  );
}