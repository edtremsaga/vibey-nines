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

