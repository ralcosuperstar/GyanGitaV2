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
      className="space-y-8 relative"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-primary/2 to-transparent opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="text-2xl sm:text-3xl text-white/90 font-light">
          How are you feeling today?
        </span>
      </motion.div>

      <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {moods.map((mood, index) => (
          <motion.div
            key={mood.id}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { type: "spring", stiffness: 400 }
            }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <Card
              className={`cursor-pointer backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 
                       hover:bg-white/10 hover:border-primary/20 transition-all duration-300 overflow-hidden relative
                       ${selectedMood === mood.id ? 'ring-2 ring-primary bg-white/10' : ''}`}
              onClick={() => onSelect(mood.id)}
            >
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,var(--primary)_25%,transparent_50%)] animate-spin-slow" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent" />
              </div>

              {/* Sacred Geometry Pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <pattern id={`sacred-pattern-${index}`} patternUnits="userSpaceOnUse" width="20" height="20">
                      <path d="M10,0 L10,20 M0,10 L20,10" stroke="currentColor" strokeWidth="0.5" className="text-primary"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#sacred-pattern-${index})`} />
                </svg>
              </div>

              <CardContent className="p-6 text-center relative z-10 flex flex-col items-center justify-center aspect-square">
                <motion.div 
                  className="text-4xl transform transition-transform group-hover:scale-110 duration-300"
                  animate={{ 
                    scale: selectedMood === mood.id ? [1, 1.1, 1] : 1
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: selectedMood === mood.id ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                >
                  {mood.icon}
                </motion.div>
                <h3 className="mt-3 font-medium text-sm text-white/90 group-hover:text-primary transition-colors">
                  {mood.label}
                </h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}