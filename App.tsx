import React, { useState, useEffect, useRef } from 'react';
import { GameState, Scenario, TrolleyAction, GameHistoryItem, PsychologicalProfile } from './types';
import { generateScenario, generatePsychologicalProfile, ENABLE_AI_ANALYSIS } from './services/geminiService';
import ScenarioCard from './components/ScenarioCard';
import ChoiceButton from './components/ChoiceButton';
import PsychProfileVisuals from './components/PsychProfileVisuals';
import DilemmaBreakdown from './components/DilemmaBreakdown';
import { TrainFront, AlertTriangle, Play, RefreshCw, XCircle, Brain, Eye, HeartCrack, Scale, LayoutGrid, List } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'dilemmas'>('profile');

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

    const historyItem: GameHistoryItem = {
      scenario: gameState.currentScenario,
      choice
    };
    
    const newHistory = [...gameState.history, historyItem];
    const nextLevel = gameState.currentLevel + 1;

    setGameState(prev => ({ 
      ...prev, 
      status: 'loading',
      history: newHistory
    }));

    if (nextLevel > 22) {
      let report: PsychologicalProfile | null = null;
      if (ENABLE_AI_ANALYSIS) {
        setGameState(prev => ({ ...prev, status: 'generating_report' }));
        report = await generatePsychologicalProfile(newHistory);
      }
      setGameState(prev => ({
        ...prev,
        status: 'game_over',
        finalReport: report || ({} as PsychologicalProfile),
        currentLevel: 22
      }));
      return;
    }

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
    let report: PsychologicalProfile | null = null;
    if (ENABLE_AI_ANALYSIS) {
      setGameState(prev => ({ ...prev, status: 'generating_report' }));
      report = await generatePsychologicalProfile(gameState.history);
    }
    setGameState(prev => ({
      ...prev,
      status: 'game_over',
      finalReport: report || ({} as PsychologicalProfile)
    }));
  };

  const resetGame = () => {
    setGameState(INITIAL_STATE);
    setActiveTab('profile');
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 selection:bg-red-900 selection:text-white pb-20">
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

        {(gameState.status === 'loading' || gameState.status === 'generating_report') && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-16 h-16 border-4 border-red-900 border-t-red-500 rounded-full animate-spin"></div>
            <p className="font-mono text-red-500 text-sm animate-pulse">
              {gameState.status === 'generating_report' ? 'JUDGING YOUR SOUL...' : 'GENERATING DILEMMA...'}
            </p>
          </div>
        )}

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

        {gameState.status === 'game_over' && gameState.finalReport && (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-1000 space-y-8">
            {/* Tab Navigation */}
            <div className="flex justify-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg transition-all font-serif tracking-widest uppercase text-xs ${activeTab === 'profile' ? 'bg-red-900/20 text-red-400 border border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                <LayoutGrid size={16} />
                Psychological Profile
              </button>
              <button
                onClick={() => setActiveTab('dilemmas')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg transition-all font-serif tracking-widest uppercase text-xs ${activeTab === 'dilemmas' ? 'bg-red-900/20 text-red-400 border border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                <List size={16} />
                Dilemmas Explained
              </button>
            </div>

            {activeTab === 'profile' ? (
              !ENABLE_AI_ANALYSIS ? (
                <div className="bg-neutral-900 border border-neutral-800 p-20 rounded-xl text-center shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center justify-center">
                   <Brain size={48} className="text-neutral-800 mb-6 opacity-30" />
                   <h2 className="text-2xl font-serif text-neutral-600 tracking-[0.2em] uppercase">Not available</h2>
                   <p className="text-neutral-700 font-mono text-[10px] mt-4 uppercase tracking-widest">Advanced Psychological Assessment Disabled</p>
                   <div className="mt-10">
                    <button
                      onClick={resetGame}
                      className="px-12 flex items-center justify-center gap-2 bg-neutral-800 text-neutral-400 hover:bg-red-600 hover:text-white py-4 rounded font-bold transition-all mx-auto"
                    >
                      <RefreshCw size={18} />
                      RESET MORAL COMPASS
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-900 border border-red-900/30 p-8 md:p-12 rounded-xl text-center space-y-8 shadow-[0_0_50px_rgba(220,38,38,0.15)] relative overflow-hidden animate-in zoom-in-95 duration-500">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-red-900 to-transparent opacity-50"></div>
                  <div className="space-y-2">
                    <AlertTriangle className="mx-auto text-red-600 mb-6 animate-pulse-red" size={48} />
                    <h2 className="text-4xl font-serif text-white tracking-tight">ANALYSIS COMPLETE</h2>
                    <div className="inline-block px-4 py-1 border border-red-900/50 rounded-full bg-red-900/10">
                       <p className="text-red-400 font-mono text-sm tracking-widest uppercase">{gameState.finalReport.archetype}</p>
                    </div>
                  </div>
                  
                  <div className="py-8 border-t border-b border-neutral-800/80">
                    <p className="font-serif text-xl md:text-2xl leading-relaxed text-red-100 italic max-w-3xl mx-auto">
                      "{gameState.finalReport.judgment}"
                    </p>
                  </div>

                  <PsychProfileVisuals 
                    biases={gameState.finalReport.decision_biases}
                    regrets={gameState.finalReport.regret_profile}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="bg-black/40 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <div className="flex items-center gap-3 mb-3 text-red-500">
                        <Brain size={20} />
                        <h3 className="font-serif text-lg text-white">Core Values</h3>
                      </div>
                      <p className="text-neutral-400 text-sm leading-relaxed">{gameState.finalReport.core_values}</p>
                    </div>
                    <div className="bg-black/40 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <div className="flex items-center gap-3 mb-3 text-red-500">
                        <Scale size={20} />
                        <h3 className="font-serif text-lg text-white">Decision Style</h3>
                      </div>
                      <p className="text-neutral-400 text-sm leading-relaxed">{gameState.finalReport.decision_style}</p>
                    </div>
                    <div className="bg-black/40 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <div className="flex items-center gap-3 mb-3 text-red-500">
                        <HeartCrack size={20} />
                        <h3 className="font-serif text-lg text-white">Blind Spots</h3>
                      </div>
                      <p className="text-neutral-400 text-sm leading-relaxed">{gameState.finalReport.blind_spots}</p>
                    </div>
                    <div className="bg-black/40 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors">
                      <div className="flex items-center gap-3 mb-3 text-red-500">
                        <Eye size={20} />
                        <h3 className="font-serif text-lg text-white">Growth</h3>
                      </div>
                      <p className="text-neutral-400 text-sm leading-relaxed">{gameState.finalReport.growth}</p>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={resetGame}
                      className="w-full md:w-auto px-12 flex items-center justify-center gap-2 bg-neutral-100 text-black hover:bg-red-600 hover:text-white py-4 rounded font-bold transition-all mx-auto"
                    >
                      <RefreshCw size={18} />
                      RESET MORAL COMPASS
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="animate-in slide-in-from-bottom-5 duration-500">
                 <DilemmaBreakdown history={gameState.history} />
                 <div className="mt-12 text-center">
                    <button
                      onClick={resetGame}
                      className="w-full md:w-auto px-12 flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-red-900 hover:text-white py-4 rounded font-bold transition-all mx-auto"
                    >
                      <RefreshCw size={18} />
                      RESET MORAL COMPASS
                    </button>
                 </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;