import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { BookmarkX } from "lucide-react";
import VerseCard from "@/components/VerseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import type { Verse } from "@/lib/data";
import { getVerseByChapterAndNumber } from "@/lib/data";

interface Favorite {
  id: number;
  chapter: string;
  verse: string;
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
  const { t } = useLanguage();

  // First fetch the user's favorites
  const { data: favorites = [], isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['/api/user/favorites'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to view bookmarks');
      }

      const response = await fetch('/api/user/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view bookmarks');
        }
        throw new Error('Failed to fetch bookmarks');
      }

      const data: Favorite[] = await response.json();
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0 // Always refetch
  });

  // Then fetch complete verse data for each favorite
  const { data: verseDetails = [], isLoading: isLoadingVerses } = useQuery({
    queryKey: ['bookmarked-verses', favorites],
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
      return results.filter((v): v is Verse & { id: number } => v !== null);
    },
    enabled: favorites.length > 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0 // Always refetch when favorites change
  });

  const isLoading = isLoadingFavorites || isLoadingVerses;

  if (isLoading) {
    return (
      <PageLayout
        title={t('bookmarks.title')}
        subtitle={t('bookmarks.subtitle')}
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
      title={t('bookmarks.title')}
      subtitle={t('bookmarks.subtitle')}
    >
      {verseDetails?.length ? (
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
                isBookmarked={true}
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
          <h3 className="text-lg font-medium mb-2">{t('bookmarks.empty.title')}</h3>
          <p className="text-muted-foreground mb-6">{t('bookmarks.empty.description')}</p>
          <Button asChild className="transition-transform hover:scale-105">
            <Link href="/browse">{t('bookmarks.empty.action')}</Link>
          </Button>
        </motion.div>
      )}
    </PageLayout>
  );
}