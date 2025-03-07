import { motion, useScroll, useTransform } from "framer-motion";
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
  const { scrollY } = useScroll();

  // Parallax effects using Framer Motion for better performance
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    if (!heroRef.current || !textRef.current) return;

    // GSAP animations for sequential reveal
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.fromTo(
      ".hero-badge",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6 }
    )
    .fromTo(
      ".hero-title",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.3"
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

    // Optimize background animations
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

    // Cleanup
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleShareWhatsApp = () => {
    const text = t('home.share.text');
    const url = window.location.origin;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 sm:py-32"
    >
      {/* Optimized gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-background to-background z-0" />

      {/* Performance optimized background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y }}
          className="bg-pattern absolute top-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-primary/3 blur-[100px] opacity-60 transform-gpu"
        />
        <motion.div
          style={{ y }}
          className="bg-pattern absolute bottom-[15%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary/3 blur-[120px] opacity-50 transform-gpu"
        />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={textRef}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Hero Badge */}
          <motion.div 
            className="hero-badge inline-flex items-center px-4 py-1.5 mb-6 border border-primary/20 rounded-full text-sm font-medium text-primary/80 bg-primary/5"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Discover Ancient Wisdom for Modern Life
          </motion.div>

          {/* Hero Title */}
          <motion.h1 
            className="hero-title text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair mb-6 tracking-tight"
          >
            <span className="block mb-3 text-balance">Find Divine Guidance in</span>
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              The Bhagavad Gita
            </span>
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p 
            className="hero-subtitle text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Experience timeless wisdom tailored to your emotional journey, helping you navigate life's challenges with clarity and purpose
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="hero-buttons grid gap-4 sm:grid-cols-2 max-w-lg w-full mx-auto mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button
                className="w-full py-6 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all group"
                onClick={() => {
                  const moodSection = document.getElementById('mood-section');
                  moodSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Find Your Verse
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button
                variant="outline"
                className="w-full py-6 text-lg border-primary/20 hover:bg-primary/5 hover:text-primary group"
                onClick={handleShareWhatsApp}
              >
                <BsWhatsapp className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Share With Friends
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats section with optimized animations */}
          <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mx-auto">
            {[
              { number: "18", text: "Sacred Chapters" },
              { number: "700", text: "Divine Verses" },
              { number: "5000+", text: "Years of Wisdom" },
              { number: "∞", text: "Life Applications" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-card/5 backdrop-blur-sm rounded-xl p-4 border border-primary/10 text-center hover:bg-card/10 transition-colors duration-300"
                whileHover={{ 
                  y: -5,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
              >
                <motion.div 
                  className="text-3xl md:text-4xl font-bold text-primary mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 400, damping: 25, delay: index * 0.1 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.text}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator with optimized animation */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          style={{ opacity }}
        >
          <span className="text-sm text-muted-foreground mb-2">Scroll to explore</span>
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