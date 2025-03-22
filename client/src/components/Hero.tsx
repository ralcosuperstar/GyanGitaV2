import { motion } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const handleScrollToMood = () => {
    const moodSection = document.getElementById('mood-section');
    if (moodSection) {
      moodSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16"
    >
      {/* Main Content Container */}
      <div className="relative w-full max-w-3xl mx-auto">
        {/* Animated Frame */}
        <motion.div
          className="absolute -inset-4 sm:-inset-6 md:-inset-8 rounded-[60px] sm:rounded-[80px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Frame Layers */}
          <div className="absolute inset-0 rounded-[60px] sm:rounded-[80px] bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="absolute inset-0 rounded-[60px] sm:rounded-[80px] border-[3px] border-primary/20" />
          <div className="absolute inset-0 rounded-[60px] sm:rounded-[80px] border-2 border-primary/10 blur-[2px]" />

          {/* Glowing Border Effect */}
          <motion.div 
            className="absolute inset-0 rounded-[60px] sm:rounded-[80px] border-[3px] border-primary/40"
            style={{
              boxShadow: '0 0 15px var(--primary), inset 0 0 15px var(--primary)',
            }}
            animate={{
              opacity: [0.4, 1, 0.4],
              boxShadow: [
                '0 0 10px var(--primary), inset 0 0 10px var(--primary)',
                '0 0 20px var(--primary), inset 0 0 20px var(--primary)',
                '0 0 10px var(--primary), inset 0 0 10px var(--primary)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Moving Light Effect */}
          <motion.div
            className="absolute inset-0 rounded-[60px] sm:rounded-[80px] overflow-hidden"
            style={{ clipPath: 'inset(0 0 0 0 round 60px)' }}
          >
            <motion.div
              className="absolute w-[10px] h-[200%] bg-gradient-to-b from-transparent via-primary/40 to-transparent rotate-45"
              animate={{
                left: ['-10%', '110%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 1
              }}
            />
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="relative bg-background/50 backdrop-blur-sm rounded-[52px] sm:rounded-[72px] p-8 sm:p-12 text-center">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full 
                      bg-primary/5 border border-primary/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm text-white/90 font-medium">Your Daily Spiritual Guide</span>
          </motion.div>

          {/* Main Question */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
              <span className="block leading-tight text-white/90">
                How are you feeling
                <span className="block mt-2 font-normal bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  right now?
                </span>
              </span>
            </h1>

            <p className="text-lg text-white/60 max-w-xl mx-auto font-light leading-relaxed">
              Let the ancient wisdom of the Bhagavad Gita guide you through your current emotional state
            </p>

            {/* CTA Button */}
            <motion.div 
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                className="px-8 py-6 text-lg font-normal
                        bg-primary/90 hover:bg-primary/80 border border-primary/30
                        shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={handleScrollToMood}
              >
                <Heart className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Choose Your Mood
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}