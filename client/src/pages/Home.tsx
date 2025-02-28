import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MoodSelector from "@/components/MoodSelector";
import VerseDisplay from "@/components/VerseDisplay";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const { data: verse, isLoading } = useQuery({
    queryKey: ['/api/mood', selectedMood],
    enabled: !!selectedMood
  });

  return (
    <div className="container px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-playfair text-4xl font-bold md:text-5xl">
          Find Spiritual Guidance in the Bhagavad Gita
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Select your current mood to receive divine wisdom from the sacred text
        </p>
      </div>

      <div className="mt-12">
        <MoodSelector onSelect={setSelectedMood} />
      </div>

      {selectedMood && (
        <div className="mt-12">
          <VerseDisplay verse={verse} isLoading={isLoading} />
          
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setSelectedMood(null)}
            >
              Choose Another Mood
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
