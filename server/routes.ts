import type { Express } from "express";
import { storage } from "./storage";
import { insertAssistantSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getUserIdOrDemo(req: any): string {
  return req.user?.claims?.sub || "demo_user_1";
}

export async function registerRoutes(app: Express) {

  // ===============================
  // ASSISTANTS (NO TOCAR)
  // ===============================

  app.get("/api/assistants", async (req: any, res) => {
    const userId = getUserIdOrDemo(req);
    const assistants = await storage.getUserAssistants(userId);
    res.json(assistants);
  });

  app.post("/api/assistants", async (req: any, res) => {
    const userId = getUserIdOrDemo(req);
    const data = insertAssistantSchema.parse(req.body);

    const assistant = await storage.createAssistant({
      ...data,
      userId,
    });

    res.json(assistant);
  });

  // ===============================
  // VIDEO GENERATION (REAL)
  // ===============================

  app.post("/api/video/generate", async (req: any, res) => {
    try {
      const { titulo, descripcion, cta, idea } = req.body;

      const prompt = `
Crea un vídeo vertical corto tipo TikTok.

Título: ${titulo}
Mensaje: ${descripcion}
CTA: ${cta}
Idea: ${idea}

Formato:
- Gancho inicial fuerte
- Ritmo rápido
- Visual moderno
- Final con CTA
`;

      const video = await openai.videos.create({
        model: "sora-2",
        prompt,
        size: "720x1280",
      });

      res.json({
        videoId: (video as any).id,
      });

    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // ===============================
  // VIDEO STATUS
  // ===============================

  app.get("/api/video/:id/status", async (req: any, res) => {
    try {
      const video = await openai.videos.retrieve(req.params.id);

      res.json({
        status: (video as any).status || "processing",
      });

    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // ===============================
  // VIDEO DOWNLOAD
  // ===============================

  app.get("/api/video/:id/content", async (req: any, res) => {
    try {
      const response = await openai.videos.downloadContent(req.params.id);

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader("Content-Type", "video/mp4");
      res.send(buffer);

    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

}