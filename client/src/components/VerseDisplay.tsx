/**
 * VerseDisplay Component
 * 
 * Displays Bhagavad Gita verses based on selected mood with optimized animations,
 * loading states, and accessibility features.
 */

import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter"; // Replace react-router-dom with wouter
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, Book, Share2, Copy, Bookmark, Check } from "lucide-react";
import { moods } from "@/lib/moods";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "@/components/ShareDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useQuery, useQueryClient } from '@tanstack/react-query';


// Animation variants refined for smoother transitions
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.48, 0.15, 0.25, 0.96]
    }
  }),
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.95
  }
};

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
  isPremiumUser: boolean; // Added prop for premium status
}


export default function VerseDisplay({ verses, selectedMood, isLoading, isPremiumUser }: VerseDisplayProps) {
  const [, navigate] = useLocation(); // Use wouter's useLocation hook
  const [selectedVerse, setSelectedVerse] = useState<VerseResponse | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copiedVerseId, setCopiedVerseId] = useState<string | null>(null);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<string>>(new Set());
  const selectedMoodData = moods.find(m => m.id === selectedMood);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's bookmarks
  const { data: userBookmarks } = useQuery({
    queryKey: ['/api/user/bookmarks'],
    queryFn: async () => {
      const response = await fetch('/api/user/bookmarks');
      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized case
          return new Set();
        }
        throw new Error('Failed to fetch bookmarks');
      }
      const data = await response.json();
      return new Set(data.map((b: any) => `${b.chapter}-${b.verse}`));
    }
  });

  useEffect(() => {
    if (userBookmarks) {
      setBookmarkedVerses(userBookmarks);
    }
  }, [userBookmarks]);

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
    const isCurrentlyBookmarked = bookmarkedVerses.has(verseId);

    try {
      // Trigger vibration feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      const response = await fetch('/api/bookmarks', {
        method: isCurrentlyBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chapter: Number(verse.chapter),
          verse: Number(verse.verse)
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update bookmark');
      }

      // Update local state optimistically
      const newBookmarks = new Set(bookmarkedVerses);
      if (isCurrentlyBookmarked) {
        newBookmarks.delete(verseId);
      } else {
        newBookmarks.add(verseId);
      }
      setBookmarkedVerses(newBookmarks);

      // Invalidate queries to refetch bookmarks
      queryClient.invalidateQueries({ queryKey: ['/api/user/bookmarks'] });

      toast({
        title: isCurrentlyBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
        description: isCurrentlyBookmarked ? "Verse removed from your bookmarks" : "Verse saved to your bookmarks",
        duration: 2000,
      });
    } catch (err) {
      console.error('Bookmark error:', err);
      toast({
        title: "Action failed",
        description: err instanceof Error ? err.message : "Please try again later",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    //No GSAP animation in this version.
  }, [verses]);

  if (!selectedMood) return null;

  if (isLoading) {
    return (
      <div className="relative" role="status" aria-label="Loading verses">
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

  if (!verses?.length) {
    return (
      <motion.div
        className="text-center py-16 px-6 rounded-xl bg-muted/30 border border-primary/10 max-w-xl mx-auto"
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
    <div ref={containerRef} className="verses-container relative px-4 sm:px-6 max-w-[1920px] mx-auto" role="region" aria-label="Verse recommendations">
      {/* Background gradients */}
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
        <h2 className="text-3xl sm:text-4xl font-playfair font-semibold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
          Verses for when you feel {selectedMoodData?.label}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
          {selectedMoodData?.description}
        </p>
      </motion.div>

      {/* Verses Grid */}
      <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {verses.map((verse, index) => {
          const verseId = `${verse.chapter}-${verse.verse}`;
          const isCopied = copiedVerseId === verseId;
          const isBookmarked = bookmarkedVerses.has(verseId);

          // Get the best available English translation, prioritizing Purohit's
          const englishTranslation = verse.purohit?.et || verse.tej.et || verse.siva?.et || verse.tej.ht;

          return (
            <motion.div
              key={verseId}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={index}
              className="flex"
            >
              <Card className="w-full overflow-hidden bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-xl relative group">
                <CardContent className="p-6 flex flex-col h-full relative">
                  {/* Decorative border effect */}
                  <div className="absolute inset-0 border border-primary/10 rounded-lg pointer-events-none"></div>
                  <div className="absolute inset-[1px] border border-primary/5 rounded-lg pointer-events-none"></div>

                  {/* Chapter and Verse Info */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
                      Ch {verse.chapter}
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
                      V {verse.verse}
                    </div>
                  </div>

                  {/* English Translation - Primary Focus */}
                  <div className="flex-grow mb-6">
                    <p className="text-xl sm:text-2xl leading-relaxed text-foreground">
                      {englishTranslation}
                    </p>
                  </div>

                  {/* Sanskrit Text */}
                  <div className="pt-4 border-t border-primary/10">
                    <p className="font-sanskrit text-base leading-relaxed line-clamp-2 mb-1 text-foreground">
                      {verse.slok}
                    </p>
                    <p className="text-sm italic text-foreground opacity-90 line-clamp-1">
                      {verse.transliteration}
                    </p>
                  </div>

                  {/* Premium Features Teaser */}
                  {!isPremiumUser && (
                    <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-primary mb-1">Unlock Premium Features</h4>
                          <p className="text-sm text-muted-foreground">
                            Get expert commentary, multiple translations, and personalized insights
                          </p>
                        </div>
                        <Button
                          variant="default"
                          className="ml-4 whitespace-nowrap"
                          onClick={() => navigate('/pricing')}
                        >
                          Go Premium
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="pt-6 mt-4 border-t border-primary/10">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedVerse(verse)}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm font-medium"
                      >
                        <Book className="h-4 w-4" />
                        Read More
                      </motion.button>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleBookmark(verse)}
                        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-colors text-sm font-medium ${
                          isBookmarked
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'bg-primary/10 hover:bg-primary/20'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleCopy(verse)}
                        className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-green-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleShare(verse)}
                        className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </motion.button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Share Dialog */}
      {selectedVerse && (
        <ShareDialog
          verse={selectedVerse}
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
        />
      )}

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