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

  const { data: favorites, isLoading } = useQuery({
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
      {favorites?.length ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {favorites.map((favorite: any) => (
            <motion.div
              key={favorite.id}
              variants={itemVariants}
            >
              <VerseCard
                verse={{
                  chapter: parseInt(favorite.chapter),
                  verse: parseInt(favorite.verse),
                  slok: favorite.sanskrit || favorite.slok,
                  transliteration: favorite.transliteration,
                  tej: {
                    ht: favorite.translation,
                    et: favorite.translation_english
                  },
                  siva: {
                    et: favorite.siva_translation
                  },
                  purohit: {
                    et: favorite.purohit_translation
                  },
                  chinmay: {
                    hc: favorite.chinmay_commentary
                  }
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