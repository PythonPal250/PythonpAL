import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Language } from '../types';
import { runCode, getCodeCompletions, scanForInputRequirements } from '../services/geminiService';
import { CodeIcon, PlayIcon, ClearIcon, RefreshIcon } from './Icons';
import { languageSnippets, languageHighlightMap } from '../constants';

declare const hljs: any;

interface IDEViewProps {
  language: Language;
}

interface TerminalLine {
  type: 'output' | 'input' | 'system' | 'error';
  content: string;
}

const IDEView: React.FC<IDEViewProps> = ({ language }) => {
    const [userCode, setUserCode] = useState(() => languageSnippets[language]);
    
    // Terminal State
    // Removed the "➜ " from the initial system message to avoid double prompts with the static one.
    const [history, setHistory] = useState<TerminalLine[]>([
        { type: 'system', content: `Welcome to the ${language} Playground!\nHit "Run" to execute your code.` }
    ]);
    const [isRunning, setIsRunning] = useState(false);
    const [isWaitingForInput, setIsWaitingForInput] = useState(false);
    const [currentInput, setCurrentInput] = useState('');
    const [promptsQueue, setPromptsQueue] = useState<string[]>([]);
    const [collectedInputs, setCollectedInputs] = useState<string[]>([]);
    
    // Auto-completion State
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [suggestionPosition, setSuggestionPosition] = useState<{ top: number; left: number } | null>(null);
    const suggestionTimeoutRef = useRef<number | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const terminalInputRef = useRef<HTMLInputElement>(null);
    const nextCursorPosition = useRef<number | null>(null);

    useEffect(() => {
        setUserCode(languageSnippets[language]);
        setHistory([{ type: 'system', content: `Welcome to the ${language} Playground!\nHit "Run" to execute your code.` }]);
        setSuggestions([]);
        setIsRunning(false);
        setIsWaitingForInput(false);
    }, [language]);

    useEffect(() => {
        if (textareaRef.current && nextCursorPosition.current !== null) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(nextCursorPosition.current, nextCursorPosition.current);
            nextCursorPosition.current = null;
        }
    }, [userCode]);

    // Auto-scroll terminal
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (isWaitingForInput) {
            terminalInputRef.current?.focus();
        }
    }, [history, isWaitingForInput]);

    // --- Syntax Highlighting & Editor Logic ---
    const highlightedCode = useMemo(() => {
        const lang = languageHighlightMap[language];
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(userCode, { language: lang, ignoreIllegals: true }).value;
        }
        return userCode
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
    }, [userCode, language]);

    const getCursorCoordinates = () => {
        const textarea = textareaRef.current;
        if (!textarea) return null;
        const computed = window.getComputedStyle(textarea);
        const div = document.createElement('div');
        const style = div.style;
        Array.from(computed).forEach(prop => { style[prop as any] = computed.getPropertyValue(prop); });
        style.position = 'absolute'; style.visibility = 'hidden'; style.whiteSpace = 'pre-wrap'; style.overflowWrap = 'normal';
        div.textContent = textarea.value.substring(0, textarea.selectionStart);
        const span = document.createElement('span'); span.textContent = '.'; div.appendChild(span);
        document.body.appendChild(div);
        const { offsetLeft, offsetTop } = span;
        const { top: textareaTop, left: textareaLeft } = textarea.getBoundingClientRect();
        document.body.removeChild(div);
        const lineHeight = parseFloat(computed.lineHeight);
        return { top: textareaTop + offsetTop + lineHeight - textarea.scrollTop, left: textareaLeft + offsetLeft - textarea.scrollLeft };
    };

    const applySuggestion = (suggestion: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const { value, selectionStart } = textarea;
        const textBeforeCursor = value.substring(0, selectionStart);
        const lastWordMatch = textBeforeCursor.match(/(\w+)$/);
        const currentWord = lastWordMatch ? lastWordMatch[1] : '';
        const newValue = value.substring(0, selectionStart - currentWord.length) + suggestion + value.substring(selectionStart);
        const newCursorPosition = selectionStart - currentWord.length + suggestion.length;
        setUserCode(newValue);
        setSuggestions([]);
        nextCursorPosition.current = newCursorPosition;
    };
    
    const handleCodeChange = (newCode: string) => {
        setUserCode(newCode);
        if (suggestionTimeoutRef.current) clearTimeout(suggestionTimeoutRef.current);
        const cursorPosition = textareaRef.current?.selectionStart;
        if (cursorPosition === undefined) return;
        const lastChar = newCode[cursorPosition - 1];
        if (!/^[a-zA-Z0-9.]$/.test(lastChar)) { setSuggestions([]); return; }
        suggestionTimeoutRef.current = window.setTimeout(async () => {
            const fetchedSuggestions = await getCodeCompletions(newCode, language, cursorPosition);
            if (fetchedSuggestions.length > 0) {
                setSuggestions(fetchedSuggestions); setActiveSuggestionIndex(0); setSuggestionPosition(getCursorCoordinates());
            } else { setSuggestions([]); }
        }, 400);
    };

    const handleScroll = () => {
        if (textareaRef.current && preRef.current) {
            preRef.current.scrollTop = textareaRef.current.scrollTop;
            preRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
        setSuggestionPosition(getCursorCoordinates());
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (suggestions.length > 0) {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActiveSuggestionIndex(prev => (prev + 1) % suggestions.length); return; }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActiveSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length); return; }
            if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); applySuggestion(suggestions[activeSuggestionIndex]); return; }
            if (e.key === 'Escape') { e.preventDefault(); setSuggestions([]); return; }
        }
        const textarea = e.currentTarget;
        const { value, selectionStart, selectionEnd } = textarea;
        if (e.key === 'Enter') {
            e.preventDefault();
            const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
            const currentLine = value.substring(lineStart, selectionStart);
            const indentationMatch = currentLine.match(/^\s*/);
            const currentIndentation = indentationMatch ? indentationMatch[0] : '';
            let newIndentation = currentIndentation;
            if (currentLine.trim().endsWith(':') || currentLine.trim().endsWith('{')) { newIndentation += '    '; }
            const newValue = value.substring(0, selectionStart) + '\n' + newIndentation + value.substring(selectionEnd);
            nextCursorPosition.current = selectionStart + 1 + newIndentation.length;
            setUserCode(newValue);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const newValue = value.substring(0, selectionStart) + '    ' + value.substring(selectionEnd);
            nextCursorPosition.current = selectionStart + 4;
            setUserCode(newValue);
        }
    };

    // --- Execution Logic ---
    const handleRun = async () => {
        if (!userCode.trim() || isRunning) return;
        
        setIsRunning(true);
        setHistory(prev => [
            ...prev,
            { type: 'system', content: `➜  Running main.${language === 'Python' ? 'py' : 'txt'}...` }
        ]);

        try {
            // Step 1: Scan for inputs
            const prompts = await scanForInputRequirements(userCode, language);
            
            if (prompts.length > 0) {
                // Interactive Mode
                setPromptsQueue(prompts);
                setCollectedInputs([]);
                setIsWaitingForInput(true);
                // Focus logic handled by useEffect
            } else {
                // Direct Execution
                const output = await runCode(userCode, language, "");
                setHistory(prev => [
                    ...prev, 
                    { type: 'output', content: output }
                ]);
                setIsRunning(false);
            }
        } catch (e) {
            setHistory(prev => [
                ...prev,
                { type: 'error', content: "Error starting execution." }
            ]);
            setIsRunning(false);
        }
    };

    const handleTerminalInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = currentInput;
            const currentPrompt = promptsQueue[0];
            // Use the displayed prompt text for history, defaults to > if empty/undefined.
            const displayPrompt = (currentPrompt !== undefined && currentPrompt !== '') ? currentPrompt : '>';
            
            // Commit input to history
            setHistory(prev => [...prev, { type: 'input', content: `${displayPrompt} ${val}` }]);
            setCurrentInput('');
            
            // Collect input
            const newCollected = [...collectedInputs, val];
            setCollectedInputs(newCollected);
            
            // Advance queue
            const newPrompts = promptsQueue.slice(1);
            setPromptsQueue(newPrompts);
            
            if (newPrompts.length === 0) {
                // All inputs collected, run code
                setIsWaitingForInput(false);
                
                try {
                    const output = await runCode(userCode, language, newCollected.join('\n'));
                    setHistory(prev => [
                        ...prev, 
                        { type: 'output', content: output }
                    ]);
                } catch (err) {
                    setHistory(prev => [
                         ...prev, 
                         { type: 'error', content: "Runtime Error" }
                    ]);
                } finally {
                    setIsRunning(false);
                }
            }
        }
    };

    const handleClear = () => {
        setHistory([{ type: 'system', content: `Welcome to the ${language} Playground!\nHit "Run" to execute your code.` }]);
        setIsRunning(false);
        setIsWaitingForInput(false);
        setPromptsQueue([]);
        setCollectedInputs([]);
    };

    return (
        <div className="flex flex-col h-full bg-primary text-text-primary font-sans overflow-hidden pt-20 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-secondary p-4 rounded-lg border border-border-color shadow-sm">
                <div className="flex items-center mb-4 md:mb-0">
                    <CodeIcon className="w-8 h-8 mr-3 text-accent"/>
                    <div>
                        <h2 className="text-2xl font-bold">Playground IDE</h2>
                        <p className="text-xs text-text-secondary">Write code, choose a language, run, and see output instantly.</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-4">
                    <div className="px-3 py-1 bg-primary rounded border border-border-color text-sm font-mono text-accent">
                        {language}
                    </div>
                    <button
                        onClick={handleClear}
                        className="flex items-center px-3 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors"
                        title="Clear Terminal"
                    >
                        <ClearIcon className="w-4 h-4 mr-2" />
                        Clear
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center px-6 py-2 bg-green-accent text-white font-bold rounded-md hover:bg-green-700 disabled:opacity-50 transition-all shadow-lg"
                    >
                        {isRunning && !isWaitingForInput ? (
                             <RefreshIcon className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <PlayIcon className="w-5 h-5 mr-2" />
                        )}
                        {isRunning ? (isWaitingForInput ? 'Waiting...' : 'Running...') : 'Run'}
                    </button>
                </div>
            </div>

            {/* Main Content - Split Pane */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
                
                {/* Editor Pane */}
                <div className="flex-1 flex flex-col min-h-0 bg-secondary rounded-lg border border-border-color shadow-sm">
                    <div className="px-4 py-2 border-b border-border-color flex justify-between items-center bg-[#1e1e1e] rounded-t-lg">
                        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Code Editor</span>
                        <span className="text-xs text-gray-500">main.{language === 'Python' ? 'py' : language === 'JavaScript' ? 'js' : 'txt'}</span>
                    </div>
                    <div className="relative flex-1 font-mono text-sm bg-[#1e1e1e] rounded-b-lg">
                        <textarea
                            ref={textareaRef}
                            value={userCode}
                            onChange={(e) => handleCodeChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onScroll={handleScroll}
                            onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                            className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white outline-none resize-none z-10 leading-relaxed custom-scrollbar"
                            style={{ whiteSpace: 'pre', overflowWrap: 'normal' }}
                            spellCheck="false"
                            aria-label="Code editor"
                        />
                        <pre ref={preRef} aria-hidden="true" className="absolute inset-0 w-full h-full m-0 p-4 overflow-auto pointer-events-none">
                            <code 
                                className={`language-${languageHighlightMap[language]} leading-relaxed`}
                                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                            />
                        </pre>
                        {suggestions.length > 0 && suggestionPosition && (
                            <div className="absolute z-20 bg-border-color border border-secondary rounded-md shadow-xl" style={{ top: suggestionPosition.top, left: suggestionPosition.left }}>
                                <ul className="py-1 max-h-48 overflow-y-auto">
                                    {suggestions.map((s, index) => (
                                        <li key={s} className={`px-3 py-1 text-sm cursor-pointer ${index === activeSuggestionIndex ? 'bg-accent text-white' : 'text-text-primary'}`} onMouseDown={(e) => { e.preventDefault(); applySuggestion(s); }}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Pane: Interactive Terminal */}
                <div className="lg:w-5/12 flex flex-col min-h-0 bg-black rounded-lg border border-border-color shadow-sm overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Terminal</span>
                        <div className="flex space-x-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                    <div 
                        className="flex-1 bg-[#0d1117] p-4 font-mono text-sm overflow-y-auto text-gray-300 custom-scrollbar"
                        onClick={() => terminalInputRef.current?.focus()}
                    >
                        {history.map((line, idx) => (
                            <div key={idx} className="whitespace-pre-wrap break-all mb-1">
                                {line.type === 'input' ? (
                                    <span className="text-white">{line.content}</span>
                                ) : line.type === 'error' ? (
                                    <span className="text-red-400">{line.content}</span>
                                ) : line.type === 'system' ? (
                                    <span className="text-blue-400 font-bold">{line.content}</span>
                                ) : (
                                    <span>{line.content}</span>
                                )}
                            </div>
                        ))}
                        
                        {isWaitingForInput && (
                            <div className="flex items-center">
                                {/* Use empty string check to ensure > shows if prompt is empty */}
                                <span className="text-white mr-2">{(promptsQueue[0] !== undefined && promptsQueue[0] !== '') ? promptsQueue[0] : '>'}</span>
                                <input
                                    ref={terminalInputRef}
                                    type="text"
                                    value={currentInput}
                                    onChange={(e) => setCurrentInput(e.target.value)}
                                    onKeyDown={handleTerminalInput}
                                    className="flex-1 bg-transparent border-none outline-none text-white"
                                    autoFocus
                                />
                            </div>
                        )}
                        
                        {/* If not running and not waiting, show idle prompt at end */}
                        {!isRunning && !isWaitingForInput && (
                           <div className="text-blue-400 font-bold opacity-50">➜ </div>
                        )}

                        <div ref={terminalEndRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IDEView;