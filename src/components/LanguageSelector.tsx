import React, { useState, useRef, useEffect } from 'react';
import { Language, supportedLanguages } from '../types';
import { ChevronDownIcon } from './Icons';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={wrapperRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-border-color shadow-sm px-4 py-2 bg-secondary text-sm font-medium text-text-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-accent"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {selectedLanguage}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-secondary ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto z-50">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {supportedLanguages.map((language) => (
              <a
                href="#"
                key={language}
                className={`block px-4 py-2 text-sm ${selectedLanguage === language ? 'bg-accent text-white' : 'text-text-secondary hover:bg-primary hover:text-text-primary'}`}
                role="menuitem"
                onClick={(e) => {
                    e.preventDefault();
                    handleSelect(language);
                }}
              >
                {language}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
