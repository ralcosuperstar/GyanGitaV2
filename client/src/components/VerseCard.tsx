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
import { motion } from 'framer-motion';

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
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("verse");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const { toast } = useToast();

  // Reset scroll position when tab changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = 0;
      }
    }
  }, [activeTab]);

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


  return (
    <>
      <Card className="group h-full flex flex-col transition-all hover:scale-[1.02] duration-200 hover:shadow-lg">
        <CardHeader className="bg-primary/5 transition-colors group-hover:bg-primary/10">
          <CardTitle className="font-playfair text-xl flex justify-between items-center">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {t('verse.verseNumber', { chapter: verse.chapter, verse: verse.verse })}
            </motion.span>
            {showActions && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmark}
                  className="h-8 w-8 transition-transform"
                  disabled={bookmarkMutation.isPending}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-5 w-5 text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 p-6 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h3 className="font-semibold text-primary mb-3">{t('verse.sanskrit')}</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-lg font-sanskrit leading-relaxed break-words">{verse.slok}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 mb-6"
          >
            <h3 className="font-semibold text-primary mb-3">{t('verse.translation')}</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="leading-relaxed break-words">{verse.tej.ht}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 border-t mt-auto space-y-3 sm:space-y-0 sm:flex sm:gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                onClick={() => setShowModal(true)}
                className="w-full transition-transform"
              >
                {t('verse.readMore')}
              </Button>
            </motion.div>
            {showActions && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="w-full sm:w-auto gap-2 transition-transform"
                >
                  <Share2 className="h-4 w-4" />
                  {t('verse.shareAction')}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          className="sm:max-w-[90%] md:max-w-4xl w-[calc(100%-2rem)] h-[90vh] flex flex-col p-0 gap-0 rounded-lg sm:rounded-xl bg-background shadow-lg overflow-hidden border"
        >
          <div className="flex flex-col h-full">
            <div className="p-4 sm:p-6 border-b">
              <div className="flex items-center justify-between">
                <DialogTitle className="font-playfair text-xl sm:text-2xl">
                  {t('verse.verseNumber', { chapter: verse.chapter, verse: verse.verse })}
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
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full h-12 bg-background border-b">
                <div className="flex w-full">
                  {[
                    { value: 'verse', key: 'verse.text' },
                    { value: 'translations', key: 'verse.translations' },
                    { value: 'commentary', key: 'verse.commentary' },
                    { value: 'related', key: 'verse.related' }
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex-1 text-xs sm:text-base py-2.5 data-[state=active]:bg-primary/10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all duration-300 ease-out"
                    >
                      {t(tab.key)}
                    </TabsTrigger>
                  ))}
                </div>
              </TabsList>

              <div className="flex-1 overflow-hidden bg-muted/5">
                <ScrollArea 
                  ref={scrollAreaRef} 
                  className="h-full" 
                  style={{ maxHeight: 'calc(90vh - 13rem)' }}
                >
                  <div className="p-4 sm:p-6 space-y-6 pb-20">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    >
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

                      <TabsContent value="related" className="mt-0 animate-in fade-in-50 pb-12">
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
                    </motion.div>
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
                  {t('verse.shareAction')}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </>
  );
}