import React from 'react';
import { ArrowBigRight, Skull, Activity } from 'lucide-react';

interface ChoiceButtonProps {
  type: 'A' | 'B';
  text: string;
  consequence: string;
  onClick: () => void;
  disabled: boolean;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ type, text, consequence, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative w-full p-6 text-left transition-all duration-300
        bg-neutral-900 border border-neutral-800 hover:border-red-600/50
        rounded-xl overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:shadow-[0_0_20px_rgba(220,38,38,0.15)]
      `}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-neutral-800 group-hover:bg-red-600 transition-colors duration-300" />
      
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-4">
          <span className="block text-xs font-bold text-neutral-500 mb-1 tracking-widest">
            OPTION {type}
          </span>
          <h3 className="text-xl font-bold text-neutral-200 mb-2 group-hover:text-red-100 transition-colors">
            {text}
          </h3>
          <p className="text-sm text-neutral-500 group-hover:text-neutral-400 font-serif">
            Warning: {consequence}
          </p>
        </div>
        
        <div className="mt-2 text-neutral-700 group-hover:text-red-500 transition-colors duration-300">
          {type === 'A' ? <Activity size={32} /> : <Skull size={32} />}
        </div>
      </div>
    </button>
  );
};

export default ChoiceButton;