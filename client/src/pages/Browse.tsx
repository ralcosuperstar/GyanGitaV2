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

export default function Browse() {
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedVerse, setSelectedVerse] = useState<string>("");

  const { data: chapters, isLoading: isLoadingChapters } = useQuery({
    queryKey: ['/api/chapters'],
  });

  const { data: verse, isLoading: isLoadingVerse } = useQuery({
    queryKey: ['/api/verse', selectedChapter, selectedVerse],
    enabled: !!(selectedChapter && selectedVerse),
  });

  return (
    <div className="container px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-playfair text-4xl font-bold md:text-5xl">
          Browse Bhagavad Gita Verses
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore the divine wisdom by selecting specific chapters and verses
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Chapter</label>
          {isLoadingChapters ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={selectedChapter}
              onValueChange={setSelectedChapter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                {chapters?.map((chapter: any) => (
                  <SelectItem key={chapter.chapter_number} value={chapter.chapter_number.toString()}>
                    Chapter {chapter.chapter_number}: {chapter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Verse</label>
          <Input
            type="number"
            min="1"
            placeholder="Enter verse number"
            value={selectedVerse}
            onChange={(e) => setSelectedVerse(e.target.value)}
          />
        </div>
      </div>

      {(selectedChapter && selectedVerse) && (
        <div className="mt-12">
          {isLoadingVerse ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-16" />
              </CardContent>
            </Card>
          ) : verse ? (
            <Card>
              <CardHeader>
                <CardTitle className="font-playfair text-2xl">
                  Chapter {selectedChapter}, Verse {selectedVerse}
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
          ) : (
            <div className="text-center text-muted-foreground">
              No verse found. Please check the chapter and verse numbers.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
