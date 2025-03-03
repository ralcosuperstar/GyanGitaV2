import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import MoodSelector from "@/components/MoodSelector";
import VerseDisplay from "@/components/VerseDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Book, Heart, Brain, Lightbulb, Target, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { BsWhatsapp } from 'react-icons/bs';
import VerseOfTheDay from "@/components/VerseOfTheDay"; // Import the new component

interface VerseResponse {
  slok: string;
  transliteration: string;
  tej: {
    ht: string;
    et: string;
  };
  siva?: {
    et: string;
  };
  purohit?: {
    et: string;
  };
  chinmay?: {
    hc: string;
  };
  chapter: number;
  verse: number;
}

const FloatingElement = ({ delay = 0, children }: { delay?: number, children: React.ReactNode }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
      delay
    }}
  >
    {children}
  </motion.div>
);

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const verseSectionRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const { data: verses, isLoading, error } = useQuery<VerseResponse[]>({
    queryKey: ['/api/mood', selectedMood],
    queryFn: async () => {
      if (!selectedMood) return null;
      const response = await fetch(`/api/mood/${selectedMood}`);
      if (!response.ok) {
        throw new Error('Failed to fetch verses');
      }
      return response.json();
    },
    enabled: !!selectedMood
  });

  useEffect(() => {
    if (selectedMood && verseSectionRef.current) {
      setTimeout(() => {
        verseSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedMood]);

  const handleShareWhatsApp = () => {
    const text = t('home.share.text');
    const url = window.location.origin;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="container relative mx-auto max-w-7xl px-4 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-playfair text-5xl font-bold md:text-6xl lg:text-7xl mb-8">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="block mb-4"
                >
                  <span className="inline-block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    Life's a Mess?
                  </span>
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="block"
                >
                  <span className="inline-block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    Let the Bhagavad Gita Guide You
                  </span>
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 text-xl text-muted-foreground leading-relaxed"
              >
                From tough days to big wins, find the Bhagavad Gita verse that speaks to your heart and soul
              </motion.p>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 max-w-xl mx-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="w-full text-lg h-16 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    onClick={() => {
                      const moodSection = document.getElementById('mood-section');
                      moodSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    <Sparkles className="w-6 h-6 mr-2" />
                    {t('home.cta.find')}
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="w-full text-lg h-16 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                    onClick={handleShareWhatsApp}
                  >
                    <BsWhatsapp className="w-6 h-6 mr-2" />
                    {t('home.cta.share')}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Floating Stats */}
          <motion.div
            className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <FloatingElement delay={0}>
              <div className="text-center transform hover:scale-105 transition-all bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-primary/10">
                <p className="text-4xl font-bold text-primary">18</p>
                <p className="text-sm text-muted-foreground">{t('stats.chapters')}</p>
              </div>
            </FloatingElement>

            <FloatingElement delay={0.1}>
              <div className="text-center transform hover:scale-105 transition-all bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-primary/10">
                <p className="text-4xl font-bold text-primary">700</p>
                <p className="text-sm text-muted-foreground">{t('stats.verses')}</p>
              </div>
            </FloatingElement>

            <FloatingElement delay={0.2}>
              <div className="text-center transform hover:scale-105 transition-all bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-primary/10">
                <p className="text-4xl font-bold text-primary">15+</p>
                <p className="text-sm text-muted-foreground">{t('stats.states')}</p>
              </div>
            </FloatingElement>

            <FloatingElement delay={0.3}>
              <div className="text-center transform hover:scale-105 transition-all bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-primary/10">
                <p className="text-4xl font-bold text-primary">5000+</p>
                <p className="text-sm text-muted-foreground">{t('stats.years')}</p>
              </div>
            </FloatingElement>
          </motion.div>
        </div>
      </div>

      {/* Mood Section */}
      <div id="mood-section" className="container mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <h2 className="mb-12 text-center font-playfair text-4xl font-semibold">
          {t('home.mood.title')}
        </h2>
        <MoodSelector onSelect={setSelectedMood} selectedMood={selectedMood} />
      </div>

      {/* Add Today's Verse section */}
      <div className="container mx-auto max-w-7xl px-4 py-20 sm:px-8 border-t">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl font-semibold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              {t('home.daily.title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t('home.daily.subtitle')}
            </p>
          </div>
          <VerseOfTheDay className="max-w-3xl mx-auto" />
        </motion.div>
      </div>

      <div ref={verseSectionRef} className="container mx-auto max-w-7xl px-4 py-20 sm:px-8">
        {error ? (
          <div className="text-center text-red-500">
            Error loading verses. Please try again.
          </div>
        ) : (
          <VerseDisplay verses={verses} selectedMood={selectedMood} isLoading={isLoading} />
        )}

        {selectedMood && verses && verses.length > 0 && (
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="h-14 w-full sm:w-auto"
              onClick={() => {
                setSelectedMood(null);
                const moodSection = document.getElementById('mood-section');
                moodSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {t('home.mood.change')}
            </Button>
            <Button
              size="lg"
              className="h-14 w-full sm:w-auto"
              onClick={() => setLocation("/browse")}
            >
              {t('home.explore')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}