/**
 * VerseDisplay Component
 * Displays Bhagavad Gita verses based on selected mood with optimized animations,
 * loading states, and accessibility features.
 */

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Book } from "lucide-react";
import { moods } from "@/lib/moods";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import VerseCard from "@/components/VerseCard";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "@/components/ShareDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';


// Animation variants refined for smoother transitions
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
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

export default function VerseDisplay({ verses, selectedMood, isLoading }: VerseDisplayProps) {
  const [selectedVerse, setSelectedVerse] = useState<VerseResponse | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copiedVerseId, setCopiedVerseId] = useState<string | null>(null);
  const [favoriteVerses, setFavoriteVerses] = useState<Set<string>>(new Set());
  const selectedMoodData = moods.find(m => m.id === selectedMood);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch user's favorites
  const { data: userFavorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await fetch('/api/user/favorites');
      if (!response.ok) throw new Error('Failed to fetch favorites');
      const data = await response.json();
      return new Set(data.map((f: any) => `${f.chapter}-${f.verse}`));
    }
  });

  useEffect(() => {
    if (userFavorites) {
      setFavoriteVerses(userFavorites);
    }
  }, [userFavorites]);

  const handleShare = (verse: VerseResponse) => {
    setSelectedVerse(verse);
    setShowShareDialog(true);
  };

  const handleCopy = async (verse: VerseResponse) => {
    const verseId = `${verse.chapter}-${verse.verse}`;
    const textToCopy = `${verse.purohit?.et || verse.tej.et || verse.siva?.et || verse.tej.ht}\n\n${verse.slok}\n\n${verse.transliteration}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedVerseId(verseId);
      toast({
        title: "Copied!",
        description: "Verse has been copied to clipboard",
        duration: 2000,
      });

      setTimeout(() => {
        setCopiedVerseId(null);
      }, 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleBookmark = async (verse: VerseResponse) => {
    const verseId = `${verse.chapter}-${verse.verse}`;
    const isCurrentlyFavorited = favoriteVerses.has(verseId);

    try {
      const response = await fetch('/api/favorites', {
        method: isCurrentlyFavorited ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dummy-token' // In real app, use actual auth token
        },
        body: JSON.stringify({
          chapter: verse.chapter,
          verse: verse.verse
        })
      });

      if (!response.ok) throw new Error('Failed to update favorite');

      // Update local state
      const newFavorites = new Set(favoriteVerses);
      if (isCurrentlyFavorited) {
        newFavorites.delete(verseId);
      } else {
        newFavorites.add(verseId);
      }
      setFavoriteVerses(newFavorites);

      toast({
        title: isCurrentlyFavorited ? "Removed from favorites" : "Added to favorites",
        description: isCurrentlyFavorited ? "Verse removed from your favorites" : "Verse saved to your favorites",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Action failed",
        description: "Please try again later",
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
          We couldn't find any verses that match "{selectedMoodData?.label}". Please try another mood or check back later.
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
    <div ref={containerRef} className="verses-container relative px-4 sm:px-6 max-w-[1920px] mx-auto" role="region" aria-label="Verse recommendations">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="inline-flex items-center px-4 py-1.5 border border-primary/20 rounded-full text-sm font-medium text-primary/80 bg-primary/5 mb-4"
        >
          {selectedMoodData?.icon} Guidance for {selectedMoodData?.label}
        </motion.div>
        <h2 className="text-3xl sm:text-4xl font-medium mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
          Verses for when you feel {selectedMoodData?.label}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
          {selectedMoodData?.description}
        </p>
      </motion.div>

      {/* Verses Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
      >
        {verses.map((verse, index) => (
          <motion.div
            key={`${verse.chapter}-${verse.verse}`}
            variants={itemVariants}
            custom={index}
            className="flex"
          >
            <VerseCard 
              verse={verse}
              variant="compact"
              showActions={true}
              handleShare={handleShare}
              handleCopy={handleCopy}
              handleBookmark={handleBookmark}
              copiedVerseId={copiedVerseId}
              setCopiedVerseId={setCopiedVerseId}
              favoriteVerses={favoriteVerses}
              setFavoriteVerses={setFavoriteVerses}
              toast={toast}
            />
          </motion.div>
        ))}
      </motion.div>
      {/* Share Dialog */}
      <AnimatePresence>
        {selectedVerse && (
          <ShareDialog
            verse={selectedVerse}
            open={showShareDialog}
            onOpenChange={setShowShareDialog}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Modal Dialog */}
      <Dialog open={!!selectedVerse && !showShareDialog} onOpenChange={() => setSelectedVerse(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-playfair text-foreground">
              Chapter {selectedVerse?.chapter}, Verse {selectedVerse?.verse}
            </DialogTitle>
            <DialogDescription>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
                  English
                </span>
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
                  Sanskrit
                </span>
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
                  Commentary
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-8">
            {/* English Translation Section */}
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

              {(selectedVerse?.siva?.et || selectedVerse?.purohit?.et) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {selectedVerse?.siva?.et && (
                    <div className="bg-card rounded-lg p-4">
                      <p className="text-base text-foreground mb-2">{selectedVerse.siva.et}</p>
                      <p className="text-sm text-primary font-medium">Sivananda Translation</p>
                    </div>
                  )}
                  {selectedVerse?.purohit?.et && (
                    <div className="bg-card rounded-lg p-4">
                      <p className="text-base text-foreground mb-2">{selectedVerse.purohit.et}</p>
                      <p className="text-sm text-primary font-medium">Purohit Translation</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sanskrit Text Section */}
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

            {/* Commentary Section */}
            {selectedVerse?.chinmay?.hc && (
              <div className="bg-card rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Commentary
                </h3>
                <div className="prose prose-lg max-w-none">
                  <p className="text-base text-foreground whitespace-pre-wrap">
                    {selectedVerse.chinmay.hc}
                  </p>
                </div>
              </div>
            )}

            {/* Hindi Translation */}
            {selectedVerse?.tej.ht && (
              <div className="bg-card rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Hindi Translation
                </h3>
                <p className="text-lg text-foreground">
                  {selectedVerse.tej.ht}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}