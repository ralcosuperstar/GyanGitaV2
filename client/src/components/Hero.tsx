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
      className="relative min-h-screen flex items-center bg-[#0A0A0A]"
    >
      <div className="container max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4">
        {/* Content Section */}
        <div className="relative">
          {/* Content Border */}
          <motion.div
            className="absolute -inset-6 rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Border Layers */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/10 to-transparent" />
            <div className="absolute inset-0 rounded-3xl border-2 border-primary/20" />

            {/* Glowing Effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-primary/40"
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
          </motion.div>

          {/* Content */}
          <div className="relative space-y-6 p-6">
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Begin Your Spiritual Journey with GyanGita Today
            </motion.h1>

            <motion.p 
              className="text-lg text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Discover personalized verses, insightful commentaries, and a supportive community 
              to guide you on your path to spiritual growth and inner peace.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-primary/90 hover:bg-primary text-white px-8"
                onClick={handleScrollToMood}
              >
                <Heart className="mr-2 h-5 w-5" />
                Start Now
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-primary/20 hover:bg-primary/10"
                onClick={handleScrollToMood}
              >
                Explore Verses →
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Right side pattern/decoration */}
        <div className="hidden lg:flex items-center justify-center">
          <motion.div
            className="w-80 h-80 rounded-full border-2 border-primary/20"
            style={{
              background: 'radial-gradient(circle at center, var(--primary) 0%, transparent 70%)',
              opacity: 0.1
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    </section>
  );
}