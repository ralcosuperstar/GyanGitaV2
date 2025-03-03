import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/language-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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

  const { data: dailyVerse, isLoading: isDailyLoading } = useQuery({
    queryKey: ['/api/verse/daily'],
    queryFn: async () => {
      const response = await fetch('/api/verse/daily');
      if (!response.ok) throw new Error('Failed to fetch daily verse');
      return response.json();
    }
  });

  const { data: popularVerses, isLoading: isPopularLoading } = useQuery({
    queryKey: ['/api/verses/popular'],
    queryFn: async () => {
      const response = await fetch('/api/verses/popular');
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
    // You could add a toast notification here
  };

  const renderVerseCard = (verse: any) => (
    <Card className="bg-white/5 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <p className="text-lg font-sanskrit leading-relaxed">{verse.slok}</p>
          <p className="text-sm text-muted-foreground italic">{verse.transliteration}</p>
        </div>

        <div>
          <p className="text-base leading-relaxed">{verse.tej.ht}</p>
          {verse.tej.et && (
            <p className="mt-2 text-sm text-muted-foreground">{verse.tej.et}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(verse.slok)}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare(verse)}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <Skeleton className="h-[300px] w-full" />
  );

  return (
    <div className={className}>
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-8">
          <TabsTrigger value="daily" className="text-lg">
            {t('home.sections.daily')}
          </TabsTrigger>
          <TabsTrigger value="popular" className="text-lg">
            {t('home.sections.popular')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {isDailyLoading ? <LoadingSkeleton /> : dailyVerse && renderVerseCard(dailyVerse)}
          </motion.div>
        </TabsContent>

        <TabsContent value="popular" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {isPopularLoading ? (
              Array(3).fill(null).map((_, i) => <LoadingSkeleton key={i} />)
            ) : (
              popularVerses?.map((verse: any) => (
                <motion.div
                  key={`${verse.chapter}-${verse.verse}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {renderVerseCard(verse)}
                </motion.div>
              ))
            )}
          </motion.div>
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