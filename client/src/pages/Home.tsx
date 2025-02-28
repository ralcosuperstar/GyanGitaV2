import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MoodSelector from "@/components/MoodSelector";
import VerseDisplay from "@/components/VerseDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const { data: verses, isLoading, error } = useQuery({
    queryKey: ['/api/mood', selectedMood],
    enabled: !!selectedMood
  });

  console.log('Selected mood:', selectedMood);
  console.log('Verses data:', verses);
  console.log('Loading state:', isLoading);
  console.log('Error:', error);

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

      {/* Mood Selection */}
      <div className="mt-12">
        <h2 className="mb-8 text-center font-playfair text-2xl font-semibold">
          How are you feeling today?
        </h2>
        <MoodSelector onSelect={setSelectedMood} selectedMood={selectedMood} />
      </div>

      {/* Verse Display */}
      <div className="mt-12">
        {error ? (
          <div className="text-center text-red-500">
            Error loading verses. Please try again.
          </div>
        ) : (
          <VerseDisplay verses={verses} selectedMood={selectedMood} isLoading={isLoading} />
        )}

        {selectedMood && (
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
        )}
      </div>

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