import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Bookmark, BookmarkCheck } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
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
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const { toast } = useToast();

  const handleBookmark = () => {
    bookmarkMutation.mutate();
  };

  const handleShare = () => {
    setShowShareDialog(true);
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

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="h-full"
      >
        <Card className="h-full backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-6 flex flex-col h-full">
            {/* Chapter and Verse Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <div className="px-3 py-1.5 rounded-full backdrop-blur-md bg-primary/10 border border-primary/20 text-sm">
                  Ch {verse.chapter}
                </div>
                <div className="px-3 py-1.5 rounded-full backdrop-blur-md bg-primary/10 border border-primary/20 text-sm">
                  V {verse.verse}
                </div>
              </div>
              {showActions && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmark}
                  className="h-8 w-8 hover:bg-white/10 transition-colors"
                  disabled={bookmarkMutation.isPending}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-5 w-5 text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* English Translation */}
              <div className="text-xl text-white/90 leading-relaxed">
                {verse.purohit?.et || verse.tej.et || verse.siva?.et}
              </div>

              {/* Sanskrit Text */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-base leading-relaxed text-white/80">
                  {verse.slok}
                </p>
                <p className="mt-2 text-sm text-gray-400 italic">
                  {verse.transliteration}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-4 border-t border-white/10 space-y-3">
              <Button
                onClick={() => setShowModal(true)}
                className="w-full bg-primary/90 hover:bg-primary/80 border border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Read More
              </Button>
              {showActions && (
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="w-full backdrop-blur-md bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </>
  );
}