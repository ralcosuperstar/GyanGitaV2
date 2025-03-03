import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/language-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
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
  };

  const renderVerse = (verse: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border"
    >
      <div className="p-4 border-b bg-muted/50">
        <h3 className="font-medium flex items-center justify-between">
          <span>Chapter {verse.chapter}, Verse {verse.verse}</span>
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
        </h3>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="font-sanskrit text-lg leading-relaxed">
            {verse.slok}
          </div>
          <div className="text-sm text-muted-foreground italic">
            {verse.transliteration}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <p className="text-base leading-relaxed">
            {verse.tej?.ht}
          </p>
          {verse.tej?.et && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {verse.tej.et}
            </p>
          )}
        </div>

        {verse.chinmay?.hc && (
          <div className="pt-4 border-t text-sm text-muted-foreground">
            <p className="leading-relaxed">
              {verse.chinmay.hc}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-32" />
      <Skeleton className="h-20" />
    </div>
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
          {isDailyLoading ? (
            <LoadingSkeleton />
          ) : (
            dailyVerse && renderVerse(dailyVerse)
          )}
        </TabsContent>

        <TabsContent value="popular" className="mt-0 space-y-8">
          {isPopularLoading ? (
            <div className="space-y-8">
              {Array(3).fill(null).map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : (
            popularVerses?.map((verse: any) => renderVerse(verse))
          )}
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