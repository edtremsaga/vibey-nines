"use client";

import { useState } from "react";
import { PlayerCount, HoleCount } from "@/types/game";

interface SetupScreenProps {
  onStartGame: (
    playerCount: PlayerCount,
    holeCount: HoleCount,
    playerNames: string[],
    handicaps: (number | undefined)[],
    pars: number[]
  ) => void;
  onViewRules?: () => void;
}

export default function SetupScreen({ onStartGame, onViewRules }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState<PlayerCount>(3);
  const [holeCount, setHoleCount] = useState<HoleCount>(18);
  const [playerNames, setPlayerNames] = useState<string[]>(() =>
    Array.from({ length: 4 }, () => "")
  );
  const [handicaps, setHandicaps] = useState<(number | undefined)[]>(() =>
    Array.from({ length: 4 }, () => undefined)
  );
  const [nameError, setNameError] = useState(false);
  const [handicapErrors, setHandicapErrors] = useState<boolean[]>(() =>
    Array.from({ length: 4 }, () => false)
  );

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
    // Clear error when user starts typing
    if (nameError) {
      setNameError(false);
    }
  };

  const handleHandicapChange = (index: number, value: string) => {
    const newHandicaps = [...handicaps];
    const newErrors = [...handicapErrors];
    
    // Allow empty string (optional handicap)
    if (value === "" || value === "-") {
      newHandicaps[index] = undefined;
      newErrors[index] = false;
      setHandicaps(newHandicaps);
      setHandicapErrors(newErrors);
      return;
    }
    
    // Only allow numeric characters, decimal point, and minus sign
    // Remove any non-numeric characters (except decimal and minus)
    const cleanedValue = value.replace(/[^0-9.-]/g, '');
    
    // If value was cleaned (had non-numeric chars), don't update
    if (cleanedValue !== value) {
      return;
    }
    
    const numValue = parseFloat(cleanedValue);
    
    // Validate range: -54 to 54
    if (isNaN(numValue)) {
      newErrors[index] = true;
      setHandicapErrors(newErrors);
      return;
    }
    
    if (numValue < -54 || numValue > 54) {
      newErrors[index] = true;
      setHandicapErrors(newErrors);
      return;
    }
    
    // Valid handicap
    newHandicaps[index] = numValue;
    newErrors[index] = false;
    setHandicaps(newHandicaps);
    setHandicapErrors(newErrors);
  };

  const handleHandicapKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point, minus sign
    // Allow: Ctrl/Cmd + A, C, V, X (for copy/paste)
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Enter' ||
      e.key === '.' ||
      e.key === '-' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      (e.key === 'a' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'c' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'v' && (e.ctrlKey || e.metaKey)) ||
      (e.key === 'x' && (e.ctrlKey || e.metaKey))
    ) {
      return; // Allow these keys
    }
    
    // Block any non-numeric characters
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleStart = () => {
    const names = playerNames.slice(0, playerCount);
    const playerHandicaps = handicaps.slice(0, playerCount);
    // Default all pars to 4 - users can set them per hole during gameplay
    const holePars = Array.from({ length: holeCount }, () => 4);
    
    // Check if all player names have been entered
    const allNamesEntered = names.every((name) => name.trim().length > 0);
    
    // Check if all handicaps are valid (if provided)
    const allHandicapsValid = playerHandicaps.every((hcp) => 
      hcp === undefined || (hcp >= -54 && hcp <= 54)
    );
    
    if (!allNamesEntered) {
      setNameError(true);
      return;
    }
    
    if (!allHandicapsValid) {
      // Invalid handicap exists, errors already shown in UI
      return;
    }
    
    setNameError(false);
    onStartGame(playerCount, holeCount, names, playerHandicaps, holePars);
  };

  return (
    <div className="golf-course-bg screen-enter flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-5">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="text-4xl">⛳</span>
            <h1 className="text-4xl font-bold text-[#2d5016] dark:text-green-300 drop-shadow-lg">
              NINES GOLF
            </h1>
            <span className="text-4xl">🏌️</span>
          </div>
          <p className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-200">
            A Golf Wagering Game{" "}
            <span className="italic text-gray-600 dark:text-gray-300">by Vibey Craft</span>
          </p>
          
          {/* Competitive positioning badges */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-[#2d5016] shadow-md dark:bg-gray-800/90 dark:text-green-300">
              ✓ Works Offline
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-[#2d5016] shadow-md dark:bg-gray-800/90 dark:text-green-300">
              ✓ No Account Required
            </span>
          </div>
        </div>

        {/* Number of Players */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-5 shadow-xl dark:bg-gray-800/80">
          <label className="mb-3 flex items-center gap-2 text-base font-bold text-[#2d5016] dark:text-green-300">
            <span>👥</span>
            Number of Players
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setPlayerCount(3);
                setNameError(false);
                setHandicapErrors(Array.from({ length: 4 }, () => false));
              }}
              className={`relative flex min-h-[52px] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                playerCount === 3
                  ? "border-[#2d5016] bg-gradient-to-br from-[#2d5016] to-[#3d6b1f] text-white shadow-lg dark:from-[#4a7c2a] dark:to-[#5a8c3a]"
                  : "border-gray-300 bg-white/90 text-gray-900 shadow-md hover:border-[#2d5016] hover:shadow-lg dark:border-gray-600 dark:bg-gray-700/90 dark:text-white dark:hover:border-green-400"
              }`}
            >
              3 Players
            </button>
            <button
              onClick={() => {
                setPlayerCount(4);
                setNameError(false);
                setHandicapErrors(Array.from({ length: 4 }, () => false));
              }}
              className={`relative flex min-h-[52px] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                playerCount === 4
                  ? "border-[#2d5016] bg-gradient-to-br from-[#2d5016] to-[#3d6b1f] text-white shadow-lg dark:from-[#4a7c2a] dark:to-[#5a8c3a]"
                  : "border-gray-300 bg-white/90 text-gray-900 shadow-md hover:border-[#2d5016] hover:shadow-lg dark:border-gray-600 dark:bg-gray-700/90 dark:text-white dark:hover:border-green-400"
              }`}
            >
              4 Players
            </button>
          </div>
        </div>

        {/* Player Names */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-5 shadow-xl dark:bg-gray-800/80">
          <label className="mb-3 flex items-center gap-2 text-base font-bold text-[#2d5016] dark:text-green-300">
            <span>✍️</span>
            Player Names
          </label>
          <div className="space-y-3">
            {Array.from({ length: playerCount }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={playerNames[index]}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className={`flex-1 rounded-xl border-2 px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]/50 ${
                      nameError
                        ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                        : "border-gray-300 bg-white/90 dark:border-gray-600 dark:bg-gray-700/90"
                    } text-gray-900 placeholder:text-gray-500 focus:border-[#2d5016] dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#4a7c2a]`}
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={handicaps[index] ?? ""}
                    onChange={(e) => handleHandicapChange(index, e.target.value)}
                    onKeyDown={(e) => handleHandicapKeyDown(e, index)}
                    placeholder="HCP"
                    min="-54"
                    max="54"
                    className={`w-24 rounded-xl border-2 px-3 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]/50 ${
                      handicapErrors[index]
                        ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
                        : "border-gray-300 bg-white/90 dark:border-gray-600 dark:bg-gray-700/90"
                    } text-gray-900 placeholder:text-gray-500 focus:border-[#2d5016] dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#4a7c2a]`}
                  />
                </div>
                {handicapErrors[index] && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Handicap must be between -54 and 54
                  </p>
                )}
              </div>
            ))}
          </div>
          {nameError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Please enter names for all players to start the game
            </p>
          )}
        </div>

        {/* Number of Holes */}
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-5 shadow-xl dark:bg-gray-800/80">
          <label className="mb-3 flex items-center gap-2 text-base font-bold text-[#2d5016] dark:text-green-300">
            <span>🏌️‍♂️</span>
            Number of Holes
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setHoleCount(9)}
              className={`flex min-h-[52px] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                holeCount === 9
                  ? "border-[#2d5016] bg-gradient-to-br from-[#2d5016] to-[#3d6b1f] text-white shadow-lg dark:from-[#4a7c2a] dark:to-[#5a8c3a]"
                  : "border-gray-300 bg-white/90 text-gray-900 shadow-md hover:border-[#2d5016] hover:shadow-lg dark:border-gray-600 dark:bg-gray-700/90 dark:text-white dark:hover:border-green-400"
              }`}
            >
              9 Holes
            </button>
            <button
              onClick={() => setHoleCount(18)}
              className={`flex min-h-[52px] items-center justify-center rounded-xl border-2 px-4 py-2.5 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                holeCount === 18
                  ? "border-[#2d5016] bg-gradient-to-br from-[#2d5016] to-[#3d6b1f] text-white shadow-lg dark:from-[#4a7c2a] dark:to-[#5a8c3a]"
                  : "border-gray-300 bg-white/90 text-gray-900 shadow-md hover:border-[#2d5016] hover:shadow-lg dark:border-gray-600 dark:bg-gray-700/90 dark:text-white dark:hover:border-green-400"
              }`}
            >
              18 Holes
            </button>
          </div>
        </div>

        {/* Start Game Button */}
        <button
          onClick={handleStart}
          className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#2d5016] to-[#3d6b1f] px-4 py-2.5 text-base font-bold text-white shadow-lg transition-all hover:from-[#3d6026] hover:to-[#4d7036] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#2d5016]/50 dark:from-[#4a7c2a] dark:to-[#5a8c3a] dark:hover:from-[#5a8c3a] dark:hover:to-[#6a9c4a]"
        >
          ⛳ START GAME ⛳
        </button>

        {/* Help Link */}
        <div className="text-center">
          <button 
            onClick={onViewRules}
            className="text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Help / Rules
          </button>
        </div>
      </div>
    </div>
  );
}

