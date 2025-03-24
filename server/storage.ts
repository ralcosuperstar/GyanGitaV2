import { moodVerses, type MoodVerse, type InsertMoodVerse } from "@shared/schema";
import path from "path";
import fs from "fs";

// Read moods data
const moodsPath = path.join(process.cwd(), "client", "src", "assets", "data", "moods.json");
const moodsData = JSON.parse(fs.readFileSync(moodsPath, "utf-8"));

export interface IStorage {
  getMoodVerses(mood: string): Promise<MoodVerse[]>;
  insertMoodVerse(moodVerse: InsertMoodVerse): Promise<MoodVerse>;
  getAllVerses(): Promise<{ chapter: string; verse: string; }[]>;
}

export class MemStorage implements IStorage {
  private moodVersesMap: Map<string, MoodVerse[]>;
  private currentId: number;

  constructor() {
    this.moodVersesMap = new Map();
    this.currentId = 1;
    this.initializeMoodVerses();
  }

  private initializeMoodVerses() {
    moodsData.moods.forEach((moodData: any) => {
      const moodVerses = moodData.verses.map((verse: any) => ({
        id: this.currentId++,
        mood: moodData.name.toLowerCase(),
        chapter: verse.chapter.toString(),
        verse: verse.verse.toString()
      }));
      this.moodVersesMap.set(moodData.name.toLowerCase(), moodVerses);
    });
  }

  async getMoodVerses(mood: string): Promise<MoodVerse[]> {
    return this.moodVersesMap.get(mood.toLowerCase()) || [];
  }

  async getAllVerses(): Promise<{ chapter: string; verse: string; }[]> {
    const allVerses = new Set<string>();
    const result: { chapter: string; verse: string; }[] = [];

    this.moodVersesMap.forEach((verses) => {
      verses.forEach((v) => {
        const key = `${v.chapter}-${v.verse}`;
        if (!allVerses.has(key)) {
          allVerses.add(key);
          result.push({
            chapter: v.chapter,
            verse: v.verse
          });
        }
      });
    });

    return result;
  }

  async insertMoodVerse(moodVerse: InsertMoodVerse): Promise<MoodVerse> {
    const id = this.currentId++;
    const newMoodVerse: MoodVerse = {
      id,
      mood: moodVerse.mood,
      chapter: moodVerse.chapter.toString(),
      verse: moodVerse.verse.toString()
    };

    const existingVerses = this.moodVersesMap.get(moodVerse.mood) || [];
    this.moodVersesMap.set(moodVerse.mood, [...existingVerses, newMoodVerse]);

    return newMoodVerse;
  }
}

export const storage = new MemStorage();