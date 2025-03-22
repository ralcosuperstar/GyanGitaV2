import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const handleScrollToMood = () => {
    const moodSection = document.getElementById('mood-section');
    if (moodSection) {
      moodSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] px-4">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          How are you feeling
          <span className="block mt-2 text-primary">
            right now?
          </span>
        </motion.h1>

        <motion.p
          className="text-lg text-gray-400 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Select your current mood and discover timeless Gita verses that will
          guide you through this moment
        </motion.p>

        <motion.div
          className="pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="ghost"
            size="lg"
            className="text-primary hover:text-primary/80 hover:bg-primary/10"
            onClick={handleScrollToMood}
          >
            Select Your Mood
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
