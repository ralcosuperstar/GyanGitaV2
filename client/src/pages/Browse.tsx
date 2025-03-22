import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid, ArrowLeft } from "lucide-react";
import VerseCard from "@/components/VerseCard";
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { generateVerseKey, getChapters, getVerseByChapterAndNumber, type Chapter, type Verse } from "@/lib/data";
import VerseModal from "@/components/VerseModal";

export default function Browse() {
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedVerse, setSelectedVerse] = useState<string>("");
  const [selectedGridChapter, setSelectedGridChapter] = useState<number | null>(null);

  // Reset scroll position when chapter changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedGridChapter]);

  // Load chapters with minimal data
  const { data: chapters, isLoading: isLoadingChapters } = useQuery<Chapter[]>({
    queryKey: ['/api/chapters'],
    queryFn: () => getChapters(),
    staleTime: Infinity, // Chapters data doesn't change
  });

  // Load verse with optimized caching
  const { data: verse, isLoading: isLoadingVerse } = useQuery<Verse | null>({
    queryKey: [generateVerseKey(Number(selectedChapter), Number(selectedVerse))],
    queryFn: async () => {
      if (!selectedChapter || !selectedVerse) return null;
      return getVerseByChapterAndNumber(Number(selectedChapter), Number(selectedVerse));
    },
    enabled: !!(selectedChapter && selectedVerse),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const handleVerseSelect = (chapter: string, verse: string) => {
    setSelectedChapter(chapter);
    setSelectedVerse(verse);
  };

  // Memoize grid items
  const gridItems = useMemo(() => {
    if (!selectedGridChapter || !chapters) return [];
    const chapterInfo = chapters.find(c => c.chapter_number === selectedGridChapter);
    if (!chapterInfo) return [];

    return Array.from({ length: chapterInfo.verses_count }).map((_, i) => ({
      verseNumber: i + 1,
      chapterNumber: selectedGridChapter
    }));
  }, [selectedGridChapter, chapters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <motion.h1
              className="text-4xl font-playfair font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Browse Verses
              </span>
            </motion.h1>
            <motion.p
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Explore the timeless wisdom of the Bhagavad Gita
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {selectedGridChapter === null ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {chapters?.map((chapter) => (
              <motion.div
                key={chapter.chapter_number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  className="cursor-pointer hover:border-primary transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group relative overflow-hidden"
                  onClick={() => setSelectedGridChapter(chapter.chapter_number)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-playfair">Chapter {chapter.chapter_number}</CardTitle>
                      <span className="text-sm text-primary/70">{chapter.verses_count} verses</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">
                      {chapter.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {chapter.name_meaning}
                    </p>
                    <div className="flex items-center text-sm text-primary/70">
                      <Grid className="h-4 w-4 mr-2" />
                      View Verses
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setSelectedGridChapter(null)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Chapters
              </Button>

              <div className="text-sm text-muted-foreground">
                Chapter {selectedGridChapter} • {
                  chapters?.find(c => c.chapter_number === selectedGridChapter)?.verses_count
                } verses
              </div>
            </div>

            <div className="grid gap-4 grid-cols-6 sm:grid-cols-8 md:grid-cols-10">
              {gridItems.map((item) => (
                <motion.button
                  key={item.verseNumber}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 17,
                    delay: item.verseNumber * 0.02
                  }}
                  className={cn(
                    "h-12 w-12 rounded-md border border-input hover:bg-primary/5",
                    "flex items-center justify-center text-sm font-medium",
                    "transition-colors hover:border-primary/50"
                  )}
                  onClick={() => handleVerseSelect(
                    item.chapterNumber.toString(), 
                    item.verseNumber.toString()
                  )}
                >
                  {item.verseNumber}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Verse Modal */}
        <VerseModal
          verse={verse}
          open={!!verse}
          onOpenChange={() => {
            setSelectedChapter("");
            setSelectedVerse("");
          }}
        />
      </div>
    </div>
  );
}