import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RefreshCw, Heart, Sparkles } from "lucide-react";
import MoodSelector from "@/components/MoodSelector";
import VerseDisplay from "@/components/VerseDisplay";
import VerseModal from "@/components/VerseModal";
import VerseOfTheDay from "@/components/VerseOfTheDay";
import { getVersesByMood, getVerseByChapterAndNumber, type Verse } from "@/lib/data";
import TestimonialsSection from "@/components/TestimonialsSection";
import CallToAction from "@/components/CallToAction";
import StatsSection from "@/components/StatsSection";
import USPSection from "@/components/USPSection";

// Floating Element Component
const FloatingElement = ({ className = "", delay = 0 }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: [0.1, 0.3, 0.1],
      scale: [0.8, 1, 0.8],
      rotate: [0, 180, 360]
    }}
    transition={{
      duration: 20,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  >
    <div className="w-72 h-72 rounded-full border border-primary/20 backdrop-blur-3xl" />
    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,var(--primary)_25%,transparent_50%)] opacity-10" />
  </motion.div>
);

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [deepLinkedVerse, setDeepLinkedVerse] = useState<Verse | null>(null);
  const [showVerseModal, setShowVerseModal] = useState(false);
  const verseSectionRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  // Handle deep linking and verse fetching logic (unchanged)
  useEffect(() => {
    const handleHashChange = async () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/verse/')) {
        const [, , chapter, verse] = hash.split('/');
        if (chapter && verse) {
          try {
            const verseData = await getVerseByChapterAndNumber(parseInt(chapter), parseInt(verse));
            if (verseData) {
              setDeepLinkedVerse(verseData);
              setShowVerseModal(true);
            }
          } catch (error) {
            console.error('Error loading verse:', error);
          }
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const { data: verses = null, isLoading, error } = useQuery<Verse[]>({
    queryKey: ['mood-verses', selectedMood],
    queryFn: async () => {
      if (!selectedMood) return [];
      console.log('Loading verses for mood:', selectedMood);
      const results = await getVersesByMood(selectedMood);
      if (!results.length) {
        console.error('No verses found for mood:', selectedMood);
      }
      return results;
    },
    enabled: !!selectedMood,
    retry: false
  });

  useEffect(() => {
    if (selectedMood && verseSectionRef.current) {
      verseSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedMood]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-16 sm:py-24">
        {/* Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40" />
        </div>

        {/* Floating Elements */}
        <FloatingElement className="top-20 left-10" delay={0} />
        <FloatingElement className="bottom-40 right-20" delay={5} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Sacred Badge */}
            <motion.div
              className="inline-flex items-center px-6 py-2 mb-8 rounded-full 
                        backdrop-blur-xl bg-primary/5 border border-primary/20 shadow-lg
                        hover:bg-primary/10 transition-all duration-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="h-4 w-4 mr-2 text-primary" />
              <span className="text-white/90 font-medium">Find Peace in Ancient Wisdom</span>
            </motion.div>

            {/* Main Title */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
                <span className="block leading-tight text-white/90">
                  How are you feeling
                  <span className="block mt-2 font-normal bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    right now?
                  </span>
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto font-light">
                Select your current mood and discover timeless Gita verses that will guide you through this moment
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mood Selection Section */}
      <section id="mood-section" className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <MoodSelector onSelect={setSelectedMood} selectedMood={selectedMood} />
          </motion.div>
        </div>
      </section>

      {/* Selected Verses Section */}
      {selectedMood && (
        <section
          ref={verseSectionRef}
          className="py-16 bg-gradient-to-b from-muted/5 via-background to-background"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {error ? (
              <div className="text-center py-12 bg-destructive/10 rounded-lg max-w-lg mx-auto">
                <p className="text-destructive font-medium">Error loading verses. Please try again.</p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : (
              <VerseDisplay verses={verses} selectedMood={selectedMood} isLoading={isLoading} />
            )}

            {selectedMood && verses && verses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 flex flex-col sm:flex-row justify-center gap-4"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 w-full sm:w-auto group"
                  onClick={() => setSelectedMood(null)}
                >
                  <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                  {t('home.mood.change')}
                </Button>
                <Button
                  size="lg"
                  className="h-14 w-full sm:w-auto group"
                  onClick={() => setLocation("/browse")}
                >
                  {t('home.explore')}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Show these sections only if no mood is selected */}
      {!selectedMood && (
        <>
          <USPSection />
          <VerseOfTheDay />
          <TestimonialsSection />
          <CallToAction />
        </>
      )}

      {/* Deep-linked Verse Modal */}
      <VerseModal
        verse={deepLinkedVerse}
        open={showVerseModal}
        onOpenChange={setShowVerseModal}
      />
    </div>
  );
}