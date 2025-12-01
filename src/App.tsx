import React, { useState, useCallback, useEffect } from 'react';
import { View, Message, Job, Project, Language } from './types';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import ProjectsView from './components/ProjectsView';
import JobsView from './components/JobsView';
import IDEView from './components/IDEView';
import GameView from './components/GameView';
import LanguageSelector from './components/LanguageSelector';
import { getChatResponse, findProjects } from './services/geminiService';
import { getSystemInstruction, getInitialMessage } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.CHAT);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('Python');
  const [messages, setMessages] = useState<Message[]>(() => [getInitialMessage('Python')]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isThinkingMode, setIsThinkingMode] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFetchingExtras, setIsFetchingExtras] = useState(false);
  
  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    setMessages([getInitialMessage(lang)]);
    setJobs([]);
    setProjects([]);
    setActiveView(View.CHAT);
  };

  const handleSendMessage = useCallback(async (prompt: string, image?: { mimeType: string; data: string }) => {
    if (!prompt && !image) return;
    setIsLoading(true);

    const userMessage: Message = {
      role: 'user',
      parts: [{ text: prompt, ...(image && { image: { inlineData: image } }) }],
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const history = [...messages, userMessage];
      const systemInstruction = getSystemInstruction(selectedLanguage);
      const responseText = await getChatResponse(prompt, history, systemInstruction, image, isThinkingMode);
      
      const modelMessage: Message = {
        role: 'model',
        parts: [{ text: responseText }],
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, modelMessage]);

    } catch (error) {
      console.error('Failed to get response from Gemini:', error);
      const errorMessage: Message = {
        role: 'model',
        parts: [{ text: "Oh no! I've tripped over a semicolon. Please try asking again." }],
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isThinkingMode, selectedLanguage]);
  
  const fetchProjects = useCallback(async () => {
    if (projects.length > 0) return;
    setIsFetchingExtras(true);
    try {
        const history = [...messages];
        const systemInstruction = getSystemInstruction(selectedLanguage);
        const fetchedProjects = await findProjects(history, systemInstruction, selectedLanguage);
        setProjects(fetchedProjects);
    } catch (error) {
        console.error('Failed to fetch projects:', error);
    } finally {
        setIsFetchingExtras(false);
    }
  }, [messages, projects.length, selectedLanguage]);

  useEffect(() => {
    if(activeView === View.PROJECTS) {
        fetchProjects();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView]);


  const renderView = () => {
    switch (activeView) {
      case View.PROJECTS:
        return <ProjectsView projects={projects} isLoading={isFetchingExtras} onRefresh={fetchProjects} language={selectedLanguage} />;
      case View.JOBS:
        // JobsView now manages its own state and data fetching via the interactive workflow
        return <JobsView jobs={jobs} isLoading={false} onRefresh={() => {}} language={selectedLanguage} />;
      case View.IDE:
        return <IDEView language={selectedLanguage} />;
      case View.GAME:
        return <GameView language={selectedLanguage} />;
      case View.CHAT:
      default:
        return (
          <ChatView
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            isThinkingMode={isThinkingMode}
            onThinkingModeChange={setIsThinkingMode}
            language={selectedLanguage}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-screen bg-primary text-text-primary font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} language={selectedLanguage} />
      <main className="flex-1 flex flex-col h-screen relative">
        <div className="absolute top-4 right-8 z-20">
            <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange} />
        </div>
        {renderView()}
      </main>
    </div>
  );
};

export default App;