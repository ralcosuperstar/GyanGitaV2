import { moodVerses, type MoodVerse, type InsertMoodVerse, favorites, type Favorite, type InsertFavorite } from "@shared/schema";

export interface IStorage {
  getMoodVerses(mood: string): Promise<MoodVerse[]>;
  insertMoodVerse(moodVerse: InsertMoodVerse): Promise<MoodVerse>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  getUserFavorites(userId: number): Promise<Favorite[]>;
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
    const moodData = {
      "anger": [
        { chapter: "2", verse: "56" },
        { chapter: "2", verse: "62" },
        { chapter: "2", verse: "63" },
        { chapter: "5", verse: "26" },
        { chapter: "16", verse: "1" }
      ],
      "peaceful": [
        { chapter: "2", verse: "66" },
        { chapter: "2", verse: "71" },
        { chapter: "4", verse: "39" },
        { chapter: "5", verse: "29" },
        { chapter: "8", verse: "28" }
      ],
      "depression": [
        { chapter: "2", verse: "3" },
        { chapter: "2", verse: "14" },
        { chapter: "5", verse: "21" }
      ],
      "confusion": [
        { chapter: "2", verse: "7" },
        { chapter: "3", verse: "7" },
        { chapter: "18", verse: "61" }
      ],
      "fear": [
        { chapter: "4", verse: "10" },
        { chapter: "11", verse: "50" },
        { chapter: "18", verse: "30" }
      ],
      "greed": [
        { chapter: "14", verse: "17" },
        { chapter: "16", verse: "21" },
        { chapter: "17", verse: "25" }
      ],
      "demotivated": [
        { chapter: "11", verse: "33" },
        { chapter: "18", verse: "48" },
        { chapter: "18", verse: "78" }
      ],
      "temptation": [
        { chapter: "2", verse: "60" },
        { chapter: "2", verse: "61" },
        { chapter: "2", verse: "70" },
        { chapter: "7", verse: "14" }
      ],
      "forgetfulness": [
        { chapter: "15", verse: "15" },
        { chapter: "18", verse: "61" }
      ],
      "losing_hope": [
        { chapter: "4", verse: "11" },
        { chapter: "9", verse: "22" },
        { chapter: "9", verse: "34" },
        { chapter: "18", verse: "66" }
      ],
      "lust": [
        { chapter: "3", verse: "37" },
        { chapter: "3", verse: "41" },
        { chapter: "3", verse: "43" },
        { chapter: "5", verse: "22" }
      ],
      "uncontrolled_mind": [
        { chapter: "6", verse: "5" },
        { chapter: "6", verse: "6" },
        { chapter: "6", verse: "26" },
        { chapter: "6", verse: "35" }
      ],
      "envy": [
        { chapter: "12", verse: "13" },
        { chapter: "12", verse: "14" },
        { chapter: "16", verse: "19" },
        { chapter: "18", verse: "71" }
      ],
      "discriminated": [
        { chapter: "5", verse: "18" },
        { chapter: "5", verse: "19" },
        { chapter: "6", verse: "32" },
        { chapter: "9", verse: "29" }
      ],
      "forgiveness": [
        { chapter: "11", verse: "44" },
        { chapter: "12", verse: "13" },
        { chapter: "12", verse: "14" },
        { chapter: "16", verse: "1" }
      ]
    };

    Object.entries(moodData).forEach(([mood, verses]) => {
      const moodVerses = verses.map((v) => ({
        id: this.currentId++,
        mood,
        chapter: v.chapter,
        verse: v.verse
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
}

export const storage = new MemStorage();