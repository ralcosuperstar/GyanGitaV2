import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const insertFavoriteSchema = z.object({
  user_id: z.number(),
  chapter: z.string(),
  verse: z.string()
});

export async function registerRoutes(app: Express): Promise<Server> {
  const requireAuth = (req: any, res: any, next: any) => {
    req.user = { id: 1 }; // For development, always authenticate with user_id 1
    next();
  };

  app.post('/api/favorites', requireAuth, async (req, res) => {
    try {
      console.log('Creating favorite:', { userId: req.user.id, ...req.body });

      const favoriteData = insertFavoriteSchema.parse({
        user_id: req.user.id,
        chapter: req.body.chapter.toString(),
        verse: req.body.verse.toString()
      });

      const favorite = await storage.createFavorite(favoriteData);
      console.log('Created favorite:', favorite);
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
      console.log('Removing favorite:', { userId: req.user.id, ...req.body });

      if (!req.body.chapter || !req.body.verse) {
        return res.status(400).json({ error: 'Missing chapter or verse' });
      }

      await storage.removeFavorite(
        req.user.id,
        req.body.chapter.toString(),
        req.body.verse.toString()
      );

      console.log('Removed favorite successfully');
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing favorite:', error);
      res.status(500).json({ error: 'Failed to remove favorite' });
    }
  });

  app.get('/api/user/favorites', requireAuth, async (req, res) => {
    try {
      console.log('Fetching favorites for user:', req.user.id);

      const favorites = await storage.getUserFavorites(req.user.id);
      console.log('Retrieved favorites:', favorites);

      res.json(favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}