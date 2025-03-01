import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/language-context";
import MoodSelector from "@/components/MoodSelector";
import VerseDisplay from "@/components/VerseDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Book, Heart, Brain, Lightbulb, Target, Users } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Hero Section */}
      <div className="container mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-playfair text-5xl font-bold md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              {t('home.title')}
            </span>
          </h1>
          <p className="mt-8 text-xl text-muted-foreground leading-relaxed">
            {t('home.subtitle')}
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 max-w-xl mx-auto">
            <Button
              size="lg"
              className="text-lg h-16 transform hover:scale-105 transition-all"
              onClick={() => {
                const moodSection = document.getElementById('mood-section');
                moodSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <Lightbulb className="w-6 h-6 mr-2" />
              {t('home.cta.find')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg h-16 transform hover:scale-105 transition-all"
              onClick={handleShareWhatsApp}
            >
              <Share2 className="w-6 h-6 mr-2" />
              {t('home.cta.share')}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center transform hover:scale-105 transition-transform">
              <p className="text-4xl font-bold text-primary">18</p>
              <p className="text-sm text-muted-foreground">{t('stats.chapters')}</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <p className="text-4xl font-bold text-primary">700</p>
              <p className="text-sm text-muted-foreground">{t('stats.verses')}</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <p className="text-4xl font-bold text-primary">15+</p>
              <p className="text-sm text-muted-foreground">{t('stats.states')}</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <p className="text-4xl font-bold text-primary">5000+</p>
              <p className="text-sm text-muted-foreground">{t('stats.years')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="mood-section" className="container mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <h2 className="mb-12 text-center font-playfair text-4xl font-semibold">
          {t('home.mood.title')}
        </h2>
        <MoodSelector onSelect={setSelectedMood} selectedMood={selectedMood} />
      </div>

      <div ref={verseSectionRef} className="container mx-auto max-w-7xl px-4 py-20 sm:px-8">
        {error ? (
          <div className="text-center text-red-500">
            Error loading verses. Please try again.
          </div>
        ) : (
          <VerseDisplay verses={verses || null} selectedMood={selectedMood} isLoading={isLoading} />
        )}

        {selectedMood && verses?.length > 0 && (
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