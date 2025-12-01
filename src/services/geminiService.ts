import { GoogleGenAI, Type } from '@google/genai';
import {
  Message,
  Job,
  Project,
  Challenge,
  EvaluationResult,
  Language,
  DebugResult,
  LintIssue,
} from '../types';

// The API key is injected at build time by Vite (see vite.config.ts).
// On Vercel / in .env, define GEMINI_API_KEY and it will be mapped
// to process.env.API_KEY during the build.
const apiKey = process.env.API_KEY as string;

if (!apiKey) {
  throw new Error(
    'API_KEY environment variable not set. Make sure GEMINI_API_KEY is configured in Vercel / .env.'
  );
}

const ai = new GoogleGenAI({ apiKey });

const getModelId = (isThinkingMode: boolean) =>
  isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

export const getChatResponse = async (
  prompt: string,
  history: Message[],
  systemInstruction: string,
  image?: { mimeType: string; data: string },
  isThinkingMode = false
): Promise<string> => {
  try {
    const model = getModelId(isThinkingMode);

    const contents = history.map((msg) => ({
      role: msg.role,
      parts: msg.parts.flatMap((part) => {
        const apiParts: any[] = [];

        if (part.text) {
          apiParts.push({ text: part.text });
        }
        if (part.image?.inlineData) {
          apiParts.push({ inlineData: { ...part.image.inlineData } });
        }
        return apiParts;
      }),
    }));

    const config: any = {
      systemInstruction,
    };

    if (isThinkingMode) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });

    // In the new @google/genai SDK, `text` is usually a method.
    const text =
      typeof (response as any).text === 'function'
        ? (response as any).text()
        : (response as any).text;

    return (text ?? '').toString();
  } catch (error) {
    console.error('Error in getChatResponse:', error);
    throw error;
  }
};

export const findProjects = async (
  history: Message[],
  systemInstruction: string,
  language: Language
): Promise<Project[]> => {
  try {
    const model = 'gemini-2.5-flash';

    const contents = [
      ...history.map((msg) => ({
        role: msg.role,
        parts: msg.parts.map((part) => ({ text: part.text })),
      })),
      {
        role: 'user',
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
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              difficulty: {
                type: Type.STRING,
                enum: ['Beginner', 'Intermediate', 'Advanced'],
              },
            },
            required: ['title', 'description', 'skills', 'difficulty'],
          },
        },
      },
      required: ['projects'],
    };

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
        systemInstruction,
      },
    });

    const text =
      typeof (response as any).text === 'function'
        ? (response as any).text()
        : (response as any).text;

    const jsonString = (text ?? '').toString().trim();
    const data = JSON.parse(jsonString);
    return data.projects ?? [];
  } catch (error) {
    console.error('Error in findProjects:', error);
    return [];
  }
};

// The rest of your helpers (getJobSearchLinks, parseJobListings, getCodingChallenge,
// evaluateCodeSolution, scanForInputRequirements, runCode, formatCode, getCodeCompletions,
// debugCode, lintCode, generateTests) can stay as you already have them.
