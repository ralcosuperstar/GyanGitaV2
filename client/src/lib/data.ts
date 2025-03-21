import chaptersData from '@/assets/data/chapters/index.json';
import moods from '@/assets/data/moods.json';

// Types for verse data
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

// Generate cache key for verses
export const generateVerseKey = (chapter: number, verse: number) =>
  `${chapter}-${verse}`;

// Import all verse files relative to the current file
const verseModules = import.meta.glob('../assets/data/slok/*/*/index.json', { eager: true });

// Core function to get a verse by chapter and number
export const getVerseByChapterAndNumber = async (chapter: number, verse: number): Promise<Verse | null> => {
  try {
    const cacheKey = generateVerseKey(chapter, verse);

    // Check cache first
    if (verseCache.has(cacheKey)) {
      return verseCache.get(cacheKey) || null;
    }

    const paddedChapter = chapter.toString().padStart(2, '0');
    const paddedVerse = verse.toString().padStart(2, '0');

    // Look for the matching verse file in the imported modules
    const matchingPath = Object.keys(verseModules).find(path =>
      path.includes(`/slok/${paddedChapter}/${paddedVerse}/index.json`)
    );

    if (!matchingPath) {
      console.error(`No verse file found for chapter ${chapter}, verse ${verse}`);
      return null;
    }

    const verseData = (verseModules[matchingPath] as any).default;
    if (!verseData) {
      console.error(`Empty verse data for ${chapter}:${verse}`);
      return null;
    }

    const verseObject: Verse = {
      ...verseData,
      chapter,
      verse
    };

    // Manage cache size
    if (verseCache.size >= VERSE_CACHE_SIZE) {
      const firstKey = verseCache.keys().next().value;
      verseCache.delete(firstKey);
    }

    verseCache.set(cacheKey, verseObject);
    return verseObject;
  } catch (error) {
    console.error(`Error in getVerseByChapterAndNumber for ${chapter}:${verse}:`, error);
    return null;
  }
};

// Get verses for a specific mood
export const getVersesByMood = async (mood: string): Promise<Verse[]> => {
  try {
    const searchMood = mood.toUpperCase().trim();
    console.log(`Looking for verses for mood: "${searchMood}"`);

    // Find mood data
    const moodData = moods.moods.find(m => m.name === searchMood);
    if (!moodData?.verses?.length) {
      console.warn(`No verses defined for mood: "${searchMood}"`);
      return [];
    }

    console.log(`Found ${moodData.verses.length} verses to load for mood: ${searchMood}`);

    // Load verses for the mood using getVerseByChapterAndNumber
    const verses = await Promise.all(
      moodData.verses.map(verseRef =>
        getVerseByChapterAndNumber(Number(verseRef.chapter), Number(verseRef.verse))
      )
    );

    const validVerses = verses.filter((v): v is Verse => v !== null);
    console.log(`Successfully loaded ${validVerses.length} verses for mood ${searchMood}`);
    return validVerses;
  } catch (error) {
    console.error('Error loading verses for mood:', error);
    return [];
  }
};

// Helper functions
export const getChapters = () => chaptersData;
export const preloadVersesByMood = (mood: string) => getVersesByMood(mood).catch(console.error);

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

// Get random verse
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
    return getVerseByChapterAndNumber(randomChapter, randomVerse);
  } catch (error) {
    console.error('Error getting random verse:', error);
    return null;
  }
};

// Get related verses
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