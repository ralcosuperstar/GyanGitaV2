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
}


export default function VerseDisplay({ verses, selectedMood, isLoading }: VerseDisplayProps) {
  const [selectedVerse, setSelectedVerse] = useState<VerseResponse | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copiedVerseId, setCopiedVerseId] = useState<string | null>(null);
  const selectedMoodData = moods.find(m => m.id === selectedMood);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleShare = (verse: VerseResponse) => {
    setSelectedVerse(verse);
    setShowShareDialog(true);
  };

  const handleCopy = async (verse: VerseResponse) => {
    const verseId = `${verse.chapter}-${verse.verse}`;
    const textToCopy = `${verse.tej.et || verse.tej.ht}\n\n${verse.slok}\n\n${verse.transliteration}`;

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
    <div ref={containerRef} className="verses-container relative px-4 sm:px-6" role="region" aria-label="Verse recommendations">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
      </div>

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

      <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {verses.map((verse, index) => {
          const verseId = `${verse.chapter}-${verse.verse}`;
          const isCopied = copiedVerseId === verseId;

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
              <Card className="w-full overflow-hidden bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      Chapter {verse.chapter}, Verse {verse.verse}
                    </span>
                    <div className="flex gap-2">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleCopy(verse)}
                        className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </motion.button>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => handleShare(verse)}
                        className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors"
                      >
                        <Bookmark className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-lg sm:text-xl leading-relaxed">
                      {verse.tej.et || verse.tej.ht}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-primary/10">
                    <p className="font-sanskrit text-base leading-relaxed line-clamp-2 mb-1">
                      {verse.slok}
                    </p>
                    <p className="text-sm italic text-muted-foreground line-clamp-1">
                      {verse.transliteration}
                    </p>
                  </div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="mt-4"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-primary/5 hover:bg-primary/10 border-primary/20"
                      onClick={() => setSelectedVerse(verse)}
                    >
                      <Book className="w-4 h-4 mr-2" />
                      Read More
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {selectedVerse && (
        <ShareDialog
          verse={selectedVerse}
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
        />
      )}

      <Dialog open={!!selectedVerse && !showShareDialog} onOpenChange={() => setSelectedVerse(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Chapter {selectedVerse?.chapter}, Verse {selectedVerse?.verse}
            </DialogTitle>
            <DialogDescription>
              Translations and Commentary
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="translations" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="translations">Translations</TabsTrigger>
              <TabsTrigger value="commentary">Commentary & Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="translations" className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium">English Translation</h4>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-lg">{selectedVerse?.tej.et}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-lg font-medium">Sanskrit Text</h4>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xl font-sanskrit mb-2">{selectedVerse?.slok}</p>
                  <p className="text-base italic">{selectedVerse?.transliteration}</p>
                </div>
              </div>

              {(selectedVerse?.siva?.et || selectedVerse?.purohit?.et) && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-lg font-medium">Additional Translations</h4>
                  {selectedVerse?.siva?.et && (
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-base">{selectedVerse.siva.et}</p>
                      <p className="text-sm text-muted-foreground mt-2">- Sivananda Translation</p>
                    </div>
                  )}
                  {selectedVerse?.purohit?.et && (
                    <div className="p-4 rounded-lg bg-muted/50 mt-4">
                      <p className="text-base">{selectedVerse.purohit.et}</p>
                      <p className="text-sm text-muted-foreground mt-2">- Purohit Translation</p>
                    </div>
                  )}
                </div>
              )}

              {selectedVerse?.tej.ht && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-lg font-medium">Hindi Translation</h4>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-base">{selectedVerse.tej.ht}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="commentary" className="space-y-6">
              {selectedVerse?.chinmay?.hc ? (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Chinmaya Commentary</h4>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-base whitespace-pre-wrap">{selectedVerse.chinmay.hc}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No additional commentary available for this verse.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}