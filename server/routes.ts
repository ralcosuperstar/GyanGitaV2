import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFavoriteSchema } from "@shared/schema";

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

async function fetchChapters() {
  try {
    const response = await fetch('https://vedicscriptures.github.io/chapters');
    if (!response.ok) {
      throw new Error('Failed to fetch chapters');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth check middleware
  const requireAuth = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    // In a real app, verify the token here
    next();
  };

  // Chapter and verse routes
  app.get('/api/chapters', async (_req, res) => {
    try {
      const chapters = await fetchChapters();
      res.json(chapters);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      res.status(500).json({ error: 'Failed to fetch chapters' });
    }
  });

  app.get('/api/verse/:chapter/:verse', async (req, res) => {
    try {
      const { chapter, verse } = req.params;
      const data = await fetchVerse(chapter, verse);
      res.json(data);
    } catch (error) {
      console.error('Error fetching verse:', error);
      res.status(500).json({ error: 'Failed to fetch verse' });
    }
  });

  // Favorites routes
  app.post('/api/favorites', requireAuth, async (req, res) => {
    try {
      // In a real app, get user_id from the auth token
      const userId = 1; // Temporary for testing

      const favoriteData = insertFavoriteSchema.parse({
        user_id: userId,
        chapter: req.body.chapter,
        verse: req.body.verse
      });

      const favorite = await storage.createFavorite(favoriteData);
      res.json(favorite);
    } catch (error) {
      console.error('Error creating favorite:', error);
      res.status(500).json({ error: 'Failed to save favorite' });
    }
  });

  app.delete('/api/favorites', requireAuth, async (req, res) => {
    try {
      // In a real app, get user_id from the auth token
      const userId = 1; // Temporary for testing

      const { chapter, verse } = req.body;
      await storage.removeFavorite(userId, chapter, verse);
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing favorite:', error);
      res.status(500).json({ error: 'Failed to remove favorite' });
    }
  });

  app.get('/api/user/favorites', requireAuth, async (req, res) => {
    try {
      // In a real app, get user_id from the auth token
      const userId = 1; // Temporary for testing

      const favorites = await storage.getUserFavorites(userId);

      // Fetch verse data for each favorite
      const favoritesWithData = await Promise.all(
        favorites.map(async (favorite) => {
          try {
            const verseData = await fetchVerse(favorite.chapter, favorite.verse);
            return {
              ...favorite,
              ...verseData
            };
          } catch (error) {
            console.error(`Error fetching verse ${favorite.chapter}:${favorite.verse}:`, error);
            return favorite;
          }
        })
      );

      res.json(favoritesWithData);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  });

  // Mood-based routes
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

      // Fetch verse data for all verses
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

      // Filter out failed fetches
      const verses = versesData.filter(Boolean);
      console.log(`Successfully fetched ${verses.length} verses for mood:`, mood);

      res.json(verses);
    } catch (error) {
      console.error('Error fetching mood verses:', error);
      res.status(500).json({ error: 'Failed to fetch mood-based verses' });
    }
  });

  // Related verses route
  app.get('/api/verse/:chapter/:verse/related', async (req, res) => {
    try {
      const { chapter, verse } = req.params;
      const allVerses = await storage.getAllVerses();

      // Filter out the current verse and get random verses
      const otherVerses = allVerses.filter(
        v => !(v.chapter === chapter && v.verse === verse)
      );

      // Get 3 random verses
      const randomVerses = otherVerses
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // Fetch verse data
      const relatedVersesData = await Promise.all(
        randomVerses.map(async (v) => {
          try {
            const verseData = await fetchVerse(v.chapter, v.verse);
            return {
              ...verseData,
              chapter: parseInt(v.chapter),
              verse: parseInt(v.verse)
            };
          } catch (error) {
            console.error(`Failed to fetch verse ${v.chapter}:${v.verse}:`, error);
            return null;
          }
        })
      );

      // Filter out failed fetches
      const verses = relatedVersesData.filter(Boolean);
      res.json(verses);
    } catch (error) {
      console.error('Error fetching related verses:', error);
      res.status(500).json({ error: 'Failed to fetch related verses' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}