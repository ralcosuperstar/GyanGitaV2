/**
 * Hero Component
 * 
 * A visually stunning and emotionally resonant hero section designed to
 * create immediate connection and engagement with users.
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Quote } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { useLanguage } from "@/contexts/language-context";

gsap.registerPlugin(ScrollTrigger);

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  }
};

interface QuoteData {
  text: string;
  chapter: number;
  verse: number;
}

const inspirationalQuotes: QuoteData[] = [
  { text: "You have the right to work, but never to the fruit of work", chapter: 2, verse: 47 },
  { text: "Change is the law of the universe", chapter: 2, verse: 22 },
  { text: "The soul is neither born, nor does it die", chapter: 2, verse: 20 },
];

const stats = [
  { 
    number: "18",
    text: "Sacred Chapters",
    description: "Each chapter unveils unique wisdom"
  },
  { 
    number: "700",
    text: "Divine Verses",
    description: "Timeless teachings for modern life"
  },
  { 
    number: "5000+",
    text: "Years of Wisdom",
    description: "Ancient knowledge, ever-relevant"
  },
  { 
    number: "∞",
    text: "Life Applications",
    description: "Guidance for every situation"
  }
];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, 300]);
  const fadeOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [currentQuote, setCurrentQuote] = useState<QuoteData>(inspirationalQuotes[0]);

  useEffect(() => {
    // Rotate through quotes every 5 seconds
    const interval = setInterval(() => {
      setCurrentQuote(prev => {
        const currentIndex = inspirationalQuotes.findIndex(q => q.text === prev.text);
        return inspirationalQuotes[(currentIndex + 1) % inspirationalQuotes.length];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!heroRef.current || !textRef.current) return;

    const tl = gsap.timeline({ 
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse"
      }
    });

    // Enhanced animation sequence
    tl.fromTo(
      ".hero-badge",
      { opacity: 0, y: -20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6 }
    )
    .fromTo(
      ".hero-title",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.3"
    )
    .fromTo(
      ".hero-quote",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6 },
      "-=0.4"
    )
    .fromTo(
      ".hero-subtitle",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.4"
    )
    .fromTo(
      ".hero-buttons",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.2"
    )
    .fromTo(
      ".hero-stats",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8 },
      "-=0.4"
    );

    const bgElements = gsap.utils.toArray('.bg-pattern');
    bgElements.forEach((el, i) => {
      gsap.to(el, {
        y: i % 2 === 0 ? -30 : 30,
        x: i % 2 === 0 ? 10 : -15,
        rotation: i % 2 === 0 ? 5 : -3,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleScrollToMood = () => {
    try {
      const moodSection = document.getElementById('mood-section');
      if (moodSection) {
        moodSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    } catch (error) {
      console.error('Error scrolling to mood section:', error);
    }
  };

  const handleShareWhatsApp = () => {
    try {
      const text = t('home.share.text');
      const url = window.location.origin;
      window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      // Could add a toast notification here for error feedback
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 sm:py-32"
      aria-label="Welcome to GyanGita"
    >
      {/* Enhanced gradient background */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" 
        aria-hidden="true"
      />

      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          style={{ y: parallaxY }}
          className="bg-pattern absolute top-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-primary/3 blur-[120px] opacity-60 transform-gpu"
        />
        <motion.div
          style={{ y: parallaxY }}
          className="bg-pattern absolute bottom-[15%] left-[10%] w-[700px] h-[700px] rounded-full bg-primary/3 blur-[140px] opacity-50 transform-gpu"
        />
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={textRef}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Enhanced hero badge */}
          <motion.div 
            className="hero-badge inline-flex items-center px-6 py-2 mb-8 border border-primary/20 rounded-full text-sm font-medium bg-primary/5 backdrop-blur-sm shadow-xl"
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
          >
            <Heart className="h-4 w-4 mr-2 text-primary animate-pulse" />
            <span className="text-primary/90">Discover Your Inner Peace</span>
          </motion.div>

          {/* Main heading with dynamic quote */}
          <motion.h1 
            className="hero-title text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair mb-6 tracking-tight"
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
          >
            <span className="block mb-4 text-balance leading-tight">
              Ancient Wisdom for
              <br className="hidden sm:block" /> Your Modern Journey
            </span>
            <motion.div 
              className="hero-quote text-2xl md:text-3xl lg:text-4xl text-primary/90 mt-6"
              key={currentQuote.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Quote className="h-8 w-8 mx-auto mb-4 text-primary/50" />
              "{currentQuote.text}"
              <div className="text-base text-primary/70 mt-2">
                Chapter {currentQuote.chapter}, Verse {currentQuote.verse}
              </div>
            </motion.div>
          </motion.h1>

          {/* Enhanced subtitle */}
          <motion.p 
            className="hero-subtitle text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
          >
            Let the timeless wisdom of the Bhagavad Gita guide you through life's challenges. 
            Find verses that speak directly to your heart and transform your perspective.
          </motion.p>

          {/* Enhanced CTA buttons */}
          <motion.div 
            className="hero-buttons grid gap-4 sm:grid-cols-2 max-w-lg w-full mx-auto mb-16"
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button
                className="w-full py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
                onClick={handleScrollToMood}
                aria-label="Find a verse that matches your mood"
              >
                <div className="absolute inset-0 bg-primary/10 transform rotate-45 translate-x-3/4 transition-transform group-hover:translate-x-1/4" />
                <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
                Begin Your Journey
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button
                variant="outline"
                className="w-full py-6 text-lg border-primary/20 hover:bg-primary/5 hover:text-primary group backdrop-blur-sm"
                onClick={handleShareWhatsApp}
                aria-label="Share on WhatsApp"
              >
                <BsWhatsapp className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                Share the Light
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced stats grid */}
          <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.number}
                className="relative group"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }
                }}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl transform group-hover:scale-110 transition-transform duration-300" />
                <div className="relative bg-card/5 backdrop-blur-sm rounded-xl p-6 border border-primary/10 text-center h-full flex flex-col justify-center hover:border-primary/20 transition-colors duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-primary/80 mb-1">
                    {stat.text}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          style={{ opacity: fadeOpacity }}
          aria-hidden="true"
        >
          <span className="text-sm text-muted-foreground mb-2">Begin Your Journey</span>
          <motion.div 
            className="w-6 h-10 rounded-full border-2 border-primary/20 flex justify-center p-1"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div 
              className="w-1.5 h-1.5 bg-primary rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}