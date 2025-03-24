import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { generateVerseKey, getChapters, getVerseByChapterAndNumber, type Chapter, type Verse } from "@/lib/data";
import VerseModal from "@/components/VerseModal";
import SEO from '@/components/SEO';

export default function Browse() {
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedVerse, setSelectedVerse] = useState<string>("");
  const [selectedGridChapter, setSelectedGridChapter] = useState<number | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const versesGridRef = useRef<HTMLDivElement>(null);

  // Load chapters data
  const { data: chapters } = useQuery<Chapter[]>({
    queryKey: ['/api/chapters'],
    queryFn: () => getChapters(),
    staleTime: Infinity,
  });

  // Load verse data when selected
  const { data: verse } = useQuery<Verse | null>({
    queryKey: [generateVerseKey(Number(selectedChapter), Number(selectedVerse))],
    queryFn: async () => {
      if (!selectedChapter || !selectedVerse) return null;
      return getVerseByChapterAndNumber(Number(selectedChapter), Number(selectedVerse));
    },
    enabled: !!(selectedChapter && selectedVerse),
  });

  // Handle verse selection
  const handleVerseSelect = (chapter: string, verse: string) => {
    setSelectedChapter(chapter);
    setSelectedVerse(verse);
  };

  // Handle chapter selection and scroll to grid
  const handleChapterSelect = (chapterNumber: number) => {
    setSelectedGridChapter(chapterNumber);
    // Use requestAnimationFrame to ensure the grid is rendered before scrolling
    requestAnimationFrame(() => {
      versesGridRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    });
  };

  // Generate grid items for selected chapter
  const gridItems = selectedGridChapter && chapters
    ? Array.from({ length: chapters.find(c => c.chapter_number === selectedGridChapter)?.verses_count || 0 })
        .map((_, i) => ({
          verseNumber: i + 1,
          chapterNumber: selectedGridChapter
        }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <SEO title="Browse Bhagavad Gita Verses" />
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background border-b">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

        <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 relative">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Browse Verses
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg sm:text-xl text-muted-foreground"
              >
                Explore the timeless wisdom of the Bhagavad Gita through our comprehensive verse collection
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="pt-4"
              >
                <Button
                  size="lg"
                  className="bg-primary/90 hover:bg-primary shadow-lg hover:shadow-xl transition-all duration-300 
                           group relative overflow-hidden h-12 sm:h-14 px-8 rounded-full"
                  onClick={() => {
                    const chaptersSection = document.querySelector('#chapters-grid');
                    if (chaptersSection) {
                      chaptersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Exploring
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {selectedGridChapter === null ? (
          // Chapters Grid
          <div id="chapters-grid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {chapters?.map((chapter) => (
              <motion.div
                key={chapter.chapter_number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-playfair">Chapter {chapter.chapter_number}</CardTitle>
                      <span className="text-sm text-primary/70">{chapter.verses_count} verses</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h3 className="font-medium text-lg mb-2 text-primary">
                        {chapter.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {chapter.translation}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedChapter(
                          expandedChapter === chapter.chapter_number ? null : chapter.chapter_number
                        )}
                      >
                        {expandedChapter === chapter.chapter_number ? (
                          <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
                        ) : (
                          <>Show More <ChevronDown className="ml-2 h-4 w-4" /></>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChapterSelect(chapter.chapter_number)}
                      >
                        <Grid className="h-4 w-4 mr-2" />
                        View Verses
                      </Button>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedChapter === chapter.chapter_number && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4 pt-4"
                        >
                          {chapter.meaning?.en && (
                            <div className="border-t border-border/50 pt-4">
                              <h4 className="text-sm font-medium text-primary/80 uppercase tracking-wider mb-2">
                                Meaning
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {chapter.meaning.en}
                              </p>
                            </div>
                          )}

                          {chapter.summary?.en && (
                            <div className="border-t border-border/50 pt-4">
                              <h4 className="text-sm font-medium text-primary/80 uppercase tracking-wider mb-2">
                                Summary
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {chapter.summary.en}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          // Verses Grid
          <div ref={versesGridRef}>
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

            <div className="grid gap-4 grid-cols-4 sm:grid-cols-8 md:grid-cols-10">
              {gridItems.map((item) => (
                <motion.button
                  key={item.verseNumber}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-12 w-12 rounded-md border border-input hover:bg-primary/5 hover:border-primary/50"
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