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
const VERSE_CACHE_SIZE = 50;
const verseCache = new Map<string, Verse>();

export const generateVerseKey = (chapter: number, verse: number) =>
  `${chapter}-${verse}`;

// Optimize verse fetching with better error handling and logging
export const getVerseByChapterAndNumber = async (chapter: number, verse: number): Promise<Verse | null> => {
  const cacheKey = generateVerseKey(chapter, verse);

  // Check cache first
  if (verseCache.has(cacheKey)) {
    console.log(`Retrieved verse ${chapter}:${verse} from cache`);
    return verseCache.get(cacheKey) || null;
  }

  try {
    console.log(`Attempting to load verse ${chapter}:${verse}`);
    const verseModule = await import(`../assets/data/slok/${chapter}/${verse}/index.json`);

    if (!verseModule.default) {
      console.error(`No data found in verse file for ${chapter}:${verse}`);
      return null;
    }

    const verseData: Verse = {
      ...verseModule.default,
      chapter,
      verse
    };

    // Manage cache size
    if (verseCache.size >= VERSE_CACHE_SIZE) {
      const firstKey = verseCache.keys().next().value;
      verseCache.delete(firstKey);
    }

    verseCache.set(cacheKey, verseData);
    console.log(`Successfully loaded verse ${chapter}:${verse}`);
    return verseData;
  } catch (error) {
    console.error(`Failed to load verse ${chapter}:${verse}:`, error);
    return null;
  }
};

// Get random verse with improved error handling
export const getRandomVerse = async (): Promise<Verse | null> => {
  try {
    const chapters = getChapters();
    const randomChapter = Math.floor(Math.random() * chapters.length) + 1;
    const chapterData = chapters[randomChapter - 1];

    if (!chapterData) {
      console.error('Invalid chapter data when getting random verse');
      return null;
    }

    const randomVerse = Math.floor(Math.random() * chapterData.verses_count) + 1;
    console.log(`Attempting to load random verse ${randomChapter}:${randomVerse}`);

    const verse = await getVerseByChapterAndNumber(randomChapter, randomVerse);
    if (!verse) {
      console.error(`Failed to load random verse ${randomChapter}:${randomVerse}`);
      return null;
    }

    return verse;
  } catch (error) {
    console.error('Error getting random verse:', error);
    return null;
  }
};

// Get verses for a specific mood with optimized loading and error handling
export const getVersesByMood = async (mood: string): Promise<Verse[]> => {
  try {
    const normalizedMood = mood.toLowerCase().trim();
    console.log(`Looking for verses for mood: ${normalizedMood}`);

    const moodData = moods.moods.find(
      m => m.name.toLowerCase() === normalizedMood
    );

    if (!moodData?.verses?.length) {
      console.warn(`No verses defined for mood: ${mood}`);
      return [];
    }

    console.log(`Found ${moodData.verses.length} verse references for mood: ${normalizedMood}`);

    const verses = await Promise.all(
      moodData.verses.map(async (verseRef) => {
        try {
          const verse = await getVerseByChapterAndNumber(
            verseRef.chapter,
            verseRef.verse
          );

          if (!verse) {
            console.error(`Failed to load verse ${verseRef.chapter}:${verseRef.verse} for mood ${normalizedMood}`);
          }
          return verse;
        } catch (err) {
          console.error(`Error processing verse ${verseRef.chapter}:${verseRef.verse}:`, err);
          return null;
        }
      })
    );

    const validVerses = verses.filter((v): v is Verse => v !== null);
    console.log(`Successfully loaded ${validVerses.length} out of ${moodData.verses.length} verses for mood ${normalizedMood}`);

    return validVerses;
  } catch (error) {
    console.error('Error in getVersesByMood:', error);
    return [];
  }
};

// Load chapters with minimal data
export const getChapters = (): Chapter[] => {
  return chaptersData.map(chapter => ({
    chapter_number: chapter.chapter_number,
    name: chapter.name,
    verses_count: chapter.verses_count,
    name_meaning: chapter.name_meaning
  }));
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

export const preloadVersesByMood = (mood: string) => {
  getVersesByMood(mood).catch(console.error);
};

// Get related verses with optimized error handling
export const getRelatedVerses = async (currentChapter: number, currentVerse: number): Promise<Verse[]> => {
  try {
    const chapters = getChapters();
    const relatedVerses: Verse[] = [];
    const maxAttempts = 6;
    let attempts = 0;

    while (relatedVerses.length < 3 && attempts < maxAttempts) {
      attempts++;
      const randomChapter = Math.floor(Math.random() * chapters.length) + 1;
      const chapterData = chapters[randomChapter - 1];

      if (!chapterData) continue;

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
  } catch (error) {
    console.error('Error getting related verses:', error);
    return [];
  }
};