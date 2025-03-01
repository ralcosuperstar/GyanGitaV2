import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Share2, Bookmark, BookmarkCheck } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface VerseCardProps {
  verse: {
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
  };
  showActions?: boolean;
  isBookmarked?: boolean;
}

export default function VerseCard({ verse, showActions = true, isBookmarked: initialIsBookmarked = false }: VerseCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const { toast } = useToast();

  // Fetch related verses when modal is open
  const { data: relatedVerses, isLoading: isLoadingRelated } = useQuery({
    queryKey: [`/api/verse/${verse.chapter}/${verse.verse}/related`],
    queryFn: async () => {
      const response = await fetch(`/api/verse/${verse.chapter}/${verse.verse}/related`);
      if (!response.ok) {
        throw new Error('Failed to fetch related verses');
      }
      return response.json();
    },
    enabled: showModal // Only fetch when modal is open
  });

  // Vibration feedback function
  const triggerVibration = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(200);
    }
  };

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/favorites', {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          chapter: verse.chapter.toString(),
          verse: verse.verse.toString()
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to manage bookmarks');
        }
        throw new Error(isBookmarked ? 'Failed to remove bookmark' : 'Failed to bookmark verse');
      }

      return response.json();
    },
    onSuccess: () => {
      triggerVibration();
      setIsBookmarked(!isBookmarked);
      queryClient.invalidateQueries({ queryKey: ['/api/user/favorites'] });
      toast({
        title: "Success",
        description: isBookmarked ? "Bookmark removed" : "Verse has been bookmarked",
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    }
  });

  const handleBookmark = () => {
    bookmarkMutation.mutate();
  };

  const handleShare = () => {
    const text = `Bhagavad Gita - Chapter ${verse.chapter}, Verse ${verse.verse}\n\n${verse.slok}\n\n${verse.transliteration}\n\n${verse.tej.ht}`;
    const url = `${window.location.origin}/browse?chapter=${verse.chapter}&verse=${verse.verse}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank');
  };

  const renderVerse = (v: any) => (
    <div key={`${v.chapter}-${v.verse}`} className="bg-muted/50 p-4 rounded-lg mb-4">
      <h4 className="font-medium mb-2">
        Chapter {v.chapter}, Verse {v.verse}
      </h4>
      <p className="text-sm font-sanskrit mb-2">{v.slok}</p>
      <p className="text-sm text-foreground/90">{v.tej.ht}</p>
    </div>
  );

  return (
    <>
      <Card className="overflow-hidden transition-transform hover:scale-[1.02] duration-200 flex flex-col h-full">
        <CardHeader className="bg-primary/5">
          <CardTitle className="font-playfair text-xl flex justify-between items-center">
            <span>Chapter {verse.chapter}, Verse {verse.verse}</span>
            {showActions && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className="h-8 w-8"
                disabled={bookmarkMutation.isPending}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4 pt-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-primary">{t('verse.sanskrit')}</h3>
            <p className="text-lg font-sanskrit leading-relaxed break-words">{verse.slok}</p>
          </div>

          <div className="space-y-2 flex-1">
            <h3 className="font-semibold text-primary">{t('verse.translation')}</h3>
            <p className="leading-relaxed break-words">{verse.tej.ht}</p>
          </div>

          <div className="flex gap-2 pt-4 mt-auto">
            <Button onClick={() => setShowModal(true)} className="flex-1">
              {t('verse.readMore')}
            </Button>
            {showActions && (
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                {t('verse.share')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
          <DialogHeader className="px-6 py-4 bg-background border-b sticky top-0 z-10">
            <DialogTitle className="font-playfair text-2xl">
              Chapter {verse.chapter}, Verse {verse.verse}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="verse" className="flex-1 flex flex-col min-h-0">
            <TabsList className="w-full grid grid-cols-4 px-6 bg-background sticky top-[73px] z-10">
              <TabsTrigger value="verse">{t('verse.text')}</TabsTrigger>
              <TabsTrigger value="translations">{t('verse.translations')}</TabsTrigger>
              <TabsTrigger value="commentary">{t('verse.commentary')}</TabsTrigger>
              <TabsTrigger value="related">{t('verse.related')}</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full py-4 px-6">
                <TabsContent value="verse" className="space-y-6 mt-0">
                  <div>
                    <h3 className="font-semibold mb-2 text-primary">{t('verse.sanskrit')}</h3>
                    <p className="text-xl font-sanskrit bg-muted/50 p-4 rounded-lg leading-relaxed break-words">
                      {verse.slok}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-primary">{t('verse.transliteration')}</h3>
                    <p className="text-lg bg-muted/50 p-4 rounded-lg leading-relaxed break-words">
                      {verse.transliteration}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="translations" className="space-y-6 mt-0">
                  {verse.tej && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="font-medium text-primary mb-2">Swami Tejomayananda</p>
                      <p className="leading-relaxed break-words">{verse.tej.ht}</p>
                      {verse.tej.et && (
                        <p className="text-muted-foreground mt-2 leading-relaxed break-words">{verse.tej.et}</p>
                      )}
                    </div>
                  )}

                  {verse.siva?.et && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="font-medium text-primary mb-2">Swami Sivananda</p>
                      <p className="leading-relaxed break-words">{verse.siva.et}</p>
                    </div>
                  )}

                  {verse.purohit?.et && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="font-medium text-primary mb-2">Shri Purohit Swami</p>
                      <p className="leading-relaxed break-words">{verse.purohit.et}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="commentary" className="space-y-6 mt-0">
                  {verse.chinmay?.hc ? (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="font-medium text-primary mb-2">Swami Chinmayananda</p>
                      <p className="leading-relaxed break-words">{verse.chinmay.hc}</p>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      {t('verse.noCommentary')}
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="related" className="space-y-6 mt-0">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium text-primary mb-4">{t('verse.relatedVerses')}</p>
                    <div className="space-y-4">
                      {isLoadingRelated ? (
                        Array(3).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-32 w-full" />
                        ))
                      ) : relatedVerses?.length ? (
                        relatedVerses.map(renderVerse)
                      ) : (
                        <p className="text-center text-muted-foreground">
                          {t('verse.noRelatedVerses')}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>

          <div className="px-6 py-4 bg-background border-t sticky bottom-0">
            <div className="flex gap-2">
              {showActions && (
                <Button 
                  variant="outline" 
                  onClick={handleBookmark} 
                  className="flex-1 gap-2"
                  disabled={bookmarkMutation.isPending}
                >
                  {isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                  {isBookmarked ? t('verse.bookmarked') : t('verse.bookmark')}
                </Button>
              )}
              <Button onClick={handleShare} className="flex-1 gap-2">
                <Share2 className="h-5 w-5" />
                {t('verse.share')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}