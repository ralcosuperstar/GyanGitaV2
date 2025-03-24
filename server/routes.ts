import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  const requireAuth = (req: Request, res: Response, next: any) => {
    req.user = { id: 1 }; // Dummy auth for development
    next();
  };

  // Example API Route to Fetch Verse
  app.get("/api/verse/:id", requireAuth, async (req: Request, res: Response) => {
    const { id } = req.params;

    // Dummy Database Logic - Replace with actual logic
    const verses = {
      "1": { id: 1, text: "This is verse 1" },
      "2": { id: 2, text: "This is verse 2" },
    };

    const verse = verses[id];
    if (!verse) {
      return res.status(404).json({ error: "Verse not found" });
    }

    res.json(verse);
  });

  const httpServer = createServer(app);
  return httpServer;
}
