import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BookmarkX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { getVerseByChapterAndNumber } from "@/lib/data";
import VerseCard from "@/components/VerseCard";

interface Favorite {
  id: number;
  user_id: number;
  chapter: string;
  verse: string;
  saved_at: string;
  notes: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  }
};

export default function Bookmarks() {
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['/api/user/favorites'],
    queryFn: async () => {
      const response = await fetch('/api/user/favorites');
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const data = await response.json();
      return data as Favorite[];
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const { data: verseDetails = [], isLoading: isLoadingVerses } = useQuery({
    queryKey: ['bookmarked-verses', favorites.map(f => `${f.chapter}-${f.verse}`).join(',')],
    queryFn: async () => {
      if (!favorites?.length) return [];

      const versePromises = favorites.map(async (favorite) => {
        try {
          const verse = await getVerseByChapterAndNumber(
            parseInt(favorite.chapter),
            parseInt(favorite.verse)
          );

          if (!verse) {
            console.error(`Failed to load verse ${favorite.chapter}:${favorite.verse}`);
            return null;
          }

          return {
            ...verse,
            id: favorite.id
          };
        } catch (error) {
          console.error(`Error loading verse ${favorite.chapter}:${favorite.verse}:`, error);
          return null;
        }
      });

      const results = await Promise.all(versePromises);
      return results.filter((v): v is NonNullable<typeof v> => v !== null);
    },
    enabled: favorites.length > 0,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const isLoading = isLoadingFavorites || isLoadingVerses;

  if (isLoading) {
    return (
      <PageLayout
        title="My Bookmarks"
        subtitle="Your personal collection of sacred verses"
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full" />
          ))}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="My Bookmarks"
      subtitle="Your personal collection of sacred verses"
    >
      {verseDetails?.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {verseDetails.map((verse) => (
            <motion.div
              key={verse.id}
              variants={itemVariants}
            >
              <VerseCard
                verse={verse}
                showActions={true}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="text-center py-12"
        >
          <div className="mb-4 relative">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl" />
            <BookmarkX className="mx-auto h-12 w-12 text-muted-foreground relative" />
          </div>
          <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground mb-6">Start exploring verses and bookmark your favorites for quick access</p>
          <Button asChild className="transition-transform hover:scale-105">
            <Link href="/browse">Browse Verses</Link>
          </Button>
        </motion.div>
      )}
    </PageLayout>
  );
}