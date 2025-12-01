export enum View {
  CHAT = 'CHAT',
  PROJECTS = 'PROJECTS',
  JOBS = 'JOBS',
  IDE = 'IDE',
  GAME = 'GAME',
}

export const supportedLanguages = [
  'Python', 'JavaScript', 'Java', 'C', 'C++', 'C#', 'Go', 'Swift', 
  'Kotlin', 'Rust', 'PHP', 'Ruby', 'TypeScript', 'SQL', 'R', 'PowerShell'
] as const;

export type Language = typeof supportedLanguages[number];

export interface Part {
  text: string;
  image?: {
    inlineData: {
      mimeType: string;
      data: string;
    };
  };
}

export interface Message {
  role: 'user' | 'model';
  parts: Part[];
  timestamp: string;
}

export interface Project {
  title: string;
  description: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Job {
  title: string;
  company: string;
  location: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  description: string;
  url: string;
  salary?: string;
}

export interface Challenge {
  title: string;
  description: string;
  exampleInput: string;
  exampleOutput: string;
}

export interface EvaluationResult {
  isCorrect: boolean;
  simulatedOutput: string;
  feedback: string;
}

export interface LintIssue {
  line: number;
  column: number;
  message: string;
  severity: 'Error' | 'Warning' | 'Info';
  suggestion?: string;
}

export interface DebugStep {
  line: number;
  explanation: string;
  variables: Record<string, any>;
}

export interface DebugResult {
  trace: DebugStep[];
  finalOutput: string;
  summary: string;
}