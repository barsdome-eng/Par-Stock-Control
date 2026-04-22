import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function generateChatResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  const ai = getAI();
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: "You are AI Nexus, a highly intelligent and helpful AI assistant. Your goal is to provide concise, accurate, and inspiring responses. Use markdown for formatting whenever appropriate.",
    }
  });

  return response.text;
}
