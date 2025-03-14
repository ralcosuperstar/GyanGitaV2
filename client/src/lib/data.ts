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

// Get verses for a specific mood - using local data
export const getVersesByMood = async (mood: string): Promise<Verse[]> => {
  console.log('Getting verses for mood:', mood);

  // Comprehensive mood-verse mappings based on themes and emotional context
  const moodVerses = {
    anger: [[2, 56], [2, 62], [2, 63], [5, 26], [16, 1], [16, 2], [16, 3], [16, 21]],
    "feeling sinful": [[4, 36], [4, 37], [5, 10], [9, 30], [10, 3], [14, 6], [18, 66]],
    forgiveness: [[11, 44], [12, 13], [12, 14], [16, 1], [16, 2], [16, 3]],
    pride: [[16, 14], [16, 13], [16, 15], [18, 26], [18, 58]],
    "death of a loved one": [[2, 13], [2, 20], [2, 22], [2, 25], [2, 27]],
    "seeking peace": [[2, 66], [2, 71], [4, 39], [5, 29], [8, 28]],
    lust: [[3, 37], [3, 41], [3, 43], [5, 22], [16, 21]],
    "uncontrolled mind": [[6, 5], [6, 6], [6, 26], [6, 35]],
    "dealing with envy": [[12, 13], [12, 14], [16, 19], [18, 71]],
    discriminated: [[5, 18], [5, 19], [6, 32], [9, 29]],
    laziness: [[3, 8], [3, 20], [6, 16], [18, 39]],
    loneliness: [[6, 30], [9, 29], [13, 16], [13, 18]],
    depression: [[2, 3], [2, 14], [5, 21]],
    confusion: [[2, 7], [3, 2], [18, 61]],
    fear: [[4, 10], [11, 50], [18, 30]],
    greed: [[14, 17], [16, 21], [17, 25]],
    demotivated: [[11, 33], [18, 48], [18, 78]],
    temptation: [[2, 60], [2, 61], [2, 70], [7, 14]],
    forgetfulness: [[15, 15], [18, 61]],
    "losing hope": [[4, 11], [9, 22], [9, 34], [18, 66], [18, 78]]
  };

  // Normalize the mood string to lowercase and handle special characters
  const normalizedMood = mood.toLowerCase()
    .trim()
    .replace(/[_\s]+/g, ' '); // Convert underscores and multiple spaces to single space

  console.log('Normalized mood:', normalizedMood);

  // Get verses for the selected mood
  const versesForMood = moodVerses[normalizedMood as keyof typeof moodVerses] ||
                       moodVerses[normalizedMood.replace(/\s+/g, '_') as keyof typeof moodVerses];

  if (!versesForMood || !versesForMood.length) {
    console.log(`No verses mapped for mood: ${mood}`);
    return [];
  }

  console.log('Found verse mappings:', versesForMood);

  // Load verses in parallel
  const verses = await Promise.all(
    versesForMood.map(async ([chapter, verse]) => {
      try {
        const verseData = await getVerse(chapter, verse);
        if (!verseData) {
          console.log(`Failed to load verse ${chapter}:${verse}`);
        }
        return verseData;
      } catch (error) {
        console.error(`Error loading verse ${chapter}:${verse}:`, error);
        return undefined;
      }
    })
  );

  // Filter out any failed verse loads
  const validVerses = verses.filter((verse): verse is Verse => verse !== undefined);
  console.log(`Successfully loaded ${validVerses.length} verses for mood: ${mood}`);

  return validVerses;
};

// Get related verses for a verse
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