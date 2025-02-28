import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Verse cache table to minimize API calls
export const verses = pgTable("verses", {
  id: serial("id").primaryKey(),
  chapter: text("chapter").notNull(),
  verse: text("verse").notNull(),
  text: text("text").notNull(),
  translation: text("translation").notNull(),
  cached_at: timestamp("cached_at").defaultNow(),
});

export const insertVerseSchema = createInsertSchema(verses).omit({
  id: true,
  cached_at: true,
});

export type InsertVerse = z.infer<typeof insertVerseSchema>;
export type Verse = typeof verses.$inferSelect;

// Moods mapped to verses
export const moodVerses = pgTable("mood_verses", {
  id: serial("id").primaryKey(),
  mood: text("mood").notNull(),
  chapter: text("chapter").notNull(),
  verse: text("verse").notNull(),
});

export const insertMoodVerseSchema = createInsertSchema(moodVerses).omit({
  id: true,
});

export type InsertMoodVerse = z.infer<typeof insertMoodVerseSchema>;
export type MoodVerse = typeof moodVerses.$inferSelect;
