import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RefreshCw, Heart, Sparkles, BookOpen, ChevronDown, ArrowDown } from "lucide-react";
import MoodSelector from "@/components/MoodSelector";
import VerseDisplay from "@/components/VerseDisplay";
import VerseModal from "@/components/VerseModal";
import VerseOfTheDay from "@/components/VerseOfTheDay";
import { getVersesByMood, getVerseByChapterAndNumber, type Verse } from "@/lib/data";
import TestimonialsSection from "@/components/TestimonialsSection";
import CallToAction from "@/components/CallToAction";
import StatsSection from "@/components/StatsSection";
import USPSection from "@/components/USPSection";
import SEO from '@/components/SEO';
import { Helmet } from 'react-helmet-async';

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
      ease: "linear",
      repeat: Infinity
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
  const moodSectionRef = useRef<HTMLDivElement>(null);
  const verseSectionRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const [fadeOpacity, setFadeOpacity] = useState(0);


  // Handle deep linking and verse fetching logic
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

  useEffect(() => {
    const handleScroll = () => {
      setFadeOpacity(window.scrollY > 50 ? 1 : 0);
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  const handleChangeMood = () => {
    setSelectedMood(null);
    if (moodSectionRef.current) {
      moodSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Find Inner Peace Through Ancient Wisdom | Bhagavad Gita"
        description="Discover personalized guidance from the Bhagavad Gita that speaks to your emotional state. Transform life's challenges into opportunities for growth with timeless wisdom."
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SpiritualOrReligiousOrganization",
            "name": "Bhagavad Gita Wisdom",
            "description": "A modern platform providing personalized spiritual guidance from the Bhagavad Gita based on emotional states.",
            "url": window.location.origin,
            "sameAs": [
              "https://en.wikipedia.org/wiki/Bhagavad_Gita"
            ],
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            },
            "image": `${window.location.origin}/og-image.jpg`,
            "offers": {
              "@type": "Offer",
              "name": "Spiritual Wisdom",
              "description": "Access timeless wisdom from the Bhagavad Gita through an innovative mood-based verse recommendation system"
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40" />
        </div>

        <FloatingElement className="top-20 -left-20 lg:left-10" delay={0} />
        <FloatingElement className="bottom-40 -right-20 lg:right-10" delay={5} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Sacred Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full 
                      backdrop-blur-xl bg-primary/5 border border-primary/20 shadow-lg
                      hover:bg-primary/10 transition-all duration-300"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm text-white/90 font-medium">Stop Scrolling, Start Healing</span>
            </motion.div>

            {/* Main Title */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight">
                <span className="block leading-tight text-white/90">
                  Tired of Endless Scrolling
                </span>
                <span className="block mt-2 font-normal bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  But Still Feeling Empty?
                </span>
              </h1>

              <p className="text-lg text-white/60 max-w-xl mx-auto font-light leading-relaxed">
                Discover ancient wisdom that actually helps with modern struggles - anxiety, loneliness, 
                and the constant pressure to "have it all figured out"
              </p>

              {/* Call to Action */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Button
                  className="w-full sm:w-auto px-8 py-6 text-lg font-normal
                          bg-primary/90 hover:bg-primary/80 border border-primary/30
                          shadow-lg hover:shadow-xl transition-all duration-300 group"
                  onClick={handleChangeMood}
                >
                  <Sparkles className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                  Begin Your Journey
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/40"
            style={{ opacity: fadeOpacity }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown className="h-6 w-6" />
          </motion.div>
        </div>
      </section>

      {/* Mood Selection Section */}
      <section id="mood-section" ref={moodSectionRef} className="py-16 relative overflow-hidden">
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
              <VerseDisplay 
                verses={verses} 
                selectedMood={selectedMood} 
                isLoading={isLoading} 
              />
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
                  className="h-14 px-8 group relative before:absolute before:inset-0 before:rounded-md before:border before:border-primary/50 before:animate-[border-glow_4s_ease-in-out_infinite]"
                  onClick={handleChangeMood}
                >
                  <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                  Change Mood
                </Button>
                <Button
                  size="lg"
                  className="h-14 px-8 bg-primary/90 hover:bg-primary group relative
                           before:absolute before:inset-0 before:rounded-md before:border before:border-primary/50
                           before:animate-[border-glow_4s_ease-in-out_infinite]
                           after:absolute after:inset-0 after:rounded-md after:border-2 after:border-primary/20
                           after:animate-[border-glow_4s_ease-in-out_infinite_0.5s]"
                  onClick={() => setLocation("/browse")}
                >
                  Explore More
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

          {/* Verse of the Day Section */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />
            </div>

            <div className="container mx-auto px-4 relative">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center px-6 py-2 border border-primary/20 rounded-full text-base font-medium text-primary/80 bg-primary/5 mb-6"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Today's Divine Wisdom
                </motion.div>

                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl font-light mb-6"
                >
                  Daily Inspiration
                  <span className="block mt-2 font-normal bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    from the Gita
                  </span>
                </motion.h2>
              </div>

              <div className="max-w-4xl mx-auto">
                <VerseOfTheDay />
              </div>
            </div>
          </section>

          <StatsSection />
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