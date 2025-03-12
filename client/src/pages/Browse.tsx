import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/language-context";
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
import { BookOpen, Search, Grid, Filter, Sparkles, ArrowLeft } from "lucide-react";
import VerseCard from "@/components/VerseCard";
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define themes for categorization
const themes = [
  { id: 'karma', label: 'Karma & Action', icon: '⚡', description: 'Understanding action and its fruits' },
  { id: 'dharma', label: 'Dharma & Duty', icon: '🎯', description: 'Discovering your life purpose' },
  { id: 'devotion', label: 'Devotion & Faith', icon: '🙏', description: 'Path of divine connection' },
  { id: 'knowledge', label: 'Knowledge & Wisdom', icon: '📚', description: 'Inner wisdom and realization' },
  { id: 'meditation', label: 'Meditation & Peace', icon: '🧘', description: 'Techniques for inner peace' },
  { id: 'purpose', label: 'Purpose & Life', icon: '🌟', description: 'Finding meaning in life' },
];

interface Chapter {
  chapter_number: number;
  name: string;
  name_meaning: string;
  verses_count: number;
  theme?: string;
  key_verses?: string[];
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
  const [viewMode, setViewMode] = useState<"browse" | "search" | "theme">("browse");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { t } = useLanguage();

  // Reset scroll position when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewMode]);

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

  const handleVerseSelect = (chapter: string, verse: string) => {
    setSelectedChapter(chapter);
    setSelectedVerse(verse);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl font-playfair font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t('browse.title')}
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {t('browse.subtitle')}
            </motion.p>

            {/* Navigation Tabs */}
            <Tabs defaultValue="browse" className="space-y-6">
              <TabsList className="inline-flex bg-background/50 backdrop-blur-sm p-1 rounded-lg border">
                <TabsTrigger 
                  value="browse" 
                  className="flex items-center gap-2"
                  onClick={() => setViewMode("browse")}
                >
                  <BookOpen className="h-4 w-4" />
                  Browse
                </TabsTrigger>
                <TabsTrigger 
                  value="search" 
                  className="flex items-center gap-2"
                  onClick={() => setViewMode("search")}
                >
                  <Search className="h-4 w-4" />
                  Search
                </TabsTrigger>
                <TabsTrigger 
                  value="theme" 
                  className="flex items-center gap-2"
                  onClick={() => setViewMode("theme")}
                >
                  <Sparkles className="h-4 w-4" />
                  Themes
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Search View */}
        {viewMode === "search" && (
          <div className="mx-auto max-w-3xl">
            <div className="flex gap-4 mb-8">
              <div className="flex-1">
                <Input
                  placeholder="Search by keywords or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('browse.select.chapter')}
                </label>
                {isLoadingChapters ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={selectedChapter}
                    onValueChange={setSelectedChapter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('browse.select.chapter')} />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters?.map((chapter) => (
                        <SelectItem
                          key={chapter.chapter_number}
                          value={chapter.chapter_number.toString()}
                        >
                          Chapter {chapter.chapter_number}: {chapter.name}
                          <span className="block text-sm text-muted-foreground">
                            {chapter.verses_count} {t('browse.verses')}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('browse.select.verse')}
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder={t('browse.select.verse')}
                  value={selectedVerse}
                  onChange={(e) => setSelectedVerse(e.target.value)}
                />
              </div>
            </div>

            {selectedChapter && selectedVerse && verse && (
              <motion.div 
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <VerseCard verse={verse} />
              </motion.div>
            )}
          </div>
        )}

        {/* Browse View */}
        {viewMode === "browse" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {chapters?.map((chapter) => (
              <motion.div
                key={chapter.chapter_number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  className="cursor-pointer hover:border-primary transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group relative overflow-hidden"
                  onClick={() => handleVerseSelect(chapter.chapter_number.toString(), "1")}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-playfair">Chapter {chapter.chapter_number}</CardTitle>
                      <span className="text-sm text-primary/70">{chapter.verses_count} verses</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">
                      {chapter.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {chapter.name_meaning}
                    </p>
                    <div className="flex items-center text-sm text-primary/70">
                      <Grid className="h-4 w-4 mr-2" />
                      View Verses
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Theme View */}
        {viewMode === "theme" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme, index) => (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className="cursor-pointer hover:border-primary transition-all duration-300 transform hover:scale-[1.02] group"
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{theme.icon}</span>
                      <CardTitle>{theme.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {theme.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Verse Display */}
        {verse && (
          <Dialog open={!!verse} onOpenChange={() => {
            setSelectedChapter("");
            setSelectedVerse("");
          }}>
            <DialogContent className="max-w-4xl">
              <VerseCard verse={verse} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}