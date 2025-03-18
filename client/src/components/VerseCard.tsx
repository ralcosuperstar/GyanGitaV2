import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Bookmark, BookmarkCheck, Book, ArrowRight } from "lucide-react";
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
    chapter: number;
    verse: number;
  };
  showActions?: boolean;
  isBookmarked?: boolean;
  variant?: 'featured' | 'compact';
}

export default function VerseCard({ 
  verse, 
  showActions = true, 
  isBookmarked: initialIsBookmarked = false,
  variant = 'compact' 
}: VerseCardProps) {
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

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="h-full"
      >
        <Card className="h-full backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4 flex flex-col h-full">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">
                  {verse.chapter}.{verse.verse}
                </span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                {showActions && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBookmark}
                    className="h-8 w-8 hover:bg-white/10 transition-all duration-300"
                    disabled={bookmarkMutation.isPending}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Compact Content */}
            <div className="flex-1">
              <p className="text-base text-white/90 leading-relaxed font-light mb-4">
                {verse.purohit?.et || verse.tej.et || verse.siva?.et}
              </p>
            </div>

            {/* Compact Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
              <Button
                onClick={() => setShowModal(true)}
                className="flex-1 bg-primary/90 hover:bg-primary/80 border border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Book className="h-4 w-4 mr-2" />
                Read
              </Button>
              {showActions && (
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1 backdrop-blur-md bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0 h-full">
          <div className="grid md:grid-cols-[2fr,3fr] h-full">
            {/* Left Section - Chapter & Verse Info */}
            <div className="relative p-6 bg-gradient-to-br from-primary/10 to-transparent border-r border-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40" />
              <div className="relative z-10">
                <div className="flex flex-col gap-1 mb-6">
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wider">Chapter</span>
                  <span className="text-4xl font-medium text-white/90">{verse.chapter}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wider">Verse</span>
                  <span className="text-4xl font-medium text-white/90">{verse.verse}</span>
                </div>
                {showActions && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBookmark}
                    className="absolute top-4 right-4 h-9 w-9 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
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
            </div>

            {/* Right Section - Content */}
            <div className="p-6 flex flex-col">
              {/* Sanskrit Text */}
              <div className="mb-4">
                <p className="text-lg text-white/80 leading-relaxed font-light">
                  {verse.slok}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  {verse.transliteration}
                </p>
              </div>

              {/* English Translation */}
              <div className="flex-1">
                <div className="text-xl text-white/90 leading-relaxed font-light">
                  {verse.purohit?.et || verse.tej.et || verse.siva?.et}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                <Button
                  onClick={() => setShowModal(true)}
                  className="flex-1 bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary/80 hover:to-primary/70 
                           border border-primary/30 shadow-lg hover:shadow-xl backdrop-blur-sm 
                           transition-all duration-300 text-white py-6 group"
                >
                  <span className="flex items-center">
                    Read Full Verse
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                {showActions && (
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 
                             border border-white/20 hover:bg-white/10 hover:border-white/30 
                             shadow-lg hover:shadow-xl transition-all duration-300 py-6 px-6 group"
                  >
                    <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </motion.div>
  );
}