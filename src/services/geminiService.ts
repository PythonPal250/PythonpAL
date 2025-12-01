import { GoogleGenAI, Type } from "@google/genai";
import { Message, Job, Project, Challenge, EvaluationResult, Language, DebugResult, LintIssue } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const _getGenerativeModel_ = (isThinkingMode: boolean) => {
    return isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
};

export const getChatResponse = async (
    prompt: string,
    history: Message[],
    systemInstruction: string,
    image?: { mimeType: string; data: string },
    isThinkingMode: boolean = false,
): Promise<string> => {
    try {
        const model = _getGenerativeModel_(isThinkingMode);

        const contents = history.map(msg => ({
            role: msg.role,
            parts: msg.parts.flatMap(part => {
                const apiParts = [];
                // Add text part if it exists. An empty prompt with just an image is valid.
                if (part.text) {
                    apiParts.push({ text: part.text });
                }
                // Add image part if it exists
                if (part.image && part.image.inlineData) {
                    // Create a shallow copy to prevent potential cyclic reference issues in the SDK.
                    apiParts.push({ inlineData: { ...part.image.inlineData } });
                }
                return apiParts;
            })
        }));

        const config = {
            ...(isThinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {}),
            systemInstruction
        };

        const response = await ai.models.generateContent({
            model,
            contents,
            config,
        });

        return response.text;
    } catch (error) {
        console.error("Error in getChatResponse:", error);
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
            ...history.map(msg => ({
                role: msg.role,
                parts: msg.parts.map(part => ({ text: part.text }))
            })),
            {
                role: 'user',
                parts: [{ text: `Based on our conversation about my ${language} skills and interests, please generate 12 relevant project ideas, covering a mix of Beginner, Intermediate, and Advanced difficulty levels.`}]
            }
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
                            difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
                        },
                        required: ["title", "description", "skills", "difficulty"],
                    },
                },
            },
            required: ["projects"],
        };

        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                responseMimeType: "application/json",
                responseSchema,
                systemInstruction
            },
        });

        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);
        return data.projects || [];
    } catch (error) {
        console.error("Error in findProjects:", error);
        return [];
    }
}

// Helper to generate search links based on language
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

