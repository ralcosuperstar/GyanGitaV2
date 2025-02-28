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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!verses || !selectedMoodData) return null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="font-playfair text-2xl font-semibold mb-2">
          {selectedMoodData.icon} Verses for {selectedMoodData.label}
        </h2>
        <p className="text-muted-foreground">{selectedMoodData.description}</p>
      </div>

      {verses.map((verse, index) => (
        <Card key={`${verse.chapter}-${verse.verse}`}>
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