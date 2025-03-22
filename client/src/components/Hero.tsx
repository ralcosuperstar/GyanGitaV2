import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, ArrowDown } from "lucide-react";
import ConsciousnessAnimation from "./ConsciousnessAnimation";

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
      className="relative min-h-[90vh] flex items-center justify-center"
      style={{ zIndex: 0 }}
    >
      {/* Animation */}
      <ConsciousnessAnimation />

      {/* Content */}
      <div className="relative container mx-auto px-4" style={{ zIndex: 2 }}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full 
                      bg-primary/5 border border-primary/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm text-white/90 font-medium">Ancient Wisdom for Modern Peace</span>
          </motion.div>

          {/* Title */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight">
              <span className="block leading-tight text-white/90">
                Find Your Inner Peace in
                <span className="block mt-2 font-normal bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Today's World
                </span>
              </span>
            </h1>

            <p className="text-lg text-white/60 max-w-xl mx-auto font-light leading-relaxed">
              Discover timeless Gita wisdom tailored to your emotional needs, 
              helping you navigate life's challenges with clarity and purpose
            </p>

            {/* CTA */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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