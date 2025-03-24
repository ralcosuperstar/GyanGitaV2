import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, ArrowDown } from "lucide-react";

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
  const { scrollY } = useScroll();
  const fadeOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const handleScrollToMood = () => {
    const moodSection = document.getElementById('mood-section');
    if (moodSection) {
      moodSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 sm:py-24"
      aria-label="Welcome to GyanGita"
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40" />
      </div>

      {/* Floating Mandalas */}
      <FloatingMandala className="top-20 -left-20 lg:left-10" delay={0} />
      <FloatingMandala className="bottom-40 -right-20 lg:right-10" delay={5} />

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Sacred Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full 
                      backdrop-blur-xl bg-primary/5 border border-primary/20 shadow-lg
                      hover:bg-primary/10 transition-all duration-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm text-white/90 font-medium">Stop Scrolling, Start Healing</span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight">
              <span className="block leading-tight text-white/90">
                Tired of Endless Scrolling
              </span>
              <span className="block mt-2 font-normal bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                But Still Feeling Empty?
              </span>
            </h1>

            <p className="text-lg text-white/60 max-w-xl mx-auto font-light leading-relaxed">
              Discover ancient wisdom that actually helps with modern struggles - anxiety, loneliness, 
              and the constant pressure to "have it all figured out"
            </p>

            {/* Call to Action */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                className="w-full sm:w-auto px-8 py-6 text-lg font-normal
                        bg-primary/90 hover:bg-primary/80 border border-primary/30
                        shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={handleScrollToMood}
              >
                <Sparkles className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Begin Your Journey
              </Button>
            </motion.div>
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