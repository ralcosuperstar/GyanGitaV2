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
    text: "Your anxiety about the future is useless. Focus on what you can control in this moment.",
    chapter: 2,
    verse: 47,
    theme: "Anxiety & Overthinking"
  },
  { 
    text: "Social media likes won't fill the void within. True peace comes from understanding your inner self.",
    chapter: 6,
    verse: 35,
    theme: "Social Media Anxiety"
  },
  { 
    text: "Stop comparing your chapter 1 to someone else's chapter 20. Your journey is uniquely yours.",
    chapter: 2,
    verse: 22,
    theme: "Self-Worth"
  }
];

const features = [
  {
    icon: "🎯",
    title: "Personalized Wisdom",
    description: "Get ancient solutions for your modern struggles"
  },
  {
    icon: "🌟",
    title: "Instant Relief",
    description: "Find clarity when anxiety hits"
  },
  {
    icon: "💫",
    title: "Real Growth",
    description: "Build lasting mental strength"
  }
];

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-8 sm:py-16 md:py-24"
      aria-label="Welcome to GyanGita"
    >
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-60" />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Minimal hero badge with glass effect */}
          <motion.div
            className="hero-badge inline-flex items-center px-4 sm:px-6 py-2 mb-8 rounded-full 
                       backdrop-blur-md bg-white/5 border border-white/10 shadow-lg
                       hover:bg-white/10 transition-all duration-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="h-4 w-4 mr-2 text-primary/90" />
            <span className="text-white/90">Ancient Wisdom for Modern Life</span>
          </motion.div>

          {/* Main title with refined typography */}
          <motion.div
            className="hero-title space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
              <span className="block leading-tight text-white/90">
                Find Inner Peace in a
                <span className="block mt-2 font-normal bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
                  Chaotic World
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
              Discover timeless wisdom from the Bhagavad Gita, making ancient teachings relevant 
              to your modern life challenges
            </p>

            {/* Quote display with glass effect */}
            <div className="w-full relative h-[180px] sm:h-[200px] mt-12">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="max-w-2xl mx-auto px-4 py-6 rounded-xl
                                backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg">
                    <Quote className="h-5 w-5 text-primary/60 mx-auto mb-4" />
                    <p className="text-lg sm:text-xl font-light text-white/90 italic">
                      "{inspirationalQuotes[currentQuote].text}"
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Feature cards with glass effect */}
          <div className="hero-features grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="backdrop-blur-lg bg-white/5 rounded-lg p-6 
                         border border-white/10 shadow-lg
                         hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <span className="text-2xl mb-4 block">{feature.icon}</span>
                <h3 className="text-base font-medium mb-2 text-white/90">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Call to action with refined buttons */}
          <motion.div 
            className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              className="w-full sm:w-auto px-6 py-6 text-base font-normal
                       bg-primary/90 hover:bg-primary/80 border border-primary/30
                       shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleScrollToMood}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start Your Journey
            </Button>

            <Button
              variant="outline"
              className="w-full sm:w-auto px-6 py-6 text-base font-normal
                       backdrop-blur-md bg-white/5 border border-white/20
                       hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(t('home.share.text') + '\n\n' + window.location.origin)}`, '_blank')}
            >
              <BsWhatsapp className="h-4 w-4 mr-2" />
              Share With Others
            </Button>
          </motion.div>
        </div>

        {/* Minimal scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          style={{ opacity: fadeOpacity }}
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowDown className="h-5 w-5 text-white/40" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}