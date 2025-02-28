import { useState, useRef } from "react";
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
      const data = await response.json();
      return data;
    },
    enabled: !!selectedMood,
    onSuccess: () => {
      // Scroll to verses section when data is loaded
      versesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  const handleShareWhatsApp = () => {
    const text = "Discover divine wisdom from Bhagavad Gita for your daily challenges at GyanGita! 🕉️\n\nFind spiritual guidance tailored to your emotional state.";
    const url = window.location.origin;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Stats Section */}
      <div className="bg-primary/5 border-b">
        <div className="container px-4 py-6 sm:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">18</p>
              <p className="text-sm text-muted-foreground">Chapters</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">700</p>
              <p className="text-sm text-muted-foreground">Verses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">15+</p>
              <p className="text-sm text-muted-foreground">Emotional States</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">5+</p>
              <p className="text-sm text-muted-foreground">Expert Translations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-playfair text-4xl font-bold md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Divine Wisdom for Modern Life's Challenges
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Navigate life's journey with timeless guidance from the Bhagavad Gita,
            perfectly matched to your emotional state.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 max-w-xl mx-auto">
            <Button
              size="lg"
              className="text-lg h-14"
              onClick={() => {
                const moodSection = document.getElementById('mood-section');
                moodSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Find Guidance
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg h-14"
              onClick={handleShareWhatsApp}
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share on WhatsApp
            </Button>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="absolute top-4 right-4 text-primary/20">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Guidance</h3>
              <p className="text-muted-foreground">
                Receive verses that resonate with your current emotional state, helping you navigate life's challenges with divine wisdom.
              </p>
            </Card>

            <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="absolute top-4 right-4 text-primary/20">
                <Book className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ancient Wisdom</h3>
              <p className="text-muted-foreground">
                Access profound teachings with expert translations and commentaries from renowned scholars and spiritual masters.
              </p>
            </Card>

            <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="absolute top-4 right-4 text-primary/20">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Inspiration</h3>
              <p className="text-muted-foreground">
                Transform challenges into opportunities with timeless spiritual principles applicable to modern life.
              </p>
            </Card>
          </div>

          {/* Additional Features */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Mood-Based Recommendations</h3>
                <p className="text-muted-foreground">Find verses that specifically address your current emotional state and life situation.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Multiple Perspectives</h3>
                <p className="text-muted-foreground">Gain deeper understanding through various scholarly interpretations and commentaries.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Selection Section */}
      <div id="mood-section" className="bg-muted/50 py-16">
        <div className="container px-4 sm:px-8">
          <h2 className="mb-8 text-center font-playfair text-3xl font-semibold">
            How are you feeling today?
          </h2>
          <MoodSelector onSelect={setSelectedMood} selectedMood={selectedMood} />
        </div>
      </div>

      {/* Verses Display Section */}
      <div ref={versesSectionRef} className="container px-4 py-16 sm:px-8">
        {error ? (
          <div className="text-center text-red-500">
            Error loading verses. Please try again.
          </div>
        ) : (
          <VerseDisplay verses={verses || null} selectedMood={selectedMood} isLoading={isLoading} />
        )}

        {selectedMood && verses?.length > 0 && (
          <div className="mt-8 flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedMood(null);
                const moodSection = document.getElementById('mood-section');
                moodSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Choose Another Mood
            </Button>
            <Button>
              Explore More Verses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}