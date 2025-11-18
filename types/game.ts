export type PlayerCount = 3 | 4;

export type HoleCount = 9 | 18;

export interface Player {
  id: string;
  name: string;
  scores: number[];
  points: number[];
  totalPoints: number;
}

export interface Game {
  id: string;
  playerCount: PlayerCount;
  holeCount: HoleCount;
  players: Player[];
  currentHole: number;
  isComplete: boolean;
  createdAt: number;
}

export type GameState = 
  | { type: "setup" }
  | { type: "playing"; game: Game }
  | { type: "results"; game: Game };

