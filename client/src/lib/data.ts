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

// Helper function to generate verse key
export const generateVerseKey = (chapter: number, verse: number) =>
  `${chapter}-${verse}`;

// Get a verse by chapter and number
export const getVerseByChapterAndNumber = async (chapter: number, verse: number): Promise<Verse | null> => {
  try {
    console.log(`Loading verse ${chapter}:${verse} from local data`);

    // Use relative path from current file to data directory
    const response = await fetch(`/src/assets/data/slok/${chapter}/${verse}/index.json`);

    if (!response.ok) {
      console.error(`Failed to load verse ${chapter}:${verse}. Status: ${response.status}`);
      return null;
    }

    try {
      const verseData = await response.json();
      return {
        ...verseData,
        chapter,
        verse
      };
    } catch (parseError) {
      console.error(`Failed to parse JSON for verse ${chapter}:${verse}:`, parseError);
      return null;
    }
  } catch (error) {
    console.error(`Error loading verse ${chapter}:${verse}:`, error);
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
    console.log('Verses to load:', moodData.verses);

    // Load verses
    const verses = await Promise.all(
      moodData.verses.map(async verseRef => {
        try {
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
      })
    );

    const validVerses = verses.filter((v): v is Verse => v !== null);
    console.log(`Successfully loaded ${validVerses.length} out of ${moodData.verses.length} verses for mood ${searchMood}`);
    return validVerses;

  } catch (error) {
    console.error('Error loading verses for mood:', error);
    return [];
  }
};

// Export helper functions
export const getChapters = () => chaptersData;
export const preloadVersesByMood = (mood: string) => getVersesByMood(mood).catch(console.error);

// Types
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