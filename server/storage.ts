import { moodVerses, type MoodVerse, type InsertMoodVerse, favorites, type Favorite, type InsertFavorite } from "@shared/schema";
import path from "path";
import fs from "fs";

// Read moods data
const moodsPath = path.join(process.cwd(), "client", "src", "assets", "data", "moods.json");
const moodsData = JSON.parse(fs.readFileSync(moodsPath, "utf-8"));

export interface IStorage {
  getMoodVerses(mood: string): Promise<MoodVerse[]>;
  insertMoodVerse(moodVerse: InsertMoodVerse): Promise<MoodVerse>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  getUserFavorites(userId: number): Promise<Favorite[]>;
  removeFavorite(userId: number, chapter: string, verse: string): Promise<void>;
  getAllVerses(): Promise<{ chapter: string; verse: string; }[]>;
}

export class MemStorage implements IStorage {
  private moodVersesMap: Map<string, MoodVerse[]>;
  private favorites: Map<string, Favorite>;
  private currentId: number;
  private favoriteId: number;

  constructor() {
    this.moodVersesMap = new Map();
    this.favorites = new Map();
    this.currentId = 1;
    this.favoriteId = 1;
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

  private getFavoriteKey(userId: number, chapter: string, verse: string): string {
    return `${userId}-${chapter}-${verse}`;
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

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const chapter = favorite.chapter.toString();
    const verse = favorite.verse.toString();
    const key = this.getFavoriteKey(favorite.user_id, chapter, verse);

    if (this.favorites.has(key)) {
      throw new Error('Verse is already in favorites');
    }

    const newFavorite: Favorite = {
      id: this.favoriteId++,
      user_id: favorite.user_id,
      chapter,
      verse,
      saved_at: new Date(),
      notes: favorite.notes || null
    };

    this.favorites.set(key, newFavorite);
    return newFavorite;
  }

  async getUserFavorites(userId: number): Promise<Favorite[]> {
    const userFavorites: Favorite[] = [];

    this.favorites.forEach((favorite) => {
      const keyParts = Object.keys(favorite).filter(key => key.startsWith('user_id'))
      if (parseInt(keyParts[0].split('-')[0]) === userId) {
        userFavorites.push(favorite);
      }
    });

    return userFavorites.sort((a, b) => 
      b.saved_at.getTime() - a.saved_at.getTime()
    );
  }

  async removeFavorite(userId: number, chapter: string, verse: string): Promise<void> {
    const key = this.getFavoriteKey(userId, chapter, verse);
    this.favorites.delete(key);
  }
}

export const storage = new MemStorage();