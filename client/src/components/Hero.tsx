import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { useLanguage } from "@/contexts/language-context";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!heroRef.current || !textRef.current) return;

    // Animate text elements
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

    // Subtle floating animation for the background patterns
    gsap.to(".bg-pattern-1", {
      y: -30,
      x: 10,
      rotation: 5,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    gsap.to(".bg-pattern-2", {
      y: 30,
      x: -15,
      rotation: -3,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });
  }, []);

  const handleShareWhatsApp = () => {
    const text = "Experience divine wisdom through the Bhagavad Gita with GyanGita - your spiritual companion for life's journey";
    const url = window.location.origin;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
  };

  return (
    <section
      ref={heroRef}
      className="min-h-[100vh] relative flex items-center justify-center overflow-hidden py-20"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-background to-background z-0"></div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-pattern-1 absolute top-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-primary/3 blur-[100px] opacity-60"></div>
        <div className="bg-pattern-2 absolute bottom-[15%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary/3 blur-[120px] opacity-50"></div>

        <motion.div
          className="decorative-om absolute right-10 top-20 opacity-5 text-primary"
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 0.05, scale: 1, rotate: 5 }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        >
          <svg width="500" height="500" viewBox="0 0 100 100" className="fill-current">
            <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C27.9 90 10 72.1 10 50S27.9 10 50 10s40 17.9 40 40-17.9 40-40 40z"/>
            <path d="M50 20c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute -left-20 top-1/3 opacity-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <svg width="300" height="300" viewBox="0 0 100 100" className="fill-primary/30">
            <path d="M95,50c0,24.9-20.1,45-45,45S5,74.9,5,50S25.1,5,50,5S95,25.1,95,50z"/>
          </svg>
        </motion.div>
      </div>

      {/* Main content */}
      <div 
        className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center"
        ref={textRef}
      >
        <motion.div 
          className="mb-4 inline-flex items-center px-4 py-1.5 border border-primary/20 rounded-full text-sm font-medium text-primary/80 bg-primary/5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Your personal guide to ancient wisdom
        </motion.div>

        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="block mb-3">Discover Divine Wisdom in</span>
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">The Bhagavad Gita</span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Find solace, guidance and purpose through personalized verses 
          that resonate with your current emotional journey
        </motion.p>

        <motion.div 
          className="grid gap-4 sm:grid-cols-2 max-w-lg w-full mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="w-full py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => {
                const moodSection = document.getElementById('mood-section');
                moodSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Find Your Verse
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              className="w-full py-6 text-lg border-primary/20 hover:bg-primary/5 hover:text-primary"
              onClick={handleShareWhatsApp}
            >
              <BsWhatsapp className="h-5 w-5 mr-2" />
              Share With Friends
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { number: "18", text: "Chapters" },
            { number: "700", text: "Verses" },
            { number: "5000+", text: "Years of Wisdom" },
            { number: "∞", text: "Life Applications" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-card/5 backdrop-blur-sm rounded-xl p-4 border border-primary/10 text-center"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.number}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.text}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <span className="text-sm text-muted-foreground mb-2">Scroll to explore</span>
          <motion.div 
            className="w-6 h-10 rounded-full border-2 border-primary/20 flex justify-center p-1"
            initial={{ y: 0 }}
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <motion.div 
              className="w-1.5 h-1.5 bg-primary rounded-full"
              initial={{ y: 0 }}
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}