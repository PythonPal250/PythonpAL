import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Challenge, EvaluationResult, Language } from '../types';
import { getCodingChallenge, evaluateCodeSolution } from '../services/geminiService';
import { CodeGameIcon, RefreshIcon } from './Icons';
import { marked } from 'marked';
import { languageKeywords, languageSnippets, languageHighlightMap } from '../constants';

declare const hljs: any;

interface GameViewProps {
  language: Language;
}

const GameView: React.FC<GameViewProps> = ({ language }) => {
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [userCode, setUserCode] = useState<string>(() => languageSnippets[language]);
    const [result, setResult] = useState<EvaluationResult | null>(null);
    const [isLoadingChallenge, setIsLoadingChallenge] = useState(true);
    const [isEvaluating, setIsEvaluating] = useState(false);
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const nextCursorPosition = useRef<number | null>(null);

    const fetchNewChallenge = useCallback(async () => {
        setIsLoadingChallenge(true);
        setResult(null);
        setUserCode(languageSnippets[language]);
        const newChallenge = await getCodingChallenge(language);
        setChallenge(newChallenge);
        setIsLoadingChallenge(false);
    }, [language]);

    useEffect(() => {
        fetchNewChallenge();
    }, [fetchNewChallenge]);
    
    useEffect(() => {
        if (textareaRef.current && nextCursorPosition.current !== null) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(nextCursorPosition.current, nextCursorPosition.current);
            nextCursorPosition.current = null;
        }
    }, [userCode]);

    const highlightedCode = useMemo(() => {
        const lang = languageHighlightMap[language];
        // FIX: Check if the language is supported by the loaded highlight.js library.
        // The default CDN build may not include all languages, causing a crash.
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(userCode, { language: lang, ignoreIllegals: true }).value;
        }
        // Fallback for unsupported languages: display plain text to prevent crashing.
        // We escape HTML entities for safety.
        return userCode
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }, [userCode, language]);

    const handleScroll = () => {
        if (textareaRef.current && preRef.current) {
            preRef.current.scrollTop = textareaRef.current.scrollTop;
            preRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        const { value, selectionStart, selectionEnd } = textarea;

        if (e.key === 'Enter') {
            e.preventDefault();
            
            const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
            const currentLine = value.substring(lineStart, selectionStart);
            const indentationMatch = currentLine.match(/^\s*/);
            const currentIndentation = indentationMatch ? indentationMatch[0] : '';
            
            let newIndentation = currentIndentation;
            const trimmedLine = currentLine.trim();
            if (trimmedLine.endsWith(':') || trimmedLine.endsWith('{')) {
                newIndentation += '    '; // Add 4 spaces for a new block
            }

            const newValue = 
                value.substring(0, selectionStart) +
                '\n' +
                newIndentation +
                value.substring(selectionEnd);
            
            nextCursorPosition.current = selectionStart + 1 + newIndentation.length;
            setUserCode(newValue);

        } else if (e.key === 'Tab') {
            e.preventDefault();

            // Attempt Auto-Completion
            const keywords = languageKeywords[language] || [];
            const textBeforeCursor = value.substring(0, selectionStart);
            const lastWordMatch = textBeforeCursor.match(/(\w+)$/);
            
            if (lastWordMatch) {
                const currentWord = lastWordMatch[1];
                const suggestion = keywords.find(k => k.startsWith(currentWord) && k !== currentWord);
                
                if (suggestion) {
                    const completion = suggestion.substring(currentWord.length);
                    const newValue = 
                        value.substring(0, selectionStart) +
                        completion +
                        value.substring(selectionEnd);
                    
                    nextCursorPosition.current = selectionStart + completion.length;
                    setUserCode(newValue);
                    return; // Exit after auto-completion
                }
            }
            
            // Default to Indentation if no completion
            const newValue = 
                value.substring(0, selectionStart) +
                '    ' +
                value.substring(selectionEnd);
            
            nextCursorPosition.current = selectionStart + 4;
            setUserCode(newValue);
        }
    };

    const handleEvaluate = async () => {
        if (!challenge || !userCode.trim()) return;
        setIsEvaluating(true);
        setResult(null);
        const evaluationResult = await evaluateCodeSolution(challenge, userCode, language);
        setResult(evaluationResult);
        setIsEvaluating(false);
    };
    
    const createMarkup = (text: string) => {
        const sanitizedHtml = marked.parse(text, { breaks: true, gfm: true });
        return { __html: sanitizedHtml as string };
    };

    const ResultDisplay = () => {
        if (!result) return null;
        const borderColor = result.isCorrect ? 'border-green-accent' : 'border-yellow-500';
        const textColor = result.isCorrect ? 'text-green-400' : 'text-yellow-400';
        
        return (
            <div className={`mt-6 bg-secondary p-4 rounded-lg border-l-4 ${borderColor}`}>
                <h3 className={`text-lg font-bold ${textColor} mb-2`}>
                    {result.isCorrect ? '🎉 Correct! You nailed it! 🎉' : '🤔 Not Quite, But Keep Going!'}
                </h3>
                <div>
                    <h4 className="font-semibold text-text-primary mb-1">Simulated Output:</h4>
                    <pre className="bg-primary p-3 rounded-md text-text-secondary whitespace-pre-wrap font-mono text-sm">{result.simulatedOutput}</pre>
                </div>
                <div className="mt-3">
                    <h4 className="font-semibold text-text-primary mb-1">Pal's Feedback:</h4>
                    <div className="text-text-secondary prose prose-invert prose-p:my-1" dangerouslySetInnerHTML={createMarkup(result.feedback)} />
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-8 flex-1 overflow-y-auto pt-20">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-text-primary flex items-center">
                    <CodeGameIcon className="w-8 h-8 mr-3 text-accent"/>
                    {language} Pursuits: The Code Quest!
                </h2>
                <button onClick={fetchNewChallenge} disabled={isLoadingChallenge || isEvaluating} className="p-2 rounded-full hover:bg-secondary transition-colors disabled:opacity-50">
                    <RefreshIcon className={`w-6 h-6 text-text-secondary ${isLoadingChallenge ? 'animate-spin' : ''}`} />
                    <span className="sr-only">New Challenge</span>
                </button>
            </div>
             <p className="text-text-secondary mb-8">Welcome, adventurer! A wild coding challenge appears. Use your {language} skills to solve it!</p>

            {isLoadingChallenge ? (
                 <div className="bg-secondary p-6 rounded-lg border border-border-color animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
                    <div className="h-20 bg-gray-700 rounded w-full"></div>
                </div>
            ) : challenge ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Challenge Description */}
                    <div className="bg-secondary p-6 rounded-lg border border-border-color">
                        <h3 className="text-2xl font-bold text-accent mb-4">{challenge.title}</h3>
                        <div className="prose prose-invert max-w-none prose-p:text-text-secondary" dangerouslySetInnerHTML={createMarkup(challenge.description)} />
                        <div className="mt-4 pt-4 border-t border-border-color">
                            <p className="font-semibold text-text-primary mb-2">For example:</p>
                            <p className="text-sm text-text-secondary">If the input is:</p>
                            <pre className="bg-primary p-2 rounded-md text-text-secondary font-mono text-sm my-1 whitespace-pre-wrap break-words">{challenge.exampleInput}</pre>
                            <p className="text-sm text-text-secondary">The output should be:</p>
                            <pre className="bg-primary p-2 rounded-md text-text-secondary font-mono text-sm my-1 whitespace-pre-wrap break-words">{challenge.exampleOutput}</pre>
                        </div>
                    </div>

                    {/* Code Editor & Actions */}
                    <div>
                        <div className="bg-secondary rounded-lg border border-border-color focus-within:ring-2 focus-within:ring-accent">
                             <div className="relative h-64 font-mono text-sm bg-primary rounded-t-lg">
                                <textarea
                                    ref={textareaRef}
                                    value={userCode}
                                    onChange={(e) => setUserCode(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onScroll={handleScroll}
                                    placeholder={`Write your ${language} code here...`}
                                    className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white outline-none resize-none z-10"
                                    style={{ whiteSpace: 'pre', overflowWrap: 'normal' }}
                                    spellCheck="false"
                                    disabled={isEvaluating}
                                    aria-label={`${language} code editor`}
                                />
                                <pre ref={preRef} aria-hidden="true" className="absolute inset-0 w-full h-full m-0 p-4 overflow-auto pointer-events-none">
                                    <code 
                                      className={`language-${languageHighlightMap[language]}`}
                                      dangerouslySetInnerHTML={{ __html: highlightedCode }}
                                    />
                                </pre>
                            </div>
                            <div className="p-3 bg-secondary rounded-b-lg border-t border-border-color flex justify-end">
                                <button
                                    onClick={handleEvaluate}
                                    disabled={isEvaluating || isLoadingChallenge}
                                    className="px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center"
                                >
                                {isEvaluating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Evaluating...
                                    </>
                                ) : 'Run Code'}
                                </button>
                            </div>
                        </div>
                        {isEvaluating ? (
                             <div className="mt-6 text-center text-text-secondary">
                                <p>{language} Pal is thinking really hard about your code... 🤔</p>
                            </div>
                        ) : <ResultDisplay />}
                    </div>
                 </div>
            ) : null}
        </div>
    );
};

export default GameView;