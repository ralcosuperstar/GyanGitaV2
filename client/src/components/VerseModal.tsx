import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, ArrowRight, Heart, Bookmark, BookmarkCheck } from "lucide-react";
import { useState, useCallback, memo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Verse } from "@/lib/data";
import ShareDialog from "./ShareDialog";
import { motion, AnimatePresence } from "framer-motion";

interface VerseModalProps {
  verse: Verse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isBookmarked?: boolean;
}

const VerseContent = memo(({ verse, isBookmarked = false }: { verse: Verse, isBookmarked?: boolean }) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to bookmark verses');
      }

      const response = await fetch('/api/favorites', {
        method: isBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      // Invalidate both favorites and specific verse queries
      queryClient.invalidateQueries({ queryKey: ['/api/user/favorites'] });
      queryClient.invalidateQueries({ 
        queryKey: [`verse-${verse.chapter}-${verse.verse}`] 
      });

      toast({
        title: "Success",
        description: !isBookmarked ? "Verse has been bookmarked" : "Bookmark removed",
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

  const handleCopy = useCallback(async () => {
    const textToCopy = `${verse.purohit?.et || verse.tej.et || verse.siva?.et}\n\n${verse.slok}\n\n${verse.transliteration}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Verse has been copied to clipboard",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }, [verse, toast]);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative"
      >
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />

        <div className="relative p-4 sm:p-6 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-white/60 uppercase tracking-wider block">Bhagavad Gita</span>
                <span className="text-sm text-white/40">Ancient Wisdom</span>
              </div>
            </div>

            {/* Bookmark Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => !bookmarkMutation.isPending && bookmarkMutation.mutate()}
              className="h-9 w-9 rounded-full hover:bg-white/10 transition-all duration-300"
              disabled={bookmarkMutation.isPending}
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-5 w-5 text-primary" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>
            </div>

          <div className="space-y-8">
            {/* Primary Content Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Sanskrit Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 border border-white/10 shadow-lg group hover:bg-white/[0.07] transition-all duration-300 h-full"
              >
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-6">
                  Sanskrit Text
                </h3>
                <div className="space-y-6">
                  <p className="text-2xl leading-relaxed text-white/90 font-light break-words">
                    {verse.slok}
                  </p>
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-base text-gray-400 break-words">
                      {verse.transliteration}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Primary Translation */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 border border-white/10 shadow-lg group hover:bg-white/[0.07] transition-all duration-300 h-full"
              >
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-6">
                  Primary Translation
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-2xl leading-relaxed text-white/90 font-light break-words">
                    {verse.purohit?.et || verse.tej.et || verse.siva?.et}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Additional Translations Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                Additional Translations
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Alternative Translations */}
                {verse.purohit?.et && (
                  <div className="backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 border border-white/10 shadow-lg group hover:bg-white/[0.07] transition-all duration-300">
                    <div className="mb-4">
                      <span className="text-sm font-medium text-primary">Purohit Translation</span>
                    </div>
                    <p className="text-lg leading-relaxed text-white/90 font-light break-words">
                      {verse.purohit.et}
                    </p>
                  </div>
                )}

                {verse.siva?.et && (
                  <div className="backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 border border-white/10 shadow-lg group hover:bg-white/[0.07] transition-all duration-300">
                    <div className="mb-4">
                      <span className="text-sm font-medium text-primary">Sivananda Translation</span>
                    </div>
                    <p className="text-lg leading-relaxed text-white/90 font-light break-words">
                      {verse.siva.et}
                    </p>
                  </div>
                )}

                {verse.tej?.et && (
                  <div className="backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 border border-white/10 shadow-lg group hover:bg-white/[0.07] transition-all duration-300">
                    <div className="mb-4">
                      <span className="text-sm font-medium text-primary">Tejomayananda Translation</span>
                    </div>
                    <p className="text-lg leading-relaxed text-white/90 font-light break-words">
                      {verse.tej.et}
                    </p>
                  </div>
                )}

                {verse.tej?.ht && (
                  <div className="backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 border border-white/10 shadow-lg group hover:bg-white/[0.07] transition-all duration-300">
                    <div className="mb-4">
                      <span className="text-sm font-medium text-primary">Hindi Translation</span>
                    </div>
                    <p className="text-lg leading-relaxed text-white/90 font-light break-words">
                      {verse.tej.ht}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Commentary Section */}
            {verse.chinmay?.hc && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-6 border border-white/10 shadow-lg group hover:bg-white/[0.07] transition-all duration-300"
              >
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-6">
                  Commentary by Chinmayananda
                </h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-white/90 font-light break-words whitespace-pre-wrap">
                    {verse.chinmay.hc}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Actions Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10"
            >
              <Button
                className="flex-1 bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary/80 hover:to-primary/70 
                         border border-primary/30 shadow-lg hover:shadow-xl backdrop-blur-sm 
                         transition-all duration-300 text-white py-6 group"
                onClick={() => setShowShareDialog(true)}
              >
                <span className="flex items-center justify-center">
                  <Share2 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                  Share Verse
                  <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </span>
              </Button>
              <Button
                variant="outline"
                className="flex-1 backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 
                         border border-white/20 hover:bg-white/10 hover:border-white/30 
                         shadow-lg hover:shadow-xl transition-all duration-300 py-6 group"
                onClick={handleCopy}
              >
                {copied ? (
                  <span className="flex items-center justify-center">
                    <Check className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Copied
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Copy className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Copy Text
                  </span>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </>
  );
});

VerseContent.displayName = 'VerseContent';

export default function VerseModal({ verse, open, onOpenChange, isBookmarked }: VerseModalProps) {
  if (!verse) return null;

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-5xl mx-auto my-4 max-h-[calc(100vh-2rem)] overflow-y-auto 
                                backdrop-blur-xl bg-gradient-to-br from-black/50 to-black/30 
                                border border-white/10 rounded-xl shadow-2xl"
          >
            <VerseContent verse={verse} isBookmarked={isBookmarked} />
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}