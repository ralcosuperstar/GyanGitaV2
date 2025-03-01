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
  const versesSectionRef = useRef<HTMLDivElement>(null);
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
    if (verses && verses.length > 0 && versesSectionRef.current) {
      setTimeout(() => {
        versesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [verses]);

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
      <div className="container mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-primary/10 to-primary/5 transform hover:scale-105 transition-all">
              <div className="absolute top-6 right-6 text-primary/30">
                <Brain className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t('features.personal.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('features.personal.desc')}
              </p>
            </Card>

            <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-primary/10 to-primary/5 transform hover:scale-105 transition-all">
              <div className="absolute top-6 right-6 text-primary/30">
                <Book className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t('features.ancient.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('features.ancient.desc')}
              </p>
            </Card>

            <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-primary/10 to-primary/5 transform hover:scale-105 transition-all">
              <div className="absolute top-6 right-6 text-primary/30">
                <Heart className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t('features.daily.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('features.daily.desc')}
              </p>
            </Card>
          </div>

          <div className="mt-20 grid gap-8 sm:grid-cols-2">
            <div className="flex items-start gap-6 group">
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">{t('features.mood.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.mood.desc')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-6 group">
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">{t('features.perspectives.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('features.perspectives.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="mood-section" className="bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          <h2 className="mb-12 text-center font-playfair text-4xl font-semibold">
            {t('home.mood.title')}
          </h2>
          <MoodSelector onSelect={setSelectedMood} selectedMood={selectedMood} />
        </div>
      </div>

      <div ref={versesSectionRef} className="container mx-auto max-w-7xl px-4 py-20 sm:px-8">
        {error ? (
          <div className="text-center text-red-500">
            Error loading verses. Please try again.
          </div>
        ) : (
          <VerseDisplay verses={verses || null} selectedMood={selectedMood} isLoading={isLoading} />
        )}

        {selectedMood && verses?.length > 0 && (
          <div className="mt-12 flex justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              className="h-14"
              onClick={() => {
                setSelectedMood(null);
                const moodSection = document.getElementById('mood-section');
                moodSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {t('home.mood.change')}
            </Button>
            <Button size="lg" className="h-14" onClick={() => setLocation("/browse")}>
              {t('home.explore')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}