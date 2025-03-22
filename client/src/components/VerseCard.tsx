import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Bookmark, BookmarkCheck, Book, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ShareDialog from "./ShareDialog";
import VerseModal from "./VerseModal";
import { motion, AnimatePresence } from 'framer-motion';

interface VerseCardProps {
  verse: {
    id?: number;
    chapter: number;
    verse: number;
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
    isBookmarked?: boolean;
  };
  showActions?: boolean;
  isBookmarked?: boolean;
  variant?: 'compact' | 'detailed';
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

export default function VerseCard({
  verse,
  showActions = true,
  isBookmarked: initialIsBookmarked = false,
  variant = 'compact',
  onBookmarkChange
}: VerseCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [localIsBookmarked, setLocalIsBookmarked] = useState(initialIsBookmarked || verse.isBookmarked || false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    setLocalIsBookmarked(initialIsBookmarked || verse.isBookmarked || false);
  }, [initialIsBookmarked, verse.isBookmarked]);

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const method = localIsBookmarked ? 'DELETE' : 'POST';
      const response = await fetch('/api/favorites', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chapter: verse.chapter,
          verse: verse.verse
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update bookmark');
      }

      return response.json();
    },
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['/api/user/favorites'] });
      await queryClient.cancelQueries({ queryKey: ['bookmarked-verses'] });

      // Store the previous state
      const previousState = localIsBookmarked;

      // Optimistically update UI
      setLocalIsBookmarked(!previousState);

      // Return context for rollback
      return { previousState };
    },
    onError: (_error, _vars, context) => {
      // Rollback on error
      if (context) {
        setLocalIsBookmarked(context.previousState);
      }
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
        duration: 3000,
      });
    },
    onSuccess: (_data, _vars, context) => {
      const newState = !context!.previousState;

      // Notify parent component
      if (onBookmarkChange) {
        onBookmarkChange(newState);
      }

      toast({
        title: "Success",
        description: newState ? "Verse has been bookmarked" : "Bookmark removed",
        duration: 2000,
      });

      // Refresh queries after successful mutation
      queryClient.invalidateQueries({ queryKey: ['/api/user/favorites'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarked-verses'] });
    }
  });

  const handleBookmarkClick = () => {
    if (!bookmarkMutation.isPending) {
      bookmarkMutation.mutate();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="h-full"
    >
      <Card className="h-full backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="flex flex-col h-full p-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg backdrop-blur-md bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20">
                  <span className="text-sm text-white/60">Ch.{verse.chapter}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg backdrop-blur-md bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/20">
                  <span className="text-sm text-white/60">V.{verse.verse}</span>
                </div>
              </div>
              {showActions && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={localIsBookmarked ? 'bookmarked' : 'unbookmarked'}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBookmarkClick}
                      className="h-8 w-8 rounded-full hover:bg-white/10 transition-all duration-300"
                      disabled={bookmarkMutation.isPending}
                    >
                      {localIsBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-primary animate-in" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            <div className="flex-grow mb-6">
              <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-lg text-white/90 leading-relaxed font-light">
                  {verse.purohit?.et || verse.tej.et || verse.siva?.et}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <Button
                onClick={() => setShowModal(true)}
                className="flex-1 bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary/80 hover:to-primary/70 
                          border border-primary/30 shadow-lg hover:shadow-xl backdrop-blur-sm 
                          transition-all duration-300 text-white py-5 group"
              >
                <span className="flex items-center justify-center">
                  <Book className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                  Read Full Verse
                  <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              </Button>

              {showActions && (
                <Button
                  variant="outline"
                  onClick={() => setShowShareDialog(true)}
                  className="px-5 backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 
                            border border-white/20 hover:bg-white/10 hover:border-white/30 
                            shadow-lg hover:shadow-xl transition-all duration-300 py-5 group"
                >
                  <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <VerseModal
        verse={verse}
        open={showModal}
        onOpenChange={setShowModal}
        isBookmarked={localIsBookmarked}
        onBookmarkChange={setLocalIsBookmarked}
      />

      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </motion.div>
  );
}