import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// ===== CONFIG =====
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ===== RUTA: GENERAR VIDEO =====
app.post("/api/video/generate", async (req, res) => {
  try {
    const { idea, titulo, descripcion, cta } = req.body;

    const prompt = `
Crea un video vertical estilo TikTok/Reel.

Tema: ${idea}
Título: ${titulo}
Descripción: ${descripcion}
CTA: ${cta}

Formato:
- Hook fuerte en 3s
- Mensaje claro
- Cierre con CTA
- Estilo viral
`;

    const response = await fetch("https://api.openai.com/v1/videos", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-video",
        prompt,
        size: "720x1280",
      }),
    });

    const data = await response.json();

    if (!data?.id) {
      return res.status(500).json({ error: data });
    }

    res.json({ videoId: data.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generando video" });
  }
});

// ===== RUTA: STATUS =====
app.get("/api/video/:id/status", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(`https://api.openai.com/v1/videos/${id}`, {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    const data = await response.json();

    res.json({
      status: data.status,
    });
  } catch (err) {
    res.status(500).json({ error: "Error status" });
  }
});

// ===== RUTA: CONTENIDO VIDEO =====
app.get("/api/video/:id/content", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      `https://api.openai.com/v1/videos/${id}/content`,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "video/mp4");
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: "Error content" });
  }
});

// ===== START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});