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

export const generateVerseKey = (chapter: number, verse: number) =>
  `${chapter}-${verse}`;

// Import all verse files using Vite's import.meta.glob
const verseModules = import.meta.glob('/src/assets/data/slok/*/*/index.json', { eager: true });

// Optimize verse fetching with better error handling and logging
export const getVerseByChapterAndNumber = async (chapter: number, verse: number): Promise<Verse | null> => {
  try {
    const cacheKey = generateVerseKey(chapter, verse);

    // Check cache first
    if (verseCache.has(cacheKey)) {
      console.log(`Retrieved verse ${chapter}:${verse} from cache`);
      return verseCache.get(cacheKey) || null;
    }

    // Construct proper path pattern
    const paddedChapter = chapter.toString().padStart(2, '0');
    const paddedVerse = verse.toString().padStart(2, '0');
    const expectedPattern = `/src/assets/data/slok/${paddedChapter}/${paddedVerse}/index.json`;

    console.log(`Looking for verse file matching pattern: ${expectedPattern}`);

    // Find matching module path
    const matchingPath = Object.keys(verseModules).find(path => 
      path.endsWith(`/${paddedChapter}/${paddedVerse}/index.json`)
    );

    if (!matchingPath) {
      console.error(`No verse file found for chapter ${chapter}, verse ${verse}`);
      console.log('Available verse files:', Object.keys(verseModules));
      return null;
    }

    const module = verseModules[matchingPath] as any;
    if (!module || !module.default) {
      console.error(`Invalid verse module for ${chapter}:${verse}`);
      return null;
    }

    const verseData = module.default;
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
    console.log(`Successfully loaded verse ${chapter}:${verse}`);
    return verseObject;

  } catch (error) {
    console.error(`Error loading verse ${chapter}:${verse}:`, error);
    return null;
  }
};

// Get verses for a specific mood with better error handling
export const getVersesByMood = async (mood: string): Promise<Verse[]> => {
  try {
    // Use exact mood name (uppercase)
    const searchMood = mood.toUpperCase().trim();
    console.log(`Looking for verses for mood: "${searchMood}"`);

    // Find mood data with exact name match
    const moodData = moods.moods.find(m => m.name === searchMood);
    if (!moodData?.verses?.length) {
      console.warn(`No verses defined for mood: "${searchMood}"`);
      console.warn('Available moods:', moods.moods.map(m => m.name).join(', '));
      return [];
    }

    console.log(`Found ${moodData.verses.length} verses for mood: ${searchMood}`);
    console.log('Verse references:', moodData.verses);

    const versePromises = moodData.verses.map(async verseRef => {
      try {
        console.log(`Loading verse ${verseRef.chapter}:${verseRef.verse}`);
        const verse = await getVerseByChapterAndNumber(
          Number(verseRef.chapter),
          Number(verseRef.verse)
        );

        if (!verse) {
          console.error(`Failed to load verse ${verseRef.chapter}:${verseRef.verse}`);
        }
        return verse;
      } catch (error) {
        console.error(`Error processing verse ${verseRef.chapter}:${verseRef.verse}:`, error);
        return null;
      }
    });

    const verses = await Promise.all(versePromises);
    const validVerses = verses.filter((v): v is Verse => v !== null);
    console.log(`Successfully loaded ${validVerses.length} of ${moodData.verses.length} verses`);

    return validVerses;
  } catch (error) {
    console.error('Error in getVersesByMood:', error);
    return [];
  }
};

// Load chapters data
export const getChapters = (): Chapter[] => {
  return chaptersData.map(chapter => ({
    chapter_number: chapter.chapter_number,
    verses_count: chapter.verses_count,
    name: chapter.name,
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
    return await getVerseByChapterAndNumber(randomChapter, randomVerse);
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