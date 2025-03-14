// Data utility functions for loading local Bhagavad Gita content
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

export interface Chapter {
  chapter_number: number;
  verses_count: number;
  name: string;
  translation: string;
  transliteration: string;
  meaning: {
    en: string;
    hi: string;
  };
  summary: {
    en: string;
    hi: string;
  };
}

// Load all chapters
export const getChapters = (): Chapter[] => {
  return chaptersData;
};

// Load a specific chapter
export const getChapter = async (chapterNumber: number): Promise<Chapter | undefined> => {
  try {
    const chapterData = await import(`@/assets/data/chapter/${chapterNumber}/index.json`);
    return chapterData.default;
  } catch (error) {
    console.error(`Error loading chapter ${chapterNumber}:`, error);
    return undefined;
  }
};

// Load a specific verse
export const getVerse = async (chapterNumber: number, verseNumber: number): Promise<Verse | undefined> => {
  try {
    const verseData = await import(`@/assets/data/slok/${chapterNumber}/${verseNumber}/index.json`);
    return {
      ...verseData.default,
      chapter: chapterNumber,
      verse: verseNumber
    };
  } catch (error) {
    console.error(`Error loading verse ${chapterNumber}:${verseNumber}:`, error);
    return undefined;
  }
};

// Get random verse
export const getRandomVerse = async (): Promise<Verse | undefined> => {
  const chapters = getChapters();
  const randomChapter = Math.floor(Math.random() * chapters.length) + 1;
  const chapterData = chapters[randomChapter - 1];

  if (chapterData) {
    const randomVerse = Math.floor(Math.random() * chapterData.verses_count) + 1;
    return await getVerse(randomChapter, randomVerse);
  }
  return undefined;
};

// Get verses for a specific mood - simulating the previous API endpoint
export const getVersesByMood = async (mood: string): Promise<Verse[]> => {
  // This is a simplified version - you'll need to add mood-verse mappings
  const moodVerses = {
    anxiety: [[1, 1], [2, 47], [18, 66]],
    peace: [[2, 48], [5, 12], [6, 27]],
    // Add more mood-verse mappings as needed
  };

  const versesForMood = moodVerses[mood as keyof typeof moodVerses] || [];
  const verses = await Promise.all(
    versesForMood.map(async ([chapter, verse]) => {
      const verseData = await getVerse(chapter, verse);
      return verseData;
    })
  );

  return verses.filter((verse): verse is Verse => verse !== undefined);
};

// Get related verses - simulating the previous API endpoint
export const getRelatedVerses = async (currentChapter: number, currentVerse: number): Promise<Verse[]> => {
  const chapters = getChapters();
  const relatedVerses: Verse[] = [];

  // Get 3 random verses excluding the current one
  while (relatedVerses.length < 3) {
    const randomChapter = Math.floor(Math.random() * chapters.length) + 1;
    const chapterData = chapters[randomChapter - 1];
    const randomVerse = Math.floor(Math.random() * chapterData.verses_count) + 1;

    // Skip if it's the current verse
    if (randomChapter === currentChapter && randomVerse === currentVerse) {
      continue;
    }

    const verseData = await getVerse(randomChapter, randomVerse);
    if (verseData) {
      relatedVerses.push(verseData);
    }
  }

  return relatedVerses;
};