import chaptersData from '@/assets/data/chapters/index.json';
import type { Chapter } from '@/lib/types';
import moodsData from '@/assets/data/moods.json';

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
  return mood.toUpperCase().trim();
};

// Get verse by chapter and number
export const getVerseByChapterAndNumber = async (
  chapter: number,
  verse: number,
  retries = 3
): Promise<Verse | null> => {
  const versePath = `/assets/data/slok/${chapter}/${verse}/index.json`;
  console.log(`[Verse] Loading verse from path: ${versePath}`);

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(versePath);

      if (response.ok) {
        const verseData = await response.json();
        console.log(`[Verse] Successfully loaded verse ${chapter}:${verse}`);
        return { ...verseData, chapter, verse };
      }

      console.log(`[Verse] Attempt ${attempt + 1} failed, status: ${response.status}`);

      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`[Verse] Error loading verse ${chapter}:${verse}, attempt ${attempt + 1}:`, error);
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  console.error(`[Verse] Failed to load verse ${chapter}:${verse} after ${retries} attempts`);
  return null;
};

// Get verses for a specific mood
export const getVersesByMood = async (mood: string): Promise<Verse[]> => {
  try {
    const searchMood = normalizeMoodName(mood);
    console.log(`[Mood] Looking for verses with mood: "${searchMood}"`);
    console.log('[Mood] Available moods:', moodsData.moods.map(m => m.name));

    const moodData = moodsData.moods.find(m => 
      normalizeMoodName(m.name) === searchMood
    );

    if (!moodData?.verses?.length) {
      console.warn(`[Mood] No verses found for mood: "${searchMood}"`);
      return [];
    }

    console.log(`[Mood] Found ${moodData.verses.length} verse references for mood: "${searchMood}"`);

    const verses = await Promise.all(
      moodData.verses.map(verseRef => 
        getVerseByChapterAndNumber(verseRef.chapter, verseRef.verse)
      )
    );

    const validVerses = verses.filter((verse): verse is Verse => verse !== null);
    console.log(`[Mood] Successfully loaded ${validVerses.length} verses for mood "${searchMood}"`);

    return validVerses;
  } catch (error) {
    console.error('[Mood] Error loading verses for mood:', error);
    return [];
  }
};

// Export helper functions
export const getChapters = () => chaptersData;

// Export types
export type { Chapter };