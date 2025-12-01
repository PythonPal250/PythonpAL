import { GoogleGenAI, Type } from "@google/genai";
import { Message, Project, Language } from "../types";

type ImagePart = { mimeType: string; data: string };

// Read API key from Vite env (client-side safe for now for your demo)
const apiKey =
  import.meta.env.VITE_GEMINI_API_KEY ||
  import.meta.env.VITE_API_KEY ||
  "";

// We create the client lazily so just importing this file
// does NOT immediately throw and break the whole app.
let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Set VITE_GEMINI_API_KEY in your Vercel environment."
    );
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

const getModelName = (isThinkingMode: boolean) =>
  isThinkingMode ? "gemini-2.5-pro" : "gemini-2.5-flash";

function toGenAiContents(history: Message[], image?: ImagePart) {
  return history.map((msg) => ({
    role: msg.role,
    parts: msg.parts.flatMap((part) => {
      const partsArr: any[] = [];
      if (part.text) partsArr.push({ text: part.text });
      if (part.image?.inlineData) {
        partsArr.push({ inlineData: { ...part.image.inlineData } });
      }
      return partsArr;
    }),
  }));
}

// --- Chat ---

export async function* getChatResponseStream(
  prompt: string,
  history: Message[],
  systemInstruction: string,
  image?: ImagePart,
  isThinkingMode = false
): AsyncGenerator<string, void, unknown> {
  const model = getModelName(isThinkingMode);
  const contents = toGenAiContents(history, image);

  const config: any = { systemInstruction };
  if (isThinkingMode) {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  const ai = getClient();

  // We call the non-streaming API once, then "fake-stream" chunks of text
  // so that `for await ... of getChatResponseStream(...)` still works.
  const response: any = await ai.models.generateContent({
    model,
    contents,
    config,
  });

  const fullText: string =
    typeof response.text === "function"
      ? response.text()
      : typeof response.response?.text === "function"
      ? response.response.text()
      : (response.text as string) ?? "";

  const chunks = fullText.split(/(\s+)/); // keep spaces
  for (const chunk of chunks) {
    if (!chunk) continue;
    yield chunk;
  }
}

// --- Projects tab ---

export async function findProjects(
  history: Message[],
  systemInstruction: string,
  language: Language
): Promise<Project[]> {
  try {
    const ai = getClient();

    const contents: any[] = [
      ...history.map((msg) => ({
        role: msg.role,
        parts: msg.parts.map((part) => ({ text: part.text })),
      })),
      {
        role: "user",
        parts: [
          {
            text: `Based on our conversation about my ${language} skills and interests, please generate 12 relevant project ideas, covering a mix of Beginner, Intermediate, and Advanced difficulty levels.`,
          },
        ],
      },
    ];

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        projects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              difficulty: { type: Type.STRING },
              githubTemplate: { type: Type.STRING },
            },
            required: ["title", "description", "skills", "difficulty"],
          },
        },
      },
      required: ["projects"],
    };

    const response: any = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const jsonText: string =
      typeof response.text === "function"
        ? response.text()
        : typeof response.response?.text === "function"
        ? response.response.text()
        : (response.text as string) ?? "";

    const data = JSON.parse(jsonText);
    return (data.projects || []).map((p: any, idx: number) => ({
      id: p.id ?? `project-${idx + 1}`,
      ...p,
    }));
  } catch (err) {
    console.error("Error in findProjects:", err);
    return [];
  }
}
