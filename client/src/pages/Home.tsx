
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  BookOpen, 
  Heart, 
  Sparkles, 
  Sun, 
  Moon, 
  Leaf, 
  Compass, 
  Quote, 
  ArrowRight,
  Play
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MoodSelection from '@/components/MoodSelection';
import VerseCard from '@/components/VerseCard';
import DailyVerse from '@/components/DailyVerse';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Hero background SVG as a React component instead of importing external image
const HeroBackground = () => (
  <div className="absolute inset-0 w-full h-full -z-10 opacity-10 overflow-hidden">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="sacred-geometry" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M10,50 L90,50 M50,10 L50,90" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <path d="M20,20 L80,80 M20,80 L80,20" stroke="currentColor" strokeWidth="0.5" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sacred-geometry)" />
    </svg>
  </div>
);

// Testimonials data
const testimonials = [
  {
    quote: "The mood-based verse recommendations helped me find exactly what I needed during a difficult time.",
    author: "Rahul Sharma",
    role: "Software Engineer"
  },
  {
    quote: "GyanGita has become my daily spiritual companion. The interface is beautiful and intuitive.",
    author: "Priya Patel",
    role: "Yoga Instructor"
  },
  {
    quote: "I love how the app remembers my favorite verses and learning progress.",
    author: "Vikram Singh",
    role: "College Student"
  },
  {
    quote: "The audio feature lets me listen to verses while commuting. It's transformed my daily journey.",
    author: "Meera Desai",
    role: "Business Owner"
  }
];

// Inspiration categories
const inspirationCategories = [
  {
    id: "peace",
    title: "Inner Peace",
    icon: <Sun className="h-6 w-6" />,
    description: "Verses to calm your mind and find tranquility"
  },
  {
    id: "purpose",
    title: "Life Purpose",
    icon: <Compass className="h-6 w-6" />,
    description: "Guidance on finding your path and dharma"
  },
  {
    id: "wisdom",
    title: "Daily Wisdom",
    icon: <Sparkles className="h-6 w-6" />,
    description: "Practical insights for everyday challenges"
  },
  {
    id: "growth",
    title: "Spiritual Growth",
    icon: <Leaf className="h-6 w-6" />,
    description: "Verses for spiritual evolution and self-realization"
  }
];

