/**
 * VerseDisplay Component
 * Displays Bhagavad Gita verses with optimized performance and animations
 */

import { useState, memo } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { moods } from "@/lib/moods";
import { motion } from "framer-motion";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import VerseCard from "@/components/VerseCard";

// Optimized animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
};

interface VerseResponse {
  slok: string;
  transliteration: string;
  tej: {
    ht: string;
    et: string;
  };
  siva?: {
    et: string;
  };
  purohit?: {
    et: string;
  };
  chinmay?: {
    hc: string;
  };
  chapter: number;
  verse: number;
}

interface VerseDisplayProps {
  verses: VerseResponse[] | null;
  selectedMood: string | null;
  isLoading: boolean;
  onChangeMood: () => void;
}

const VerseDisplay = memo(({ verses, selectedMood, isLoading, onChangeMood }: VerseDisplayProps) => {
  const selectedMoodData = moods.find(m => m.id === selectedMood);

  if (!selectedMood) return null;

  if (isLoading) {
    return (
      <div className="relative space-y-8" role="status" aria-label="Loading verses">
        {/* Header */}
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-1.5 border border-primary/20 rounded-full text-sm font-medium text-primary/80 bg-primary/5 mb-4"
          >
            {selectedMoodData?.icon} Finding verses for {selectedMoodData?.label}
          </motion.div>
        </div>

        {/* Loading Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(3).fill(null).map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <SkeletonCard variant="verse" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (!verses?.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 rounded-xl bg-muted/30 border border-primary/10 max-w-xl mx-auto"
      >
        <div className="mb-6 text-primary/60">
          <RefreshCw className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-medium mb-2">No verses found</h3>
        <p className="text-muted-foreground mb-6">
          We couldn't find any verses for "{selectedMoodData?.label}". Please try another mood.
        </p>
        <Button 
          variant="outline" 
          className="border-primary/20 hover:bg-primary/5"
          onClick={onChangeMood}
        >
          <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
          Try Another Mood
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8" role="region" aria-label="Verse recommendations">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center px-4 py-1.5 border border-primary/20 rounded-full text-sm font-medium text-primary/80 bg-primary/5 mb-4">
          {selectedMoodData?.icon} Guidance for {selectedMoodData?.label}
        </div>
        <h2 className="text-3xl sm:text-4xl font-medium mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          Verses for when you feel {selectedMoodData?.label}
        </h2>
        <div className="text-muted-foreground max-w-2xl mx-auto">
          {selectedMoodData?.description}
        </div>
      </motion.div>

      {/* Verses Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {verses.map((verse) => (
          <motion.div
            key={`${verse.chapter}-${verse.verse}`}
            variants={itemVariants}
            className="h-full"
          >
            <VerseCard
              verse={verse}
              showActions={true}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});

VerseDisplay.displayName = 'VerseDisplay';

export default VerseDisplay;