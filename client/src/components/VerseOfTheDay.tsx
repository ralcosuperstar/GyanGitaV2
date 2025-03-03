import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { motion } from "framer-motion";
import ShareDialog from "@/components/ShareDialog";
import { useState } from "react";

interface VerseOfTheDayProps {
  className?: string;
}

export default function VerseOfTheDay({ className }: VerseOfTheDayProps) {
  const { t } = useLanguage();
  const [showShareDialog, setShowShareDialog] = useState(false);

  const { data: verse, isLoading } = useQuery({
    queryKey: ['/api/verse/daily'],
    queryFn: async () => {
      const response = await fetch('/api/verse/daily');
      if (!response.ok) {
        throw new Error('Failed to fetch daily verse');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <CardHeader className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-6 bg-muted rounded w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-20 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!verse) return null;

  return (
    <>
      <Card className={`group transition-all hover:shadow-lg ${className}`}>
        <CardHeader className="bg-primary/5 transition-colors group-hover:bg-primary/10">
          <CardTitle className="font-playfair text-xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {t('verse.verseNumber', { chapter: verse.chapter, verse: verse.verse })}
            </motion.span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold text-primary mb-3">{t('verse.sanskrit')}</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-lg font-sanskrit leading-relaxed break-words">{verse.slok}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-primary mb-3">{t('verse.translation')}</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="leading-relaxed break-words">{verse.tej.et}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 border-t flex justify-end"
          >
            <Button
              variant="outline"
              onClick={() => setShowShareDialog(true)}
              className="gap-2 transition-transform hover:scale-105"
            >
              <Share2 className="h-4 w-4" />
              {t('verse.share')}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </>
  );
}