export const parseJobListings = async (pastedText: string, language: Language): Promise<Job[]> => {
    try {
        const model = 'gemini-2.5-flash';
        
        const prompt = `You are JobFinderAI.
        Your goal is to extract real job postings from the raw text provided by the user.
        The user has searched for "${language}" jobs and pasted the results below.

        CRITICAL RULES:
        1. Extract ONLY real jobs mentioned in the pasted text.
        2. Do NOT invent or hallucinate job posts. If there is not enough info, skip it.
        3. For 'url', try to find a link in the text. If none is found, leave it empty.
        4. For 'type', infer if it is 'Remote', 'On-site', or 'Hybrid'. Default to 'On-site' if unclear.
        5. Extract salary if mentioned (e.g., "$100k - $120k").
        
        PASTED TEXT:
        ---
        ${pastedText}
        ---
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                jobs: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            company: { type: Type.STRING },
                            location: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['Remote', 'On-site', 'Hybrid'] },
                            description: { type: Type.STRING },
                            url: { type: Type.STRING },
                            salary: { type: Type.STRING },
                        },
                        required: ["title", "company", "location", "type", "description"],
                    },
                },
            },
            required: ["jobs"],
        };

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            },
        });

        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);
        return data.jobs || [];

    } catch (error) {
        console.error("Error in parseJobListings:", error);
        return [];
    }
};

export const getCodingChallenge = async (language: Language): Promise<Challenge> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `Generate a funny and interesting ${language} coding challenge of intermediate difficulty. The challenge should be solvable in a few lines of code. Provide a title, a description, an example input, and the corresponding example output.`;
        
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                exampleInput: { type: Type.STRING },
                exampleOutput: { type: Type.STRING },
            },
            required: ["title", "description", "exampleInput", "exampleOutput"],
        };
        
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error in getCodingChallenge:", error);
        return {
            title: "The Case of the Missing Semicolon",
            description: "Oh no! It seems I couldn't fetch a challenge. My internal code must be on a coffee break. Try refreshing to wake it up!",
            exampleInput: "N/A",
            exampleOutput: "N/A",
        };
    }
};

export const evaluateCodeSolution = async (challenge: Challenge, userCode: string, language: Language): Promise<EvaluationResult> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `You are a friendly and funny AI code evaluator for the ${language} programming language.
        A user was given this challenge:
        Title: "${challenge.title}"
        Description: "${challenge.description}"

        The user submitted this ${language} code:
        \`\`\`${language.toLowerCase()}
        ${userCode}
        \`\`\`

        Your task is to:
        1.  Analyze the user's code. Does it correctly solve the challenge?
        2.  Simulate the output of their code as if it were run. If it has an error, describe the error in a simple way.
        3.  Provide funny, friendly, and constructive feedback. Be encouraging, even if the code is wrong! Explain what's right and what could be improved.
        4.  Return your evaluation in the specified JSON format.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                isCorrect: { type: Type.BOOLEAN },
                simulatedOutput: { type: Type.STRING },
                feedback: { type: Type.STRING },
            },
            required: ["isCorrect", "simulatedOutput", "feedback"],
        };

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error in evaluateCodeSolution:", error);
        return {
            isCorrect: false,
            simulatedOutput: "Error: My crystal ball is cloudy...",
            feedback: "I seem to have run into a little snag trying to evaluate your code. Could you try submitting it again? Let's give it another go!",
        };
    }
};

export const scanForInputRequirements = async (userCode: string, language: Language): Promise<string[]> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `Analyze the following ${language} code snippet.
        Determine if the code requests user input (e.g., using input(), Scanner, std::cin, etc.).
        
        CRITICAL RULES:
        1. Return a JSON object with a "prompts" key containing an array of prompt strings.
        2. For languages like Python where the prompt is part of the function (e.g. input("Name: ")), extract that string.
        3. For languages like C++, Java, C, or C# where input and output are separate (e.g. cout << "Enter name:"; cin >> name;), identify the PRINT statement immediately preceding the input call and use that text as the prompt.
        4. If there is no specific prompt text found, use an empty string "".
        5. If there is a loop requesting input, only return the prompts for the first iteration.

        Code:
        \`\`\`${language.toLowerCase()}
        ${userCode}
        \`\`\`
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                prompts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                },
            },
            required: ["prompts"],
        };

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);
        return data.prompts || [];

    } catch (error) {
        console.error("Error scanning for inputs:", error);
        return [];
    }
};

export const runCode = async (userCode: string, language: Language, userInput: string): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `You are a ${language} code interpreter.
        Your task is to execute the following code snippet and return ONLY the standard output it produces.
        
        CRITICAL RULES:
        1.  Use the provided "Standard Input" (stdin) below as the input for the program.
        2.  If the code requests input (e.g. input("PromptText"), Scanner, std::cin) and "Standard Input" is provided, read from it sequentially.
        3.  IMPORTANT: When executing input functions (like input("PromptText")), DO NOT include the prompt text ("PromptText") in the final stdout. The UI handles the prompting. Only include explicit print statements or the result of the program.
        4.  If the code runs successfully, return ONLY its direct output (stdout).
        5.  If the code results in an error (like a compilation or runtime error), return ONLY the error message.
        6.  Do NOT add any explanations, commentary, apologies, or markdown formatting like \`\`\`.
        7.  If the code has no output (e.g., it only defines functions or assigns variables), return a specific message: "[No output]".
        
        Standard Input (stdin):
        ---
        ${userInput || ''}
        ---

        Code to execute:
        \`\`\`${language.toLowerCase()}
        ${userCode}
        \`\`\`
        `;
        
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error in runCode:", error);
        return "An error occurred while trying to run the code. My apologies!";
    }
};

export const formatCode = async (userCode: string, language: Language): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `You are an expert code formatter for the ${language} programming language.
        Your task is to format the following code snippet according to the most widely accepted style guide for that language (e.g., PEP 8 for Python, Prettier for JavaScript, etc.).

        CRITICAL RULES:
        1.  Return ONLY the formatted code.
        2.  Do NOT add any explanations, commentary, or markdown formatting like \`\`\`.
        
        Code to format:
        \`\`\`${language.toLowerCase()}
        ${userCode}
        \`\`\`
        `;
        
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error in formatCode:", error);
        return userCode; // Return original code on error
    }
};

