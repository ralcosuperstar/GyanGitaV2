import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-playfair text-4xl font-bold md:text-5xl mb-4">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              {t('about.title')}
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <Card className="transform hover:scale-105 transition-all">
            <CardContent className="p-8">
              <h2 className="font-playfair text-2xl font-semibold mb-4">{t('about.mission.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.mission.desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-all">
            <CardContent className="p-8">
              <h2 className="font-playfair text-2xl font-semibold mb-4">{t('about.how.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.how.desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 transform hover:scale-105 transition-all">
            <CardContent className="p-8">
              <h2 className="font-playfair text-2xl font-semibold mb-4">{t('about.text.title')}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t('about.text.desc')}
              </p>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3"
                  alt="Sacred text background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center bg-primary/5 rounded-lg p-8">
          <h2 className="font-playfair text-2xl font-semibold mb-4">{t('about.credits.title')}</h2>
          <p className="text-muted-foreground">
            {t('about.credits.desc')}
          </p>
        </div>
      </div>
    </div>
  );
}