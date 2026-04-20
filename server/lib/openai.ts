import OpenAI from "openai";
import { storage } from "../storage";

// ==========================
// CLIENT
// ==========================

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("OPENAI_API_KEY no configurada en el entorno del servidor");
    return null;
  }

  return new OpenAI({ apiKey });
}

export function requireOpenAIClient() {
  const client = getOpenAIClient();

  if (!client) {
    throw new Error("No hay OPENAI_API_KEY configurada.");
  }

  return client;
}

// ==========================
// GENERATE TEXT SIMPLE
// ==========================

export async function generateText(prompt: string): Promise<string> {
  try {
    const client = getOpenAIClient();
    if (!client) return "No hay API Key configurada.";

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating text:", error);
    return "Error generando texto.";
  }
}

// ==========================
// RUN ASSISTANT
// ==========================

export async function runAssistant(
  assistantId: number,
  input: string,
): Promise<string> {
  try {
    const client = getOpenAIClient();
    if (!client) return "No hay API Key configurada.";

    const assistant = await storage.getAssistant(assistantId);
    if (!assistant) {
      return "Asistente no encontrado.";
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      temperature: assistant.temperature ?? 0.7,
      messages: [
        {
          role: "system",
          content: assistant.systemPrompt,
        },
        {
          role: "user",
          content: input,
        },
      ],
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error running assistant:", error);
    return "Error ejecutando asistente.";
  }
}