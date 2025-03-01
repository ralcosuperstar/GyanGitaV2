import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  last_login: timestamp("last_login"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  last_login: true,
});

// User preferences
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  theme: text("theme").default("light"),
  font_size: text("font_size").default("medium"),
  language: text("language").default("en"),
  notifications_enabled: boolean("notifications_enabled").default(true),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  updated_at: true,
});

// Favorites table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  chapter: text("chapter").notNull(),
  verse: text("verse").notNull(),
  saved_at: timestamp("saved_at").defaultNow(),
  notes: text("notes"),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  saved_at: true,
});

// Reading progress
export const readingProgress = pgTable("reading_progress", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  chapter: text("chapter").notNull(),
  verse: text("verse").notNull(),
  completed: boolean("completed").default(false),
  last_read_at: timestamp("last_read_at").defaultNow(),
});

export const insertProgressSchema = createInsertSchema(readingProgress).omit({
  id: true,
  last_read_at: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertPreferences = z.infer<typeof insertPreferencesSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type ReadingProgress = typeof readingProgress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;

// Existing verse cache table
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

// Existing mood verses table
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