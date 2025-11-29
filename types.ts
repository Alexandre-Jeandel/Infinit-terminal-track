export interface ScenarioOption {
  text: string;
  consequence: string;
}

export interface Scenario {
  id: string;
  level: number;
  description: string;
  philosophical_context: string;
  option_a: ScenarioOption;
  option_b: ScenarioOption;
}

export interface GameHistoryItem {
  scenario: Scenario;
  choice: 'A' | 'B';
}

export interface GameState {
  status: 'intro' | 'loading' | 'active' | 'game_over' | 'generating_report';
  currentLevel: number;
  currentScenario: Scenario | null;
  history: GameHistoryItem[];
  finalReport: string | null;
  error: string | null;
}

export enum TrolleyAction {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  ABSTAIN = 'ABSTAIN'
}