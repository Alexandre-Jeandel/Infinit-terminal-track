import React from 'react';
import { Scenario } from '../types';
import { Quote } from 'lucide-react';

interface ScenarioCardProps {
  scenario: Scenario;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8 animate-fade-in">
      <div className="bg-neutral-900/80 border border-neutral-700 p-8 rounded-lg shadow-2xl relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Quote size={64} className="text-red-500 transform rotate-12" />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <span className="bg-red-900/30 text-red-400 text-xs font-bold px-3 py-1 rounded tracking-widest uppercase border border-red-900/50">
              Scenario #{scenario.level}
            </span>
            <span className="text-neutral-500 text-xs tracking-widest uppercase font-mono">
              Terminal ID: {scenario.id.split('-')[0]}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl text-neutral-100 font-serif leading-relaxed mb-6">
            {scenario.description}
          </h2>

          <div className="border-l-2 border-red-800/50 pl-4 py-2 mt-8">
            <p className="text-neutral-400 text-sm italic font-serif">
              "{scenario.philosophical_context}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;