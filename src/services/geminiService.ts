import { GoogleGenAI } from "@google/genai";
import type { Message, Job, Project, Challenge, EvaluationResult, Language } from "../types";

// Guard for missing API key
if (!process.env.API_KEY) {
  // At build/runtime this will show clearly in console if the env var is missing
  console.warn("API_KEY environment variable is not set. Gemini calls will fail until you configure it.");
}

// Create a single client instance
const ai = new GoogleGenAI({
  // In Vite, this will be inlined from define() in vite.config.ts
  apiKey: process.env.API_KEY,
});

// Helper to choose model
const getModelName = (thinking: boolean) =>
  thinking ? "gemini-2.5-pro" : "gemini-2.5-flash";

// Convert our internal Message[] to Gemini contents format
function buildContents(history: Message[]) {
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

/**
 * Streaming chat response – used by App.tsx
 */
export async function* getChatResponseStream(
  prompt: string,
  history: Message[],
  systemInstruction: string,
  image?: { mimeType: string; data: string },
  isThinkingMode: boolean = false,
): AsyncGenerator<string, void, unknown> {
  try {
    const model = getModelName(isThinkingMode);

    const contents = [
      ...buildContents(history),
      {
        role: "user" as const,
        parts: [
          { text: prompt },
          ...(image
            ? [
                {
                  inlineData: {
                    mimeType: image.mimeType,
                    data: image.data,
                  },
                },
              ]
            : []),
        ],
      },
    ];

    const config: any = { systemInstruction };
    if (isThinkingMode) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });

    const fullText = (response.text ?? "").toString();
    const chunks = fullText.split(/(\s+)/);

    for (const chunk of chunks) {
      if (!chunk) continue;
      yield chunk;
    }
  } catch (err) {
    console.error("Error in getChatResponseStream:", err);
    // Yield a friendly error message instead of crashing the UI
    yield "⚠️ Sorry, I ran into a problem talking to Gemini. Please check your API key and try again.";
  }
}

/**
 * Generate project ideas – used by ProjectsView via App.tsx
 */
