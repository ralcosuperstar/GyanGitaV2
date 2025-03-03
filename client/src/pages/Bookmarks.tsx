import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { BookmarkX } from "lucide-react";
import VerseCard from "@/components/VerseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
      damping: 20
    }
  }
};

export default function Bookmarks() {
  const { t } = useLanguage();

  // First fetch the user's favorites
  const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['/api/user/favorites'],
    queryFn: async () => {
      const response = await fetch('/api/user/favorites', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view bookmarks');
        }
        throw new Error('Failed to fetch bookmarks');
      }
      return response.json();
    }
  });

  // Then fetch complete verse data for each favorite
  const { data: verseDetails, isLoading: isLoadingVerses } = useQuery({
    queryKey: ['verse-details', favorites],
    queryFn: async () => {
      if (!favorites?.length) return [];

      const versePromises = favorites.map(async (favorite) => {
        const response = await fetch(`https://vedicscriptures.github.io/slok/${favorite.chapter}/${favorite.verse}`);
        if (!response.ok) throw new Error(`Failed to fetch verse ${favorite.chapter}:${favorite.verse}`);
        const verseData = await response.json();
        return {
          ...verseData,
          id: favorite.id,
          chapter: parseInt(favorite.chapter),
          verse: parseInt(favorite.verse)
        };
      });

      return Promise.all(versePromises);
    },
    enabled: !!favorites?.length
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
                verse={{
                  chapter: verse.chapter,
                  verse: verse.verse,
                  slok: verse.slok,
                  transliteration: verse.transliteration,
                  tej: verse.tej || {},
                  siva: verse.siva || {},
                  purohit: verse.purohit || {},
                  chinmay: verse.chinmay || {}
                }}
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