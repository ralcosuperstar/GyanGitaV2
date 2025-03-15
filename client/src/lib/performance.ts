import { lazy } from 'react';

// Lazy-loaded components for better initial load time
export const LazyVerseModal = lazy(() => import('@/components/VerseModal'));
export const LazyCommentarySection = lazy(() => import('@/components/CommentarySection'));
export const LazyAudioPlayer = lazy(() => import('@/components/AudioPlayer'));

// Preload critical verses
export const preloadCriticalVerses = [
  { chapter: 2, verse: 47 }, // Karma Yoga
  { chapter: 18, verse: 66 }, // Ultimate message
  { chapter: 4, verse: 7 }, // Avatar verse
  { chapter: 2, verse: 20 }, // Soul's immortality
];

// SEO metadata for key pages
export const PAGE_METADATA = {
  home: {
    title: 'GyanGita - Modern Solutions from Ancient Wisdom | Bhagavad Gita App',
    description: 'Find peace and purpose through ancient Bhagavad Gita wisdom. Get personalized verses for modern challenges like anxiety, stress, and self-discovery.',
    keywords: 'Bhagavad Gita app, anxiety solutions, spiritual guidance, mental peace, self-improvement, Hindu scripture'
  },
  verse: {
    title: 'Chapter {chapter} Verse {verse} | Bhagavad Gita Meaning & Commentary',
    description: 'Deep insights into Bhagavad Gita Chapter {chapter} Verse {verse}. Multiple translations, expert commentary, and practical life applications.',
    keywords: 'Bhagavad Gita verse {chapter}.{verse}, Sanskrit translation, verse meaning, spiritual wisdom'
  },
  mood: {
    title: '{mood} - Find Peace Through Gita Wisdom | GyanGita',
    description: 'Overcome {mood} with timeless wisdom from Bhagavad Gita. Get personalized verses and practical guidance for emotional well-being.',
    keywords: '{mood} solutions, emotional healing, Bhagavad Gita wisdom, spiritual guidance'
  }
};

// Performance monitoring
export const measurePerformance = {
  pageLoad: (page: string) => {
    const timing = window.performance.timing;
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page ${page} loaded in ${pageLoadTime}ms`);
    // Send to analytics
  },
  interaction: (action: string, duration: number) => {
    console.log(`${action} took ${duration}ms`);
    // Send to analytics
  }
};

// Caching strategy
export const CACHE_CONFIG = {
  verses: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxItems: 1000
  },
  translations: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxItems: 500
  }
};
