import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import Hero from "@/components/Hero";
import MoodSelector from "@/components/MoodSelector";
import VerseDisplay from "@/components/VerseDisplay";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BsWhatsapp } from 'react-icons/bs';
import { Sparkles, BookOpen, Heart, Brain, Lightbulb, Compass, Users } from "lucide-react";
import VerseOfTheDay from "@/components/VerseOfTheDay";

interface Verse {
  slok: string;
  transliteration: string;
  tej: {
    ht: string;
    et: string;
  };
  chapter: number;
  verse: number;
}

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-card/5 backdrop-blur-sm rounded-xl p-6 border border-primary/10"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const verseSectionRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const { data: verses, isLoading, error } = useQuery<Verse[]>({
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
      verseSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedMood]);

  const handleShareWhatsApp = () => {
    const text = "Experience divine wisdom through the Bhagavad Gita with GyanGita - your spiritual companion for life's journey";
    const url = window.location.origin;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-muted/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-playfair font-semibold mb-4">
              Why Choose GyanGita?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover timeless wisdom tailored to your modern life journey
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Brain}
              title="Personalized Guidance"
              description="Receive verses that resonate with your current emotional state and life situations"
            />
            <FeatureCard
              icon={Heart}
              title="Emotional Support"
              description="Find solace and strength through ancient wisdom during challenging times"
            />
            <FeatureCard
              icon={BookOpen}
              title="Multiple Translations"
              description="Access clear translations and interpretations from renowned scholars"
            />
            <FeatureCard
              icon={Compass}
              title="Daily Inspiration"
              description="Start each day with a carefully selected verse for spiritual growth"
            />
            <FeatureCard
              icon={Users}
              title="Community Connect"
              description="Share insights and discuss verses with fellow spiritual seekers"
            />
            <FeatureCard
              icon={Lightbulb}
              title="Modern Context"
              description="Learn how ancient teachings apply to contemporary challenges"
            />
          </div>
        </div>
      </section>

      {/* Mood Section */}
      <div id="mood-section" className="container mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-12 text-center font-playfair text-4xl font-semibold">
            {t('home.mood.title')}
          </h2>
          <MoodSelector onSelect={setSelectedMood} selectedMood={selectedMood} />
        </motion.div>
      </div>

      {/* Verse of the Day Section */}
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
              Start your day with divine wisdom
            </p>
          </div>
          <VerseOfTheDay className="max-w-3xl mx-auto" />
        </motion.div>
      </div>

      {/* Selected Verses Section */}
      <div ref={verseSectionRef} className="container mx-auto max-w-7xl px-4 py-20 sm:px-8">
        {error ? (
          <div className="text-center text-red-500">
            Error loading verses. Please try again.
          </div>
        ) : (
          <VerseDisplay verses={verses} selectedMood={selectedMood} isLoading={isLoading} />
        )}

        {selectedMood && verses && verses.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
          >
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
          </motion.div>
        )}
      </div>
    </div>
  );
}