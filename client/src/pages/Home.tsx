
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { 
  Brain, 
  Book, 
  Heart, 
  Leaf, 
  ScrollText, 
  Sparkles, 
  Coffee, 
  Quote, 
  ArrowRight,
  ArrowRightCircle,
  Timer,
  Users,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoodSelection } from "@/components/MoodSelection";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/hooks/use-theme";
import VerseCard from "@/components/VerseCard";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Testimonials data
const testimonials = [
  {
    text: "GyanGita has transformed my daily spiritual practice. I feel more connected and peaceful.",
    author: "Arjun M.",
    role: "Daily Meditator",
  },
  {
    text: "As a yoga instructor, I recommend GyanGita to all my students. It's like having a spiritual guide in your pocket.",
    author: "Priya J.",
    role: "Yoga Teacher",
  },
  {
    text: "The mood-based recommendations are incredibly accurate. Just what I needed when I'm feeling lost.",
    author: "Rahul S.",
    role: "Spiritual Seeker",
  },
];

// Daily verse section
const DailyVerse = () => {
  const [verse, setVerse] = useState({
    slok: "",
    transliteration: "",
    translation: "",
    chapter: 1,
    verse: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyVerse = async () => {
      try {
        setLoading(true);
        // Get a random chapter (1-18) and verse (1-40)
        const chapter = Math.floor(Math.random() * 18) + 1;
        const verse = Math.floor(Math.random() * 40) + 1;
        
        const response = await fetch(`/api/verse/${chapter}/${verse}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch verse: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (!data || !data.slok) {
          throw new Error("Invalid verse data received");
        }
        
        setVerse({
          slok: data.slok || "Sanskrit text not available",
          transliteration: data.transliteration || "Transliteration not available",
          translation: data.tej?.et || data.tej?.ht || "Translation not available",
          chapter,
          verse
        });
      } catch (error) {
        console.error("Error fetching daily verse:", error);
        // Set fallback data
        setVerse({
          slok: "Error loading verse",
          transliteration: "Please try again later",
          translation: "Could not load the daily verse. Please refresh the page.",
          chapter: 1,
          verse: 1
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDailyVerse();
  }, []);

  return (
    <div className="p-6 bg-primary/5 rounded-xl backdrop-blur-sm border border-primary/10">
      <div className="flex items-center mb-4">
        <Quote className="text-primary mr-2" />
        <h3 className="text-2xl font-semibold">Verse of the Day</h3>
      </div>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="font-playfair italic text-lg leading-relaxed">{verse.slok}</div>
          <div className="text-sm text-muted-foreground">{verse.transliteration}</div>
          <Separator className="my-4" />
          <div className="text-base">{verse.translation}</div>
          <div className="flex justify-between items-center mt-4">
            <Badge variant="outline" className="text-xs">Chapter {verse.chapter}, Verse {verse.verse}</Badge>
            <Button variant="ghost" size="sm" className="text-primary flex items-center gap-1">
              Read More <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Usage statistics
const UsageStats = () => {
  return (
    <div className="grid grid-cols-3 gap-4 py-4">
      <div className="text-center p-4 bg-primary/5 rounded-lg">
        <Users className="h-8 w-8 mx-auto mb-2 text-primary/70" />
        <div className="text-3xl font-bold">10K+</div>
        <div className="text-sm text-muted-foreground">Daily Users</div>
      </div>
      <div className="text-center p-4 bg-primary/5 rounded-lg">
        <ScrollText className="h-8 w-8 mx-auto mb-2 text-primary/70" />
        <div className="text-3xl font-bold">700</div>
        <div className="text-sm text-muted-foreground">Sacred Verses</div>
      </div>
      <div className="text-center p-4 bg-primary/5 rounded-lg">
        <Timer className="h-8 w-8 mx-auto mb-2 text-primary/70" />
        <div className="text-3xl font-bold">5M+</div>
        <div className="text-sm text-muted-foreground">Minutes of Wisdom</div>
      </div>
    </div>
  );
};

export default function Home() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/10 to-transparent"></div>
          {theme === 'dark' && (
            <div className="absolute inset-0 bg-[url('/images/sacred-geometry-pattern.svg')] opacity-5"></div>
          )}
        </div>
        
        <div className="container relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-8 md:pt-32 md:pb-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-block mb-2">
              <Badge variant="outline" className="px-3 py-1 text-sm rounded-full border-primary/20 bg-primary/5 text-primary">
                Spiritual Wisdom for Modern Life
              </Badge>
            </div>
            <h1 className="font-playfair text-5xl font-bold md:text-6xl lg:text-7xl mt-6">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                {t('home.title')}
              </span>
            </h1>
            <p className="mt-8 text-xl text-muted-foreground leading-relaxed">
              {t('home.subtitle')}
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full font-medium">
                <Link href="/browse">
                  Browse Chapters <ArrowRightCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full font-medium">
                <Link href="/about">
                  Learn More <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mood Selection Section */}
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Sparkles className="inline-block h-10 w-10 text-primary mb-4" />
          <h2 className="text-3xl font-semibold mb-4 font-playfair">How are you feeling today?</h2>
          <p className="text-xl text-muted-foreground mb-10">
            Select your current mood and receive personalized guidance from the Bhagavad Gita
          </p>
          <MoodSelection />
        </div>
      </div>
      
      {/* Featured Verse of the Day */}
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-8 bg-gradient-to-r from-background via-primary/5 to-background">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-semibold mb-6 font-playfair">Daily Inspiration</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Start your day with divine wisdom. Each day we feature a different verse from the Bhagavad Gita to inspire and guide you on your spiritual journey.
              </p>
              <UsageStats />
              <div className="mt-8">
                <Button asChild className="rounded-full">
                  <Link href="/browse">
                    Explore All Verses <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <DailyVerse />
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold font-playfair mb-4">Features</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the unique features that make GyanGita your ultimate spiritual companion
          </p>
        </div>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-primary/10 to-primary/5 transform hover:scale-105 transition-all">
              <div className="absolute top-6 right-6 text-primary/30">
                <Brain className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t('features.personal.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('features.personal.desc')}
              </p>
            </Card>

            <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-primary/10 to-primary/5 transform hover:scale-105 transition-all">
              <div className="absolute top-6 right-6 text-primary/30">
                <Book className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t('features.ancient.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('features.ancient.desc')}
              </p>
            </Card>

            <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-primary/10 to-primary/5 transform hover:scale-105 transition-all">
              <div className="absolute top-6 right-6 text-primary/30">
                <Heart className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{t('features.companion.title')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('features.companion.desc')}
              </p>
            </Card>

            <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-primary/10 to-primary/5 transform hover:scale-105 transition-all">
              <div className="absolute top-6 right-6 text-primary/30">
                <Coffee className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Daily Reflection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Develop a daily spiritual practice with our guided reflection prompts based on Gita's timeless wisdom.
              </p>
            </Card>

            <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-primary/10 to-primary/5 transform hover:scale-105 transition-all">
              <div className="absolute top-6 right-6 text-primary/30">
                <ScrollText className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Chapter Summaries</h3>
              <p className="text-muted-foreground leading-relaxed">
                Easy-to-understand summaries of each chapter to help you grasp the core teachings quickly.
              </p>
            </Card>

            <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-primary/10 to-primary/5 transform hover:scale-105 transition-all">
              <div className="absolute top-6 right-6 text-primary/30">
                <Leaf className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Mindfulness Tools</h3>
              <p className="text-muted-foreground leading-relaxed">
                Integrate the wisdom of Gita into your meditation practice with our guided mindfulness tools.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-primary/5 py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold font-playfair mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of spiritual seekers who have found guidance and peace through GyanGita
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 mx-auto max-w-6xl">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={cn(
                "p-8 border border-primary/10 relative overflow-hidden",
                index === 1 ? "md:transform md:-translate-y-4" : ""
              )}>
                <Quote className="h-10 w-10 text-primary/20 absolute top-4 right-4" />
                <p className="text-lg leading-relaxed mb-6 relative z-10">"{testimonial.text}"</p>
                <div className="mt-auto">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-primary/5 rounded-tl-full"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Reading Journey Section */}
      <div className="container mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="px-3 py-1 text-sm rounded-full border-primary/20 bg-primary/5 text-primary mb-6">
                Your Spiritual Journey
              </Badge>
              <h2 className="text-3xl font-semibold mb-6 font-playfair">Begin Your Reading Journey</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Set out on a transformative journey through the 18 chapters of the Bhagavad Gita. Track your progress, earn spiritual insights, and deepen your understanding of this timeless wisdom.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Follow a structured reading path through all 18 chapters",
                  "Track your progress and continuity in your spiritual practice",
                  "Unlock deeper insights and commentaries as you advance",
                  "Reflect on your journey with guided questions and prompts"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-4 mt-1 bg-primary/10 rounded-full p-1">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/browse">
                  Start Reading <ArrowRightCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl transform rotate-3"></div>
              <div className="relative z-10 bg-card rounded-2xl p-8 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-primary/10">Chapter 1: Arjuna's Dilemma</h3>
                <p className="mb-4 text-muted-foreground">
                  The first chapter sets the scene of the Kurukshetra war. Arjuna, seeing his relatives on the opposing side, is filled with doubt and despair about fighting.
                </p>
                <div className="flex justify-between items-center">
                  <Badge>47 verses</Badge>
                  <Button variant="ghost" size="sm" className="text-primary flex items-center gap-1">
                    Read Chapter <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Download App Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-semibold font-playfair mb-4">Take Wisdom With You</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Install GyanGita on your device for offline access to the Bhagavad Gita anytime, anywhere
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="rounded-full flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.9,19.9l-5.4,3c-0.8,0.5-1.8,0.5-2.6,0l-5.4-3C3.5,19.3,3,18.3,3,17.2V6.8c0-1.1,0.5-2.1,1.5-2.7l5.4-3 c0.8-0.5,1.8-0.5,2.6,0l5.4,3C18.5,4.7,19,5.7,19,6.8v10.4C21,18.3,19.5,19.3,17.9,19.9z" />
                </svg>
                Download for Android
              </Button>
              <Button variant="outline" className="rounded-full flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5,12.5c0-0.9,0.5-1.7,1.3-2.2c-0.5-0.7-1.1-1.3-1.9-1.8c-0.8,0.4-1.6,0.6-2.4,0.6c-0.8,0-1.6-0.2-2.4-0.6 C10.4,8.2,8.8,8,7.2,8.6C6,9,5.1,9.8,4.5,10.9c-1.1,2-0.9,4.5,0.5,6.3c0.7,0.9,1.7,1.6,2.8,1.9c1.1,0.3,2.3,0.1,3.3-0.4 c0.8-0.5,1.7-0.7,2.6-0.7s1.8,0.2,2.6,0.7c1,0.6,2.2,0.7,3.3,0.4c1.1-0.3,2.1-1,2.8-1.9c0.8-1,1.3-2.2,1.3-3.5 C19.9,13.7,18.4,12.5,17.5,12.5z M16.8,5.1c0-1.9-1.6-3.5-3.5-3.5h-0.5v7h0.5C15.2,8.6,16.8,7,16.8,5.1z" />
                </svg>
                Download for iOS
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Or simply add to home screen from your mobile browser
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="container mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl text-center bg-primary/5 rounded-3xl p-12 border border-primary/10">
          <h2 className="text-3xl font-semibold font-playfair mb-6">Ready to Begin Your Spiritual Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore the timeless wisdom of Bhagavad Gita and find the guidance you need for your current state of mind.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/browse">
              Explore the Bhagavad Gita <ArrowRightCircle className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
