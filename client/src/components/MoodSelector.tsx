import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { moods } from "@/lib/moods";

interface MoodSelectorProps {
  onSelect: (moodId: string) => void;
  selectedMood: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

export default function MoodSelector({ onSelect, selectedMood }: MoodSelectorProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <span className="text-lg sm:text-xl text-white/60">
          Select how you're feeling to receive personalized guidance from the Gita
        </span>
      </motion.div>

      <motion.div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {moods.map((mood) => (
          <motion.div
            key={mood.id}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { type: "spring", stiffness: 400 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className={`cursor-pointer backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 
                       hover:bg-white/10 hover:border-primary/20 transition-all duration-300 overflow-hidden relative group
                       ${selectedMood === mood.id ? 'ring-2 ring-primary bg-white/10' : ''}`}
              onClick={() => onSelect(mood.id)}
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardContent className="p-6 text-center relative z-10">
                <div className="text-4xl mb-4 transform transition-transform group-hover:scale-110 duration-300">
                  {mood.icon}
                </div>
                <h3 className="font-medium text-lg mb-2 text-white/90 group-hover:text-primary transition-colors">
                  {mood.label}
                </h3>
                <p className="text-sm text-white/60">
                  {mood.description}
                </p>

                {/* Sacred Geometry Accent */}
                <div className="absolute -z-10 inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,var(--primary)_25%,transparent_50%)]" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}