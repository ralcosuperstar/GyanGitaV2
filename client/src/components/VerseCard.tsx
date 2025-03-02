import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Share2, Bookmark, BookmarkCheck, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import ShareDialog from "@/components/ShareDialog";

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

// Add showShareDialog state
export default function VerseCard({ verse, showActions = true, isBookmarked: initialIsBookmarked = false }: VerseCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("verse");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const { toast } = useToast();

  const { data: relatedVerses, isLoading: isLoadingRelated } = useQuery({
    queryKey: [`/api/verse/${verse.chapter}/${verse.verse}/related`],
    queryFn: async () => {
      const response = await fetch(`/api/verse/${verse.chapter}/${verse.verse}/related`);
      if (!response.ok) {
        throw new Error('Failed to fetch related verses');
      }
      return response.json();
    },
    enabled: showModal
  });

  const triggerVibration = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(200);
    }
  };

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

  // Replace the handleShare function
  const handleShare = () => {
    setShowShareDialog(true);
  };

  const renderVerse = (v: any) => (
    <div key={`${v.chapter}-${v.verse}`} className="bg-muted/50 p-4 rounded-lg mb-4 hover:bg-muted/70 transition-colors cursor-pointer">
      <h4 className="font-medium mb-2">
        Chapter {v.chapter}, Verse {v.verse}
      </h4>
      <p className="text-sm font-sanskrit mb-2 leading-relaxed break-words">{v.slok}</p>
      <p className="text-sm text-foreground/90 leading-relaxed break-words">{v.tej.ht}</p>
    </div>
  );

  useEffect(() => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        scrollAreaRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  }, [activeTab]);

  return (
    <>
      <Card className="group h-full transition-all hover:scale-[1.02] duration-200 hover:shadow-lg">
        <CardHeader className="bg-primary/5 transition-colors group-hover:bg-primary/10">
          <CardTitle className="font-playfair text-xl flex justify-between items-center">
            <span>Chapter {verse.chapter}, Verse {verse.verse}</span>
            {showActions && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className="h-8 w-8 transition-transform hover:scale-110"
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

        <CardContent className="p-6 flex flex-col min-h-[320px]">
          <div className="mb-6">
            <h3 className="font-semibold text-primary mb-3">{t('verse.sanskrit')}</h3>
            <p className="text-lg font-sanskrit leading-relaxed break-words">{verse.slok}</p>
          </div>

          <div className="flex-grow mb-6">
            <h3 className="font-semibold text-primary mb-3">{t('verse.translation')}</h3>
            <p className="leading-relaxed break-words">{verse.tej.ht}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t mt-auto">
            <Button
              onClick={() => setShowModal(true)}
              className="flex-1 transition-transform hover:scale-105"
            >
              {t('verse.readMore')}
            </Button>
            {showActions && (
              <Button
                variant="outline"
                onClick={handleShare}
                className="gap-2 transition-transform hover:scale-105"
              >
                <Share2 className="h-4 w-4" />
                {t('verse.share')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          className="sm:max-w-[90%] md:max-w-4xl w-[calc(100%-2rem)] h-[90vh] flex flex-col p-0 gap-0 rounded-lg sm:rounded-xl bg-background shadow-lg overflow-hidden border data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          hideCloseButton
        >
          <div className="flex flex-col h-full">
            <div className="p-4 sm:p-6 border-b">
              <div className="flex items-center justify-between">
                <DialogTitle className="font-playfair text-xl sm:text-2xl">
                  Chapter {verse.chapter}, Verse {verse.verse}
                </DialogTitle>
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                  {showActions && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBookmark}
                      className="h-8 w-8 rounded-md hover:bg-background/90 transition-all hover:scale-105"
                      disabled={bookmarkMutation.isPending}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="h-5 w-5 text-primary" />
                      ) : (
                        <Bookmark className="h-5 w-5" />
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md hover:bg-background/90 transition-all hover:scale-105"
                    onClick={() => setShowModal(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <Tabs
              defaultValue="verse"
              className="flex-1 flex flex-col overflow-hidden"
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                if (scrollAreaRef.current) {
                  const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
                  if (scrollArea) {
                    scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              }}
            >
              <TabsList className="w-full h-12 bg-background border-b">
                <div className="flex w-full">
                  <TabsTrigger
                    value="verse"
                    className="flex-1 text-xs sm:text-base py-2.5 data-[state=active]:bg-primary/10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-colors"
                  >
                    {t('verse.text')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="translations"
                    className="flex-1 text-xs sm:text-base py-2.5 data-[state=active]:bg-primary/10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-colors"
                  >
                    {t('verse.translations')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="commentary"
                    className="flex-1 text-xs sm:text-base py-2.5 data-[state=active]:bg-primary/10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-colors"
                  >
                    {t('verse.commentary')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="related"
                    className="flex-1 text-xs sm:text-base py-2.5 data-[state=active]:bg-primary/10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-colors"
                  >
                    {t('verse.related')}
                  </TabsTrigger>
                </div>
              </TabsList>

              <div className="flex-1 overflow-hidden bg-muted/5">
                <ScrollArea ref={scrollAreaRef} className="h-full scroll-area">
                  <div className="p-4 sm:p-6 space-y-6">
                    <TabsContent value="verse" className="mt-0 space-y-6 animate-in fade-in-50">
                      <div>
                        <h3 className="font-semibold mb-3 text-primary">{t('verse.sanskrit')}</h3>
                        <div className="bg-muted/50 p-4 rounded-lg shadow-sm">
                          <p className="text-lg sm:text-xl font-sanskrit leading-relaxed break-words">{verse.slok}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3 text-primary">{t('verse.transliteration')}</h3>
                        <div className="bg-muted/50 p-4 rounded-lg shadow-sm">
                          <p className="text-base sm:text-lg leading-relaxed break-words">{verse.transliteration}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="translations" className="mt-0 space-y-6 animate-in fade-in-50">
                      {verse.tej && (
                        <div className="bg-muted/50 p-4 rounded-lg shadow-sm">
                          <p className="font-medium text-primary mb-3">Swami Tejomayananda</p>
                          <div className="space-y-4">
                            <p className="leading-relaxed break-words">{verse.tej.ht}</p>
                            {verse.tej.et && (
                              <p className="text-muted-foreground leading-relaxed break-words border-t border-border/50 pt-4">
                                {verse.tej.et}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {verse.siva?.et && (
                        <div className="bg-muted/50 p-4 rounded-lg shadow-sm">
                          <p className="font-medium text-primary mb-3">Swami Sivananda</p>
                          <p className="leading-relaxed break-words">{verse.siva.et}</p>
                        </div>
                      )}

                      {verse.purohit?.et && (
                        <div className="bg-muted/50 p-4 rounded-lg shadow-sm">
                          <p className="font-medium text-primary mb-3">Shri Purohit Swami</p>
                          <p className="leading-relaxed break-words">{verse.purohit.et}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="commentary" className="mt-0 animate-in fade-in-50">
                      {verse.chinmay?.hc ? (
                        <div className="bg-muted/50 p-4 rounded-lg shadow-sm">
                          <p className="font-medium text-primary mb-3">Swami Chinmayananda</p>
                          <p className="leading-relaxed break-words">{verse.chinmay.hc}</p>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-muted-foreground">
                          <p>{t('verse.noCommentary')}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="related" className="mt-0 animate-in fade-in-50">
                      <div className="space-y-4">
                        <h3 className="font-medium text-primary mb-4">{t('verse.relatedVerses')}</h3>
                        {isLoadingRelated ? (
                          <div className="space-y-4">
                            {Array(3).fill(0).map((_, i) => (
                              <Skeleton key={i} className="h-32 w-full" />
                            ))}
                          </div>
                        ) : relatedVerses?.length ? (
                          relatedVerses.map(renderVerse)
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            <p>{t('verse.noRelatedVerses')}</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </div>
                </ScrollArea>
              </div>
            </Tabs>

            <DialogFooter className="p-4 sm:p-6 bg-background border-t mt-auto">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {showActions && (
                  <Button
                    variant="outline"
                    onClick={handleBookmark}
                    className="w-full sm:w-auto flex-1 gap-2 transition-transform hover:scale-105"
                    disabled={bookmarkMutation.isPending}
                  >
                    {isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                    {isBookmarked ? t('verse.bookmarked') : t('verse.bookmark')}
                  </Button>
                )}
                <Button
                  onClick={handleShare}
                  className="w-full sm:w-auto flex-1 gap-2 transition-transform hover:scale-105"
                >
                  <Share2 className="h-5 w-5" />
                  {t('verse.share')}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add ShareDialog */}
      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </>
  );
}