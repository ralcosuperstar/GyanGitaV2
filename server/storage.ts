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
    this.initializeMoodVerses();
  }

  private initializeMoodVerses() {
    const defaultMappings = [
      { mood: "anger", chapter: "2", verse: "56" },
      { mood: "peaceful", chapter: "2", verse: "66" },
      { mood: "depression", chapter: "2", verse: "14" },
      { mood: "confusion", chapter: "2", verse: "7" },
      { mood: "fear", chapter: "4", verse: "10" },
      { mood: "greed", chapter: "14", verse: "17" },
      { mood: "demotivated", chapter: "11", verse: "33" },
      { mood: "temptation", chapter: "2", verse: "60" }
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