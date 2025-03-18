import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Quote, ArrowDown } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { useLanguage } from "@/contexts/language-context";

gsap.registerPlugin(ScrollTrigger);

const inspirationalQuotes = [
  { 
    text: "Find peace in chaos, wisdom in stillness",
    chapter: 2,
    verse: 47,
    theme: "Inner Peace"
  },
  { 
    text: "Your true self lies beyond the digital noise",
    chapter: 6,
    verse: 35,
    theme: "Digital Wellness"
  },
  { 
    text: "Every moment is a chance to begin again",
    chapter: 2,
    verse: 22,
    theme: "Fresh Start"
  }
];

// Floating Mandala pattern component
const FloatingMandala = ({ className = "", delay = 0 }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: [0.1, 0.3, 0.1],
      scale: [0.8, 1, 0.8],
      rotate: [0, 180, 360]
    }}
    transition={{
      duration: 20,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    <div className="w-72 h-72 rounded-full border border-primary/20 backdrop-blur-3xl" />
    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,var(--primary)_25%,transparent_50%)] opacity-10" />
  </motion.div>
);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, 300]);
  const fadeOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => (prev + 1) % inspirationalQuotes.length);
    }, 6000);
    return () => clearInterval(interval);
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 sm:py-32"
      aria-label="Welcome to GyanGita"
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40" />
      </div>

      {/* Floating Mandalas */}
      <FloatingMandala className="top-20 left-10" delay={0} />
      <FloatingMandala className="bottom-40 right-20" delay={5} />
      <FloatingMandala className="top-40 right-10" delay={10} />

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Sacred Badge */}
          <motion.div
            className="inline-flex items-center px-6 py-2 mb-8 rounded-full 
                     backdrop-blur-xl bg-primary/5 border border-primary/20 shadow-lg
                     hover:bg-primary/10 transition-all duration-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="h-4 w-4 mr-2 text-primary" />
            <span className="text-white/90 font-medium">Ancient Wisdom for Modern Peace</span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
              <span className="block leading-tight text-white/90">
                Find Your Inner Peace in a
                <span className="block mt-2 font-normal bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  World of Chaos
                </span>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto font-light">
              Discover timeless Bhagavad Gita wisdom tailored to your emotional needs, 
              helping you navigate life's challenges with clarity and purpose
            </p>

            {/* Animated Quote Display */}
            <div className="w-full relative h-[200px] mt-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="max-w-2xl mx-auto px-6 py-8 rounded-2xl
                               backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
                    <Quote className="h-6 w-6 text-primary/60 mx-auto mb-4" />
                    <p className="text-xl sm:text-2xl font-light text-white/90 italic">
                      "{inspirationalQuotes[currentQuote].text}"
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              className="w-full sm:w-auto px-8 py-7 text-lg font-normal
                      bg-primary/90 hover:bg-primary/80 border border-primary/30
                      shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={handleScrollToMood}
            >
              <Sparkles className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
              Begin Your Journey
            </Button>

            <Button
              variant="outline"
              className="w-full sm:w-auto px-8 py-7 text-lg font-normal
                      backdrop-blur-xl bg-white/5 border border-white/20
                      hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(t('home.share.text') + '\n\n' + window.location.origin)}`, '_blank')}
            >
              <BsWhatsapp className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
              Share the Peace
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40"
          style={{ opacity: fadeOpacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className="h-6 w-6" />
        </motion.div>
      </div>
    </section>
  );
}