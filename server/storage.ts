import { moodVerses, type MoodVerse, type InsertMoodVerse } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getMoodVerses(mood: string): Promise<MoodVerse[]>;
  insertMoodVerse(moodVerse: InsertMoodVerse): Promise<MoodVerse>;
}

export class MemStorage implements IStorage {
  private moodVersesMap: Map<string, MoodVerse[]>;
  currentId: number;

  constructor() {
    this.moodVersesMap = new Map();
    this.currentId = 1;
    this.initializeMoodVerses();
  }

  private initializeMoodVerses() {
    const moodData = {
      "anger": [
        { chapter: "2", verse: "56" },
        { chapter: "2", verse: "62" },
        { chapter: "2", verse: "63" },
      ],
      "peaceful": [
        { chapter: "2", verse: "66" },
        { chapter: "2", verse: "71" },
        { chapter: "4", verse: "39" },
      ],
      "depression": [
        { chapter: "2", verse: "3" },
        { chapter: "2", verse: "14" },
        { chapter: "5", verse: "21" },
      ],
      "confusion": [
        { chapter: "2", verse: "7" },
        { chapter: "3", verse: "7" },
        { chapter: "18", verse: "61" },
      ],
      "fear": [
        { chapter: "4", verse: "10" },
        { chapter: "11", verse: "50" },
        { chapter: "18", verse: "30" },
      ],
      "greed": [
        { chapter: "14", verse: "17" },
        { chapter: "16", verse: "21" },
        { chapter: "17", verse: "25" },
      ],
      "demotivated": [
        { chapter: "11", verse: "33" },
        { chapter: "18", verse: "48" },
        { chapter: "18", verse: "78" },
      ],
      "temptation": [
        { chapter: "2", verse: "60" },
        { chapter: "2", verse: "61" },
        { chapter: "2", verse: "70" },
      ],
    };

    Object.entries(moodData).forEach(([mood, verses]) => {
      const moodVerses = verses.map((v, index) => ({
        id: this.currentId++,
        mood,
        chapter: v.chapter,
        verse: v.verse,
      }));
      this.moodVersesMap.set(mood, moodVerses);
    });
  }

  async getMoodVerses(mood: string): Promise<MoodVerse[]> {
    return this.moodVersesMap.get(mood) || [];
  }

  async insertMoodVerse(moodVerse: InsertMoodVerse): Promise<MoodVerse> {
    const id = this.currentId++;
    const newMoodVerse: MoodVerse = { ...moodVerse, id };

    const existingVerses = this.moodVersesMap.get(moodVerse.mood) || [];
    this.moodVersesMap.set(moodVerse.mood, [...existingVerses, newMoodVerse]);

    return newMoodVerse;
  }
}

export const storage = new MemStorage();