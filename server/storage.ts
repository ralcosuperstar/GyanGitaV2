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
  private favoritesList: Favorite[];
  private userFavoritesMap: Map<number, Set<string>>;
  private currentId: number;
  private favoriteId: number;

  constructor() {
    this.moodVersesMap = new Map();
    this.favoritesList = [];
    this.userFavoritesMap = new Map();
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
    const newMoodVerse: MoodVerse = { 
      ...moodVerse, 
      id,
      chapter: moodVerse.chapter.toString(),
      verse: moodVerse.verse.toString()
    };

    const existingVerses = this.moodVersesMap.get(moodVerse.mood) || [];
    this.moodVersesMap.set(moodVerse.mood, [...existingVerses, newMoodVerse]);

    return newMoodVerse;
  }

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const id = this.favoriteId++;
    const verseKey = this.getVerseKey(
      favorite.chapter.toString(),
      favorite.verse.toString()
    );

    // Get or create user's favorites set
    let userFavorites = this.userFavoritesMap.get(favorite.user_id);
    if (!userFavorites) {
      userFavorites = new Set();
      this.userFavoritesMap.set(favorite.user_id, userFavorites);
    }

    // Check if already favorited
    if (userFavorites.has(verseKey)) {
      throw new Error('Verse is already in favorites');
    }

    // Add to user's favorites set
    userFavorites.add(verseKey);

    // Create favorite object with consistent string types
    const newFavorite: Favorite = {
      id,
      user_id: favorite.user_id,
      chapter: favorite.chapter.toString(),
      verse: favorite.verse.toString(),
      saved_at: new Date(),
      notes: favorite.notes || null
    };

    // Add to favorites list
    this.favoritesList.push(newFavorite);

    return newFavorite;
  }

  async getUserFavorites(userId: number): Promise<Favorite[]> {
    // Return a sorted copy of the favorites
    return [...this.favoritesList]
      .filter(f => f.user_id === userId)
      .sort((a, b) => {
        // Handle potential null values
        const aTime = a.saved_at ? a.saved_at.getTime() : 0;
        const bTime = b.saved_at ? b.saved_at.getTime() : 0;
        return bTime - aTime;
      });
  }

  async removeFavorite(userId: number, chapter: string, verse: string): Promise<void> {
    const verseKey = this.getVerseKey(chapter, verse);

    // Remove from user's favorites set
    const userFavorites = this.userFavoritesMap.get(userId);
    if (userFavorites) {
      userFavorites.delete(verseKey);
    }

    // Remove from favorites list
    this.favoritesList = this.favoritesList.filter(
      f => !(f.user_id === userId && f.chapter === chapter && f.verse === verse)
    );
  }
}

export const storage = new MemStorage();