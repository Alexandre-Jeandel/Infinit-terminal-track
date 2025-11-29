import React, { useState, useEffect, useRef } from 'react';
import { GameState, Scenario, TrolleyAction, GameHistoryItem } from './types';
import { generateScenario, generatePsychologicalProfile } from './services/geminiService';
import ScenarioCard from './components/ScenarioCard';
import ChoiceButton from './components/ChoiceButton';
import { TrainFront, AlertTriangle, Play, RefreshCw, XCircle } from 'lucide-react';

const INITIAL_STATE: GameState = {
  status: 'intro',
  currentLevel: 1,
  currentScenario: null,
  history: [],
  finalReport: null,
  error: null
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when content changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [gameState.currentScenario, gameState.finalReport, gameState.status]);

  const startGame = async () => {
    setGameState(prev => ({ ...prev, status: 'loading' }));
    const firstScenario = await generateScenario(1, []);
    setGameState(prev => ({
      ...prev,
      status: 'active',
      currentLevel: 1,
      currentScenario: firstScenario,
      history: []
    }));
  };

  const handleChoice = async (choice: 'A' | 'B') => {
    if (!gameState.currentScenario) return;

    // Record history
    const historyItem: GameHistoryItem = {
      scenario: gameState.currentScenario,
      choice
    };
    
    const newHistory = [...gameState.history, historyItem];
    const nextLevel = gameState.currentLevel + 1;

    // Optimistic update to loading
    setGameState(prev => ({ 
      ...prev, 
      status: 'loading',
      history: newHistory
    }));

    // Generate next
    const nextScenario = await generateScenario(nextLevel, newHistory);

    setGameState(prev => ({
      ...prev,
      status: 'active',
      currentLevel: nextLevel,
      currentScenario: nextScenario,
      history: newHistory
    }));
  };

  const handleAbstain = async () => {
    setGameState(prev => ({ ...prev, status: 'generating_report' }));
    const report = await generatePsychologicalProfile(gameState.history);
    setGameState(prev => ({
      ...prev,
      status: 'game_over',
      finalReport: report
    }));
  };

  const resetGame = () => {
    setGameState(INITIAL_STATE);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 selection:bg-red-900 selection:text-white pb-20">
      
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-neutral-800 z-40 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <TrainFront className="text-red-600" size={24} />
          <span className="font-serif font-bold text-lg tracking-wider">TERMINAL TRACK</span>
        </div>
        <div className="font-mono text-xs text-neutral-500">
          LEVEL: <span className="text-red-500">{gameState.currentLevel}</span>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 max-w-4xl">
        
        {/* Intro Screen */}
        {gameState.status === 'intro' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-red-900/10 rounded-full flex items-center justify-center border border-red-900/30 animate-pulse-red">
              <TrainFront size={64} className="text-red-600" />
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-700">
              The Trolley
            </h1>
            <p className="max-w-md text-neutral-400 text-lg leading-relaxed">
              An infinite moral descent. The scenarios will escalate. The choices will become impossible. 
            </p>
            <p className="text-red-500/80 font-mono text-sm border border-red-900/30 px-4 py-2 rounded">
              WARNING: Contains disturbing philosophical themes.
            </p>
            <button
              onClick={startGame}
              className="group flex items-center gap-3 bg-neutral-100 text-black px-8 py-4 rounded font-bold hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              <Play size={20} className="fill-current" />
              INITIATE SIMULATION
            </button>
          </div>
        )}

        {/* Loading State */}
        {(gameState.status === 'loading' || gameState.status === 'generating_report') && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-16 h-16 border-4 border-red-900 border-t-red-500 rounded-full animate-spin"></div>
            <p className="font-mono text-red-500 text-sm animate-pulse">
              {gameState.status === 'generating_report' ? 'JUDGING YOUR SOUL...' : 'GENERATING DILEMMA...'}
            </p>
          </div>
        )}

        {/* Active Game */}
        {gameState.status === 'active' && gameState.currentScenario && (
          <div className="space-y-12 animate-in slide-in-from-bottom-10 fade-in duration-500">
            
            <ScenarioCard scenario={gameState.currentScenario} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <ChoiceButton
                type="A"
                text={gameState.currentScenario.option_a.text}
                consequence={gameState.currentScenario.option_a.consequence}
                onClick={() => handleChoice('A')}
                disabled={false}
              />
              <ChoiceButton
                type="B"
                text={gameState.currentScenario.option_b.text}
                consequence={gameState.currentScenario.option_b.consequence}
                onClick={() => handleChoice('B')}
                disabled={false}
              />
            </div>

            <div className="flex justify-center pt-8">
              <button
                onClick={handleAbstain}
                className="group flex flex-col items-center gap-2 text-neutral-600 hover:text-red-500 transition-colors"
              >
                <div className="p-3 rounded-full border border-neutral-800 group-hover:border-red-900 bg-neutral-900">
                  <XCircle size={24} />
                </div>
                <span className="font-serif text-sm tracking-widest uppercase text-center">
                  I cannot choose<br/>
                  <span className="text-[10px] opacity-50">(End Simulation)</span>
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState.status === 'game_over' && (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-1000">
            <div className="bg-neutral-900 border border-red-900/30 p-8 rounded-xl text-center space-y-6 shadow-[0_0_50px_rgba(220,38,38,0.1)]">
              <AlertTriangle className="mx-auto text-red-600 mb-4" size={48} />
              
              <h2 className="text-3xl font-serif text-white">Simulation Terminated</h2>
              
              <div className="py-6 border-t border-b border-neutral-800">
                <p className="text-neutral-500 text-xs uppercase tracking-widest mb-4">Psychological Profile</p>
                <p className="font-serif text-lg leading-relaxed text-red-100 italic">
                  "{gameState.finalReport}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm font-mono text-neutral-400">
                <div className="bg-black/50 p-4 rounded">
                  <span className="block text-xs text-neutral-600">LEVELS SURVIVED</span>
                  <span className="text-2xl text-white">{gameState.currentLevel}</span>
                </div>
                <div className="bg-black/50 p-4 rounded">
                  <span className="block text-xs text-neutral-600">BURDEN</span>
                  <span className="text-2xl text-white">{gameState.history.length} Choices</span>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 py-4 rounded transition-all mt-8"
              >
                <RefreshCw size={18} />
                RESET MORAL COMPASS
              </button>
            </div>
          </div>
        )}
        
        <div ref={bottomRef} />
      </main>
    </div>
  );
};

export default App;