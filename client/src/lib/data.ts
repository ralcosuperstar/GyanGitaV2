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
    anxiety: [[2, 47], [18, 66], [2, 14]], // Focus on duty and letting go of outcomes
    peace: [[2, 48], [5, 12], [6, 27]], // Verses about inner peace
    peaceful: [[2, 48], [5, 12], [6, 27]], // Same as peace
    depression: [[2, 14], [2, 22], [2, 30]], // Verses about hope and eternal nature of soul
    anger: [[2, 62], [2, 63], [5, 23]], // Verses about controlling anger
    confusion: [[4, 42], [18, 63], [2, 7]], // Guidance in times of doubt
    fear: [[2, 45], [2, 40], [4, 10]], // Overcoming fear
    grief: [[2, 11], [2, 13], [2, 27]], // Dealing with loss
    loneliness: [[9, 29], [7, 14], [4, 35]], // Divine companionship
    stress: [[2, 48], [5, 12], [18, 58]], // Stress relief through detachment
    happiness: [[5, 21], [14, 20], [2, 66]], // Path to true happiness
    discriminated: [[5, 18], [9, 29], [6, 32]], // Equality and universal vision
    forgiveness: [[16, 1], [16, 2], [16, 3]], // Divine qualities and forgiveness
    envy: [[3, 37], [16, 1], [16, 2]], // Overcoming negative emotions
    lust: [[3, 37], [3, 43], [5, 21]], // Controlling desires
    "losing hope": [[2, 14], [2, 22], [2, 30]], // Same as depression
    "losing_hope": [[2, 14], [2, 22], [2, 30]], // Alternative format
    demotivated: [[2, 47], [18, 66], [2, 14]], // Similar to anxiety
    forgetfulness: [[15, 15], [10, 10], [4, 35]], // Mindfulness and remembrance
    "uncontrolled mind": [[6, 26], [6, 35], [2, 67]], // Mind control
    "uncontrolled_mind": [[6, 26], [6, 35], [2, 67]], // Alternative format
    greed: [[16, 21], [16, 22], [14, 17]], // Overcoming material attachment
    temptation: [[3, 37], [3, 43], [5, 21]] // Same as lust
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