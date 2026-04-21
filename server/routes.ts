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

function normalizeSeconds(input: any): "4" | "8" | "12" {
  const value = String(input ?? "4").trim();
  if (value === "4" || value === "8" || value === "12") return value;
  if (value === "15") return "12";
  return "4";
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
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          error: "OPENAI_API_KEY no configurada en backend",
        });
      }

      const {
        titulo,
        descripcion,
        cta,
        idea,
        duracion,
        seconds,
        urlProyecto,
        nombreProyecto,
      } = req.body ?? {};

      const prompt = `
Crea un vídeo vertical corto tipo TikTok.

Proyecto: ${nombreProyecto || ""}
URL: ${urlProyecto || ""}
Título: ${titulo || ""}
Mensaje: ${descripcion || ""}
CTA: ${cta || ""}
Idea: ${idea || ""}

Formato:
- Gancho inicial fuerte
- Ritmo rápido
- Visual moderno
- Final con CTA
`.trim();

      const video = await openai.videos.create({
        model: "sora-2",
        prompt,
        size: "720x1280",
        seconds: normalizeSeconds(seconds ?? duracion),
      });

      return res.json({
        ok: true,
        videoId: (video as any).id,
        status: (video as any).status,
        model: (video as any).model,
      });
    } catch (err: any) {
      const status =
        err?.status ||
        err?.statusCode ||
        err?.response?.status ||
        500;

      const payload = err?.error || err?.response?.data || null;
      const message =
        err?.message ||
        payload?.message ||
        "Error desconocido al generar vídeo";

      console.error("VIDEO_GENERATE_ERROR:", {
        status,
        message,
        payload,
      });

      return res.status(status).json({
        ok: false,
        error: message,
        status,
        details: payload,
      });
    }
  });

  // ===============================
  // VIDEO STATUS
  // ===============================

  app.get("/api/video/:id/status", async (req: any, res) => {
    try {
      const video = await openai.videos.retrieve(req.params.id);

      return res.json({
        ok: true,
        status: (video as any).status || "processing",
      });
    } catch (err: any) {
      const status =
        err?.status ||
        err?.statusCode ||
        err?.response?.status ||
        500;

      const payload = err?.error || err?.response?.data || null;
      const message =
        err?.message ||
        payload?.message ||
        "Error al consultar estado del vídeo";

      console.error("VIDEO_STATUS_ERROR:", {
        status,
        message,
        payload,
      });

      return res.status(status).json({
        ok: false,
        error: message,
        status,
        details: payload,
      });
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
      return res.send(buffer);
    } catch (err: any) {
      const status =
        err?.status ||
        err?.statusCode ||
        err?.response?.status ||
        500;

      const payload = err?.error || err?.response?.data || null;
      const message =
        err?.message ||
        payload?.message ||
        "Error al descargar vídeo";

      console.error("VIDEO_CONTENT_ERROR:", {
        status,
        message,
        payload,
      });

      return res.status(status).json({
        ok: false,
        error: message,
        status,
        details: payload,
      });
    }
  });
}