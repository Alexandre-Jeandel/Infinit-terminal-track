import React, { useState } from 'react';
import { GameHistoryItem, Scenario } from '../types';
import { FIXED_SCENARIOS } from '../services/geminiService';
import { ChevronDown, ChevronUp, BookOpen, UserCircle, Microscope, Lock } from 'lucide-react';

interface DilemmaBreakdownProps {
  history: GameHistoryItem[];
}

const DilemmaItem = ({ 
  level, 
  data, 
  historyItem 
}: { 
  level: number, 
  data: Omit<Scenario, 'id' | 'level'>, 
  historyItem?: GameHistoryItem 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const choiceText = historyItem ? (historyItem.choice === 'A' ? data.option_a.text : data.option_b.text) : null;
  const consequenceText = historyItem ? (historyItem.choice === 'A' ? data.option_a.consequence : data.option_b.consequence) : null;

  return (
    <div className={`border rounded-lg overflow-hidden transition-all duration-300 mb-4 ${historyItem ? 'border-neutral-700 bg-black/40' : 'border-neutral-800 bg-black/10 opacity-70'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-6 text-left group transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-4">
          <span className={`font-mono text-xs w-8 h-8 flex items-center justify-center rounded-full border ${historyItem ? 'bg-red-900/20 text-red-400 border-red-900/50' : 'bg-neutral-900 text-neutral-600 border-neutral-800'}`}>
            {level}
          </span>
          <div>
            <h4 className={`font-serif text-lg transition-colors ${historyItem ? 'text-neutral-100 group-hover:text-red-400' : 'text-neutral-500'}`}>
              {data.philosophical_context}
            </h4>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
                {historyItem ? (
                   <>Choice: <span className="text-red-500/80">{choiceText}</span></>
                ) : (
                  <span className="flex items-center gap-1 text-neutral-700"><Lock size={10} /> Not Encountered</span>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="text-neutral-600 group-hover:text-neutral-300">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 md:p-8 pt-0 border-t border-neutral-800 animate-in slide-in-from-top-2 duration-300 bg-neutral-900/40">
          <div className="space-y-6">
            {historyItem && (
              <div className="flex gap-4">
                 <div className="mt-1 text-red-600">
                   <UserCircle size={18} />
                 </div>
                 <div>
                   <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1 font-mono">Your Decision</p>
                   <p className="text-neutral-300 text-sm leading-relaxed italic border-l-2 border-red-900/50 pl-4">
                      "{consequenceText}"
                   </p>
                 </div>
              </div>
            )}

            <div className="flex gap-4">
               <div className="mt-1 text-red-600">
                 <BookOpen size={18} />
               </div>
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1 font-mono">The Moral Challenge</p>
                 <p className="text-neutral-200 text-sm font-serif leading-relaxed">
                    {data.moral_challenge}
                 </p>
               </div>
            </div>

            <div className="flex gap-4">
               <div className="mt-1 text-red-600">
                 <Microscope size={18} />
               </div>
               <div>
                 <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1 font-mono">Scientific Insight</p>
                 <p className="text-neutral-400 text-sm leading-relaxed">
                    {data.scientific_explanation}
                 </p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DilemmaBreakdown: React.FC<DilemmaBreakdownProps> = ({ history }) => {
  // Convert history array to a map for O(1) lookup by level
  const historyMap = history.reduce((acc, item) => {
    acc[item.scenario.level] = item;
    return acc;
  }, {} as Record<number, GameHistoryItem>);

  // Render all 22 scenarios
  const levels = Array.from({ length: 22 }, (_, i) => i + 1);

  return (
    <div className="space-y-2 animate-in fade-in duration-500 pb-12">
      <div className="mb-8 text-center">
        <h3 className="text-xl font-serif text-neutral-400 uppercase tracking-[0.2em] mb-2">The Archive of Choices</h3>
        <p className="text-xs text-neutral-600 font-mono italic max-w-lg mx-auto">
          Every level in the simulation, deconstructed through the lens of moral philosophy and evolutionary psychology.
        </p>
      </div>
      
      <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar space-y-4">
        {levels.map((level) => (
          <DilemmaItem 
            key={level} 
            level={level} 
            data={FIXED_SCENARIOS[level]} 
            historyItem={historyMap[level]} 
          />
        ))}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ef4444;
        }
      `}</style>
    </div>
  );
};

export default DilemmaBreakdown;