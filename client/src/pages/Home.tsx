import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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

  // Auto-scroll effect when verses are loaded
  useEffect(() => {
    if (verses && verses.length > 0 && versesSectionRef.current) {
      setTimeout(() => {
        versesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [verses]);

  const handleShareWhatsApp = () => {
    const text = "Discover divine wisdom from Bhagavad Gita for your daily challenges at GyanGita! 🕉️\n\nFind spiritual guidance tailored to your emotional state.";
    const url = window.location.origin;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Stats Section */}
      <div className="border-b bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 py-8 sm:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center transform hover:scale-105 transition-transform">
              <p className="text-4xl font-bold text-primary">18</p>
              <p className="text-sm text-muted-foreground">Sacred Chapters</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <p className="text-4xl font-bold text-primary">700</p>
              <p className="text-sm text-muted-foreground">Divine Verses</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <p className="text-4xl font-bold text-primary">15+</p>
              <p className="text-sm text-muted-foreground">Emotional States</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <p className="text-4xl font-bold text-primary">5+</p>
              <p className="text-sm text-muted-foreground">Expert Translations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-playfair text-5xl font-bold md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Divine Wisdom for Modern Life's Challenges
            </span>
          </h1>
          <p className="mt-8 text-xl text-muted-foreground leading-relaxed">
            Navigate life's journey with timeless guidance from the Bhagavad Gita,
            perfectly matched to your emotional state.
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
              Find Guidance
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg h-16 transform hover:scale-105 transition-all"
              onClick={handleShareWhatsApp}
            >
              <Share2 className="w-6 h-6 mr-2" />
              Share on WhatsApp
            </Button>
          </div>

          <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-primary/10 to-primary/5 transform hover:scale-105 transition-all">
              <div className="absolute top-6 right-6 text-primary/30">
                <Brain className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Personalized Guidance</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive verses that resonate with your current emotional state, helping you navigate life's challenges with divine wisdom.
              </p>
            </Card>

            <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-primary/10 to-primary/5 transform hover:scale-105 transition-all">
              <div className="absolute top-6 right-6 text-primary/30">
                <Book className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Ancient Wisdom</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access profound teachings with expert translations and commentaries from renowned scholars and spiritual masters.
              </p>
            </Card>

            <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-primary/10 to-primary/5 transform hover:scale-105 transition-all">
              <div className="absolute top-6 right-6 text-primary/30">
                <Heart className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Daily Inspiration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Transform challenges into opportunities with timeless spiritual principles applicable to modern life.
              </p>
            </Card>
          </div>

          {/* Additional Features */}
          <div className="mt-20 grid gap-8 sm:grid-cols-2">
            <div className="flex items-start gap-6 group">
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">Mood-Based Recommendations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find verses that specifically address your current emotional state and life situation.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-6 group">
              <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">Multiple Perspectives</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Gain deeper understanding through various scholarly interpretations and commentaries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Selection Section */}
      <div id="mood-section" className="bg-gradient-to-b from-muted/50 to-background py-20">
        <div className="container px-4 sm:px-8">
          <h2 className="mb-12 text-center font-playfair text-4xl font-semibold">
            How are you feeling today?
          </h2>
          <MoodSelector onSelect={setSelectedMood} selectedMood={selectedMood} />
        </div>
      </div>

      {/* Verses Display Section */}
      <div ref={versesSectionRef} className="container px-4 py-20 sm:px-8">
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
              Choose Another Mood
            </Button>
            <Button size="lg" className="h-14">
              Explore More Verses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}