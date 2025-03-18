import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Bookmark, BookmarkCheck, Book, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ShareDialog from "@/components/ShareDialog";
import { motion } from 'framer-motion';
import VerseModal from "./VerseModal";

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
  variant?: 'compact' | 'detailed';
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

  // Compact variant for mood selection results
  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="h-full"
      >
        <Card className="h-full backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="flex flex-col h-full p-6 relative">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBookmark}
                    className="h-8 w-8 rounded-full hover:bg-white/10 transition-all duration-300"
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

              {/* Main Content */}
              <div className="flex-grow mb-6">
                <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-lg text-white/90 leading-relaxed font-light">
                    {verse.purohit?.et || verse.tej.et || verse.siva?.et}
                  </p>
                </div>
              </div>

              {/* Actions Container */}
              <div className="flex items-center gap-3 pt-4 mt-auto border-t border-white/10">
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
                    size="icon"
                    onClick={handleShare}
                    className="h-11 w-11 shrink-0 backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 
                              border border-white/20 hover:bg-white/10 hover:border-white/30 
                              shadow-lg hover:shadow-xl transition-all duration-300 group rounded-lg"
                  >
                    <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        <VerseModal 
          verse={verse}
          open={showModal}
          onOpenChange={setShowModal}
        />
        <ShareDialog
          verse={verse}
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
        />
      </motion.div>
    );
  }

  // Detailed variant for homepage and featured sections
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-0 h-full relative">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />

          <div className="relative grid lg:grid-cols-[1fr,2fr] h-full">
            {/* Left Section - Info & Sanskrit */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-br from-primary/10 to-transparent">
              {/* Chapter & Verse Info */}
              <div className="flex flex-col gap-6 mb-8">
                <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wider block mb-2">Chapter</span>
                  <span className="text-4xl font-medium text-white/90 block">{verse.chapter}</span>
                </div>
                <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wider block mb-2">Verse</span>
                  <span className="text-4xl font-medium text-white/90 block">{verse.verse}</span>
                </div>
              </div>

              {/* Sanskrit Text */}
              <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Sanskrit</h3>
                <p className="text-lg text-white/90 leading-relaxed font-light mb-4">
                  {verse.slok}
                </p>
                <p className="text-sm text-gray-400">
                  {verse.transliteration}
                </p>
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

            {/* Right Section - Translation & Actions */}
            <div className="p-6 flex flex-col">
              {/* English Translation */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">Translation</h3>
                <div className="backdrop-blur-sm bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="text-xl text-white/90 leading-relaxed font-light">
                    {verse.purohit?.et || verse.tej.et || verse.siva?.et}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 px-6 border-t border-white/10">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-primary/90 to-primary/80 hover:from-primary/80 hover:to-primary/70 
                           border border-primary/30 shadow-lg hover:shadow-xl backdrop-blur-sm 
                           transition-all duration-300 text-white py-6 group"
                  onClick={() => setShowModal(true)}
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
                    onClick={handleShare}
                    className="p-2 m-2 w-12 backdrop-blur-md bg-gradient-to-r from-white/10 to-white/5 
                             border border-white/20 hover:bg-white/10 hover:border-white/30 
                             shadow-lg hover:shadow-xl transition-all duration-300 py-5 group flex-shrink-0"
                  >
                    <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <VerseModal 
        verse={verse}
        open={showModal}
        onOpenChange={setShowModal}
      />
      <ShareDialog
        verse={verse}
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </motion.div>
  );
}