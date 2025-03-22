import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from 'framer-motion';
import { generateVerseKey, getChapters, getVerseByChapterAndNumber, type Chapter, type Verse } from "@/lib/data";
import VerseModal from "@/components/VerseModal";
import ChapterCard from "@/components/ChapterCard";
import SEO from '@/components/SEO';
import { Helmet } from 'react-helmet-async';

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

  // Generate grid items for the selected chapter
  const gridItems = selectedGridChapter && chapters
    ? Array.from({ length: chapters.find(c => c.chapter_number === selectedGridChapter)?.verses_count || 0 })
        .map((_, i) => ({
          verseNumber: i + 1,
          chapterNumber: selectedGridChapter
        }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <SEO 
        title="Browse Bhagavad Gita Verses"
        description="Explore all 700+ verses of the Bhagavad Gita. Navigate through 18 chapters of profound wisdom, with multiple translations and expert commentary."
        keywords={[
          "Bhagavad Gita verses",
          "Gita chapters",
          "Sanskrit verses",
          "Krishna's teachings",
          "Hindu scripture browse",
          "spiritual text",
          "verse translations",
          "Gita commentary",
          "chapter meanings",
          "verse search"
        ]}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Chapter",
            "name": selectedGridChapter 
              ? `Chapter ${selectedGridChapter} - ${chapters?.find(c => c.chapter_number === selectedGridChapter)?.name}`
              : "Bhagavad Gita Chapters",
            "description": "Browse and explore the complete collection of Bhagavad Gita verses with translations and commentary",
            "isPartOf": {
              "@type": "Book",
              "name": "The Bhagavad Gita",
              "author": {
                "@type": "Person",
                "name": "Vyasa"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            }
          })}
        </script>
      </Helmet>

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
                <ChapterCard 
                  chapter={chapter}
                  onViewVerses={setSelectedGridChapter}
                />
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

            <div className="grid gap-4 grid-cols-4 sm:grid-cols-8 md:grid-cols-10">
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
                  className="h-12 w-12 rounded-md border border-input hover:bg-primary/5 flex items-center justify-center text-sm font-medium transition-colors hover:border-primary/50"
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