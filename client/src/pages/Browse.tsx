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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Share2, Book, Grid } from "lucide-react";
import VerseCard from "@/components/VerseCard";

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
  chapter: number;
  verse: number;
}

export default function Browse() {
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedVerse, setSelectedVerse] = useState<string>("");
  const [viewMode, setViewMode] = useState<"search" | "grid">("search");
  const [selectedGridChapter, setSelectedGridChapter] = useState<number | null>(null);
  const [showVerseModal, setShowVerseModal] = useState(false);

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
      const data = await response.json();
      return { ...data, chapter: parseInt(selectedChapter), verse: parseInt(selectedVerse) };
    },
    enabled: !!(selectedChapter && selectedVerse)
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Stats Section */}
      <div className="border-b bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-8">
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

      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-8">
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

        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={viewMode === "search" ? "default" : "outline"}
            onClick={() => setViewMode("search")}
            className="gap-2"
          >
            <Book className="w-4 h-4" />
            Search Verses
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            onClick={() => setViewMode("grid")}
            className="gap-2"
          >
            <Grid className="w-4 h-4" />
            Browse Chapters
          </Button>
        </div>

        {viewMode === "search" ? (
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-6 md:grid-cols-2">
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

            {selectedChapter && selectedVerse && verse && (
              <div className="mt-12">
                <VerseCard verse={verse} />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {selectedGridChapter === null ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {chapters?.map((chapter) => (
                  <Card 
                    key={chapter.chapter_number}
                    className="cursor-pointer hover:border-primary transition-colors transform hover:scale-105"
                    onClick={() => setSelectedGridChapter(chapter.chapter_number)}
                  >
                    <CardHeader>
                      <CardTitle>Chapter {chapter.chapter_number}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-medium text-lg mb-2">{chapter.name}</h3>
                      <p className="text-muted-foreground mb-4">{chapter.name_meaning}</p>
                      <p className="text-sm text-primary">{chapter.verses_count} Verses</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div>
                <Button 
                  variant="outline" 
                  className="mb-8"
                  onClick={() => setSelectedGridChapter(null)}
                >
                  ← Back to Chapters
                </Button>

                <div className="grid gap-4 grid-cols-6 sm:grid-cols-8 md:grid-cols-10">
                  {Array.from({ length: chapters?.find(c => c.chapter_number === selectedGridChapter)?.verses_count || 0 }).map((_, i) => (
                    <Button
                      key={i + 1}
                      variant="outline"
                      className="h-12 w-12 hover:bg-primary/5"
                      onClick={() => {
                        setSelectedChapter(selectedGridChapter.toString());
                        setSelectedVerse((i + 1).toString());
                        setShowVerseModal(true);
                      }}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verse Modal */}
        {verse && showVerseModal && (
          <Dialog open={showVerseModal} onOpenChange={setShowVerseModal}>
            <DialogContent className="max-w-3xl">
              <VerseCard verse={verse} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}