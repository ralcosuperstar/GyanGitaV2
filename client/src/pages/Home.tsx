import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MoodSelector from "@/components/MoodSelector";
import VerseDisplay from "@/components/VerseDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const { data: verse, isLoading } = useQuery({
    queryKey: ['/api/mood', selectedMood],
    enabled: !!selectedMood
  });

  return (
    <div className="container px-4 py-12 sm:px-8">
      {/* Hero Section */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-playfair text-4xl font-bold md:text-5xl lg:text-6xl">
          Find Peace in Ancient Wisdom
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Discover personalized spiritual guidance from the Bhagavad Gita based on your current emotional state. 
          Let the timeless wisdom guide you through life's journey.
        </p>
      </div>

      {/* Feature Cards */}
      {!selectedMood && (
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-center">
              <span className="text-4xl">🎯</span>
              <h3 className="mt-4 font-playfair text-xl font-semibold">Personalized Guidance</h3>
              <p className="mt-2 text-muted-foreground">
                Receive verses that resonate with your current emotional state
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <span className="text-4xl">📖</span>
              <h3 className="mt-4 font-playfair text-xl font-semibold">Ancient Wisdom</h3>
              <p className="mt-2 text-muted-foreground">
                Access the timeless teachings of the Bhagavad Gita
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <span className="text-4xl">🌟</span>
              <h3 className="mt-4 font-playfair text-xl font-semibold">Daily Inspiration</h3>
              <p className="mt-2 text-muted-foreground">
                Find new insights and inspiration every day
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mood Selection */}
      <div className="mt-12">
        <h2 className="mb-8 text-center font-playfair text-2xl font-semibold">
          How are you feeling today?
        </h2>
        <MoodSelector onSelect={setSelectedMood} />
      </div>

      {/* Verse Display */}
      {selectedMood && (
        <div className="mt-12">
          <VerseDisplay verse={verse} isLoading={isLoading} />

          <div className="mt-8 flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setSelectedMood(null)}
            >
              Choose Another Mood
            </Button>
            <Link href="/browse">
              <Button variant="default">
                Explore More Verses
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {!selectedMood && (
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground">
            Begin your spiritual journey today. Select your current mood above to receive 
            divine guidance tailored to your emotional state.
          </p>
        </div>
      )}
    </div>
  );
}