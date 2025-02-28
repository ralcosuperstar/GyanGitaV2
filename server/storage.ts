import { moodVerses, type MoodVerse, type InsertMoodVerse } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getMoodVerse(mood: string): Promise<MoodVerse | undefined>;
  insertMoodVerse(moodVerse: InsertMoodVerse): Promise<MoodVerse>;
}

export class MemStorage implements IStorage {
  private moodVerseMap: Map<string, MoodVerse>;
  currentId: number;

  constructor() {
    this.moodVerseMap = new Map();
    this.currentId = 1;

    // Initialize with some default mood-verse mappings
    this.initializeMoodVerses();
  }

  private initializeMoodVerses() {
    const defaultMappings = [
      { mood: "peaceful", chapter: "2", verse: "70" },
      { mood: "anxious", chapter: "2", verse: "14" },
      { mood: "confused", chapter: "2", verse: "7" },
      { mood: "motivated", chapter: "2", verse: "47" },
      { mood: "grateful", chapter: "4", verse: "39" },
      { mood: "sad", chapter: "2", verse: "11" },
      { mood: "happy", chapter: "5", verse: "23" },
      { mood: "seeking", chapter: "4", verse: "34" },
    ];

    defaultMappings.forEach((mapping, index) => {
      const moodVerse: MoodVerse = {
        id: index + 1,
        mood: mapping.mood,
        chapter: mapping.chapter,
        verse: mapping.verse,
      };
      this.moodVerseMap.set(mapping.mood, moodVerse);
    });
  }

  async getMoodVerse(mood: string): Promise<MoodVerse | undefined> {
    return this.moodVerseMap.get(mood);
  }

  async insertMoodVerse(moodVerse: InsertMoodVerse): Promise<MoodVerse> {
    const id = this.currentId++;
    const newMoodVerse: MoodVerse = { ...moodVerse, id };
    this.moodVerseMap.set(moodVerse.mood, newMoodVerse);
    return newMoodVerse;
  }
}

export const storage = new MemStorage();