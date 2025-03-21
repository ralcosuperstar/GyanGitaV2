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
  try {
    const cacheKey = generateVerseKey(chapter, verse);
    console.log(`Processing verse ${chapter}:${verse}`);

    // Check cache first
    if (verseCache.has(cacheKey)) {
      console.log(`Retrieved verse ${chapter}:${verse} from cache`);
      return verseCache.get(cacheKey) || null;
    }

    // Ensure proper path with padded numbers
    const paddedChapter = chapter.toString().padStart(2, '0');
    const paddedVerse = verse.toString().padStart(2, '0');
    const basePath = `/attached_assets/src/assets/data/slok`;
    const versePath = `${basePath}/${paddedChapter}/${paddedVerse}/index.json`;

    console.log(`Loading verse from: ${versePath}`);

    const response = await fetch(versePath);
    if (!response.ok) {
      console.error(`Failed to fetch verse ${chapter}:${verse}, status: ${response.status}`);
      console.error(`Attempted path: ${versePath}`);
      return null;
    }

    const verseData = await response.json();
    if (!verseData) {
      console.error(`No data found in verse file for ${chapter}:${verse}`);
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
    console.log(`Successfully loaded verse ${chapter}:${verse}`);
    return verseObject;

  } catch (error) {
    console.error(`Error in getVerseByChapterAndNumber for ${chapter}:${verse}:`, error);
    return null;
  }
};

// Get verses for a specific mood with improved error handling
export const getVersesByMood = async (mood: string): Promise<Verse[]> => {
  try {
    // Use exact mood name
    const searchMood = mood.toUpperCase().trim();
    console.log(`Looking for verses for mood: "${searchMood}"`);

    // Find mood data with exact name match
    const moodData = moods.moods.find(m => m.name === searchMood);
    if (!moodData?.verses?.length) {
      console.warn(`No verses defined for mood: "${searchMood}"`);
      console.warn('Available moods:', moods.moods.map(m => m.name).join(', '));
      return [];
    }

    console.log(`Found ${moodData.verses.length} verse references for mood: ${searchMood}`);
    console.log('Verses to load:', JSON.stringify(moodData.verses));

    const versePromises = moodData.verses.map(async verseRef => {
      try {
        if (!verseRef.chapter || !verseRef.verse) {
          console.error(`Invalid verse reference for mood ${searchMood}:`, verseRef);
          return null;
        }

        console.log(`Loading verse ${verseRef.chapter}:${verseRef.verse} for mood ${searchMood}`);
        const verse = await getVerseByChapterAndNumber(
          Number(verseRef.chapter),
          Number(verseRef.verse)
        );

        if (!verse) {
          console.error(`Failed to load verse ${verseRef.chapter}:${verseRef.verse} for mood ${searchMood}`);
        }
        return verse;
      } catch (error) {
        console.error(`Error loading verse ${verseRef.chapter}:${verseRef.verse}:`, error);
        return null;
      }
    });

    const verses = await Promise.all(versePromises);
    const validVerses = verses.filter((v): v is Verse => v !== null);
    console.log(`Successfully loaded ${validVerses.length} out of ${moodData.verses.length} verses for mood ${searchMood}`);

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
    return await getVerseByChapterAndNumber(randomChapter, randomVerse);
  } catch (error) {
    console.error('Error getting random verse:', error);
    return null;
  }
};

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