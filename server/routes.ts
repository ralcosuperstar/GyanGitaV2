import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import cors from 'cors';

// Create schema with proper number types
const insertBookmarkSchema = z.object({
  user_id: z.number(),
  chapter: z.coerce.number(),
  verse: z.coerce.number()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS for all routes
  app.use(cors());

  // Auth check middleware - for demo, always authenticate
  const requireAuth = (_req: any, _res: any, next: any) => {
    // For demo purposes, set a default user
    next();
  };

  // Add logging middleware with proper error handling
  app.use((req, res, next) => {
    try {
      // Only log if the body exists and is an object
      const logData = {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.method !== 'GET' ? req.body : undefined
      };
      console.log('Request:', logData);
      next();
    } catch (error) {
      // If logging fails, continue with the request
      next();
    }
  });

  // Bookmark routes
  app.post('/api/bookmarks', requireAuth, async (req, res) => {
    try {
      const userId = 1;
      console.log('Creating bookmark:', { userId, body: req.body });

      // Validate and parse the request body
      const bookmarkData = insertBookmarkSchema.parse({
        user_id: userId,
        chapter: req.body.chapter,
        verse: req.body.verse
      });

      console.log('Parsed bookmark data:', bookmarkData);
      const bookmark = await storage.createBookmark(bookmarkData);
      res.json(bookmark);
    } catch (error) {
      console.error('Error creating bookmark:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid data format', details: error.errors });
      } else if (error instanceof Error && error.message === 'Verse is already bookmarked') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to save bookmark' });
      }
    }
  });

  app.delete('/api/bookmarks', requireAuth, async (req, res) => {
    try {
      const userId = 1;
      console.log('Removing bookmark:', { userId, body: req.body });

      const { chapter, verse } = insertBookmarkSchema.parse({
        user_id: userId,
        chapter: req.body.chapter,
        verse: req.body.verse
      });

      await storage.removeBookmark(userId, chapter, verse);
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid data format', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to remove bookmark' });
      }
    }
  });

  app.get('/api/user/bookmarks', requireAuth, async (req, res) => {
    try {
      const userId = 1;
      console.log('Fetching bookmarks for user:', userId);
      const bookmarks = await storage.getUserBookmarks(userId);
      console.log('Found bookmarks:', bookmarks);
      res.json(bookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}