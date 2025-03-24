import chaptersData from '@/assets/data/chapters/index.json';
import type { MoodData } from './moods';
import { loadMoodsData, validateMoodData } from './moods';

// Cache for moods data
let cachedMoodsData: MoodData | null = null;

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

// Helper function to normalize mood names
const normalizeMoodName = (mood: string): string => {
  return mood.toUpperCase()
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Helper function to get data file path
const getVerseDataPath = (chapter: number, verse: number): string => {
  return `/assets/data/slok/${chapter}/${verse}/index.json`;
};

// Get verse by chapter and number with retries
export const getVerseByChapterAndNumber = async (
  chapter: number,
  verse: number,
  retries = 3
): Promise<Verse | null> => {
  try {
    const versePath = getVerseDataPath(chapter, verse);
    let lastError: string | undefined;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(versePath);
        if (response.ok) {
          const verseData = await response.json();
          return { ...verseData, chapter, verse };
        }
        lastError = `HTTP ${response.status} - ${response.statusText}`;
      } catch (error: any) {
        lastError = error.message;
      }

      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    console.error(`Failed to load verse ${chapter}:${verse} after ${retries + 1} attempts`);
    console.error(`Last error: ${lastError}`);
    return null;
  } catch (error) {
    console.error(`Error loading verse ${chapter}:${verse}:`, error);
    return null;
  }
};

// Get verses for a specific mood with better error handling
export const getVersesByMood = async (mood: string): Promise<Verse[]> => {
  try {
    const searchMood = normalizeMoodName(mood);
    console.log(`Looking for verses for mood: "${searchMood}"`);

    // Load moods data if not cached
    if (!cachedMoodsData) {
      cachedMoodsData = await loadMoodsData();
    }

    if (!cachedMoodsData) {
      console.error('Failed to load moods data');
      return [];
    }

    const moodData = cachedMoodsData.moods.find(m => 
      normalizeMoodName(m.name) === searchMood
    );

    if (!moodData?.verses?.length) {
      console.warn(`No verses defined for mood: "${searchMood}"`);
      console.log('Available moods:', cachedMoodsData.moods.map(m => m.name));
      return [];
    }

    console.log(`Found ${moodData.verses.length} verse references for mood: ${searchMood}`);

    const versePromises = moodData.verses.map(async verseRef => {
      try {
        return await getVerseByChapterAndNumber(verseRef.chapter, verseRef.verse, 2);
      } catch (error) {
        console.error(`Error loading verse ${verseRef.chapter}:${verseRef.verse}:`, error);
        return null;
      }
    });

    const verses = await Promise.all(versePromises);
    const validVerses = verses.filter((v): v is Verse => v !== null);

    if (validVerses.length === 0) {
      console.error('No verses could be loaded for mood:', searchMood);
    }

    return validVerses;
  } catch (error) {
    console.error('Error loading verses for mood:', error);
    return [];
  }
};

// Export helper functions
export const getChapters = () => chaptersData;
export const preloadVersesByMood = (mood: string) => getVersesByMood(mood).catch(console.error);

// Export types
export type { Chapter } from '@/lib/types';