export async function findProjects(
  history: Message[],
  systemInstruction: string,
  language: Language,
): Promise<Project[]> {
  try {
    const model = "gemini-2.5-flash";

    const contents = [
      ...buildContents(history),
      {
        role: "user" as const,
        parts: [
          {
            text: `Based on our conversation and my ${language} skills, generate 12 project ideas as pure JSON in this shape:
{
  "projects": [
    {
      "title": "string",
      "description": "string",
      "skills": ["string"],
      "difficulty": "Beginner" | "Intermediate" | "Advanced"
    }
  ]
}`,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
      config: { systemInstruction },
    });

    const json = (response.text ?? "{}").toString();
    const parsed = JSON.parse(json);
    return (parsed.projects ?? []) as Project[];
  } catch (err) {
    console.error("Error in findProjects:", err);
    return [];
  }
}

/**
 * Job search helper links – used by JobsView
 */
export function getJobSearchLinks(
  language: Language,
): Record<string, { name: string; url: string }[]> {
  const encoded = encodeURIComponent(language);

  return {
    "Global Job Platforms": [
      {
        name: "LinkedIn Jobs",
        url: `https://www.linkedin.com/jobs/search/?keywords=${encoded}%20Developer`,
      },
      {
        name: "Indeed",
        url: `https://www.indeed.com/jobs?q=${encoded}+Developer`,
      },
      {
        name: "Glassdoor",
        url: `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encoded}%20Developer`,
      },
      {
        name: "Google Jobs",
        url: `https://www.google.com/search?q=${encoded}+developer+jobs`,
      },
    ],
    "Remote-First Platforms": [
      {
        name: "RemoteOK",
        url: `https://remoteok.com/remote-${encoded}-jobs`,
      },
      {
        name: "We Work Remotely",
        url: `https://weworkremotely.com/remote-jobs/search?term=${encoded}`,
      },
      {
        name: "Remotive",
        url: `https://remotive.com/remote-jobs/search?search=${encoded}`,
      },
      {
        name: "Working Nomads",
        url: `https://www.workingnomads.com/jobs?category=${encoded.toLowerCase()}`,
      },
    ],
    "Tech-Specific Boards": [
      {
        name: "Dice",
        url: `https://www.dice.com/jobs?q=${encoded}`,
      },
      {
        name: "Wellfound (AngelList Talent)",
        url: `https://wellfound.com/role/${encoded.toLowerCase()}-developer`,
      },
      {
        name: "Stack Overflow Jobs (archive)",
        url: `https://stackoverflow.com/jobs?q=${encoded}`,
      },
    ],
  };
}

/**
 * Coding challenge – used by GameView
 */
export async function getCodingChallenge(
  language: Language,
): Promise<Challenge> {
  try {
    const model = "gemini-2.5-flash";

    const prompt = `
You are a fun coding tutor.
Create one intermediate ${language} coding challenge.

Return ONLY valid JSON in this format:

{
  "title": "string",
  "description": "markdown string explaining the task",
  "exampleInput": "string",
  "exampleOutput": "string"
}
`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const json = (response.text ?? "{}").toString();
    return JSON.parse(json) as Challenge;
  } catch (err) {
    console.error("Error in getCodingChallenge:", err);
    return {
      title: "Challenge unavailable",
      description:
        "I couldn't generate a new challenge right now. Please try again in a moment!",
      exampleInput: "",
      exampleOutput: "",
    };
  }
}

/**
 * Evaluate user's solution – used by GameView
 */
export async function evaluateCodeSolution(
  challenge: Challenge,
  userCode: string,
  language: Language,
): Promise<EvaluationResult> {
  try {
    const model = "gemini-2.5-flash";

    const prompt = `
You are a friendly ${language} code reviewer.

Challenge:
Title: ${challenge.title}
Description:
${challenge.description}

User's code:
\`\`\`${language.toLowerCase()}
${userCode}
\`\`\`

Return ONLY JSON in this format:

{
  "isCorrect": boolean,
  "simulatedOutput": "string - what the program would print OR the error message",
  "feedback": "string - detailed friendly feedback in markdown"
}
`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const json = (response.text ?? "{}").toString();
    return JSON.parse(json) as EvaluationResult;
  } catch (err) {
    console.error("Error in evaluateCodeSolution:", err);
    return {
      isCorrect: false,
      simulatedOutput: "An internal error occurred while evaluating the code.",
      feedback:
        "I wasn't able to check your code this time. Please try again in a moment!",
    };
  }
}

/**
 * Analyze code for input() prompts – used by IDEView
 */
export async function scanForInputRequirements(
  userCode: string,
  language: Language,
): Promise<string[]> {
  try {
    const model = "gemini-2.5-flash";

    const prompt = `
Analyze this ${language} code and detect any user input prompts.

Return ONLY JSON like:
{ "prompts": ["Enter your name:", "Enter age:"] }

If there are no prompts, return:
{ "prompts": [] }

Code:
\`\`\`${language.toLowerCase()}
${userCode}
\`\`\`
`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const json = (response.text ?? '{"prompts":[]}').toString();
    const parsed = JSON.parse(json) as { prompts?: string[] };
    return parsed.prompts ?? [];
  } catch (err) {
    console.error("Error in scanForInputRequirements:", err);
    return [];
  }
}

/**
 * Simulate running user code – used by IDEView
 */
export async function runCode(
  userCode: string,
  language: Language,
  userInput: string,
): Promise<string> {
  try {
    const model = "gemini-2.5-flash";

    const prompt = `
You are a ${language} code interpreter.

Execute the code mentally and return ONLY what would appear on stdout.
If there is a compile/runtime error, return ONLY the error message.
Do NOT add explanations or extra text.

Standard input (stdin):
${userInput || ""}

Code:
\`\`\`${language.toLowerCase()}
${userCode}
\`\`\`
`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = (response.text ?? "").toString().trim();
    return text || "[No output]";
  } catch (err) {
    console.error("Error in runCode:", err);
    return "An internal error occurred while trying to run the code.";
  }
}

/**
 * Code completion suggestions – used by IDEView
 */
export async function getCodeCompletions(
  userCode: string,
  language: Language,
  cursorPosition: number,
): Promise<string[]> {
  try {
    const model = "gemini-2.5-flash";

    const codeWithCursor =
      userCode.slice(0, cursorPosition) +
      "[CURSOR]" +
      userCode.slice(cursorPosition);

    const prompt = `
You are an autocomplete engine for ${language}.

Code (with [CURSOR] marker):
\`\`\`${language.toLowerCase()}
${codeWithCursor}
\`\`\`

Return ONLY JSON like:
{ "suggestions": ["print", "printf", "println"] }

Max 5 suggestions.
`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const json = (response.text ?? '{"suggestions":[]}').toString();
    const parsed = JSON.parse(json) as { suggestions?: string[] };
    return parsed.suggestions ?? [];
  } catch (err) {
    console.error("Error in getCodeCompletions:", err);
    return [];
  }
}
