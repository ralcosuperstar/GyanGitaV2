import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/language-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Share2, Copy } from "lucide-react";
import { motion } from "framer-motion";
import ShareDialog from "@/components/ShareDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface VerseOfTheDayProps {
  className?: string;
}

interface Verse {
  slok: string;
  transliteration: string;
  tej: {
    ht: string;
    et: string;
  };
  chapter: number;
  verse: number;
}

export default function VerseOfTheDay({ className }: VerseOfTheDayProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [activeVerse, setActiveVerse] = useState<Verse | null>(null);

  const { data: dailyVerse, isLoading: isDailyLoading } = useQuery<Verse>({
    queryKey: ['/api/verse/daily'],
    queryFn: async () => {
      const response = await fetch(`/api/verse/daily`);
      if (!response.ok) throw new Error('Failed to fetch daily verse');
      return response.json();
    }
  });

  const { data: popularVerses, isLoading: isPopularLoading } = useQuery<Verse[]>({
    queryKey: ['/api/verses/popular'],
    queryFn: async () => {
      const response = await fetch(`/api/verses/popular`);
      if (!response.ok) throw new Error('Failed to fetch popular verses');
      return response.json();
    }
  });

  const handleShare = (verse: Verse) => {
    setActiveVerse(verse);
    setShowShareDialog(true);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const renderVerse = (verse: Verse) => (
    <div className="bg-card/5 rounded-lg">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">browse.chapter {verse.chapter}, browse.verse {verse.verse}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(verse.slok)}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
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

      <div className="px-4 pb-4 text-center">
        <p className="text-2xl font-sanskrit leading-relaxed mb-2">
          {verse.slok}
        </p>
        <p className="text-base italic text-muted-foreground mb-6">
          {verse.transliteration}
        </p>
        <p className="text-base leading-relaxed">
          {verse.tej.ht}
        </p>
      </div>
    </div>
  );

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
          {isDailyLoading ? (
            <LoadingSkeleton />
          ) : dailyVerse ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderVerse(dailyVerse)}
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