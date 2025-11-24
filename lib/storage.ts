import { Game, GameState } from "@/types/game";

const STORAGE_KEY = "vibey-nines-game";

export function saveGame(game: Game): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  }
}

export function loadGame(): Game | null {
  if (typeof window === "undefined") return null;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as Game;
  } catch {
    return null;
  }
}

export function clearGame(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Settings storage
const SETTINGS_KEY = "vibey-nines-settings";

export interface GameSettings {
  playerCount: 3 | 4;
  holeCount: 9 | 18;
  playerNames: string[];
}

export function saveSettings(settings: GameSettings): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
}

export function loadSettings(): GameSettings | null {
  if (typeof window === "undefined") return null;
  
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as GameSettings;
  } catch {
    return null;
  }
}

