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

function normalizePriceRange(input: any): string {
  const value = Number(input);
  if (Number.isNaN(value)) return "precio medio";
  if (value <= 1) return "muy económico";
  if (value === 2) return "económico";
  if (value === 3) return "precio medio";
  if (value === 4) return "precio medio-alto";
  return "premium";
}

function parseJsonObject(text: string): any {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("La IA no devolvió JSON válido");
    return JSON.parse(match[0]);
  }
}

export async function registerRoutes(app: Express) {
  // ===============================
  // HEALTH
  // ===============================

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      service: "vendeconia-backend",
      productGenerator: Boolean(process.env.OPENAI_API_KEY),
    });
  });

  // ===============================
  // PRODUCT GENERATION (REAL)
  // ===============================

  app.post("/api/products/generate", async (req: any, res) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({
          ok: false,
          error: "OPENAI_API_KEY no configurada en backend",
        });
      }

      const {
        category,
        priceRange,
        trendingOnly = false,
        fastShipping = true,
      } = req.body ?? {};

      if (!category || typeof category !== "string") {
        return res.status(400).json({
          ok: false,
          error: "Selecciona una categoría válida",
        });
      }

      const pricePreference = normalizePriceRange(priceRange);

      const prompt = `
Actúa como analista de oportunidades de ecommerce para VendeConIA.

Genera exactamente 5 ideas de productos concretos para la categoría: ${category}.
Preferencia de precio: ${pricePreference}.
Priorizar señales de tendencia: ${trendingOnly ? "sí" : "no obligatorio"}.
Priorizar productos sencillos de enviar: ${fastShipping ? "sí" : "no obligatorio"}.

No afirmes que un producto es tendencia real si no puedes verificarlo en tiempo real.
No inventes marcas, cifras de ventas, ratings ni proveedores.
Devuelve únicamente JSON válido con esta forma exacta:
{
  "products": [
    {
      "name": "nombre concreto del producto",
      "description": "por qué puede tener interés comercial",
      "price": "precio orientativo en euros, solo número o rango",
      "trending": false,
      "viral": false,
      "popular": false,
      "views": "",
      "tags": ["tag1", "tag2"],
      "affiliateUrl": null,
      "commission": 0,
      "supplier": null,
      "supplierUrl": null
    }
  ]
}
`.trim();

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.6,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Eres un analista de ecommerce. Debes ser útil, prudente y no inventar datos verificables.",
          },
          { role: "user", content: prompt },
        ],
      });

      const raw = response.choices[0]?.message?.content || "";
      const parsed = parseJsonObject(raw);
      const candidates = Array.isArray(parsed?.products) ? parsed.products : [];

      if (candidates.length === 0) {
        throw new Error("La IA no devolvió productos utilizables");
      }

      const products = candidates.slice(0, 5).map((item: any, index: number) => ({
        id: -(Date.now() + index),
        userId: getUserIdOrDemo(req),
        name: String(item?.name || `Idea ${index + 1}`),
        description: String(item?.description || ""),
        price: String(item?.price || ""),
        imageUrl: "",
        rating: null,
        reviews: null,
        trending: Boolean(item?.trending),
        isTrending: Boolean(item?.trending),
        viral: Boolean(item?.viral),
        popular: Boolean(item?.popular),
        views: String(item?.views || ""),
        tags: Array.isArray(item?.tags) ? item.tags.map(String).slice(0, 5) : [],
        affiliateUrl: item?.affiliateUrl || null,
        commission: Number(item?.commission || 0),
        supplier: item?.supplier || null,
        supplierUrl: item?.supplierUrl || null,
        createdAt: new Date().toISOString(),
      }));

      return res.json({
        ok: true,
        products,
        source: "openai",
        generatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      const status = err?.status || err?.statusCode || 500;
      const message = err?.message || "Error al generar productos";

      console.error("PRODUCT_GENERATE_ERROR:", {
        status,
        message,
      });

      return res.status(status).json({
        ok: false,
        error: message,
      });
    }
  });

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
