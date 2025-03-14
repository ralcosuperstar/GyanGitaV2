import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

// Create schema with proper number types
const insertBookmarkSchema = z.object({
  user_id: z.number(),
  chapter: z.number(),
  verse: z.number()
});

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

  // Bookmark routes
  app.post('/api/bookmarks', requireAuth, async (req, res) => {
    try {
      // In a real app, get user_id from the auth token
      const userId = 1; // Temporary for testing

      const bookmarkData = insertBookmarkSchema.parse({
        user_id: userId,
        chapter: Number(req.body.chapter),
        verse: Number(req.body.verse)
      });

      const bookmark = await storage.createBookmark(bookmarkData);
      res.json(bookmark);
    } catch (error) {
      console.error('Error creating bookmark:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid data format' });
      } else {
        res.status(500).json({ error: 'Failed to save bookmark' });
      }
    }
  });

  app.delete('/api/bookmarks', requireAuth, async (req, res) => {
    try {
      // In a real app, get user_id from the auth token
      const userId = 1; // Temporary for testing

      const { chapter, verse } = req.body;
      await storage.removeBookmark(userId, Number(chapter), Number(verse));
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      res.status(500).json({ error: 'Failed to remove bookmark' });
    }
  });

  app.get('/api/user/bookmarks', requireAuth, async (req, res) => {
    try {
      // In a real app, get user_id from the auth token
      const userId = 1; // Temporary for testing

      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}