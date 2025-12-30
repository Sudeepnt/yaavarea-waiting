
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getFuturisticTeaser() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a short, 2-sentence teaser for a platform called YaavArea where people rate development in their neighborhood. Use words like 'score', 'locality', 'transparent', and 'future'. Keep it monochrome and professional.",
      config: {
        temperature: 0.8,
        maxOutputTokens: 100,
      }
    });
    return response.text || "Your locality. Your voice. Rate the progress of your area with a transparent development score.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The future of neighborhood rating is here. Quantify the development of your locality with YaavArea.";
  }
}
