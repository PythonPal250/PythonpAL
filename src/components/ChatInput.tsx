import React, { useState, useRef } from 'react';
import { UploadIcon, SendIcon, SparklesIcon } from './Icons';
import { Language } from '../types';

interface ChatInputProps {
  onSendMessage: (prompt: string, image?: { mimeType: string; data: string }) => void;
  isLoading: boolean;
  isThinkingMode: boolean;
  onThinkingModeChange: (enabled: boolean) => void;
  language: Language;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, isThinkingMode, onThinkingModeChange, language }) => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<{ file: File; preview: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        resolve({ mimeType: file.type, data: base64Data });
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || (!prompt.trim() && !imageFile)) return;

    let imagePayload;
    if (imageFile) {
      imagePayload = await fileToBase64(imageFile.file);
    }
    
    onSendMessage(prompt, imagePayload);
    setPrompt('');
    setImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {imageFile && (
        <div className="relative w-24 h-24">
          <img src={imageFile.preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
          <button
            type="button"
            onClick={() => setImageFile(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold"
            aria-label="Remove image"
          >
            &times;
          </button>
        </div>
      )}
      <div className="flex items-center p-1 pr-2 bg-secondary rounded-lg border border-border-color focus-within:ring-2 focus-within:ring-accent">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask me anything about ${language}...`}
          className="flex-1 bg-transparent resize-none outline-none px-4 text-text-primary placeholder-text-secondary"
          rows={1}
          disabled={isLoading}
          aria-label={`Chat input for ${language}`}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-text-secondary hover:text-accent disabled:opacity-50"
          disabled={isLoading}
          aria-label="Upload image"
        >
          <UploadIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          className="p-2 bg-accent text-white rounded-full hover:bg-blue-500 disabled:bg-gray-500"
          disabled={isLoading || (!prompt.trim() && !imageFile)}
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center justify-end space-x-4">
        <label htmlFor="thinking-mode-toggle" className="flex items-center cursor-pointer">
          <SparklesIcon className={`w-5 h-5 transition-colors ${isThinkingMode ? 'text-purple-accent' : 'text-text-secondary'}`} />
          <span className={`ml-2 text-sm font-medium ${isThinkingMode ? 'text-text-primary' : 'text-text-secondary'}`}>
            Thinking Mode
          </span>
          <div className="relative ml-3">
            <input
              type="checkbox"
              id="thinking-mode-toggle"
              className="sr-only"
              checked={isThinkingMode}
              onChange={(e) => onThinkingModeChange(e.target.checked)}
            />
            <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isThinkingMode ? 'transform translate-x-full bg-purple-accent' : ''}`}></div>
          </div>
        </label>
      </div>
    </form>
  );
};

export default ChatInput;