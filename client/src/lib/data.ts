// Data utility functions for loading Bhagavad Gita content
import chaptersData from '@/assets/data/chapters/index.json';
import moods from '@/assets/data/moods.json';

// Types for verse and chapter data
export interface Verse {
  slok: string;
  transliteration: string;
  tej: {
    ht: string;
    et: string;
  };
  siva?: {
    et: string;
  };
  purohit?: {
    et: string;
  };
  chinmay?: {
    hc: string;
  };
  chapter: number;
  verse: number;
}

// Cache configuration
const VERSE_CACHE_SIZE = 50; // Number of verses to keep in memory
const verseCache = new Map<string, Verse>();

// Add caching key generator for consistent cache keys
export const generateVerseKey = (chapter: number, verse: number) =>
  `/verse/${chapter}/${verse}`;

// Optimize verse fetching with better error handling, types and caching
export const getVerseByChapterAndNumber = async (chapter: number, verseNumber: number): Promise<Verse | null> => {
  const cacheKey = generateVerseKey(chapter, verseNumber);

  // Check cache first
  if (verseCache.has(cacheKey)) {
    return verseCache.get(cacheKey) || null;
  }

  try {
    const verseData = await import(
      /* webpackChunkName: "verse-[request]" */
      `@/assets/data/slok/${chapter}/${verseNumber}/index.json`
    );

    const verse = {
      ...verseData.default,
      chapter,
      verse: verseNumber
    };

    // Manage cache size
    if (verseCache.size >= VERSE_CACHE_SIZE) {
      const firstKey = verseCache.keys().next().value;
      verseCache.delete(firstKey);
    }

    // Add to cache
    verseCache.set(cacheKey, verse);
    return verse;
  } catch (error) {
    console.error(`Error loading verse ${chapter}:${verseNumber}:`, error);
    return null;
  }
};

// Load chapters with minimal data
export const getChapters = (): Chapter[] => {
  // Return only essential chapter data
  return chaptersData.map(chapter => ({
    chapter_number: chapter.chapter_number,
    name: chapter.name,
    verses_count: chapter.verses_count,
    name_meaning: chapter.name_meaning
  }));
};

// Load chapter details on demand
export const getChapterDetails = async (chapterNumber: number): Promise<Chapter | undefined> => {
  try {
    const chapterData = await import(
      /* webpackChunkName: "chapter-[request]" */
      `@/assets/data/chapter/${chapterNumber}/index.json`
    );
    return chapterData.default;
  } catch (error) {
    console.error(`Error loading chapter ${chapterNumber}:`, error);
    return undefined;
  }
};

export interface Chapter {
  chapter_number: number;
  verses_count: number;
  name: string;
  name_meaning: string;
  translation?: string;
  transliteration?: string;
  meaning?: {
    en: string;
    hi: string;
  };
  summary?: {
    en: string;
    hi: string;
  };
}

// Get random verse with caching
export const getRandomVerse = async (): Promise<Verse | undefined> => {
  const chapters = getChapters();
  const randomChapter = Math.floor(Math.random() * chapters.length) + 1;
  const chapterData = chapters[randomChapter - 1];

  if (chapterData) {
    const randomVerse = Math.floor(Math.random() * chapterData.verses_count) + 1;
    const verse = await getVerseByChapterAndNumber(randomChapter, randomVerse);
    return verse || undefined;
  }
  return undefined;
};

// Get verses for a specific mood with optimized loading
export const getVersesByMood = async (mood: string): Promise<Verse[]> => {
  try {
    // Normalize the mood string
    const normalizedMood = mood.toLowerCase().trim();

    // Find the mood in moods data
    const moodData = moods.moods.find(
      m => m.name.toLowerCase() === normalizedMood
    );

    if (!moodData?.verses?.length) {
      console.warn(`No verses found for mood: ${mood}`);
      return [];
    }

    // Load verses in parallel with caching
    const versePromises = moodData.verses.map(async (verseData) => {
      try {
        const verse = await getVerseByChapterAndNumber(
          verseData.chapter,
          verseData.verse
        );
        return verse;
      } catch (error) {
        console.error(`Error loading verse ${verseData.chapter}:${verseData.verse}:`, error);
        return null;
      }
    });

    const verses = await Promise.all(versePromises);
    return verses.filter((verse): verse is Verse => verse !== null);
  } catch (error) {
    console.error('Error loading verses for mood:', mood, error);
    return [];
  }
};

// Preload verses for better UX
export const preloadVersesByMood = (mood: string) => {
  getVersesByMood(mood).catch(console.error);
};

// Get related verses with cache utilization
export const getRelatedVerses = async (currentChapter: number, currentVerse: number): Promise<Verse[]> => {
  const chapters = getChapters();
  const relatedVerses: Verse[] = [];
  const maxAttempts = 6; // Try up to 6 times to get 3 verses
  let attempts = 0;

  while (relatedVerses.length < 3 && attempts < maxAttempts) {
    attempts++;
    const randomChapter = Math.floor(Math.random() * chapters.length) + 1;
    const chapterData = chapters[randomChapter - 1];
    const randomVerse = Math.floor(Math.random() * chapterData.verses_count) + 1;

    // Skip if it's the current verse
    if (randomChapter === currentChapter && randomVerse === currentVerse) {
      continue;
    }

    const verseData = await getVerseByChapterAndNumber(randomChapter, randomVerse);
    if (verseData && !relatedVerses.some(v => v.chapter === verseData.chapter && v.verse === verseData.verse)) {
      relatedVerses.push(verseData);
    }
  }

  return relatedVerses;
};