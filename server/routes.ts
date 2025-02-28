import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

async function fetchVerse(chapter: string, verse: string) {
  try {
    const response = await fetch(`https://vedicscriptures.github.io/slok/${chapter}/${verse}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch verse: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching verse ${chapter}:${verse}:`, error);
    throw error;
  }
}

async function fetchChapters() {
  const response = await fetch('https://vedicscriptures.github.io/chapters');
  return response.json();
}

async function fetchChapter(chapter: string) {
  const response = await fetch(`https://vedicscriptures.github.io/chapter/${chapter}`);
  return response.json();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.get('/api/verse/:chapter/:verse', async (req, res) => {
    try {
      const { chapter, verse } = req.params;
      const data = await fetchVerse(chapter, verse);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch verse' });
    }
  });

  app.get('/api/chapters', async (_req, res) => {
    try {
      const data = await fetchChapters();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chapters' });
    }
  });

  app.get('/api/chapter/:chapter', async (req, res) => {
    try {
      const { chapter } = req.params;
      const data = await fetchChapter(chapter);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chapter' });
    }
  });

  // Mood-based verse recommendations
  app.get('/api/mood/:mood', async (req, res) => {
    try {
      const { mood } = req.params;
      console.log(`Fetching verses for mood: ${mood}`);

      // Get all verses mapped to this mood
      const moodVerses = await storage.getMoodVerses(mood);
      console.log('Found mood verses:', moodVerses);

      if (!moodVerses.length) {
        console.log('No verses found for mood:', mood);
        res.status(404).json({ error: 'No verses found for this mood' });
        return;
      }

      // Fetch all verses data from the API
      const versesPromises = moodVerses.map(mv => fetchVerse(mv.chapter, mv.verse));
      const verses = await Promise.all(versesPromises);

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