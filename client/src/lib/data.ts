// Data utility functions for loading Bhagavad Gita content
import chaptersData from '@/assets/data/chapters/index.json';

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
  // Mood-verse mappings
  const moodVerses = {
    "anger": [[2, 56], [2, 62], [2, 63]],
    "peace": [[2, 66], [2, 71], [4, 39]],
    "feeling sinful": [[4, 36], [4, 37], [5, 10], [9, 30], [10, 3], [14, 6], [18, 66]],
    "forgiveness": [[11, 44], [12, 13], [12, 14], [16, 1], [16, 2], [16, 3]],
    "practicing forgiveness": [[11, 44], [12, 13], [12, 14], [16, 1], [16, 2], [16, 3]],
    "pride": [[16, 14], [16, 13], [16, 15], [18, 26], [18, 58]],
    "death of a loved one": [[2, 13], [2, 20], [2, 22], [2, 25], [2, 27]],
    "grief": [[2, 13], [2, 20], [2, 22], [2, 25], [2, 27]],
    "seeking peace": [[2, 66], [2, 71], [4, 39], [5, 29], [8, 28]],
    "lust": [[3, 37], [3, 41], [3, 43], [5, 22], [16, 21]],
    "uncontrolled mind": [[6, 5], [6, 6], [6, 26], [6, 35]],
    "dealing with envy": [[12, 13], [12, 14], [16, 19], [18, 71]],
    "envy": [[12, 13], [12, 14], [16, 19], [18, 71]],
    "discriminated": [[5, 18], [5, 19], [6, 32], [9, 29]],
    "laziness": [[3, 8], [3, 20], [6, 16], [18, 39]],
    "loneliness": [[6, 30], [9, 29], [13, 16], [13, 18]],
    "depression": [[2, 3], [2, 14], [5, 21]],
    "confusion": [[2, 7], [3, 2], [18, 61]],
    "fear": [[4, 10], [11, 50], [18, 30]],
    "greed": [[14, 17], [16, 21], [17, 25]],
    "demotivated": [[11, 33], [18, 48], [18, 78]],
    "temptation": [[2, 60], [2, 61], [2, 70], [7, 14]],
    "forgetfulness": [[15, 15], [18, 61]],
    "losing hope": [[4, 11], [9, 22], [9, 34], [18, 66], [18, 78]]
  };

  const normalizedMood = mood.toLowerCase().trim().replace(/[_\s]+/g, ' ');
  const versesForMood = moodVerses[normalizedMood as keyof typeof moodVerses];

  if (!versesForMood?.length) {
    console.log(`No verses mapped for mood: ${mood}`);
    return [];
  }

  // Load verses in parallel with caching
  const versePromises = versesForMood.map(([chapter, verse]) =>
    getVerseByChapterAndNumber(chapter, verse)
  );

  const verses = await Promise.all(versePromises);
  return verses.filter((verse): verse is Verse => verse !== null);
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