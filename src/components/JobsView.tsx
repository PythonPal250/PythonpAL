import React, { useState, useEffect } from 'react';
import { Job, Language } from '../types';
import { BriefcaseIcon, ExternalLinkIcon } from './Icons';
import { getJobSearchLinks } from '../services/geminiService';

interface JobsViewProps {
  jobs: Job[]; 
  isLoading: boolean;
  onRefresh: () => void;
  language: Language;
}

const JobsView: React.FC<JobsViewProps> = ({ language }) => {
  const [searchLinks, setSearchLinks] = useState<Record<string, {name: string, url: string}[]>>({});

  useEffect(() => {
      setSearchLinks(getJobSearchLinks(language));
  }, [language]);

  return (
    <div className="p-8 flex-1 overflow-y-auto pt-20">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-text-primary flex items-center">
                <BriefcaseIcon className="w-8 h-8 mr-3 text-accent"/>
                JobFinder - {language} Edition
            </h2>
        </div>

        <div className="bg-secondary p-6 rounded-lg border border-border-color">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-text-primary mb-2">Find Your Next Role</h3>
                <p className="text-text-secondary">Here are the best job boards to find fresh {language} opportunities. Click the links below to start browsing!</p>
            </div>
            
            <div className="space-y-8">
                {Object.entries(searchLinks).map(([category, links]) => (
                    <div key={category}>
                        <h4 className="text-lg font-semibold text-accent mb-4 border-b border-border-color pb-2">{category}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(links as {name: string, url: string}[]).map((link) => (
                                <a 
                                    key={link.name} 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-primary rounded-lg border border-border-color hover:border-accent hover:bg-gray-900 transition-all group shadow-sm hover:shadow-md"
                                >
                                    <span className="font-semibold text-text-primary group-hover:text-accent truncate">{link.name}</span>
                                    <ExternalLinkIcon className="w-4 h-4 text-text-secondary group-hover:text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 flex-shrink-0 ml-2" />
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="mt-8 p-6 bg-secondary/50 rounded-lg border border-border-color/50 text-center">
             <p className="text-text-secondary italic">"Choose a job you love, and you will never have to work a day in your life."</p>
        </div>
    </div>
  );
};

export default JobsView;