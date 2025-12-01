import React from 'react';
import { View, Language } from '../types';
import { ChatIcon, LightbulbIcon, BriefcaseIcon, PythonLogoIcon, CodeGameIcon, CodeIcon } from './Icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  language: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, language }) => {
  const NavItem = ({ view, icon, label }: { view: View; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
        activeView === view
          ? 'bg-accent text-white shadow-lg'
          : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
      }`}
      aria-current={activeView === view}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </button>
  );

  const LanguageAwareIcon = language === 'Python' ? PythonLogoIcon : CodeIcon;

  return (
    <aside className="w-64 bg-secondary p-4 border-r border-border-color flex flex-col">
      <div className="flex items-center mb-8 px-2">
        <LanguageAwareIcon className="w-10 h-10 text-accent" />
        <h1 className="text-2xl font-bold ml-2 text-text-primary">{language} Pal</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem view={View.CHAT} icon={<ChatIcon className="w-6 h-6" />} label="Chat" />
        <NavItem view={View.PROJECTS} icon={<LightbulbIcon className="w-6 h-6" />} label="Projects" />
        <NavItem view={View.JOBS} icon={<BriefcaseIcon className="w-6 h-6" />} label="Jobs" />
        <NavItem view={View.IDE} icon={<CodeIcon className="w-6 h-6" />} label="IDE" />
        <NavItem view={View.GAME} icon={<CodeGameIcon className="w-6 h-6" />} label="Code Quest" />
      </nav>
      <div className="mt-auto text-center text-text-secondary text-xs">
        <p>Your friendly coding companion</p>
        <p>&copy; {new Date().getFullYear()}</p>
      </div>
    </aside>
  );
};

export default Sidebar;