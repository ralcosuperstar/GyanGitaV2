import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import ShareDialog from "@/components/ShareDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getRandomVerse, type Verse } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface VerseOfTheDayProps {
  className?: string;
}

export default function VerseOfTheDay({ className }: VerseOfTheDayProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
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

  const handleCopy = async (verse: Verse) => {
    const verseId = `${verse.chapter}-${verse.verse}`;
    const textToCopy = `${verse.slok}\n\n${verse.transliteration}\n\n${verse.tej.ht}`;

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

    return (
      <div className="bg-muted/50 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm">Chapter {verse.chapter}, Verse {verse.verse}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(verse)}
              className="h-8 w-8 p-0 relative"
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
              className="h-8 w-8 p-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Sanskrit Text */}
          <div className="space-y-4">
            <p className="text-2xl font-sanskrit leading-relaxed">
              {verse.slok}
            </p>
            <p className="text-base italic text-muted-foreground">
              {verse.transliteration}
            </p>
          </div>

          {/* Primary Translation */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-lg font-medium">Translation</h4>
            <p className="text-lg leading-relaxed">
              {verse.tej.ht}
            </p>
            {verse.tej.et && (
              <p className="text-base text-muted-foreground">
                {verse.tej.et}
              </p>
            )}
          </div>

          {/* Additional Translations & Commentary */}
          <Accordion type="single" collapsible className="w-full pt-4 border-t">
            {verse.siva?.et && (
              <AccordionItem value="siva">
                <AccordionTrigger className="text-sm">Additional Translation</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">{verse.siva.et}</p>
                </AccordionContent>
              </AccordionItem>
            )}
            {verse.purohit?.et && (
              <AccordionItem value="purohit">
                <AccordionTrigger className="text-sm">Alternative Translation</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">{verse.purohit.et}</p>
                </AccordionContent>
              </AccordionItem>
            )}
            {verse.chinmay?.hc && (
              <AccordionItem value="commentary">
                <AccordionTrigger className="text-sm">Commentary</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">{verse.chinmay.hc}</p>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );

  return (
    <div className={className}>
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="daily" className="flex-1">
            Today's Verse
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex-1">
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

      {activeVerse && (
        <ShareDialog
          verse={activeVerse}
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
        />
      )}
    </div>
  );
}