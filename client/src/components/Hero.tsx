/**
 * Hero Component
 * 
 * An engaging and interactive hero section that creates immediate emotional 
 * connection while maintaining visual clarity and user focus.
 */

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Quote, ArrowDown } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { useLanguage } from "@/contexts/language-context";

gsap.registerPlugin(ScrollTrigger);

// Engaging quotes that resonate with modern life challenges
const inspirationalQuotes = [
  { 
    text: "You have the right to work, but never to the fruit of work",
    chapter: 2,
    verse: 47,
    theme: "Success & Career"
  },
  { 
    text: "The mind is restless and difficult to control, but it can be conquered through regular practice and detachment",
    chapter: 6,
    verse: 35,
    theme: "Mental Peace"
  },
  { 
    text: "Change is the law of the universe. You can be a millionaire or a pauper in an instant",
    chapter: 2,
    verse: 22,
    theme: "Adaptability"
  }
];

// Value propositions that highlight unique benefits
const features = [
  {
    icon: "🎯",
    title: "Personalized Guidance",
    description: "Verses matched to your emotional state"
  },
  {
    icon: "🌟",
    title: "Modern Context",
    description: "Ancient wisdom for today's challenges"
  },
  {
    icon: "💫",
    title: "Daily Growth",
    description: "Progressive spiritual development"
  }
];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, 300]);
  const fadeOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [currentQuote, setCurrentQuote] = useState(0);

  // Rotate through quotes with crossfade animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % inspirationalQuotes.length);
    }, 6000); // Increased duration for better readability

    return () => clearInterval(interval);
  }, []);

  // Enhanced animations with GSAP
  useEffect(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse"
      }
    });

    // Sequence of engaging animations
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
      ".hero-features",
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.2,
        duration: 0.6 
      },
      "-=0.4"
    )
    .fromTo(
      ".hero-buttons",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.6 },
      "-=0.2"
    );

    // Clean up animations
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleScrollToMood = () => {
    const moodSection = document.getElementById('mood-section');
    if (moodSection) {
      moodSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-24"
      aria-label="Welcome to GyanGita"
    >
      {/* Dynamic background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" aria-hidden="true" />
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

      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Engaging hero badge */}
          <motion.div
            className="hero-badge inline-flex items-center px-6 py-2 mb-8 border border-primary/20 rounded-full text-sm font-medium bg-primary/5 backdrop-blur-sm shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="h-4 w-4 mr-2 text-primary animate-pulse" />
            <span className="text-primary/90">Find Your Inner Light</span>
          </motion.div>

          {/* Main title and dynamic quote */}
          <motion.div
            className="hero-title mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair mb-6 tracking-tight">
              <span className="block text-balance leading-tight">
                Modern Guidance from
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Timeless Wisdom
                </span>
              </span>

              {/* Fixed height container for subtitle text */}
              <div className="relative h-[100px] flex items-center justify-center mt-4">
                <motion.p 
                  className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Eternal Wisdom For Modern Life
                </motion.p>
              </div>

            </h1>

            {/* Quote Container with Fixed Height */}
            <div className="relative h-[200px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote}
                  initial={{ 
                    opacity: 0,
                    y: 20,
                    position: 'absolute',
                    width: '100%'
                  }}
                  animate={{ 
                    opacity: 1,
                    y: 0,
                    position: 'absolute',
                    width: '100%'
                  }}
                  exit={{ 
                    opacity: 0,
                    y: -20,
                    position: 'absolute',
                    width: '100%'
                  }}
                  transition={{ 
                    type: "tween",
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                  className="flex flex-col items-center justify-center"
                >
                  <Quote className="h-6 w-6 mb-3 text-primary/50" />
                  <p className="italic text-xl md:text-2xl text-primary/80 max-w-3xl mx-auto px-4">
                    "{inspirationalQuotes[currentQuote].text}"
                  </p>
                  <div className="text-sm text-primary/60 mt-2">
                    Chapter {inspirationalQuotes[currentQuote].chapter}, 
                    Verse {inspirationalQuotes[currentQuote].verse}
                    <span className="mx-2">•</span>
                    <span className="text-primary/70">{inspirationalQuotes[currentQuote].theme}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Feature highlights */}
          <div className="hero-features grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-card/5 backdrop-blur-sm rounded-xl p-6 border border-primary/10 text-center hover:border-primary/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <span className="text-3xl mb-3 block">{feature.icon}</span>
                <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Call to action buttons */}
          <motion.div 
            className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              className="relative w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all group overflow-hidden"
              onClick={handleScrollToMood}
            >
              <div className="absolute inset-0 bg-primary/10 transform rotate-45 translate-x-3/4 transition-transform group-hover:translate-x-1/4" />
              <span className="relative flex items-center">
                <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Begin Your Journey
              </span>
            </Button>

            <Button
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-lg border-primary/20 hover:bg-primary/5 hover:text-primary group backdrop-blur-sm"
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(t('home.share.text') + '\n\n' + window.location.origin)}`, '_blank')}
            >
              <BsWhatsapp className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Share the Light
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          style={{ opacity: fadeOpacity }}
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowDown className="h-6 w-6 text-primary/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}