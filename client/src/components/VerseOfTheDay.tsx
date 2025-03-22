/**
 * VerseDisplay Component
 * 
 * Displays Bhagavad Gita verses with improved readability and contrast
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Book } from "lucide-react";
import { motion } from "framer-motion";
import ShareDialog from "@/components/ShareDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getRandomVerse, type Verse } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VerseOfTheDayProps {
  className?: string;
}

export default function VerseOfTheDay({ className }: VerseOfTheDayProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [activeVerse, setActiveVerse] = useState<Verse | null>(null);
  const [copiedVerseId, setCopiedVerseId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch one random verse for Today's Verse
  const { data: todayVerse, isLoading: isTodayLoading } = useQuery<Verse>({
    queryKey: ['verse-of-day'],
    queryFn: getRandomVerse
  });

  // Fetch three random verses for Popular Verses
  const { data: popularVerses, isLoading: isPopularLoading } = useQuery<Verse[]>({
    queryKey: ['popular-verses'],
    queryFn: async () => {
      const verses = [];
      for (let i = 0; i < 3; i++) {
        const verse = await getRandomVerse();
        if (verse) verses.push(verse);
      }
      return verses;
    }
  });

  const handleShare = (verse: Verse) => {
    setActiveVerse(verse);
    setShowShareDialog(true);
  };

  const handleShowDetails = (verse: Verse) => {
    setActiveVerse(verse);
    setShowDetailDialog(true);
  };

  const handleCopy = async (verse: Verse) => {
    const verseId = `${verse.chapter}-${verse.verse}`;
    // Prioritize English translations
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

  const renderVerse = (verse: Verse) => {
    const verseId = `${verse.chapter}-${verse.verse}`;
    const isCopied = copiedVerseId === verseId;
    // Prioritize English translations
    const englishTranslation = verse.purohit?.et || verse.tej.et || verse.siva?.et || verse.tej.ht;

    return (
      <div className="bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-primary/10 hover:border-primary/20">
        <div className="p-6 flex flex-col h-full">
          {/* Chapter and Verse Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
                Ch {verse.chapter}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
                V {verse.verse}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(verse)}
                className="h-9 w-9 p-0 rounded-full hover:bg-primary/10"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(verse)}
                className="h-9 w-9 p-0 rounded-full hover:bg-primary/10"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow space-y-6">
            {/* English Translation - Primary Focus */}
            <div>
              <p className="text-xl sm:text-2xl leading-relaxed text-foreground">
                {englishTranslation}
              </p>
            </div>

            {/* Sanskrit Text */}
            <div className="pt-4 border-t border-primary/10">
              <p className="font-sanskrit text-base leading-relaxed line-clamp-2 mb-2 text-foreground">
                {verse.slok}
              </p>
              <p className="text-base italic text-foreground opacity-90 line-clamp-1">
                {verse.transliteration}
              </p>
            </div>
          </div>

          {/* Read More Button */}
          <Button
            className="w-full mt-6 bg-primary/20 hover:bg-primary/30 text-primary font-medium text-base"
            onClick={() => handleShowDetails(verse)}
          >
            <Book className="h-4 w-4 mr-2" />
            Read Full Verse
          </Button>
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6 bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-primary/10">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );

  return (
    <div className={className}>
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-12 items-center bg-muted/50 backdrop-blur-sm rounded-lg p-1">
          <TabsTrigger 
            value="daily"
            className="flex-1 h-10 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            Today's Verse
          </TabsTrigger>
          <TabsTrigger 
            value="popular"
            className="flex-1 h-10 data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            Popular Verses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-8">
          {isTodayLoading ? (
            <LoadingSkeleton />
          ) : todayVerse ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderVerse(todayVerse)}
            </motion.div>
          ) : null}
        </TabsContent>

        <TabsContent value="popular" className="mt-8">
          <div className="space-y-8">
            {isPopularLoading ? (
              Array(3).fill(null).map((_, i) => (
                <LoadingSkeleton key={i} />
              ))
            ) : popularVerses ? (
              popularVerses.map((verse) => (
                <motion.div
                  key={`${verse.chapter}-${verse.verse}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {renderVerse(verse)}
                </motion.div>
              ))
            ) : null}
          </div>
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      {activeVerse && (
        <ShareDialog
          verse={activeVerse}
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
        />
      )}

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-playfair text-foreground">
              Chapter {activeVerse?.chapter}, Verse {activeVerse?.verse}
            </DialogTitle>
            <DialogDescription>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
                  English
                </span>
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary">
                  Sanskrit
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
                  {activeVerse?.purohit?.et || activeVerse?.tej.et || activeVerse?.siva?.et || activeVerse?.tej.ht}
                </p>
              </div>

              {/* Sanskrit Text */}
              <div className="bg-card rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Sanskrit Text
                </h3>
                <p className="text-2xl font-sanskrit leading-relaxed text-foreground">
                  {activeVerse?.slok}
                </p>
                <p className="text-lg italic text-foreground opacity-90">
                  {activeVerse?.transliteration}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}