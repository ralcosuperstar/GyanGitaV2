import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !textRef.current) return;

    gsap.fromTo(
      textRef.current.children,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out",
      }
    );

    // Parallax effect for the decorative elements
    gsap.to(".decorative-om", {
      y: -50,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="min-h-[90vh] relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 to-background"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="decorative-om absolute -right-20 top-20 opacity-10 text-primary"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <svg width="400" height="400" viewBox="0 0 100 100" className="fill-current">
            <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C27.9 90 10 72.1 10 50S27.9 10 50 10s40 17.9 40 40-17.9 40-40 40z"/>
            <path d="M50 20c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z"/>
          </svg>
        </motion.div>
      </div>

      {/* Main content */}
      <div 
        ref={textRef}
        className="container mx-auto px-4 text-center relative z-10"
      >
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-playfair mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        >
          Discover the Timeless Wisdom of the Bhagavad Gita
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
        >
          Experience divine knowledge through personalized verses, 
          expert commentaries, and daily spiritual guidance
        </motion.p>
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button 
            className="btn btn-primary px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey
          </motion.button>
          <motion.button 
            className="btn btn-outline px-8 py-3 rounded-lg border-2 border-primary/20 hover:bg-primary/5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
