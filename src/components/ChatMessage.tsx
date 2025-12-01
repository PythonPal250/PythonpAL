import React, { useEffect, useRef } from 'react';
import { marked } from 'marked';
import { Message, Language } from '../types';
import { PythonLogoIcon, UserIcon, CodeIcon } from './Icons';

declare const hljs: any;

interface ChatMessageProps {
  message: Message;
  language: Language;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, language }) => {
  const isModel = message.role === 'model';
  const messageRef = useRef<HTMLDivElement>(null);

  const createMarkup = (text: string) => {
    // Basic sanitation
    const sanitizedHtml = marked.parse(text, { breaks: true, gfm: true });
    return { __html: sanitizedHtml as string };
  };

  useEffect(() => {
    if (messageRef.current) {
      const preBlocks = messageRef.current.querySelectorAll('pre');
      preBlocks.forEach((pre) => {
        // Apply syntax highlighting
        const codeBlock = pre.querySelector('code');
        if (codeBlock) {
          hljs.highlightElement(codeBlock as HTMLElement);
        }

        // Add copy button if it doesn't exist
        if (pre.querySelector('.copy-button')) {
          return;
        }

        pre.style.position = 'relative';

        const button = document.createElement('button');
        button.className = 'copy-button absolute top-2 right-2 p-1.5 bg-secondary text-text-secondary hover:text-text-primary hover:bg-primary rounded-md transition-colors z-10';
        button.setAttribute('aria-label', 'Copy code');
        
        const copyIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.043m-7.416 0v3.043c0 .212.03.418.084.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"></path></svg>`;
        const checkIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-green-accent"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>`;

        button.innerHTML = copyIconSVG;

        button.onclick = () => {
          const code = pre.querySelector('code')?.innerText ?? '';
          navigator.clipboard.writeText(code).then(() => {
            button.innerHTML = checkIconSVG;
            setTimeout(() => {
              button.innerHTML = copyIconSVG;
            }, 2000);
          });
        };

        pre.appendChild(button);
      });
    }
  }, [message]);
  
  const ModelIcon = language === 'Python' ? PythonLogoIcon : CodeIcon;

  return (
    <div ref={messageRef} className={`flex items-start gap-4 ${isModel ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isModel ? 'bg-secondary' : 'bg-accent'}`}>
        {isModel ? <ModelIcon className="w-6 h-6 text-accent" /> : <UserIcon className="w-6 h-6 text-white" />}
      </div>
      <div className={`max-w-xl xl:max-w-2xl p-4 rounded-xl shadow-md break-words ${isModel ? 'bg-secondary rounded-tl-none' : 'bg-accent text-white rounded-tr-none'}`}>
        {message.parts.map((part, index) => (
          <div key={index}>
            {part.image && part.image.inlineData && (
              <img
                src={`data:${part.image.inlineData.mimeType};base64,${part.image.inlineData.data}`}
                alt="Uploaded content"
                className="max-w-xs rounded-lg mb-2"
              />
            )}
            {part.text && (
              <div className="prose prose-invert prose-p:my-2 prose-headings:my-3 prose-pre:bg-primary prose-pre:p-3 prose-pre:rounded-md" dangerouslySetInnerHTML={createMarkup(part.text)} />
            )}
          </div>
        ))}
        <div className={`text-xs mt-2 ${isModel ? 'text-text-secondary' : 'text-gray-200'}`}>{message.timestamp}</div>
      </div>
    </div>
  );
};

export default ChatMessage;