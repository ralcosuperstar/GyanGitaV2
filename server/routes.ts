import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const favoriteSchema = z.object({
  chapter: z.coerce.string(),
  verse: z.coerce.string()
});

export async function registerRoutes(app: Express): Promise<Server> {
  const requireAuth = (req: any, res: any, next: any) => {
    req.user = { id: 1 }; // For development
    next();
  };

  app.post('/api/favorites', requireAuth, async (req, res) => {
    try {
      const { chapter, verse } = favoriteSchema.parse(req.body);
      console.log('Creating favorite:', { userId: req.user.id, chapter, verse });

      const favorite = await storage.createFavorite({
        user_id: req.user.id,
        chapter,
        verse,
        notes: null
      });

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
      const { chapter, verse } = favoriteSchema.parse(req.body);
      console.log('Removing favorite:', { userId: req.user.id, chapter, verse });

      await storage.removeFavorite(
        req.user.id,
        chapter,
        verse
      );

      res.json({ success: true });
    } catch (error) {
      console.error('Error removing favorite:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid data format' });
      } else {
        res.status(500).json({ error: 'Failed to remove favorite' });
      }
    }
  });

  app.get('/api/user/favorites', requireAuth, async (req, res) => {
    try {
      console.log('Fetching favorites for user:', req.user.id);
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