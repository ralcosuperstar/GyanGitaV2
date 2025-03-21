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
  private favorites: Map<number, Map<string, Favorite>>;
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

  private getVerseKey(chapter: string, verse: string): string {
    return `${chapter}-${verse}`;
  }

  async getMoodVerses(mood: string): Promise<MoodVerse[]> {
    return this.moodVersesMap.get(mood.toLowerCase()) || [];
  }

  async getAllVerses(): Promise<{ chapter: string; verse: string; }[]> {
    const allVerses = new Set<string>();
    const result: { chapter: string; verse: string; }[] = [];

    this.moodVersesMap.forEach((verses) => {
      verses.forEach((v) => {
        const key = this.getVerseKey(v.chapter, v.verse);
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

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    // Ensure consistent string types
    const chapter = favorite.chapter.toString();
    const verse = favorite.verse.toString();
    const verseKey = this.getVerseKey(chapter, verse);

    // Get or create user's favorites map
    let userFavorites = this.favorites.get(favorite.user_id);
    if (!userFavorites) {
      userFavorites = new Map();
      this.favorites.set(favorite.user_id, userFavorites);
    }

    // Check if already favorited
    if (userFavorites.has(verseKey)) {
      throw new Error('Verse is already in favorites');
    }

    // Create new favorite
    const newFavorite: Favorite = {
      id: this.favoriteId++,
      user_id: favorite.user_id,
      chapter,
      verse,
      saved_at: new Date(),
      notes: favorite.notes || null
    };

    // Store favorite
    userFavorites.set(verseKey, newFavorite);

    return newFavorite;
  }

  async getUserFavorites(userId: number): Promise<Favorite[]> {
    const userFavorites = this.favorites.get(userId);
    if (!userFavorites) {
      return [];
    }

    // Return sorted array of favorites
    return Array.from(userFavorites.values())
      .sort((a, b) => b.saved_at.getTime() - a.saved_at.getTime());
  }

  async removeFavorite(userId: number, chapter: string, verse: string): Promise<void> {
    const verseKey = this.getVerseKey(chapter, verse);
    const userFavorites = this.favorites.get(userId);

    if (userFavorites) {
      userFavorites.delete(verseKey);
    }
  }
}

export const storage = new MemStorage();