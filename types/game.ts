export type PlayerCount = 3 | 4;

export type HoleCount = 9 | 18;

export interface Player {
  id: string;
  name: string;
  handicap?: number; // Optional handicap (range -54 to 54)
  scores: number[];
  points: number[];
  totalPoints: number;
}

export interface Game {
  id: string;
  playerCount: PlayerCount;
  holeCount: HoleCount;
  pars: number[]; // Par value for each hole (typically 3, 4, or 5)
  players: Player[];
  currentHole: number;
  isComplete: boolean;
  createdAt: number;
}

export type GameState = 
  | { type: "setup" }
  | { type: "playing"; game: Game }
  | { type: "results"; game: Game };

