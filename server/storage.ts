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
  private favoritesMap: Map<number, Favorite[]>;
  currentId: number;
  favoriteId: number;

  constructor() {
    this.moodVersesMap = new Map();
    this.favoritesMap = new Map();
    this.currentId = 1;
    this.favoriteId = 1;
    this.initializeMoodVerses();
  }

  private initializeMoodVerses() {
    // Initialize from moods data
    moodsData.moods.forEach((moodData: any) => {
      const moodVerses = moodData.verses.map((verse: any) => ({
        id: this.currentId++,
        mood: moodData.name.toLowerCase(),
        chapter: verse.chapter.toString(),
        verse: verse.text.toString()
      }));
      this.moodVersesMap.set(moodData.name.toLowerCase(), moodVerses);
    });
  }

  async getMoodVerses(mood: string): Promise<MoodVerse[]> {
    const normalizedMood = mood.toLowerCase().trim();
    return this.moodVersesMap.get(normalizedMood) || [];
  }

  async getAllVerses(): Promise<{ chapter: string; verse: string; }[]> {
    const allVerses: { chapter: string; verse: string; }[] = [];
    this.moodVersesMap.forEach((verses) => {
      verses.forEach((v) => {
        if (!allVerses.some(existing => 
          existing.chapter === v.chapter && existing.verse === v.verse
        )) {
          allVerses.push({
            chapter: v.chapter,
            verse: v.verse
          });
        }
      });
    });
    return allVerses;
  }

  async insertMoodVerse(moodVerse: InsertMoodVerse): Promise<MoodVerse> {
    const id = this.currentId++;
    const newMoodVerse: MoodVerse = { ...moodVerse, id };

    const existingVerses = this.moodVersesMap.get(moodVerse.mood) || [];
    this.moodVersesMap.set(moodVerse.mood, [...existingVerses, newMoodVerse]);

    return newMoodVerse;
  }

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const id = this.favoriteId++;
    const newFavorite: Favorite = { 
      ...favorite, 
      id,
      saved_at: new Date(),
      notes: favorite.notes || null
    };

    const userFavorites = this.favoritesMap.get(favorite.user_id) || [];

    // Check if verse is already favorited
    const exists = userFavorites.some(
      f => f.chapter === favorite.chapter && f.verse === favorite.verse
    );

    if (exists) {
      throw new Error('Verse is already in favorites');
    }

    this.favoritesMap.set(
      favorite.user_id, 
      [...userFavorites, newFavorite]
    );

    return newFavorite;
  }

  async getUserFavorites(userId: number): Promise<Favorite[]> {
    return this.favoritesMap.get(userId) || [];
  }

  async removeFavorite(userId: number, chapter: string, verse: string): Promise<void> {
    const userFavorites = this.favoritesMap.get(userId) || [];
    const updatedFavorites = userFavorites.filter(
      f => f.chapter !== chapter || f.verse !== verse
    );
    this.favoritesMap.set(userId, updatedFavorites);
  }
}

export const storage = new MemStorage();