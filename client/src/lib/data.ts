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

// Helper function to normalize mood names
const normalizeMoodName = (mood: string): string => {
  return mood.toUpperCase()
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/OF A/g, 'OF')
    .trim();
};

// Helper function to generate verse key
export const generateVerseKey = (chapter: number, verse: number) =>
  `${chapter}-${verse}`;

// Helper function to get data file path
const getVerseDataPath = (chapter: number, verse: number): string => {
  // In production, assets are served from the root public directory
  const baseUrl = import.meta.env.DEV ? '/src/assets/data' : '/assets/data';
  return `${baseUrl}/slok/${chapter}/${verse}/index.json`;
};

// Get a verse by chapter and number with retries
export const getVerseByChapterAndNumber = async (chapter: number, verse: number, retries = 3): Promise<Verse | null> => {
  try {
    const versePath = getVerseDataPath(chapter, verse);
    console.log(`Attempting to load verse from: ${versePath}`);

    let response;
    let attempt = 0;
    let lastError;

    while (attempt <= retries) {
      try {
        response = await fetch(versePath);

        if (response.ok) {
          const verseData = await response.json();
          return {
            ...verseData,
            chapter,
            verse
          };
        }

        lastError = `HTTP ${response.status} - ${response.statusText}`;
        attempt++;

        if (attempt <= retries) {
          console.log(`Attempt ${attempt} failed (${lastError}), retrying in ${attempt} second(s)...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      } catch (fetchError) {
        lastError = fetchError.message;
        console.error(`Attempt ${attempt + 1} failed:`, fetchError);
        if (attempt === retries) throw fetchError;
        attempt++;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    console.error(`Failed to load verse ${chapter}:${verse} after ${retries + 1} attempts.`);
    console.error(`Last error: ${lastError}`);
    console.error(`Attempted path: ${versePath}`);
    return null;

  } catch (error) {
    console.error(`Error loading verse ${chapter}:${verse}:`, error);
    console.error('Full error details:', error);
    return null;
  }
};

// Get random verse with retries
export const getRandomVerse = async (): Promise<Verse | null> => {
  try {
    const chapters = getChapters();
    const maxAttempts = 3;
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const randomChapter = Math.floor(Math.random() * chapters.length) + 1;
        const chapterData = chapters[randomChapter - 1];

        if (!chapterData) {
          console.error('Invalid chapter data when getting random verse');
          return null;
        }

        const randomVerse = Math.floor(Math.random() * chapterData.verses_count) + 1;
        console.log(`Getting random verse from chapter ${randomChapter}, verse ${randomVerse}`);

        const verse = await getVerseByChapterAndNumber(randomChapter, randomVerse);
        if (verse) return verse;

        attempts++;
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error);
        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    }

    console.error(`Failed to get random verse after ${maxAttempts} attempts`);
    return null;
  } catch (error) {
    console.error('Error getting random verse:', error);
    return null;
  }
};

// Get verses for a specific mood with better error handling
export const getVersesByMood = async (mood: string): Promise<Verse[]> => {
  try {
    const searchMood = normalizeMoodName(mood);
    console.log(`Looking for verses for mood: "${searchMood}"`);

    if (!moods?.moods) {
      console.error('Moods data structure is invalid:', moods);
      return [];
    }

    const moodData = moods.moods.find(m => 
      normalizeMoodName(m.name) === searchMood
    );

    if (!moodData?.verses?.length) {
      console.warn(`No verses defined for mood: "${searchMood}"`);
      console.log('Available moods:', moods.moods.map(m => m.name));
      return [];
    }

    console.log(`Found ${moodData.verses.length} verse references for mood: ${searchMood}`);

    const verses = await Promise.all(
      moodData.verses.map(async verseRef => {
        try {
          const verse = await getVerseByChapterAndNumber(
            Number(verseRef.chapter),
            Number(verseRef.verse),
            2 // Limit retries for parallel requests
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

    if (validVerses.length === 0) {
      console.error('No verses could be loaded for mood:', searchMood);
      console.log('Mood data:', moodData);
    }

    return validVerses;
  } catch (error) {
    console.error('Error loading verses for mood:', error);
    console.error('Full error details:', error);
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