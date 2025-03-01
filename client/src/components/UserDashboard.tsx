import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book, Heart, History, Bookmark } from "lucide-react";
import type { ReadingProgress, Favorite } from "@shared/schema";
import VerseCard from "./VerseCard";

export default function UserDashboard() {
  const { t } = useLanguage();

  const { data: readingProgress } = useQuery<ReadingProgress[]>({
    queryKey: ['/api/user/progress'],
    enabled: false, // Enable after auth is implemented
  });

  const { data: favorites } = useQuery<Favorite[]>({
    queryKey: ['/api/user/favorites'],
    enabled: false, // Enable after auth is implemented
  });

  return (
    <div className="space-y-8">
      {/* Reading Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            {t('dashboard.progress')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{t('dashboard.chaptersRead')}</span>
                <span>3/18</span>
              </div>
              <Progress value={16.67} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{t('dashboard.versesRead')}</span>
                <span>42/700</span>
              </div>
              <Progress value={6} />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">{t('dashboard.recentlyRead')}</h3>
            <div className="space-y-2">
              {readingProgress?.slice(0, 3).map((progress) => (
                <div 
                  key={progress.id}
                  className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted"
                >
                  <span>Chapter {progress.chapter}, Verse {progress.verse}</span>
                  <History className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favorites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            {t('dashboard.favorites')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {favorites?.slice(0, 3).map((favorite) => (
              <div key={favorite.id} className="p-2 rounded-md hover:bg-muted">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Chapter {favorite.chapter}, Verse {favorite.verse}
                  </span>
                  <Bookmark className="h-4 w-4 text-primary" />
                </div>
                {favorite.notes && (
                  <p className="text-sm text-muted-foreground">{favorite.notes}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
