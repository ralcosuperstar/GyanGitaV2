
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Heart, BookmarkPlus, Share, Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DailyVerse() {
  const [dailyVerse, setDailyVerse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchDailyVerse = async () => {
      try {
        // This would be an API call in a real app
        // Simulate API request delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mocked daily verse
        setDailyVerse({
          chapter: 2,
          verse: 47,
          content: {
            slok: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
            transliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
            translation: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, and never be attached to not doing your duty."
          },
          commentary: "This is one of the most famous verses of the Bhagavad Gita. Lord Krishna explains the importance of performing one's duty without attachment to results."
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching daily verse:", error);
        setIsLoading(false);
      }
    };

    fetchDailyVerse();
  }, []);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would call an API to save to user preferences
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, this would call an API to save to user preferences
  };

  const shareVerse = () => {
    // In a real app, this would open a share dialog with web share API
    alert("Sharing functionality would be implemented here.");
  };

  const playAudio = () => {
    // In a real app, this would play audio of the verse
    alert("Audio playback would be implemented here.");
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-20 w-full mb-6" />
          <Skeleton className="h-16 w-full mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex justify-between mt-8">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dailyVerse) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border">
        <CardContent className="p-0">
          <div className="bg-primary/5 p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                Chapter {dailyVerse.chapter}, Verse {dailyVerse.verse}
              </h3>
              <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                Today's Verse
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="font-serif text-lg mb-6 text-center leading-relaxed">
              {dailyVerse.content.slok.split('\n').map((line: string, i: number) => (
                <div key={i} className="mb-1">{line}</div>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground mb-4 italic text-center">
              {dailyVerse.content.transliteration.split('\n').map((line: string, i: number) => (
                <div key={i} className="mb-1">{line}</div>
              ))}
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg mb-6">
              <p className="text-base">{dailyVerse.content.translation}</p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>{dailyVerse.commentary}</p>
            </div>
            
            <div className="flex justify-between mt-6 pt-4 border-t">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={toggleFavorite}
              >
                <Heart 
                  className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} 
                />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={toggleBookmark}
              >
                <BookmarkPlus 
                  className={`h-5 w-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} 
                />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={playAudio}
              >
                <Play className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={shareVerse}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
