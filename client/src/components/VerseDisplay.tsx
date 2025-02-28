import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { moods } from "@/lib/moods";
import VerseCard from "./VerseCard";

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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-20" />
              <Skeleton className="h-16" />
              <Skeleton className="h-10" />
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
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="font-playfair text-2xl font-semibold mb-2">
          {selectedMoodData?.icon} Verses for {selectedMoodData?.label}
        </h2>
        <p className="text-muted-foreground">{selectedMoodData?.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {verses.map((verse, index) => (
          <VerseCard key={`${verse.chapter}-${verse.verse}-${index}`} verse={verse} />
        ))}
      </div>
    </div>
  );
}