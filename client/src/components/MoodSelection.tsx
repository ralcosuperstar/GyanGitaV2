import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { moods } from '@/lib/moods';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MoodSelectionProps = {
  className?: string;
};

export default function MoodSelection({ className = "" }: MoodSelectionProps) {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setIsAnimating(true);

    // Simulate a loading effect, then navigate
    setTimeout(() => {
      navigate(`/mood/${moodId}`);
    }, 600);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const moodVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    hover: { 
      y: -5,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)"
    },
    tap: { 
      scale: 0.95,
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.05)"
    },
    selected: {
      scale: [1, 1.05, 1],
      boxShadow: "0px 0px 0px 2px rgba(255, 127, 80, 0.7)",
      transition: {
        duration: 0.3
      }
    }
  };

  // Show only a subset of moods on the homepage
  const homepageMoods = moods.slice(0, 8);

  return (
    <div className={className}>
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {homepageMoods.map((mood) => (
          <motion.div
            key={mood.id}
            variants={moodVariants}
            whileHover="hover"
            whileTap="tap"
            animate={selectedMood === mood.id ? "selected" : "visible"}
          >
            <Card 
              className={cn(
                "cursor-pointer overflow-hidden border transition-all h-full",
                selectedMood === mood.id ? "border-primary/50" : "",
                isAnimating && selectedMood === mood.id ? "animate-pulse" : ""
              )}
              onClick={() => handleMoodSelect(mood.id)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center h-full">
                <div className="text-3xl mb-2">
                  {mood.icon}
                </div>
                <h3 className="font-medium mb-1">{t(`moods.${mood.id}.label`) || mood.label}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {t(`moods.${mood.id}.description`) || mood.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}