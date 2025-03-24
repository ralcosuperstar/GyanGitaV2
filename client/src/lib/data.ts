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

// Get a verse by chapter and number with retries
export const getVerseByChapterAndNumber = async (chapter: number, verse: number): Promise<Verse | null> => {
  try {
    console.log(`Attempting to load verse ${chapter}:${verse}`);

    // Construct the correct path based on the environment
    const path = `/assets/data/slok/${chapter}/${verse}/index.json`;
    console.log('Attempting to fetch from:', path);

    try {
      const response = await fetch(path, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        console.error(`Failed to fetch verse data. Status: ${response.status}`);
        const text = await response.text();
        console.error('Response:', text);
        return null;
      }

      const data = await response.json();
      console.log('Successfully loaded verse data:', data);

      return {
        ...data,
        chapter,
        verse
      };
    } catch (error) {
      console.error('Error fetching verse data:', error);
      return null;
    }
  } catch (error) {
    console.error(`Error in getVerseByChapterAndNumber for ${chapter}:${verse}:`, error);
    return null;
  }
};

// Get verses for a specific mood
export const getVersesByMood = async (mood: string): Promise<Verse[]> => {
  try {
    const searchMood = normalizeMoodName(mood);
    console.log(`Looking for verses for mood: "${searchMood}"`);

    const moodData = moods.moods.find(m =>
      normalizeMoodName(m.name) === searchMood
    );

    if (!moodData?.verses?.length) {
      console.warn(`No verses defined for mood: "${searchMood}"`);
      return [];
    }

    console.log('Found mood data:', moodData);

    const verses = await Promise.all(
      moodData.verses.map(async verseRef => {
        try {
          console.log(`Loading verse ${verseRef.chapter}:${verseRef.verse} for mood ${searchMood}`);
          const verse = await getVerseByChapterAndNumber(
            Number(verseRef.chapter),
            Number(verseRef.verse)
          );

          if (!verse) {
            console.error(`Failed to load verse ${verseRef.chapter}:${verseRef.verse}`);
          }
          return verse;
        } catch (error) {
          console.error(`Error loading verse ${verseRef.chapter}:${verseRef.verse}:`, error);
          return null;
        }
      })
    );

    const validVerses = verses.filter((v): v is Verse => v !== null);
    console.log(`Successfully loaded ${validVerses.length} verses for mood ${searchMood}`);

    if (validVerses.length === 0) {
      console.error('No valid verses were loaded for mood:', searchMood);
    }

    return validVerses;
  } catch (error) {
    console.error('Error in getVersesByMood:', error);
    return [];
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
    console.error('Error in getRandomVerse:', error);
    return null;
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