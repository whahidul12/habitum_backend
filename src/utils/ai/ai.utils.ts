import { GoogleGenAI } from "@google/genai";
import { IAIResponse, IChatCompletionArgs } from "./ai.types.js";

// Uses fallback configuration variable or dynamic string
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

/**
 * Initializes and retrieves the singleton instance of the Gemini API Client
 */
const getClient = (): GoogleGenAI | null => {
  if (client) return client;

  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  client = new GoogleGenAI({ apiKey: key });
  return client;
};

/**
 * Helper utility to determine if AI features are configured
 */
export const isAIenabled = (): boolean => !!process.env.GEMINI_API_KEY;

/**
 * Safely strips away Markdown blocks and parses clean JSON responses from LLM instructions
 */
export const parseJSON = <T>(text: string | null | undefined): T => {
  let cleanText = (text || "").trim();

  // Fixed JS bug: .startWith changed to native .startsWith
  if (cleanText.startsWith("```json")) {
    cleanText = cleanText.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
  } else if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/```\n?/g, "");
  }

  return JSON.parse(cleanText) as T;
};

/**
 * Sends structural instruction sets directly to Gemini models
 */
export const chatCompletion = async ({
  system,
  user,
  temperature = 0.7,
}: IChatCompletionArgs): Promise<IAIResponse> => {
  const c = getClient();

  if (!c) {
    return {
      ok: false,
      content:
        "AI features disabled - set GEMINI_API_KEY in the backend .env to enable real AI responses.",
    };
  }

  try {
    const res = await c.models.generateContent({
      model: MODEL,
      contents: user,
      config: {
        systemInstruction: system,
        temperature,
      },
    });

    return {
      ok: true,
      content: (res.text || "").trim(),
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    console.error("AI Error:", errorMessage);

    return {
      ok: false,
      content: "AI request failed. Please try again later.",
    };
  }
};

/**
 * Immutable system engine setups for various application contexts
 */
export const SYSTEM_PROMPTS = {
  weekly:
    "You are a warm, encouraging habit coach. Analyse the user's last 7 days of habit data and write a short personalised report (120-180 words). Mention: What went well, what struggled, patterns noticed, and one specific piece of encouragement. Use the user's actual habit names. Be human, not generic. No markdown headers - use plain prose with line breaks.",
  suggestion:
    'You are a helpful habit coach. Based on the user\'s goals, productive time, and past struggles, suggest exactly 3 personalised habits. Return valid JSON only with this shape: {"suggestions":[{"name":"...","description":"...","frequency":"daily|weekly","category":"Health|Fitness|Learning|Mindfulness|Productivity|Social|Creative|Other","icon":"<emoji>","reason":"..."}]} No prose outside JSON.',
  recovery:
    "You are a compassionate habit recovery coach. The user broke a streak. Write a 3-day recovery plan tailored to this specific habit. Be warm but actionable. Use this structure: a short empathetic opening (1-2 sentences), then Day 1/Day 2/Day 3 sections with one concrete action each, then a closing line of encouragement.",
  chat: "You are a helpful habit analysis assistant. Answer the user's question using ONLY the provided habit data as context. Be specific—cite actual habit names, days, and percentages. Keep replies under 120 words. If the data is insufficient, say so briefly. ",
  morning:
    "You are a warm, motivated friend. Write a single short morning message (30-60 words) using the user's actual habit names and current streaks. Mention 1-2 specific habits. Energetic but not cheesy. No emoji overload—max 1.",
} as const; // "as const" makes this object read-only so values cannot be accidentally mutated at runtime
