import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface VerseDisplayProps {
  verse: {
    slok: string;
    transliteration: string;
    tej: {
      ht: string;
      et: string;
    };
  } | null;
  isLoading: boolean;
}

export default function VerseDisplay({ verse, isLoading }: VerseDisplayProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-16" />
        </CardContent>
      </Card>
    );
  }

  if (!verse) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-playfair text-2xl">
          Divine Guidance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-2 font-semibold">Sanskrit Verse</h3>
          <p className="text-lg italic">{verse.slok}</p>
        </div>
        
        <div>
          <h3 className="mb-2 font-semibold">Transliteration</h3>
          <p className="text-lg">{verse.transliteration}</p>
        </div>
        
        <div>
          <h3 className="mb-2 font-semibold">Translation</h3>
          <div className="space-y-4">
            <p>{verse.tej.ht}</p>
            <p className="text-muted-foreground">{verse.tej.et}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
