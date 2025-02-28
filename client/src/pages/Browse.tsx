import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2, Book } from "lucide-react";

interface Chapter {
  chapter_number: number;
  name: string;
  name_meaning: string;
  verses_count: number;
}

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
}

export default function Browse() {
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedVerse, setSelectedVerse] = useState<string>("");

  const { data: chapters, isLoading: isLoadingChapters } = useQuery<Chapter[]>({
    queryKey: ['/api/chapters'],
    queryFn: async () => {
      const response = await fetch('https://vedicscriptures.github.io/chapters');
      if (!response.ok) throw new Error('Failed to fetch chapters');
      return response.json();
    }
  });

  const { data: verse, isLoading: isLoadingVerse } = useQuery<VerseResponse>({
    queryKey: ['/api/verse', selectedChapter, selectedVerse],
    queryFn: async () => {
      if (!selectedChapter || !selectedVerse) return null;
      const response = await fetch(`https://vedicscriptures.github.io/slok/${selectedChapter}/${selectedVerse}`);
      if (!response.ok) throw new Error('Failed to fetch verse');
      return response.json();
    },
    enabled: !!(selectedChapter && selectedVerse)
  });

  const handleShare = () => {
    if (!verse) return;
    const text = `Bhagavad Gita - Chapter ${selectedChapter}, Verse ${selectedVerse}\n\n${verse.transliteration}\n\nTranslation: ${verse.tej.ht}`;
    const url = `${window.location.origin}/browse?chapter=${selectedChapter}&verse=${selectedVerse}`;
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
              <p className="text-4xl font-bold text-primary">5+</p>
              <p className="text-sm text-muted-foreground">Translations</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <p className="text-4xl font-bold text-primary">2500+</p>
              <p className="text-sm text-muted-foreground">Years of Wisdom</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl font-bold md:text-5xl mb-4">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Explore Sacred Verses
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Delve into the timeless wisdom of the Bhagavad Gita, verse by verse
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Select Chapter</label>
              {isLoadingChapters ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedChapter}
                  onValueChange={setSelectedChapter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters?.map((chapter) => (
                      <SelectItem 
                        key={chapter.chapter_number} 
                        value={chapter.chapter_number.toString()}
                      >
                        Chapter {chapter.chapter_number}: {chapter.name}
                        <span className="block text-sm text-muted-foreground">
                          {chapter.verses_count} verses
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Enter Verse Number</label>
              <Input
                type="number"
                min="1"
                placeholder="Enter verse number"
                value={selectedVerse}
                onChange={(e) => setSelectedVerse(e.target.value)}
              />
            </div>
          </div>

          {selectedChapter && selectedVerse && (
            <div className="mt-12">
              {isLoadingVerse ? (
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-2/3" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-20" />
                    <Skeleton className="h-16" />
                  </CardContent>
                </Card>
              ) : verse ? (
                <Card className="overflow-hidden">
                  <CardHeader className="bg-primary/5">
                    <CardTitle className="font-playfair text-2xl flex items-center justify-between">
                      <span>Chapter {selectedChapter}, Verse {selectedVerse}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="text-primary hover:text-primary/80"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div>
                      <h3 className="font-semibold mb-2 text-primary">Sanskrit</h3>
                      <p className="text-lg font-sanskrit bg-muted/50 p-4 rounded-lg">
                        {verse.slok}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-primary">Transliteration</h3>
                      <p className="text-lg bg-muted/50 p-4 rounded-lg">
                        {verse.transliteration}
                      </p>
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
              ) : (
                <div className="text-center text-muted-foreground">
                  No verse found. Please check the chapter and verse numbers.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}