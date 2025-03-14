/**
 * VerseDisplay Component
 * 
 * Displays Bhagavad Gita verses based on selected mood with optimized animations,
 * loading states, and accessibility features.
 */

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, Book } from "lucide-react";
import { moods } from "@/lib/moods";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Types for verse data structure
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
}

// Animation variants for consistent motion effects
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      type: "spring",
      stiffness: 200,
      damping: 25
    }
  })
};

export default function VerseDisplay({ verses, selectedMood, isLoading }: VerseDisplayProps) {
  const [selectedVerse, setSelectedVerse] = useState<VerseResponse | null>(null);
  const selectedMoodData = moods.find(m => m.id === selectedMood);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !verses?.length) return;

    // Create a GSAP timeline for smooth animations
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" }
    });

    // Animate the mood title with a fade-in effect
    tl.fromTo(
      ".mood-title",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8 }
    );

    // Add a subtle glow animation to the container
    gsap.to(".verses-container", {
      boxShadow: "0 0 30px rgba(var(--primary-rgb), 0.05)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    return () => {
      tl.kill();
      gsap.killTweensOf(".verses-container");
    };
  }, [verses]);

  if (!selectedMood) return null;

  // Loading state with skeleton UI
  if (isLoading) {
    return (
      <div className="relative" role="status" aria-label="Loading verses">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute top-40 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px] animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="text-center mb-12 mood-title">
          <h2 className="font-playfair text-3xl font-semibold mb-2">
            <span className="gradient-heading">
              {selectedMoodData?.icon} Finding verses for {selectedMoodData?.label}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Searching the ancient wisdom for guidance on your current emotional state...
          </p>
        </div>

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

  // No verses found state
  if (!verses?.length) {
    return (
      <motion.div 
        className="text-center py-16 px-6 rounded-xl bg-muted/30 border border-primary/10 max-w-xl mx-auto"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="mb-6 text-primary/60">
          <svg className="w-16 h-16 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M21 21L15.5 15.5M10 7V10M10 13V13.01M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-xl font-medium mb-2">No verses found for this mood</h3>
        <p className="text-muted-foreground mb-6">
          We couldn't find any verses for "{selectedMoodData?.label}" in our database. Please try another mood or check back later.
        </p>
        <Button 
          variant="outline" 
          className="border-primary/20 hover:bg-primary/5"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
          Try Another Mood
        </Button>
      </motion.div>
    );
  }

  return (
    <div ref={containerRef} className="verses-container relative" role="region" aria-label="Verse recommendations">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px] animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedMood}
            className="text-center mb-12 mood-title"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              className="inline-flex items-center px-4 py-1.5 border border-primary/20 rounded-full text-sm font-medium text-primary/80 bg-primary/5 mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 25 }}
            >
              {selectedMoodData?.icon} Guidance for {selectedMoodData?.label}
            </motion.div>
            <h2 className="font-playfair text-3xl font-semibold mb-3 gradient-heading">
              Verses for when you feel {selectedMoodData?.label}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {selectedMoodData?.description || "The Bhagavad Gita offers wisdom for every emotional state. Here are verses to guide you through this moment."}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {verses.map((verse, index) => (
            <motion.div 
              key={`${verse.chapter}-${verse.verse}-${index}`}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="flex"
            >
              <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="mb-4 text-sm text-muted-foreground">
                    Chapter {verse.chapter}, Verse {verse.verse}
                  </div>

                  {/* English Translation First */}
                  <div className="mb-6">
                    <p className="text-lg leading-relaxed">{verse.tej.et || verse.tej.ht}</p>
                  </div>

                  {/* Sanskrit Text */}
                  <div className="mb-6 pt-4 border-t">
                    <p className="text-base font-sanskrit leading-relaxed mb-2">{verse.slok}</p>
                    <p className="text-sm italic text-muted-foreground">{verse.transliteration}</p>
                  </div>

                  {/* View More Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setSelectedVerse(verse)}
                  >
                    <Book className="w-4 h-4 mr-2" />
                    View More Translations
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Translations Modal */}
      <Dialog open={!!selectedVerse} onOpenChange={() => setSelectedVerse(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Chapter {selectedVerse?.chapter}, Verse {selectedVerse?.verse}
            </DialogTitle>
            <DialogDescription>
              Multiple translations and interpretations
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* English Translations */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">English Translations</h4>
              {selectedVerse?.tej.et && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-base">{selectedVerse.tej.et}</p>
                  <p className="text-sm text-muted-foreground mt-2">- Tejomay Translation</p>
                </div>
              )}
              {selectedVerse?.siva?.et && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-base">{selectedVerse.siva.et}</p>
                  <p className="text-sm text-muted-foreground mt-2">- Sivananda Translation</p>
                </div>
              )}
              {selectedVerse?.purohit?.et && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-base">{selectedVerse.purohit.et}</p>
                  <p className="text-sm text-muted-foreground mt-2">- Purohit Translation</p>
                </div>
              )}
            </div>

            {/* Sanskrit and Hindi */}
            <div className="space-y-4 pt-6 border-t">
              <h4 className="text-lg font-medium">Original Text</h4>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-lg font-sanskrit mb-2">{selectedVerse?.slok}</p>
                <p className="text-sm italic">{selectedVerse?.transliteration}</p>
              </div>
              {selectedVerse?.tej.ht && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-base">{selectedVerse.tej.ht}</p>
                  <p className="text-sm text-muted-foreground mt-2">- Hindi Translation</p>
                </div>
              )}
            </div>

            {/* Commentary */}
            {selectedVerse?.chinmay?.hc && (
              <div className="space-y-4 pt-6 border-t">
                <h4 className="text-lg font-medium">Commentary</h4>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-base">{selectedVerse.chinmay.hc}</p>
                  <p className="text-sm text-muted-foreground mt-2">- Chinmaya Commentary</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}