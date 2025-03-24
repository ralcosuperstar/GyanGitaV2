import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  const requireAuth = (req: any, res: any, next: any) => {
    req.user = { id: 1 }; // For development
    next();
  };

  const httpServer = createServer(app);
  return httpServer;
}