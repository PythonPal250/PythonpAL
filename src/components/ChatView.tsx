import React, { useRef, useEffect } from 'react';
import { Message, Language } from '../types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { PythonLogoIcon, CodeIcon } from './Icons';

interface ChatViewProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (prompt: string, image?: { mimeType: string; data: string }) => void;
  isThinkingMode: boolean;
  onThinkingModeChange: (enabled: boolean) => void;
  language: Language;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, isLoading, onSendMessage, isThinkingMode, onThinkingModeChange, language }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const LanguageAwareIcon = language === 'Python' ? PythonLogoIcon : CodeIcon;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const getWatermarkFontSize = (lang: Language): string => {
    const length = lang.length;
    if (length >= 10) { // For "JavaScript", "TypeScript", "PowerShell"
      return 'text-[8rem] md:text-[11rem] lg:text-[14rem]';
    }
    if (length >= 6) { // For "Python", "Kotlin"
      return 'text-[10rem] md:text-[14rem] lg:text-[18rem]';
    }
    // For short names like "C", "R", "Go", "Java"
    return 'text-[12rem] md:text-[16rem] lg:text-[20rem]';
  };

  const watermarkClass = getWatermarkFontSize(language);

  return (
    <div className="relative flex flex-col h-full bg-primary overflow-hidden">
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className={`${watermarkClass} font-black text-secondary opacity-40 -rotate-12 select-none`}>
            {language}
          </span>
        </div>
      <div className="relative z-10 flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pt-20">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} language={language} />
        ))}
        {isLoading && (
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <LanguageAwareIcon className="w-6 h-6 text-accent" />
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-secondary">
               <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="relative z-10 p-4 md:p-6 bg-primary border-t border-border-color">
        <ChatInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          isThinkingMode={isThinkingMode}
          onThinkingModeChange={onThinkingModeChange}
          language={language}
        />
      </div>
    </div>
  );
};

export default ChatView;