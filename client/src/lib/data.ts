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
export const getVerseByChapterAndNumber = async (chapter: number, verse: number, retries = 2): Promise<Verse | null> => {
  try {
    // Construct paths for both development and production
    const paths = [
      `/assets/data/slok/${chapter}/${verse}/index.json`,
      `/src/assets/data/slok/${chapter}/${verse}/index.json`,
      `/public/assets/data/slok/${chapter}/${verse}/index.json`
    ];

    let response = null;
    let error = null;

    // Try each path until we find one that works
    for (const path of paths) {
      try {
        console.log(`Attempting to load verse from: ${path}`);
        response = await fetch(path, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (response.ok) {
          console.log(`Successfully loaded verse from: ${path}`);
          break;
        }
      } catch (e) {
        error = e;
        console.error(`Failed to load from ${path}:`, e);
      }
    }

    if (!response || !response.ok) {
      console.error(`Failed to load verse ${chapter}:${verse} after trying all paths`);
      if (error) console.error('Last error:', error);
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
      console.error('Response text:', await response.text());
      return null;
    }
  } catch (error) {
    console.error(`Error loading verse ${chapter}:${verse}:`, error);
    console.error('Full error details:', error);
    return null;
  }
};

// Get verses for a specific mood with better error handling
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

    console.log(`Found mood data:`, moodData);

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

    if (validVerses.length === 0) {
      console.error('No valid verses were loaded for mood:', searchMood);
    }

    return validVerses;
  } catch (error) {
    console.error('Error loading verses for mood:', error);
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
    console.error('Error getting random verse:', error);
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