export const getCodeCompletions = async (
    userCode: string,
    language: Language,
    cursorPosition: number
): Promise<string[]> => {
    try {
        const model = 'gemini-2.5-flash';

        const codeWithMarker =
            userCode.slice(0, cursorPosition) + "[CURSOR]" + userCode.slice(cursorPosition);

        const prompt = `You are a code completion engine for ${language}.
        Given the following code with a [CURSOR] marker, provide a list of relevant auto-completion suggestions like keywords, variables, and function names in scope.
        
        CRITICAL RULES:
        1. Return a JSON object with a single key "suggestions" which is an array of strings.
        2. The array should contain at most 5 suggestions.
        3. Do NOT include any explanation or markdown. Only the JSON object.
        
        Code:
        \`\`\`${language.toLowerCase()}
        ${codeWithMarker}
        \`\`\`
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                suggestions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                },
            },
            required: ["suggestions"],
        };

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);
        return data.suggestions || [];

    } catch (error) {
        console.error("Error in getCodeCompletions:", error);
        return [];
    }
};

export const debugCode = async (userCode: string, language: Language): Promise<DebugResult> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `You are an expert ${language} debugger.
Your task is to analyze the following code, provide a step-by-step execution trace, and identify the final output.

CRITICAL RULES:
1.  Trace the execution line by line.
2.  For each significant step (variable assignment, loop iteration, function call, return statement), describe what is happening.
3.  At each step, show the state of all relevant variables in scope as a JSON object string.
4.  If the code produces an error, the trace should lead up to the error, and the summary should explain the error.
5.  The 'finalOutput' should be what the program prints to standard output, or the error message if it fails.
6.  The 'summary' should be a brief, high-level explanation of what the code does, and point out any potential bugs, inefficiencies, or logical errors.
7.  Return your analysis in the specified JSON format.

Code to debug:
\`\`\`${language.toLowerCase()}
${userCode}
\`\`\`
`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                trace: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            line: { type: Type.INTEGER },
                            explanation: { type: Type.STRING },
                            variables: { type: Type.OBJECT },
                        },
                        required: ["line", "explanation", "variables"],
                    },
                },
                finalOutput: { type: Type.STRING },
                summary: { type: Type.STRING },
            },
            required: ["trace", "finalOutput", "summary"],
        };

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error in debugCode:", error);
        return {
            trace: [],
            finalOutput: "An error occurred during the debugging process.",
            summary: "I wasn't able to analyze the code. This might be due to a temporary issue or a syntax error I couldn't process. Please try again!",
        };
    }
};

export const lintCode = async (userCode: string, language: Language): Promise<LintIssue[]> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `You are an expert code linter for the ${language} programming language.
Your task is to analyze the following code snippet for potential errors, style issues, and anti-patterns.

CRITICAL RULES:
1.  Identify any syntax errors, logical bugs, or deviations from common style guides (e.g., PEP 8 for Python, Prettier for JavaScript, etc.).
2.  Provide a severity level for each issue: 'Error', 'Warning', or 'Info'.
3.  For each issue, provide a concise, helpful message and the line and column number where it occurs.
4.  If possible, provide a brief suggestion for how to fix the issue.
5.  Return your analysis as a JSON object adhering to the specified schema. If there are no issues, return an empty array.

Code to lint:
\`\`\`${language.toLowerCase()}
${userCode}
\`\`\`
`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                issues: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            line: { type: Type.INTEGER },
                            column: { type: Type.INTEGER },
                            message: { type: Type.STRING },
                            severity: { type: Type.STRING, enum: ['Error', 'Warning', 'Info'] },
                            suggestion: { type: Type.STRING },
                        },
                        required: ["line", "column", "message", "severity"],
                    },
                },
            },
            required: ["issues"],
        };

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);
        return data.issues || [];

    } catch (error) {
        console.error("Error in lintCode:", error);
        return [{
            line: 1,
            column: 1,
            message: "Failed to lint code. An unexpected error occurred.",
            severity: 'Error',
            suggestion: 'Please try again later.'
        }];
    }
};

export const generateTests = async (userCode: string, language: Language): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';

        const testingFrameworks: Partial<Record<Language, string>> = {
            'Python': 'pytest', 'JavaScript': 'Jest', 'TypeScript': 'Jest',
            'Java': 'JUnit 5', 'C++': 'Google Test', 'C#': 'xUnit',
            'Go': 'the built-in testing package', 'Rust': 'the built-in testing framework',
            'Ruby': 'RSpec', 'PHP': 'PHPUnit'
        };
        const framework = testingFrameworks[language] || 'a standard testing framework';

        const prompt = `You are an expert software developer specializing in test-driven development for ${language}.
Your task is to analyze the provided code snippet and generate a suite of high-quality unit tests using ${framework}.

CRITICAL RULES:
1.  Analyze the functions and logic within the code.
2.  Write clear, concise, and effective unit tests that cover edge cases, happy paths, and potential failure modes.
3.  The generated test code should be complete, runnable, and follow best practices for ${language} and ${framework}.
4.  Return ONLY the generated test code.
5.  Do NOT add any explanations, commentary, or markdown formatting like \`\`\`.

Code to test:
\`\`\`${language.toLowerCase()}
${userCode}
\`\`\`
`;
        
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error in generateTests:", error);
        return `// An error occurred while generating tests for your ${language} code. Please try again.`;
    }
};