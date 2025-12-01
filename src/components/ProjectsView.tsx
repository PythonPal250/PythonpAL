import React from 'react';
import { Project, Language } from '../types';
import { LightbulbIcon, RefreshIcon } from './Icons';

interface ProjectsViewProps {
  projects: Project[];
  isLoading: boolean;
  onRefresh: () => void;
  language: Language;
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const difficultyColor = {
        'Beginner': 'bg-green-accent/20 text-green-400',
        'Intermediate': 'bg-yellow-500/20 text-yellow-400',
        'Advanced': 'bg-red-500/20 text-red-400',
    }[project.difficulty];
    
    return (
        <div className="bg-secondary p-6 rounded-lg border border-border-color hover:border-accent transition-all duration-300 flex flex-col h-full">
            <h3 className="text-xl font-bold text-text-primary mb-2">{project.title}</h3>
            <p className="text-text-secondary mb-4 flex-grow">{project.description}</p>
            <div className="mb-4">
                <p className="font-semibold text-sm text-text-primary mb-2">Skills Required:</p>
                <div className="flex flex-wrap gap-2">
                    {project.skills.map(skill => (
                        <span key={skill} className="bg-primary px-2 py-1 text-xs rounded-full text-text-secondary border border-border-color">{skill}</span>
                    ))}
                </div>
            </div>
            <div>
                 <span className={`px-3 py-1 text-sm font-medium rounded-full ${difficultyColor}`}>{project.difficulty}</span>
            </div>
        </div>
    );
};


const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, isLoading, onRefresh, language }) => {
  return (
    <div className="p-8 flex-1 overflow-y-auto pt-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-text-primary flex items-center">
            <LightbulbIcon className="w-8 h-8 mr-3 text-accent"/>
            {language} Project Ideas
          </h2>
          <button onClick={onRefresh} disabled={isLoading} className="p-2 rounded-full hover:bg-secondary transition-colors disabled:opacity-50">
            <RefreshIcon className={`w-6 h-6 text-text-secondary ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-text-secondary mb-8">Here are some project ideas I whipped up for you based on our chat. Let's build something amazing! 🚀</p>
        
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-secondary p-6 rounded-lg border border-border-color animate-pulse">
                        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
                        <div className="flex flex-wrap gap-2">
                            <div className="h-5 bg-gray-700 rounded-full w-16"></div>
                            <div className="h-5 bg-gray-700 rounded-full w-20"></div>
                        </div>
                    </div>
                ))}
            </div>
        ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-secondary rounded-lg">
                <p className="text-text-secondary">No project ideas found. Try chatting with me about your skills and I'll generate some for you!</p>
            </div>
        )}
    </div>
  );
};

export default ProjectsView;
