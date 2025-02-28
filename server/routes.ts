import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

async function fetchVerse(chapter: string, verse: string) {
  try {
    console.log(`Fetching verse ${chapter}:${verse}`);
    const url = `https://vedicscriptures.github.io/slok/${chapter}/${verse}`;
    console.log('Fetching from URL:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch verse: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`Successfully fetched verse ${chapter}:${verse}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching verse ${chapter}:${verse}:`, error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/mood/:mood', async (req, res) => {
    try {
      const { mood } = req.params;
      console.log(`Fetching verses for mood: ${mood}`);

      // Get all verses mapped to this mood
      const moodVerses = await storage.getMoodVerses(mood);
      console.log('Found mood verses:', moodVerses);

      if (!moodVerses.length) {
        console.log('No verses found for mood:', mood);
        return res.status(404).json({ error: 'No verses found for this mood' });
      }

      // Fetch all verses data from the API
      const versesData = await Promise.all(
        moodVerses.map(async (mv) => {
          try {
            const verseData = await fetchVerse(mv.chapter, mv.verse);
            return {
              ...verseData,
              chapter: parseInt(mv.chapter),
              verse: parseInt(mv.verse)
            };
          } catch (error) {
            console.error(`Failed to fetch verse ${mv.chapter}:${mv.verse}:`, error);
            return null;
          }
        })
      );

      // Filter out any failed fetches
      const verses = versesData.filter(Boolean);
      console.log(`Successfully fetched ${verses.length} verses for mood:`, mood);

      res.json(verses);
    } catch (error) {
      console.error('Error fetching mood verses:', error);
      res.status(500).json({ error: 'Failed to fetch mood-based verses' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}