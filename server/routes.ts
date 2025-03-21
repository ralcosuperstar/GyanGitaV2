import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

// Create schema with proper string types to match storage
const insertFavoriteSchema = z.object({
  user_id: z.number(),
  chapter: z.string(),
  verse: z.string()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth check middleware - simplified for development
  const requireAuth = (req: any, res: any, next: any) => {
    // For development, always authenticate with user_id 1
    req.user = { id: 1 };
    next();
  };

  // Favorites routes
  app.post('/api/favorites', requireAuth, async (req, res) => {
    try {
      const favoriteData = insertFavoriteSchema.parse({
        user_id: req.user.id,
        chapter: req.body.chapter.toString(),
        verse: req.body.verse.toString()
      });

      const favorite = await storage.createFavorite(favoriteData);
      res.json(favorite);
    } catch (error) {
      console.error('Error creating favorite:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid data format' });
      } else {
        res.status(500).json({ error: 'Failed to save favorite' });
      }
    }
  });

  app.delete('/api/favorites', requireAuth, async (req, res) => {
    try {
      const { chapter, verse } = req.body;
      await storage.removeFavorite(req.user.id, chapter.toString(), verse.toString());
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing favorite:', error);
      res.status(500).json({ error: 'Failed to remove favorite' });
    }
  });

  app.get('/api/user/favorites', requireAuth, async (req, res) => {
    try {
      const favorites = await storage.getUserFavorites(req.user.id);
      res.json(favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}