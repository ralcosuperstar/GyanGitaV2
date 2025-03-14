import { moodVerses, type MoodVerse, type InsertMoodVerse } from "@shared/schema";

interface Bookmark {
  id: number;
  user_id: number;
  chapter: number;
  verse: number;
  created_at: Date;
}

interface InsertBookmark {
  user_id: number;
  chapter: number;
  verse: number;
}

export interface IStorage {
  getMoodVerses(mood: string): Promise<MoodVerse[]>;
  insertMoodVerse(moodVerse: InsertMoodVerse): Promise<MoodVerse>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  getUserBookmarks(userId: number): Promise<Bookmark[]>;
  removeBookmark(userId: number, chapter: number, verse: number): Promise<void>;
  getAllVerses(): Promise<{ chapter: string; verse: string; }[]>;
}

export class MemStorage implements IStorage {
  private moodVersesMap: Map<string, MoodVerse[]>;
  private bookmarksMap: Map<number, Bookmark[]>;
  currentId: number;
  bookmarkId: number;

  constructor() {
    this.moodVersesMap = new Map();
    this.bookmarksMap = new Map();
    this.currentId = 1;
    this.bookmarkId = 1;
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

  async createBookmark(bookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.bookmarkId++;
    const newBookmark: Bookmark = {
      ...bookmark,
      id,
      created_at: new Date()
    };

    const userBookmarks = this.bookmarksMap.get(bookmark.user_id) || [];

    // Check if verse is already bookmarked
    const exists = userBookmarks.some(
      b => b.chapter === bookmark.chapter && b.verse === bookmark.verse
    );

    if (exists) {
      throw new Error('Verse is already bookmarked');
    }

    this.bookmarksMap.set(
      bookmark.user_id,
      [...userBookmarks, newBookmark]
    );

    return newBookmark;
  }

  async getUserBookmarks(userId: number): Promise<Bookmark[]> {
    return this.bookmarksMap.get(userId) || [];
  }

  async removeBookmark(userId: number, chapter: number, verse: number): Promise<void> {
    const userBookmarks = this.bookmarksMap.get(userId) || [];
    const updatedBookmarks = userBookmarks.filter(
      b => b.chapter !== chapter || b.verse !== verse
    );
    this.bookmarksMap.set(userId, updatedBookmarks);
  }
}

export const storage = new MemStorage();