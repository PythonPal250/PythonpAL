import React from 'react';
import { Language } from '../types';

type IconProps = React.SVGProps<SVGSVGElement>;

export const ChatIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);

export const LightbulbIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a7.5 7.5 0 01-7.5 0c1.433-.923 2.553-2.427 3-4.182m3 .171a7.5 7.5 0 011.5-.189m-1.5.189a7.5 7.5 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0" />
  </svg>
);

export const BriefcaseIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.441-2.25 2.613-1.286.172-2.504.172-3.75 0-1.286-.172-2.25-1.3-2.25-2.613v-4.075m10.5 0a2.25 2.25 0 00-2.25-2.25h-3.75a2.25 2.25 0 00-2.25 2.25m10.5 0v-4.075a2.25 2.25 0 00-2.25-2.25h-3.75a2.25 2.25 0 00-2.25 2.25v4.075m-3.75 0v-4.075a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v4.075" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

export const SendIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

export const UploadIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3.375 3.375 0 1112.866 7.3l-7.693 7.693a.75.75 0 01-1.06-1.06l7.693-7.693a4.5 4.5 0 016.364 6.364l-10.94 10.94A3.375 3.375 0 116.366 19.5" />
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.455-2.456L12.75 18l1.178-.398a3.375 3.375 0 002.455-2.456L16.5 14.25l.398 1.178a3.375 3.375 0 002.456 2.456l1.178.398-1.178.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

export const ExternalLinkIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5 0V6.375c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125-1.125h-4.5A1.125 1.125 0 0113.5 10.5z" />
    </svg>
);

export const RefreshIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-11.667 0l3.181-3.183a8.25 8.25 0 00-11.667 0l3.181 3.183" />
    </svg>
);

export const CodeGameIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V5.75A2.25 2.25 0 0018 3.5H6A2.25 2.25 0 003.75 5.75v12.5A2.25 2.25 0 006 20.25z" />
    </svg>
);

export const CodeIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

export const CopyIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.043m-7.416 0v3.043c0 .212.03.418.084.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

export const PlayIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
  </svg>
);

export const WandIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-3.182 3.182l.06.06a3 3 0 004.14 0l3.182-3.182m-3.182-4.14l3.182 3.182a3 3 0 004.14 0l.06-.06a3 3 0 00-3.182-3.182m-4.14 3.182l-3.182-3.182a3 3 0 00-4.14 0l-.06.06a3 3 0 003.182 3.182m4.14-3.182l-4.14-4.14m0 0a3 3 0 10-4.14 4.14m4.14-4.14a3 3 0 104.14 4.14m0-4.14L12 12m0 0l-3.182 3.182m3.182-3.182L15.182 8.818m-3.182 3.182L8.818 15.182" />
  </svg>
);

export const ClearIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const BugIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25L12 12m0 0l-3.75 3.75M12 12L8.25 8.25M12 12l3.75 3.75M12 12V3m0 18v-9m-4.5-4.5H3m18 0h-4.5m-9 9H3m18 0h-4.5" />
    </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </svg>
);

export const BeakerIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.585l-3.45 4.313A11.95 11.95 0 0012 21.75a11.95 11.95 0 006.2-1.732l-3.45-4.313a2.25 2.25 0 01-.5-1.585V3.104m6.338 0c-.09.022-.178.044-.268.065a7.5 7.5 0 01-1.186 1.186c-.16.132-.303.28-.433.433a7.5 7.5 0 01-1.186 1.186c-.022.09-.044.178-.065.268m0 0v5.714m0-5.714a7.5 7.5 0 00-1.186-1.186c-.132-.16-.28-.303-.433-.433a7.5 7.5 0 00-1.186-1.186c-.09-.022-.178-.044-.268-.065m0 0a7.5 7.5 0 01.268-.065" />
    </svg>
);


