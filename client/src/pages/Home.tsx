import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CallToAction from "@/components/CallToAction";
import MoodSelector from "@/components/MoodSelector";
import VerseDisplay from "@/components/VerseDisplay";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw } from "lucide-react";
import VerseOfTheDay from "@/components/VerseOfTheDay";
import { getVersesByMood, type Verse } from "@/lib/data";

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const verseSectionRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const { data: verses = null, isLoading, error } = useQuery<Verse[]>({
    queryKey: ['mood-verses', selectedMood],
    queryFn: async () => {
      if (!selectedMood) return null;
      return getVersesByMood(selectedMood);
    },
    enabled: !!selectedMood
  });

  useEffect(() => {
    if (selectedMood && verseSectionRef.current) {
      verseSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedMood]);

  const handleResetMood = () => {
    setSelectedMood(null);
    const moodSection = document.getElementById('mood-section');
    if (moodSection) {
      moodSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <FeaturesSection />

      {/* Verse of the Day Section */}
      <section className="py-24 bg-gradient-to-b from-background via-muted/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-1.5 border border-primary/20 rounded-full text-sm font-medium text-primary/80 bg-primary/5 mb-4"
              >
                Daily Inspiration
              </motion.div>

              <h2 className="text-4xl font-playfair font-semibold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-4">
                {t('home.daily.title')}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Start your day with divine wisdom and timeless guidance
              </p>
            </div>
            <VerseOfTheDay className="max-w-3xl mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Mood-Based Recommendation Section */}
      <section id="mood-section" className="py-24 bg-muted/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-1.5 border border-primary/20 rounded-full text-sm font-medium text-primary/80 bg-primary/5 mb-4"
            >
              Personalized For You
            </motion.div>

            <h2 className="text-4xl font-playfair font-semibold mb-6">
              {t('home.mood.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Select how you're feeling right now, and we'll recommend Bhagavad Gita verses that resonate with your current emotional state
            </p>

            <MoodSelector onSelect={setSelectedMood} selectedMood={selectedMood} />
          </motion.div>
        </div>
      </section>

      {/* Selected Verses Section */}
      {selectedMood && (
        <section 
          ref={verseSectionRef} 
          className="py-20 bg-gradient-to-b from-muted/5 via-background to-background"
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
                  onClick={handleResetMood}
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

      {/* Call to Action Section */}
      <CallToAction />
    </div>
  );
}