export default function Home() {
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const [popularVerses, setPopularVerses] = useState([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Fetch popular verses on load
  useEffect(() => {
    const fetchPopularVerses = async () => {
      try {
        // In a real app, we would fetch from the API
        const data = [
          { chapter: 2, verse: 47, content: { slok: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।", transliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana", translation: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions." } },
          { chapter: 4, verse: 7, content: { slok: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।", transliteration: "yadā yadā hi dharmasya glānir bhavati bhārata", translation: "Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion..." } },
          { chapter: 9, verse: 34, content: { slok: "मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु।", transliteration: "man-manā bhava mad-bhakto mad-yājī māṁ namaskuru", translation: "Engage your mind always in thinking of Me, become My devotee, offer obeisances to Me and worship Me." } },
        ];
        setPopularVerses(data);
      } catch (error) {
        console.error("Error fetching popular verses:", error);
      }
    };

    fetchPopularVerses();
  }, []);

  // Interactive elements animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const statCounterVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8,
        delay: 0.2
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with Parallax effect */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroBackground />
        
        <div className="container px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              style={{ y }}
              className="mb-6 flex justify-center"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-4xl md:text-6xl font-serif">ॐ</span>
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4 tracking-tight">
              <span className="text-primary">Gyan</span>Gita
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-8 text-muted-foreground">
              {t('home.tagline')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <Link href="/browse">
                    <BookOpen className="mr-2 h-5 w-5" />
                    {t('home.cta.browse')}
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6"
                  onClick={() => setIsVideoModalOpen(true)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  {t('home.cta.watch')}
                </Button>
              </motion.div>
            </div>

            <motion.div 
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className="h-8 w-8 text-primary opacity-70" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Key stats section with counter animation */}
      <section className="bg-primary/5 py-16">
        <div className="container px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="space-y-2" variants={statCounterVariants}>
              <h3 className="text-4xl font-bold text-primary">18</h3>
              <p className="text-sm font-medium text-muted-foreground">{t('stats.chapters')}</p>
            </motion.div>
            
            <motion.div className="space-y-2" variants={statCounterVariants}>
              <h3 className="text-4xl font-bold text-primary">700+</h3>
              <p className="text-sm font-medium text-muted-foreground">{t('stats.verses')}</p>
            </motion.div>
            
            <motion.div className="space-y-2" variants={statCounterVariants}>
              <h3 className="text-4xl font-bold text-primary">12</h3>
              <p className="text-sm font-medium text-muted-foreground">{t('stats.states')}</p>
            </motion.div>
            
            <motion.div className="space-y-2" variants={statCounterVariants}>
              <h3 className="text-4xl font-bold text-primary">5000+</h3>
              <p className="text-sm font-medium text-muted-foreground">{t('stats.years')}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mood-based guidance section */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">
              {t('home.sections.personalized')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              {t('home.mood.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('home.mood.subtitle')}
            </p>
          </motion.div>

          <MoodSelection className="max-w-5xl mx-auto" />

          <div className="text-center mt-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" variant="outline">
                <Link href="/moods">
                  {t('home.mood.view_all')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Daily Verse Section with interactive tabs */}
      <section className="py-20 bg-primary/5">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="text-center">
              <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">
                {t('home.sections.daily')}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
                {t('home.daily.title')}
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                {t('home.daily.subtitle')}
              </p>
            </div>

            <Tabs defaultValue="verse" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="verse">Today's Verse</TabsTrigger>
                <TabsTrigger value="popular">Popular Verses</TabsTrigger>
              </TabsList>
              
              <TabsContent value="verse" className="focus-visible:outline-none focus-visible:ring-0">
                <DailyVerse />
              </TabsContent>
              
              <TabsContent value="popular" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="space-y-6">
                  {popularVerses.map((verse, idx) => (
                    <motion.div 
                      key={`${verse.chapter}-${verse.verse}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <VerseCard 
                        chapter={verse.chapter} 
                        verse={verse.verse} 
                        content={verse.content}
                        showActions={true}
                      />
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Inspiration Categories */}
      <section className="py-20">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">
              {t('home.sections.inspiration')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Find Inspiration For Every Situation
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore curated collections of verses organized by life's key aspects
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {inspirationCategories.map((category) => (
              <motion.div 
                key={category.id}
                variants={itemVariants}
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
                className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all border"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <Button variant="ghost" size="sm" className="mt-auto" asChild>
                  <Link href={`/category/${category.id}`}>
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials carousel */}
      <section className="py-20 bg-primary/5">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              What Our Users Say
            </h2>
          </motion.div>

          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/1 lg:basis-1/1">
                  <div className="p-1">
                    <Card className="border-0 shadow-sm hover:shadow-md transition-all">
                      <CardContent className="p-8 flex flex-col items-center text-center">
                        <Quote className="h-8 w-8 text-primary/40 mb-4" />
                        <p className="text-lg italic mb-6">{testimonial.quote}</p>
                        <div>
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-6">
              <CarouselPrevious className="static transform-none data-[state=hidden]:opacity-50 data-[state=hidden]:hover:opacity-50" />
              <CarouselNext className="static transform-none data-[state=hidden]:opacity-50 data-[state=hidden]:hover:opacity-50" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 bg-primary/90 text-white">
        <div className="container px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
              Begin Your Spiritual Journey Today
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Discover the timeless wisdom of the Bhagavad Gita, personalized for your spiritual growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8"
                asChild
              >
                <Link href="/browse">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Verses
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary text-lg px-8"
                asChild
              >
                <Link href="/about">
                  <Heart className="mr-2 h-5 w-5" />
                  Learn More
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-background rounded-lg overflow-hidden max-w-5xl w-full shadow-xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="p-4 flex justify-between items-center border-b">
                <h3 className="font-medium">Introduction to GyanGita</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsVideoModalOpen(false)}
                >
                  &times;
                </Button>
              </div>
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="text-muted-foreground mb-4">Video player would be implemented here with actual content</p>
                  <p className="text-sm text-muted-foreground">This is a placeholder for the introduction video</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
