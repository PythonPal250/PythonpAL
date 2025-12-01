import { Message, Language } from './types';

export const getSystemInstruction = (language: Language): string => `You are "${language} Pal," a friendly, funny, and encouraging AI mentor. Your personality is a mix of a caring parent and a cool best friend. Your goal is to help users learn ${language} and guide them toward their career goals.

**CRITICAL RULE: You MUST ONLY answer questions and discuss topics strictly related to the ${language} programming language. If a user asks about anything else (another programming language, history, science, personal questions, etc.), you MUST politely refuse and guide the conversation back to ${language}. For example, say: "That's a great question, but my expertise is all about ${language}! How about we dive into some cool ${language} concepts instead? ✨"**

- Use simple, encouraging language.
- Use emojis and light-hearted jokes to make learning fun.
- When explaining code, break it down into small, easy-to-understand pieces.
- When asked for project ideas, tailor them to the user's perceived skill level from the conversation.
- When asked for jobs, provide a mix of remote and on-site roles relevant to ${language}.
- Actively ask users about their career goals with ${language} (e.g., "So, what amazing things do you dream of building with ${language}? Web apps? Games? AI magic? ✨").
- Based on their goals, recommend other essential tools and skills (e.g., for web dev with JavaScript, suggest React/Angular/Vue, HTML/CSS; for data science with R, suggest Tidyverse, Shiny).
- Always be positive and supportive! You are their biggest fan.`;

export const getInitialMessage = (language: Language): Message => ({
  role: 'model',
  parts: [{ text: `Hey there, my future ${language} superstar! 🌟 I'm ${language} Pal, your personal guide on this awesome coding adventure. Think of me as your coding buddy who will never get tired of your questions. What's the first thing you'd like to learn or build today? Don't be shy!` }],
  timestamp: new Date().toLocaleTimeString(),
});

