import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Bookmark, BookmarkPlus, Play, HeartOff, Copy } from 'lucide-react';
import { Link } from 'wouter';
import { toast } from "sonner";
import { useLanguage } from '@/contexts/language-context';

type VerseCardProps = {
  chapter: number;
  verse: number;
  content: {
    slok: string;
    transliteration?: string;
    translation: string;
  };
  isCompact?: boolean;
  showActions?: boolean;
  onFavorite?: (chapter: number, verse: number) => void;
  onBookmark?: (chapter: number, verse: number) => void;
  className?: string;
};

export default function VerseCard({
  chapter,
  verse,
  content,
  isCompact = false,
  showActions = true,
  onFavorite,
  onBookmark,
  className = "",
}: VerseCardProps) {
  const { t } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavorite?.(chapter, verse);
    toast(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(chapter, verse);
    toast(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
    // In a real implementation, this would play/pause the audio
    toast(isAudioPlaying ? "Audio paused" : "Audio playing");
  };

  const shareVerse = () => {
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: `Bhagavad Gita: Chapter ${chapter}, Verse ${verse}`,
        text: `${content.slok}\n\n${content.translation}`,
        url: window.location.origin + `/verse/${chapter}/${verse}`,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback copy to clipboard
      const shareText = `Bhagavad Gita: Chapter ${chapter}, Verse ${verse}\n\n${content.slok}\n\n${content.translation}`;
      navigator.clipboard.writeText(shareText);
      toast("Verse copied to clipboard");
    }
  };

  const copyVerse = () => {
    const textToCopy = `Bhagavad Gita: Chapter ${chapter}, Verse ${verse}\n\n${content.slok}\n\n${content.translation}`;
    navigator.clipboard.writeText(textToCopy);
    toast("Verse copied to clipboard");
  };

  // Animation variants
  const cardVariants = {
    hover: { y: -5, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)" },
    tap: { y: 0, boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.05)" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      className={className}
    >
      <Card className="overflow-hidden border transition-all">
        <CardContent className={`p-0 ${isCompact ? 'text-sm' : ''}`}>
          {/* Header */}
          <div className="bg-primary/5 p-3 border-b flex items-center justify-between">
            <h3 className="font-medium">
              {t('browse.chapter')} {chapter}, {t('browse.verse')} {verse}
            </h3>

            <div className="flex gap-1">
              {showActions && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={copyVerse}
                    title="Copy verse"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => setIsExpanded(!isExpanded)}
                    title={isExpanded ? "Show less" : "Show more"}
                  >
                    {isExpanded ? 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up">
                        <path d="m18 15-6-6-6 6"/>
                      </svg>
                      : 
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    }
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className={`p-4 ${isCompact ? 'space-y-2' : 'space-y-4'}`}>
            {/* Sanskrit text with hover effect */}
            <motion.div 
              className="font-serif text-center leading-relaxed"
              whileHover={{ scale: 1.02 }}
            >
              {content.slok.split('\n').map((line, i) => (
                <div key={i} className="mb-1">{line}</div>
              ))}
            </motion.div>

            {/* Only show transliteration if expanded or not compact */}
            {(isExpanded || !isCompact) && content.transliteration && (
              <motion.div 
                className="text-sm text-muted-foreground italic text-center"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {content.transliteration.split('\n').map((line, i) => (
                  <div key={i} className="mb-1">{line}</div>
                ))}
              </motion.div>
            )}

            {/* Translation */}
            <div className={`${isCompact ? 'text-sm' : 'text-base'} ${isExpanded ? 'bg-muted/30 p-3 rounded-lg' : ''}`}>
              {content.translation}
            </div>

            {/* Extended content only shown when expanded */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 border-t pt-3 mt-3"
              >
                <h4 className="font-medium text-sm">Commentary</h4>
                <p className="text-sm text-muted-foreground">
                  This is a placeholder for extended commentary. In a production app, this would load actual commentary for this verse.
                </p>

                {isAudioPlaying && (
                  <div className="bg-muted/20 p-3 rounded-lg flex items-center justify-between">
                    <span className="text-xs">Now playing Sanskrit recitation</span>
                    <div className="flex space-x-1 items-center">
                      <span className="animate-pulse bg-primary h-3 w-1 rounded-full"></span>
                      <span className="animate-pulse bg-primary h-5 w-1 rounded-full" style={{ animationDelay: "0.1s" }}></span>
                      <span className="animate-pulse bg-primary h-3 w-1 rounded-full" style={{ animationDelay: "0.2s" }}></span>
                      <span className="animate-pulse bg-primary h-4 w-1 rounded-full" style={{ animationDelay: "0.3s" }}></span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/verse/${chapter}/${verse}`}>
                      View full details
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            {showActions && (
              <div className="flex justify-between pt-2 border-t mt-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={toggleFavorite}
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFavorite ? 
                    <Heart className="h-4 w-4 fill-primary text-primary" /> : 
                    <Heart className="h-4 w-4" />
                  }
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={toggleBookmark}
                  title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {isBookmarked ? 
                    <BookmarkPlus className="h-4 w-4 fill-primary text-primary" /> : 
                    <BookmarkPlus className="h-4 w-4" />
                  }
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={toggleAudio}
                  title={isAudioPlaying ? "Pause audio" : "Play audio"}
                >
                  <Play className={`h-4 w-4 ${isAudioPlaying ? 'text-primary' : ''}`} />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={shareVerse}
                  title="Share verse"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}