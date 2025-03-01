import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { BookmarkX } from "lucide-react";
import VerseCard from "@/components/VerseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

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
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-8">
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl font-bold md:text-5xl mb-4">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              {t('bookmarks.title')}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('bookmarks.subtitle')}
          </p>
        </div>

        {favorites?.length ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite: any) => (
              <VerseCard
                key={favorite.id}
                verse={{
                  chapter: parseInt(favorite.chapter),
                  verse: parseInt(favorite.verse),
                  slok: favorite.slok,
                  transliteration: favorite.transliteration,
                  tej: {
                    ht: favorite.translation,
                    et: favorite.translation_english
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookmarkX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('bookmarks.empty.title')}</h3>
            <p className="text-muted-foreground mb-6">{t('bookmarks.empty.description')}</p>
            <Button asChild>
              <Link href="/browse">{t('bookmarks.empty.action')}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}