export const languageKeywords: Record<Language, string[]> = {
    'Python': ['and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'False', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'None', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'True', 'try', 'while', 'with', 'yield'],
    'JavaScript': ['await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield'],
    'Java': ['abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while'],
    'C': ['auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while'],
    'C++': ['alignas', 'alignof', 'and', 'and_eq', 'asm', 'atomic_cancel', 'atomic_commit', 'atomic_noexcept', 'auto', 'bitand', 'bitor', 'bool', 'break', 'case', 'catch', 'char', 'char8_t', 'char16_t', 'char32_t', 'class', 'compl', 'concept', 'const', 'consteval', 'constexpr', 'constinit', 'const_cast', 'continue', 'co_await', 'co_return', 'co_yield', 'decltype', 'default', 'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'not', 'not_eq', 'nullptr', 'operator', 'or', 'or_eq', 'private', 'protected', 'public', 'reflexpr', 'register', 'reinterpret_cast', 'requires', 'return', 'short', 'signed', 'sizeof', 'static', 'static_assert', 'static_cast', 'struct', 'switch', 'synchronized', 'template', 'this', 'thread_local', 'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void', 'volatile', 'wchar_t', 'while', 'xor', 'xor_eq'],
    'C#': ['abstract', 'as', 'base', 'bool', 'break', 'byte', 'case', 'catch', 'char', 'checked', 'class', 'const', 'continue', 'decimal', 'default', 'delegate', 'do', 'double', 'else', 'enum', 'event', 'explicit', 'extern', 'false', 'finally', 'fixed', 'float', 'for', 'foreach', 'goto', 'if', 'implicit', 'in', 'int', 'interface', 'internal', 'is', 'lock', 'long', 'namespace', 'new', 'null', 'object', 'operator', 'out', 'override', 'params', 'private', 'protected', 'public', 'readonly', 'ref', 'return', 'sbyte', 'sealed', 'short', 'sizeof', 'stackalloc', 'static', 'string', 'struct', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using', 'virtual', 'void', 'volatile', 'while'],
    'Go': ['break', 'case', 'chan', 'const', 'continue', 'default', 'defer', 'else', 'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import', 'interface', 'map', 'package', 'range', 'return', 'select', 'struct', 'switch', 'type', 'var'],
    'Swift': ['associatedtype', 'class', 'deinit', 'enum', 'extension', 'fileprivate', 'func', 'import', 'init', 'inout', 'internal', 'let', 'open', 'private', 'precedencegroup', 'protocol', 'public', 'rethrows', 'static', 'struct', 'subscript', 'typealias', 'var', 'break', 'case', 'catch', 'continue', 'default', 'defer', 'do', 'else', 'fallthrough', 'for', 'guard', 'if', 'in', 'repeat', 'return', 'throw', 'switch', 'where', 'while', 'as', 'Any', 'catch', 'false', 'is', 'nil', 'rethrows', 'super', 'self', 'Self', 'throw', 'throws', 'true', 'try'],
    'Kotlin': ['as', 'break', 'class', 'continue', 'do', 'else', 'false', 'for', 'fun', 'if', 'in', 'interface', 'is', 'null', 'object', 'package', 'return', 'super', 'this', 'throw', 'true', 'try', 'typealias', 'val', 'var', 'when', 'while'],
    'Rust': ['as', 'break', 'const', 'continue', 'crate', 'else', 'enum', 'extern', 'false', 'fn', 'for', 'if', 'impl', 'in', 'let', 'loop', 'match', 'mod', 'move', 'mut', 'pub', 'ref', 'return', 'self', 'Self', 'static', 'struct', 'super', 'trait', 'true', 'type', 'unsafe', 'use', 'where', 'while', 'async', 'await', 'dyn'],
    'PHP': ['__halt_compiler', 'abstract', 'and', 'array', 'as', 'break', 'callable', 'case', 'catch', 'class', 'clone', 'const', 'continue', 'declare', 'default', 'die', 'do', 'echo', 'else', 'elseif', 'empty', 'enddeclare', 'endfor', 'endforeach', 'endif', 'endswitch', 'endwhile', 'eval', 'exit', 'extends', 'final', 'finally', 'fn', 'for', 'foreach', 'function', 'global', 'goto', 'if', 'implements', 'include', 'include_once', 'instanceof', 'insteadof', 'interface', 'isset', 'list', 'namespace', 'new', 'or', 'print', 'private', 'protected', 'public', 'require', 'require_once', 'return', 'static', 'switch', 'throw', 'trait', 'try', 'unset', 'use', 'var', 'while', 'xor', 'yield'],
    'Ruby': ['BEGIN', 'END', 'alias', 'and', 'begin', 'break', 'case', 'class', 'def', 'defined?', 'do', 'else', 'elsif', 'end', 'ensure', 'false', 'for', 'if', 'in', 'module', 'next', 'nil', 'not', 'or', 'redo', 'rescue', 'retry', 'return', 'self', 'super', 'then', 'true', 'undef', 'unless', 'until', 'when', 'while', 'yield'],
    'TypeScript': ['break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'as', 'implements', 'interface', 'let', 'package', 'private', 'protected', 'public', 'static', 'yield', 'any', 'boolean', 'constructor', 'declare', 'get', 'module', 'require', 'number', 'set', 'string', 'symbol', 'type', 'from', 'of'],
    'SQL': ['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'DATABASE', 'ALTER', 'DROP', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'ON', 'GROUP', 'BY', 'ORDER', 'ASC', 'DESC', 'HAVING', 'AS', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'LIKE', 'IN', 'BETWEEN', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'],
    'R': ['if', 'else', 'repeat', 'while', 'function', 'for', 'in', 'next', 'break', 'TRUE', 'FALSE', 'NULL', 'Inf', 'NaN', 'NA', 'NA_integer_', 'NA_real_', 'NA_complex_', 'NA_character_'],
    'PowerShell': ['Begin', 'Break', 'Catch', 'Class', 'Continue', 'Data', 'Define', 'Do', 'DynamicParam', 'Else', 'ElseIf', 'End', 'Exit', 'Filter', 'Finally', 'For', 'ForEach', 'From', 'Function', 'If', 'In', 'InlineScript', 'Hidden', 'Parallel', 'Param', 'Process', 'Return', 'Sequence', 'Switch', 'Throw', 'Trap', 'Try', 'Until', 'Using', 'Var', 'While', 'Workflow']
};

export const languageSnippets: Record<Language, string> = {
    'Python': 'def solve():\n    # Your code here\n    pass',
    'JavaScript': 'function solve() {\n    // Your code here\n}',
    'Java': 'class Solution {\n    public static void solve() {\n        // Your code here\n    }\n}',
    'C': '#include <stdio.h>\n\nvoid solve() {\n    // Your code here\n}',
    'C++': '#include <iostream>\n\nvoid solve() {\n    // Your code here\n}',
    'C#': 'using System;\n\npublic class Program {\n    public static void solve() {\n        // Your code here\n    }\n}',
    'Go': 'package main\n\nfunc solve() {\n    // Your code here\n}',
    'Swift': 'func solve() {\n    // Your code here\n}',
    'Kotlin': 'fun solve() {\n    // your code here\n}',
    'Rust': 'fn solve() {\n    // Your code here\n}',
    'PHP': '<?php\n\nfunction solve() {\n    // Your code here\n}\n',
    'Ruby': 'def solve\n  # Your code here\nend',
    'TypeScript': 'function solve(): void {\n    // Your code here\n}',
    'SQL': '-- Write your SQL query here\nSELECT * FROM my_table;',
    'R': 'solve <- function() {\n  # Your code here\n}',
    'PowerShell': 'function solve {\n    # Your code here\n}'
};

export const languageHighlightMap: Record<Language, string> = {
    'Python': 'python',
    'JavaScript': 'javascript',
    'Java': 'java',
    'C': 'c',
    'C++': 'cpp',
    'C#': 'csharp',
    'Go': 'go',
    'Swift': 'swift',
    'Kotlin': 'kotlin',
    'Rust': 'rust',
    'PHP': 'php',
    'Ruby': 'ruby',
    'TypeScript': 'typescript',
    'SQL': 'sql',
    'R': 'r',
    'PowerShell': 'powershell'
};