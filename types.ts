export interface ScenarioOption {
  text: string;
  consequence: string;
}

export interface Scenario {
  id: string;
  level: number;
  description: string;
  philosophical_context: string;
  moral_challenge: string;
  scientific_explanation: string;
  option_a: ScenarioOption;
  option_b: ScenarioOption;
}

export interface GameHistoryItem {
  scenario: Scenario;
  choice: 'A' | 'B';
}

export interface DecisionBiases {
  prioritizes_loyalty_over_impartiality: number;
  prioritizes_action_over_passivity: number;
  prioritizes_principle_over_outcome: number;
  prioritizes_self_sacrifice_over_self_preservation: number;
}

export interface RegretProfile {
  regret_of_inaction: number;
  regret_of_action: number;
  regret_of_outcome: number;
  regret_of_self_betrayal: number;
}

export interface PsychologicalProfile {
  archetype: string;
  judgment: string;
  core_values: string;
  decision_style: string;
  blind_spots: string;
  growth: string;
  decision_biases: DecisionBiases;
  regret_profile: RegretProfile;
}

export interface GameState {
  status: 'intro' | 'loading' | 'active' | 'game_over' | 'generating_report';
  currentLevel: number;
  currentScenario: Scenario | null;
  history: GameHistoryItem[];
  finalReport: PsychologicalProfile | null;
  error: string | null;
}

export enum TrolleyAction {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  ABSTAIN = 'ABSTAIN'
}