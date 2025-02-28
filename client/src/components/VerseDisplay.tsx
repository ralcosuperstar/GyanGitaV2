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

  console.log('VerseDisplay props:', { verses, selectedMood, isLoading });

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
        <Card key={`${verse.chapter}-${verse.verse}-${index}`} className="overflow-hidden">
          <CardHeader className="bg-primary/5">
            <CardTitle className="font-playfair text-xl flex items-center justify-between">
              <span>Chapter {verse.chapter}, Verse {verse.verse}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h3 className="font-semibold mb-2 text-primary">Sanskrit Verse</h3>
              <p className="text-lg font-sanskrit bg-muted/50 p-4 rounded-lg">{verse.slok}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-primary">Transliteration</h3>
              <p className="text-lg bg-muted/50 p-4 rounded-lg">{verse.transliteration}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-primary">Translations</h3>
              <div className="space-y-4">
                {verse.tej && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium text-primary mb-2">Swami Tejomayananda</p>
                    <p>{verse.tej.ht}</p>
                    {verse.tej.et && (
                      <p className="text-muted-foreground mt-2">{verse.tej.et}</p>
                    )}
                  </div>
                )}

                {verse.siva?.et && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium text-primary mb-2">Swami Sivananda</p>
                    <p>{verse.siva.et}</p>
                  </div>
                )}

                {verse.purohit?.et && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium text-primary mb-2">Shri Purohit Swami</p>
                    <p>{verse.purohit.et}</p>
                  </div>
                )}
              </div>
            </div>

            {verse.chinmay?.hc && (
              <div>
                <h3 className="font-semibold mb-2 text-primary">Commentary</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium text-primary mb-2">Swami Chinmayananda</p>
                  <p>{verse.chinmay.hc}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}