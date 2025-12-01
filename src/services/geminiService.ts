import { GoogleGenAI } from "@google/genai";
import {
  Message,
  Job,
  Project,
  Challenge,
  EvaluationResult,
  Language,
} from "../types";

// -----------------
// Client setup
// -----------------
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

// Vite will inline this at build time using define() in vite.config.ts
const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY as string,
});

const getModelName = (isThinkingMode: boolean) =>
  isThinkingMode ? "gemini-2.5-pro" : "gemini-2.5-flash";

// Convert our Message[] history into Gemini "contents"
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

// -----------------
// 1) Chat streaming
// -----------------
export async function* getChatResponseStream(
  prompt: string,
  history: Message[],
  systemInstruction: string,
  image?: { mimeType: string; data: string },
  isThinkingMode: boolean = false,
): AsyncGenerator<string, void, unknown> {
  const model = getModelName(isThinkingMode);

  const baseContents = buildContents(history);
  const contents = [
    ...baseContents,
    {
      role: "user",
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

  const config: Record<string, any> = {
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

  const fullText = (response.text ?? "").toString();
  // Fake "streaming" by yielding in word-ish chunks
  const chunks = fullText.split(/(\s+)/);
  for (const chunk of chunks) {
    if (!chunk) continue;
    yield chunk;
  }
}

// -----------------
// 2) Project ideas
// -----------------
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
        role: "user",
        parts: [
          {
            text:
              `Based on our conversation about my ${language} skills and interests, ` +
              `generate 12 project ideas in JSON:\n` +
              `{\n  "projects": [\n    {\n      "title": "...",\n      "description": "...",\n      "skills": ["..."],\n      "difficulty": "Beginner|Intermediate|Advanced"\n    }\n  ]\n}`,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
      config: { systemInstruction },
    });

    const jsonText = (response.text ?? "{}").toString();
    const parsed = JSON.parse(jsonText);
    return parsed.projects ?? [];
  } catch (err) {
    console.error("Error in findProjects:", err);
    return [];
  }
}

// -----------------
// 3) Job search links
// -----------------
export function getJobSearchLinks(language: Language): {
  [category: string]: { name: string; url: string }[];
} {
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
    "Tech-Specific Platforms": [
      {
        name: "Dice",
        url: `https://www.dice.com/jobs?q=${encoded}`,
      },
      {
        name: "Wellfound (AngelList Talent)",
        url: `https://wellfound.com/role/${encoded.toLowerCase()}-developer`,
      },
      {
        name: "StackOverflow Jobs (archive / links)",
        url: `https://stackoverflow.com/jobs?q=${encoded}`,
      },
    ],
  };
}

// -----------------
// 4) Coding challenge
// -----------------
export async function getCodingChallenge(
  language: Language,
): Promise<Challenge> {
  try {
    const model = "gemini-2.5-flash";

    const prompt = `
You are a helpful coding tutor.

Generate a fun, intermediate difficulty coding challenge for ${language}.
Return ONLY valid JSON in this exact shape:

{
  "title": "string",
  "description": "markdown description, can contain lists and code blocks",
  "exampleInput": "string - a sample input",
  "exampleOutput": "string - the correct output for that input"
}
`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const jsonText = (response.text ?? "{}").toString();
    return JSON.parse(jsonText) as Challenge;
  } catch (err) {
    console.error("Error in getCodingChallenge:", err);
    return {
      title: "Challenge unavailable",
      description:
        "I couldn't fetch a new challenge right now. Please try again in a moment.",
      exampleInput: "",
      exampleOutput: "",
    } as Challenge;
  }
}

// -----------------
// 5) Evaluate solution
// -----------------
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

User's code (in ${language}):
\`\`\`${language.toLowerCase()}
${userCode}
\`\`\`

Return ONLY JSON in this shape:

{
  "isCorrect": boolean,
  "simulatedOutput": "string - what the program would print OR the error",
  "feedback": "friendly markdown explanation and suggestions"
}
`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const jsonText = (response.text ?? "{}").toString();
    return JSON.parse(jsonText) as EvaluationResult;
  } catch (err) {
    console.error("Error in evaluateCodeSolution:", err);
    return {
      isCorrect: false,
      simulatedOutput: "An error occurred while evaluating your code.",
      feedback:
        "I ran into an internal issue while checking your solution. Please try again!",
    } as EvaluationResult;
  }
}

// -----------------
// 6) Scan for input()
// -----------------
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

If there are no prompts, return: { "prompts": [] }

Code:
\`\`\`${language.toLowerCase()}
${userCode}
\`\`\`
`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const jsonText = (response.text ?? '{"prompts":[]}').toString();
    const parsed = JSON.parse(jsonText) as { prompts: string[] };
    return parsed.prompts ?? [];
  } catch (err) {
    console.error("Error in scanForInputRequirements:", err);
    return [];
  }
}

// -----------------
// 7) Run code (simulated)
// -----------------
export async function runCode(
  userCode: string,
  language: Language,
  userInput: string,
): Promise<string> {
  try {
    const model = "gemini-2.5-flash";

    const prompt = `
You are a ${language} code interpreter.

Execute the following code mentally and return ONLY what would appear on stdout.
If there is a runtime/compile error, return ONLY the error message.
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
    return "An error occurred while trying to run the code.";
  }
}

// -----------------
// 8) Code completions
// -----------------
export async function getCodeCompletions(
  userCode: string,
  language: Language,
  cursorPosition: number,
): Promise<string[]> {
  try {
    const model = "gemini-2.5-flash";

    const codeWithMarker =
      userCode.slice(0, cursorPosition) +
      "[CURSOR]" +
      userCode.slice(cursorPosition);

    const prompt = `
You are an autocomplete engine for ${language}.

Code (with [CURSOR] marker):
\`\`\`${language.toLowerCase()}
${codeWithMarker}
\`\`\`

Return ONLY JSON like:
{ "suggestions": ["print", "printf", "println"] }

Max 5 suggestions.
`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const jsonText = (response.text ?? '{"suggestions":[]}').toString();
    const parsed = JSON.parse(jsonText) as { suggestions: string[] };
    return parsed.suggestions ?? [];
  } catch (err) {
    console.error("Error in getCodeCompletions:", err);
    return [];
  }
}
// ADD THIS at the bottom of geminiService.ts

export const getJobSearchLinks = (language: Language) => {
  const encodedLang = encodeURIComponent(language);

  return [
    { name: "LinkedIn Jobs", url: `https://www.linkedin.com/jobs/search/?keywords=${encodedLang}%20Developer` },
    { name: "Indeed", url: `https://www.indeed.com/jobs?q=${encodedLang}+Developer` },
    { name: "RemoteOK", url: `https://remoteok.com/remote-${encodedLang}-jobs` },
    { name: "We Work Remotely", url: `https://weworkremotely.com/remote-jobs/search?term=${encodedLang}` },
    { name: "Dice", url: `https://www.dice.com/jobs?q=${encodedLang}` },
    { name: "SimplyHired", url: `https://www.simplyhired.com/search?q=${encodedLang}+Developer` }
  ];
};

