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

export default function VerseOfTheDay({ className }: VerseOfTheDayProps) {
  const { t } = useLanguage();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [activeVerse, setActiveVerse] = useState<any>(null);

  // Fetch today's verse
  const { data: dailyVerse, isLoading: isDailyLoading } = useQuery({
    queryKey: ['/api/verse/daily'],
    queryFn: async () => {
      const response = await fetch(`/api/verse/daily`);
      if (!response.ok) throw new Error('Failed to fetch daily verse');
      return response.json();
    }
  });

  // Fetch popular verses
  const { data: popularVerses, isLoading: isPopularLoading } = useQuery({
    queryKey: ['/api/verses/popular'],
    queryFn: async () => {
      const response = await fetch(`/api/verses/popular`);
      if (!response.ok) throw new Error('Failed to fetch popular verses');
      return response.json();
    }
  });

  const handleShare = (verse: any) => {
    setActiveVerse(verse);
    setShowShareDialog(true);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const renderVerse = (verse: any) => (
    <div key={`${verse.chapter}-${verse.verse}`} className="bg-card rounded-lg p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">
            Chapter {verse.chapter}, Verse {verse.verse}
          </h3>
          <p className="text-sm text-muted-foreground">Today's Verse</p>
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

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xl font-sanskrit leading-relaxed">
            {verse.slok}
          </p>
          <p className="text-sm text-muted-foreground italic">
            {verse.transliteration}
          </p>
        </div>

        <div className="pt-4 border-t space-y-4">
          <p className="text-base leading-relaxed">
            {verse.tej?.ht}
          </p>
          <p className="text-sm text-muted-foreground">
            {verse.tej?.et}
          </p>
        </div>
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
        <TabsList className="w-full mb-8">
          <TabsTrigger value="daily" className="flex-1 text-lg py-3">
            Today's Verse
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex-1 text-lg py-3">
            Popular Verses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-0">
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

        <TabsContent value="popular" className="mt-0">
          <div className="space-y-8">
            {isPopularLoading ? (
              Array(3).fill(null).map((_, i) => (
                <LoadingSkeleton key={i} />
              ))
            ) : popularVerses ? (
              popularVerses.map((verse: any) => (
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