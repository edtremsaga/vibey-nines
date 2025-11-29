import { Game, GameState } from "@/types/game";

const STORAGE_KEY = "vibey-nines-game";

export function saveGame(game: Game): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
    } catch (error) {
      // Handle localStorage errors gracefully
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn("localStorage is full. Game progress may not be saved.");
      } else {
        console.warn("Failed to save game to localStorage:", error);
      }
      // App continues to work even if save fails
    }
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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Handle localStorage errors gracefully (unlikely for removeItem, but safe to catch)
      console.warn("Failed to clear game from localStorage:", error);
    }
  }
}

// Settings storage
const SETTINGS_KEY = "vibey-nines-settings";

export interface GameSettings {
  playerCount: 3 | 4;
  holeCount: 9 | 18;
  playerNames: string[];
  handicaps?: (number | undefined)[];
}

export function saveSettings(settings: GameSettings): void {
  if (typeof window !== "undefined") {
    try {
      // Filter out null values before saving
      const cleanedSettings = {
        ...settings,
        handicaps: settings.handicaps?.map(hcp => hcp === null ? undefined : hcp)
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(cleanedSettings));
    } catch (error) {
      // Handle localStorage errors gracefully
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn("localStorage is full. Settings may not be saved.");
      } else {
        console.warn("Failed to save settings to localStorage:", error);
      }
      // App continues to work even if save fails
    }
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