// Language Specific Icons - EXACT REPRODUCTIONS
export const PythonLogoIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 248 250" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g>
            <path fill="#3776AB" d="M124,25.8V82.8H96.4c-14.5,0-26.2-11.4-26.2-26.2,0-3.7,0.9-7.2,2.6-10.3-2.5-0.6-5.1-1.2-7.6-1.2-20.3,0-36.9,16.6-36.9,36.9v6.9H0.5V118.9h27.6V160.4H0.5v27.4h27.6v6c0,20.3,16.6,36.9,36.9,36.9s36.9-16.6,36.9-36.9V124H94.2V25.8c-0.1-3.7-0.1-7.6-0.2-11.3Z"/>
            <path fill="#FFD43B" d="M124,222.2V165.2h27.6v14.5c0,14.5-11.7,26.2-26.2,26.2-3.7,0-7.2-0.9-10.3-2.6,2.5,0.6,5.1,1.2,7.6,1.2,20.3,0,36.9-16.6,36.9-36.9v-6.9h27.6V143.6H187.7V102.1h27.6V74.7H187.7v-6c0-20.3-16.6-36.9-36.9-36.9s-36.9,16.6-36.9,36.9v64.1h30.2v90.2c0.1,3.7,0.1,7.6,0.2,11.3Z"/>
        </g>
    </svg>
);

const JavaScriptIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <filter id="shadow">
                <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.5" floodColor="#000000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <path d="M14.3,20.4 C11,23.3 12.5,33.5 13.5,38.8 C15.1,47.5 10.4,52.3 12.3,60 C14.3,68.2 24.1,71.5 29.5,74.5 C35.4,77.9 45.4,85.5 50.8,85.2 C57.2,84.9 61.2,76.4 67.5,73.5 C73.5,70.7 84.1,70.3 87.2,63.5 C90.5,56.3 86.2,46.7 84.8,40.5 C83.1,33.1 89.2,25.3 84,20 C78.8,14.7 70.1,16.3 62.2,17.5 C54.3,18.7 48.8,11.8 42.5,12.5 C36.2,13.2 27.5,10.5 21.8,14.5 C18.1,17.1 16.5,18.5 14.3,20.4 Z" fill="#ffffff" />
        <rect x="20" y="20" width="60" height="60" fill="#F7DF1E"/>
        <path d="M43.5 65h-7.2V45h7.2V39.5h-14v31h14V65zm16.4-15.3c-2.1 2.3-5 3.5-8.2 3.5s-6.2-1.2-8.3-3.5c-2-2.3-3.1-5.3-3.1-8.8s1.1-6.5 3.1-8.8c2.1-2.3 5-3.5 8.3-3.5s6.2 1.2 8.2 3.5c2 2.3 3.1 5.3 3.1 8.8s-1.1 6.5-3.1 8.8zm-7.2-6.5c0-1.7-.5-3.1-1.5-4.1s-2.3-1.5-3.8-1.5-2.8.5-3.8 1.5-1.5 2.4-1.5 4.1.5 3.1 1.5 4.1 2.3 1.5 3.8 1.5 2.8-.5 3.8-1.5 1.5-2.4 1.5-4.1z" fill="#000"/>
        <path d="M14.3,20.4 C11,23.3 12.5,33.5 13.5,38.8 C15.1,47.5 10.4,52.3 12.3,60 C14.3,68.2 24.1,71.5 29.5,74.5 C35.4,77.9 45.4,85.5 50.8,85.2 C57.2,84.9 61.2,76.4 67.5,73.5 C73.5,70.7 84.1,70.3 87.2,63.5 C90.5,56.3 86.2,46.7 84.8,40.5 C83.1,33.1 89.2,25.3 84,20 C78.8,14.7 70.1,16.3 62.2,17.5 C54.3,18.7 48.8,11.8 42.5,12.5 C36.2,13.2 27.5,10.5 21.8,14.5 C18.1,17.1 16.5,18.5 14.3,20.4 Z" fill="none" stroke="#e0e0e0" stroke-width="0.5"/>
        <path d="M21.8,14.5 C20,13 18,15 16,17 C14,19 14,21 12,23 C10,25 11,28 10,30 C9,32 10,35 9,37 C8,39 9,42 8,44 C7,46 8,49 7,51 C6,53 7,56 6,58 C5,60 6,63 5,65 C4,67 5,70 4,72 C3,74 4,77 3,79 C2,81 3,84 2,86" fill="none" stroke="#ffffff" stroke-width="1.5" filter="url(#shadow)" stroke-linecap="round"/>
        <path d="M84,20 C86,18 88,20 90,22 C92,24 92,26 94,28 C96,30 95,33 96,35 C97,37 96,40 97,42 C98,44 97,47 98,49 C99,51 98,54 99,56 C100,58 99,61 100,63 C101,65 100,68 101,70 C102,72 101,75 102,77 C103,79 102,82 103,84" fill="none" stroke="#ffffff" stroke-width="1.5" filter="url(#shadow)" stroke-linecap="round"/>
    </svg>
);

const JavaIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="-10 -20 100 135" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fill="#007396" d="M 64.2,42.7 C 61,35.5 51.5,28.8 40,28.8 c -14.4,0 -24.2,8.1 -24.2,19.9 c 0,10.4 7.2,16.2 16.3,18.1 l 12.1,2.5 c 3,0.6 6.3,1.6 6.3,5 c 0,3.9 -3.5,5.6 -7.8,5.6 c -5.1,0 -8.7,-2.4 -9.6,-6.9 l -13.4,2.9 c 1.9,8.5 10.6,12.6 22.1,12.6 c 13.9,0 22.1,-6.9 22.1,-17.8 c 0,-9.2 -5.8,-15.3 -16.2,-17.5 l -11.1,-2.2 c -4.3,-0.9 -5.9,-2.4 -5.9,-4.5 c 0,-2.6 2.5,-4.4 6.3,-4.4 c 4.1,0 6.9,2.1 7.6,5.3 l 12.9,-3.3 z" />
        <path fill="#f8981d" d="M 52.8,0 C 44.2,5.2 34.9,13.7 34.9,26.8 C 34.9,37.2 42,43.4 50.1,43.4 C 58.1,43.4 65.1,37.2 65.1,27.1 C 65.1,19.2 59.9,10.1 52.8,0 z M 50.1,37.4 C 45.8,37.4 42.6,33.5 42.6,27.4 C 42.6,20.8 47.2,14.6 52.6,9.1 C 55.6,16.5 57.8,24.4 57.8,27.7 C 57.8,33.5 54.4,37.4 50.1,37.4 z" />
        <text x="3" y="105" fill="#f8981d" fontFamily="sans-serif" fontSize="30">Java</text>
    </svg>
);

const CIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="c-grad-final" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f74d63" />
        <stop offset="100%" stopColor="#f07e6e" />
      </linearGradient>
      <linearGradient id="c-grad-dot" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f74d63" />
        <stop offset="50%" stopColor="#f5656a" />
        <stop offset="100%" stopColor="#f07e6e" />
      </linearGradient>
    </defs>
    <path d="M68.5,15.2C58.3,15.2,50,23.5,50,33.7v32.6c0,10.2,8.3,18.5,18.5,18.5h6.3c11.4,0,20.7-9.3,20.7-20.7v-2.1 c0-5.7-2.3-11.2-6.5-15.2C84.7,42.5,77,41.9,70.6,41.9h-1.8v-7.4h1.8c6.4,0,14.1-0.6,18.4-5C93.4,24.5,85.2,15.2,74.8,15.2H68.5z" fill="url(#c-grad-final)"/>
    <path d="M54.5,11.8c-12.7,0-23,10.3-23,23v30.4c0,12.7,10.3,23,23,23h6.3c13.9,0,25.2-11.3,25.2-25.2v-2.1 c0-6.9-2.8-13.6-7.9-18.5c-5.4-5.2-14.2-4.5-22.1-4.5h-1.8v-9h1.8c7.8,0,17.1-0.7,22.4-6.1C101,25,91.3,11.8,78.3,11.8H54.5z M68.5,82.8c-9,0-16.3-7.3-16.3-16.3V33.7c0-9,7.3-16.3,16.3-16.3h6.3c9,0,16.3,7.3,16.3,16.3v2.1c0,9-7.3,16.3-16.3,16.3h-6.3V82.8z" fill="none"/>
    <circle cx="83" cy="50" r="12" fill="url(#c-grad-dot)"/>
  </svg>
);

const CPlusPlusIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fill="#004482" d="M256 7.5L504.5 152v208L256 504.5 7.5 360V152L256 7.5z"/>
        <path fill="#00599c" d="M256 7.5V504.5L504.5 360V152L256 7.5z"/>
        <path fill="#fff" d="M346.2 163.4c-47.2-47.2-123.8-47.2-171 0-47.2 47.2-47.2 123.8 0 171 47.2 47.2 123.8 47.2 171 0 47.2-47.2 47.2-123.8 0-171zm-13.8 157.2c-39.6 39.6-103.8 39.6-143.4 0-39.6-39.6-39.6-103.8 0-143.4s103.8-39.6 143.4 0c39.6 39.6 39.6 103.8 0 143.4z"/>
        <path fill="#fff" d="M381.8 238.2h-31.8v-31.8h-26.5v31.8h-31.8v26.5h31.8v31.8h26.5v-31.8h31.8v-26.5zM441.2 238.2h-31.8v-31.8h-26.5v31.8h-31.8v26.5h31.8v31.8h26.5v-31.8h31.8v-26.5z"/>
    </svg>
);

const CSharpIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fill="#6A1577" d="m256 7.5l248.5 144.5v208L256 504.5 7.5 360V152L256 7.5z"/>
        <path fill="#862695" d="m256 7.5v497l248.5-144.5V152L256 7.5z"/>
        <path fill="#fff" d="M375.1 144.9C318 108.5 240.2 114.7 192 163c-38.6 38.6-49.8 94-32.2 140.2-27.4-15.8-44.5-46-44.5-80.3 0-51.5 41.7-93.2 93.2-93.2 28.5 0 54.1 12.8 71.5 33.3 14.1-12.2 33-19.8 54.2-19.8 41.2 0 74.5 33.4 74.5 74.5 0 21-8.5 40-22.3 53.7 18-36.9 20.3-80.4-1.3-119.5z"/>
        <path fill="#fff" d="M370.4 290.5h-56.1v56.1h-44.3V290.5h-56.1v-44.3h56.1v-56.1h44.3v56.1h56.1v44.3zm-88.5-146.6h-56.1v56.1h-44.3v-56.1h-56.1v-44.3h56.1V43.5h44.3v56.1h56.1v44.3z"/>
    </svg>
);

const GoIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 220 80" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fill="#00ADD8" d="M39.8 80C17.8 80 0 62.2 0 40S17.8 0 39.8 0h17.9c9 0 17.7 3.1 24.5 8.7L69 22.1c-4-3.1-9.1-4.9-14.5-4.9h-14C28.2 17.2 19 27.4 19 39.8s9.2 22.6 21.6 22.6h14c5.4 0 10.5-1.8 14.5-4.9l13.2 13.4C75.4 76.9 66.8 80 57.7 80H39.8z"/>
        <path fill="#00ADD8" d="M140 40c0 22.1-17.9 40-40 40s-40-17.9-40-40 17.9-40 40-40 40 17.9 40 40zm-21.5 0c0-10.2-8.3-18.5-18.5-18.5S81.5 29.8 81.5 40 89.8 58.5 100 58.5s18.5-8.3 18.5-18.5z"/>
        <path fill="#00ADD8" d="M210 40c0 22.1-17.9 40-40 40s-40-17.9-40-40 17.9-40 40-40 40 17.9 40 40zm-21.5 0c0-10.2-8.3-18.5-18.5-18.5s-18.5 8.3-18.5 18.5 8.3 18.5 18.5 18.5 18.5-8.3 18.5-18.5z"/>
    </svg>
);

const SwiftIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="48" fill="none" stroke="#007AFF" strokeWidth="4"/>
      <path d="M 2,50 H 98 M 15,15 L 85,85 M 15,85 L 85,15" fill="none" stroke="#007AFF" strokeWidth="2" strokeOpacity="0.5"/>
      <text x="50" y="58" fontSize="24" textAnchor="middle" fill="#007AFF" fontFamily="sans-serif" fontWeight="bold">SWIFT</text>
    </svg>
);

const KotlinIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="kotlin-grad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E44857"/>
                <stop offset="100%" stopColor="#C965E4"/>
            </linearGradient>
            <linearGradient id="kotlin-grad2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F48024"/>
                <stop offset="100%" stopColor="#E44857"/>
            </linearGradient>
            <linearGradient id="kotlin-grad3" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#5270E4"/>
                <stop offset="100%" stopColor="#C965E4"/>
            </linearGradient>
        </defs>
        <polygon points="0,100 0,0 50,0 100,50 50,100" fill="url(#kotlin-grad3)"/>
        <polygon points="50,0 100,0 100,50" fill="url(#kotlin-grad2)"/>
        <polygon points="0,100 50,100 100,50" fill="url(#kotlin-grad1)"/>
    </svg>
);

const RustIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="white">
        <path d="M 50 12 A 38 38 0 0 0 12 50 A 38 38 0 0 0 50 88 A 38 38 0 0 0 88 50 A 38 38 0 0 0 50 12 Z M 50 15 A 35 35 0 0 1 85 50 A 35 35 0 0 1 50 85 A 35 35 0 0 1 15 50 A 35 35 0 0 1 50 15 Z" />
        <path d="M 45,35 H 65 L 58,50 H 72 L 50,80 L 42,60 H 30 Z" />
        <path d="M 20 48.5 a 2.5 2.5 0 0 0 0 5 h 22 v -5 z m 38 0 v 5 h 22 a 2.5 2.5 0 0 0 0 -5 z" />
        <path d="M 48.5 20 a 2.5 2.5 0 0 0 -5 0 v 22 h 5 z m 5 38 h -5 v 22 a 2.5 2.5 0 0 0 5 0 z" />
      </g>
    </svg>
);

const PHPIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg" {...props}>
        <ellipse cx="80" cy="40" rx="78" ry="38" fill="#777BB4"/>
        <text x="35" y="58" fontFamily="Verdana, sans-serif" fontSize="45" fontWeight="bold" fill="white">php</text>
    </svg>
);

const RubyIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g>
        <path d="M50 5 L95 40 L50 95 L5 40 Z" fill="#D91404"/>
        <path d="M50 5 L5 40 L50 48 Z" fill="#B30000"/>
        <path d="M50 5 L95 40 L50 48 Z" fill="#F27777"/>
        <path d="M5 40 L50 95 L50 48 Z" fill="#B30000"/>
        <path d="M95 40 L50 95 L50 48 Z" fill="#8C0000"/>
        <path d="M50 11.5 L88 40 L50 44 Z" fill="white" opacity="0.3"/>
      </g>
    </svg>
);

const TypeScriptIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="90" height="90" x="5" y="5" rx="10" fill="#3178C6"/>
        <path fill="white" d="M30 68V26h13v36h13v6H30zm32-35h-1V26h14v5h-9v11h8v5h-8v11h9v5H62z"/>
    </svg>
);

const SQLIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <ellipse cx="60" cy="25" rx="45" ry="20" fill="#86B4D6"/>
        <path d="M 15,25 V 75 C 15,95 105,95 105,75 V 25" fill="#86B4D6"/>
        <ellipse cx="60" cy="25" rx="45" ry="20" fill="#BBD9EC"/>
        <circle cx="25" cy="25" r="3" fill="#6E9FBF"/>
        <circle cx="25" cy="50" r="3" fill="#6E9FBF"/>
        <circle cx="25" cy="75" r="3" fill="#6E9FBF"/>
        <text x="150" y="65" fontFamily="sans-serif" fontSize="40" fontWeight="bold" fill="#003B57" textAnchor="middle">SQL</text>
    </svg>
);

const RIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fill="white" d="M40.8,81.4H22.1V18.6h32c12.3,0,21,3.2,28.1,9.7c7.1,6.5,10.7,15.2,10.7,26.1c0,10-3.3,18.4-9.8,25.1 c-6.5,6.7-14.8,10-24.8,10H40.8z M40.8,66.4H47c6.1,0,10.9-1.5,14.4-4.6c3.5-3.1,5.3-7.4,5.3-12.9c0-5.4-1.8-9.8-5.3-13.1 c-3.5-3.3-8.3-4.9-14.4-4.9h-6.1V66.4z"/>
    </svg>
);

const PowerShellIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M 5,15 L 15,5 H 95 L 85,15 V 85 L 95,95 H 15 L 5,85 Z" fill="#203456"/>
      <path d="M 25,75 V 25 L 60,50 Z" fill="white"/>
      <path d="M 40,75 H 75 V 60 H 40 Z" fill="white"/>
    </svg>
);

export const LanguageIconMap: Record<Language, React.FC<IconProps>> = {
    'Python': PythonLogoIcon,
    'JavaScript': JavaScriptIcon,
    'Java': JavaIcon,
    'C': CIcon,
    'C++': CPlusPlusIcon,
    'C#': CSharpIcon,
    'Go': GoIcon,
    'Swift': SwiftIcon,
    'Kotlin': KotlinIcon,
    'Rust': RustIcon,
    'PHP': PHPIcon,
    'Ruby': RubyIcon,
    'TypeScript': TypeScriptIcon,
    'SQL': SQLIcon,
    'R': RIcon,
    'PowerShell': PowerShellIcon
};