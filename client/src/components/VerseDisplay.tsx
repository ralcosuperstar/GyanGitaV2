import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { moods } from "@/lib/moods";

interface VerseResponse {
  slok: string;
  transliteration: string;
  tej: {
    ht: string;
    et: string;
  };
  chapter: number;
  verse: number;
}

interface VerseDisplayProps {
  verses: VerseResponse[] | null;
  selectedMood: string | null;
  isLoading: boolean;
}

export default function VerseDisplay({ verses, selectedMood, isLoading }: VerseDisplayProps) {
  const selectedMoodData = moods.find(m => m.id === selectedMood);

  if (!selectedMood) return null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!verses?.length) {
    return (
      <div className="text-center text-muted-foreground">
        No verses found for the selected mood. Please try another mood.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-playfair text-2xl font-semibold mb-2">
          {selectedMoodData?.icon} Verses for {selectedMoodData?.label}
        </h2>
        <p className="text-muted-foreground">{selectedMoodData?.description}</p>
      </div>

      {verses.map((verse, index) => (
        <Card key={`${verse.chapter}-${verse.verse}-${index}`}>
          <CardHeader>
            <CardTitle className="font-playfair text-xl">
              Chapter {verse.chapter}, Verse {verse.verse}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Sanskrit Verse</h3>
              <p className="text-lg italic">{verse.slok}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Transliteration</h3>
              <p className="text-lg">{verse.transliteration}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Translation</h3>
              <div className="space-y-2">
                <p>{verse.tej.ht}</p>
                <p className="text-muted-foreground">{verse.tej.et}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}