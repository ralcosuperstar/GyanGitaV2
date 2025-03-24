/**
 * VerseDisplay Component
 * Displays Bhagavad Gita verses based on selected mood with optimized animations
 */

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Book, ArrowRight, Share2 } from "lucide-react";
import { moods } from "@/lib/moods";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import VerseCard from "@/components/VerseCard";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "@/components/ShareDialog";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export default function VerseDisplay({ verses, selectedMood, isLoading, onChangeMood }: VerseDisplayProps) {
  const [selectedVerse, setSelectedVerse] = useState<VerseResponse | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const selectedMoodData = moods.find(m => m.id === selectedMood);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleShare = (verse: VerseResponse) => {
    setSelectedVerse(verse);
    setShowShareDialog(true);
  };

  const handleCopy = async (verse: VerseResponse) => {
    const verseId = `${verse.chapter}-${verse.verse}`;
    const textToCopy = `${verse.purohit?.et || verse.tej.et || verse.siva?.et || verse.tej.ht}\n\n${verse.slok}\n\n${verse.transliteration}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copied!",
        description: "Verse has been copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  if (!selectedMood) return null;

  if (isLoading) {
    return (
      <div className="relative" role="status" aria-label="Loading verses">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute top-40 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
        </div>

        {/* Loading Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-1.5 border border-primary/20 rounded-full text-sm font-medium text-primary/80 bg-primary/5 mb-4"
          >
            {selectedMoodData?.icon} Finding verses for {selectedMoodData?.label}
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Searching ancient wisdom for guidance on your current emotional state...
          </motion.p>
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
        transition={{ duration: 0.5 }}
        className="text-center py-16 px-6 rounded-xl bg-muted/30 border border-primary/10 max-w-xl mx-auto"
      >
        <div className="mb-6 text-primary/60">
          <RefreshCw className="w-16 h-16 mx-auto animate-spin-slow" />
        </div>
        <h3 className="text-xl font-medium mb-2">No verses found for this mood</h3>
        <p className="text-muted-foreground mb-6">
          We couldn't find any verses that match "{selectedMoodData?.label}". Please try another mood.
        </p>
        <Button 
          onClick={onChangeMood}
          variant="outline" 
          className="border-primary/20 hover:bg-primary/5"
        >
          <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
          Try Another Mood
        </Button>
      </motion.div>
    );
  }

  return (
    <div ref={containerRef} className="verses-container relative px-4 sm:px-6 max-w-[1920px] mx-auto" role="region" aria-label="Verse recommendations">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Verses Grid */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.2
            }
          }
        }}
        initial="hidden"
        animate="visible"
        className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
      >
        {verses.map((verse, index) => (
          <motion.div
            key={`${verse.chapter}-${verse.verse}`}
            variants={{
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
            }}
            className="h-full"
          >
            <VerseCard
              verse={verse}
              showActions={true}
              onShare={() => handleShare(verse)}
              onCopy={() => handleCopy(verse)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Single Action Buttons Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
      >
        <Button
          variant="outline"
          size="lg"
          className="h-14 px-8 group relative before:absolute before:inset-0 before:rounded-md before:border before:border-primary/50 before:animate-[border-glow_4s_ease-in-out_infinite]"
          onClick={onChangeMood}
        >
          <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
          Change Mood
        </Button>
        <Button
          size="lg"
          className="h-14 px-8 bg-primary/90 hover:bg-primary group relative
                     before:absolute before:inset-0 before:rounded-md before:border before:border-primary/50
                     before:animate-[border-glow_4s_ease-in-out_infinite]
                     after:absolute after:inset-0 after:rounded-md after:border-2 after:border-primary/20
                     after:animate-[border-glow_4s_ease-in-out_infinite_0.5s]"
          onClick={() => setLocation("/browse")}
        >
          Explore More
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </motion.div>

      {/* Dialogs */}
      <AnimatePresence>
        {selectedVerse && (
          <ShareDialog
            verse={selectedVerse}
            open={showShareDialog}
            onOpenChange={setShowShareDialog}
          />
        )}
      </AnimatePresence>

      <Dialog open={!!selectedVerse && !showShareDialog} onOpenChange={() => setSelectedVerse(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair text-foreground">
              Chapter {selectedVerse?.chapter}, Verse {selectedVerse?.verse}
            </DialogTitle>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
                English
              </span>
              <span className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
                Sanskrit
              </span>
            </div>
          </DialogHeader>

          <div className="mt-8 space-y-8">
            <div className="space-y-6">
              <div className="bg-card rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  English Translation
                </h3>
                <p className="text-xl leading-relaxed text-foreground">
                  {selectedVerse?.tej.et}
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2 text-foreground">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Sanskrit Text
              </h3>
              <div className="space-y-4">
                <p className="text-2xl font-sanskrit leading-relaxed text-foreground">
                  {selectedVerse?.slok}
                </p>
                <p className="text-lg italic text-foreground/80">
                  {selectedVerse?.transliteration}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}