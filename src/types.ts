export type ScreenState = 'TITLE' | 'GAME' | 'GAMEOVER' | 'LEADERBOARD';

export interface GameState {
  screen: ScreenState;
  score: number;
  relicsFound: number;
  thirst: number;
  energy: number;
  resonance: number;
}
